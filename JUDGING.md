# JUDGING.md — Rubric, Assignment & Normalization Engine

## 1. Judging Rubric & Scoring Criteria

Every project is evaluated across two orthogonal axes on a 1 to 5 scale:

| Criterion | Scale | Weight | Description |
|-----------|-------|--------|-------------|
| **Functionality** | 1 – 5 | 50% | Completeness, working demo, absence of critical runtime failures, and core value delivered. |
| **Quality & Architecture** | 1 – 5 | 50% | Code craftsmanship, clean separation of concerns, testability, and defensive programming. |

Raw score computation for a single review:
$$S_{raw}(j, p) = 0.50 \times \text{Functionality} + 0.50 \times \text{Quality}$$

---

## 2. Track Assignment & Conflict Prevention

1. **Domain Alignment**: Judges are mapped to one or more tracks via `JudgeTrack` (e.g. Judge Tomas Varga to Track `trk_03` Accessibility). Judges only receive pending review queues for projects inside their designated tracks.
2. **Conflict of Interest (COI) Rule**:
   - A judge whose email appears in `Team.members` of any submitting team is disqualified from scoring that team's project.
   - The query filter dynamically excludes self-assigned entries:
     $$\text{Project.team.members} \cap \{\text{Judge.email}\} = \emptyset$$

---

## 3. Score Normalization & Mitigating Uneven Reviews

In real hackathons, two fundamental statistical anomalies occur:
1. **Uneven Sample Sizes**: Some projects receive 2 reviews while others receive 5 due to judge availability.
2. **Judge Calibration Bias**: "Lenient" judges cluster scores around 4.5–5.0, while "Harsh" judges rarely award above 3.0.

### A. Bayesian Adjusted Mean (Handling Unequal Review Counts)
To prevent a project with a single 5.0 rating from outranking a project with four 4.8 ratings, we apply Bayesian shrinkage toward the global event mean $\mu_{global}$:

$$\bar{S}_{bayes}(p) = \frac{C \cdot \mu_{global} + \sum_{i=1}^{n_p} S_i}{C + n_p}$$

Where:
- $n_p$: Number of reviews received by project $p$.
- $C$: Confidence damping factor (calibrated to $C = 2$ reviews).
- $\mu_{global}$: Overall average score across all evaluations in the event.

### B. Z-Score Standardization (Handling Judge Bias)
For normalized cross-track rankings, each judge's ratings are standardized relative to their individual distribution:

$$Z(j, p) = \frac{S(j, p) - \mu_j}{\sigma_j + \epsilon}$$

Where:
- $\mu_j$: Mean of all ratings given by judge $j$.
- $\sigma_j$: Standard deviation of ratings given by judge $j$.
- $\epsilon = 10^{-6}$: Regularizer preventing division by zero for judges with uniform scoring.

The final normalized project score is then mapped back to a calibrated 0–5 scale:
$$\text{Score}_{final}(p) = \text{Clamp}_{0}^{5}\left( \mu_{global} + \sigma_{global} \cdot \frac{1}{n_p} \sum_{j} Z(j, p) \right)$$

---

## 4. Pairwise Ranking (Tie-Breaking Extension)

When two projects produce identical normalized scores to two decimal places, a pairwise comparator breaks the tie:
1. If both projects share common evaluators, the project winning the head-to-head matchup prevails.
2. If evaluators do not overlap, priority is given to the project with higher variance resistance (lower dispersion across criteria).

---

## 5. Audit Trail & Verifiability

- Every score mutation logs `createdAt` and `updatedAt` timestamps in PostgreSQL.
- Database unique constraints guarantee that multiple clicks or concurrent submissions update the existing ballot rather than creating phantom score records.
- Organizers inspect the complete unweighted and weighted trail via `/api/export.csv`.
