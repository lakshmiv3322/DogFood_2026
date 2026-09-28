# Production Deployment Guide: DOGFOOD 2026 Hackathon Portal

This document outlines migrating the DOGFOOD 2026 Hackathon Portal from the local Docker-based PostgreSQL setup to a production-grade managed PostgreSQL provider, configuring automated backups with Point-in-Time Recovery (PITR), and deploying the application container.

---

## 1. Managed PostgreSQL Migration (Neon)

The local development stack uses a containerized PostgreSQL 16 instance. In production, migrate to **[Neon](https://neon.tech)** (Serverless Postgres) or an equivalent managed provider (Supabase / AWS RDS).

### Step 1: Provision Neon Project
1. Log in to the [Neon Console](https://console.neon.tech).
2. Create a new project named `dogfood2026-prod`.
3. Select your preferred AWS region close to your compute infrastructure.
4. Copy the pooled connection string provided in the Neon dashboard.

### Step 2: Connection String Configuration
Neon provides connection pooling out of the box via PgBouncer. Use the pooled connection string for application runtime queries:

```env
# Format: postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/[dbname]?sslmode=require
DATABASE_URL="postgresql://neondb_owner:npg_secret123@ep-cool-butterfly-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

> **Note**: For running database migrations (`prisma migrate deploy`), use the direct (non-pooled) connection string if transactional DDL locking requires an unpooled connection:
> ```env
> DIRECT_URL="postgresql://neondb_owner:npg_secret123@ep-cool-butterfly-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
> ```

### Step 3: Schema Deployment
Apply existing committed migrations to the new database without running the local `db` service:

```bash
DATABASE_URL="<your-neon-database-url>" npx prisma migrate deploy
```

### Step 4: Decommission Local `db` Service
In production, update `docker-compose.prod.yml` or container orchestrator task definitions:
- Remove the `db` service block and `pgdata` volume.
- Remove `depends_on: db` from the `app` container.
- Pass the Neon `DATABASE_URL` via encrypted environment variable / secrets manager (e.g. AWS Secrets Manager, Doppler, or GCP Secret Manager).

---

## 2. Continuous Backups & Point-in-Time Recovery (PITR)

Data loss during an active hackathon (e.g. accidental score overwrites or judge mistakes) requires granular recovery.

### Neon Point-in-Time Recovery
Neon provides continuous WAL-based Point-in-Time Recovery (PITR) by default across all active branches, allowing instant restore to any microsecond within the retention window:
- In the Neon Console, navigate to **Project Settings > History Retention**.
- Adjust retention window (free tier defaults to 24 hours; scale up to 7 or 30 days for hackathon week).
- To restore: Use **Time Travel Branches** to branch the database at the exact timestamp prior to any incident without downtime or data destruction.
- Official documentation: [Neon Point-in-Time Recovery & Time Travel](https://neon.tech/docs/guides/point-in-time-restore)

### Alternative Providers
If using an alternative provider:
- **Supabase**: Point in Time Recovery is enabled under **Database > Backups > PITR**. See [Supabase PITR Documentation](https://supabase.com/docs/guides/platform/backups#point-in-time-recovery).
- **AWS RDS**: Enable automated backups with PITR (up to 35 days retention) in the RDS instance settings. See [AWS RDS Point-in-Time Recovery Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html).

---

## 3. Production Environment Checklist

Before opening the portal to participants and judges:

1. **Disable Demo Mode**: Ensure `NEXT_PUBLIC_DEMO_MODE` is not set or set to `"false"` in production.
2. **Rotate Secrets**:
   - `NEXTAUTH_SECRET`: Generate a cryptographically secure 64-character hex string (`python -c "import secrets; print(secrets.token_hex(32))"`).
   - `POSTGRES_PASSWORD`: Controlled by the managed database provider.
3. **Configure Error Tracking**: Set `SENTRY_DSN` in production environment to capture runtime errors.
4. **Health Check Monitoring**: External load balancers (e.g. AWS ALB, Cloudflare, Traefik) should target the `GET /api/health` endpoint for readiness and liveness checks (returns `200` with `{ status: "ok" }`).
