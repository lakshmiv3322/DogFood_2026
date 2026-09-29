import Link from "next/link";
import { Header } from "@/components/shell/Header";
import { Footer } from "@/components/shell/Footer";
import { Container } from "@/components/shell/Container";
import { Button } from "@/components/ui/Button";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-1">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <Container size="sm" className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 border border-border text-accent mb-6 shadow-glow">
            <Compass size={32} />
          </div>

          <span className="font-mono text-xs font-bold uppercase tracking-widest text-danger">
            [ Error 404 ]
          </span>

          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-text-primary mt-2 mb-4">
            Route Not Found
          </h1>

          <p className="font-mono text-xs sm:text-sm text-text-secondary leading-relaxed mb-8 max-w-md mx-auto">
            The page or project record you requested does not exist or has been moved within the evaluation registry.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/projects">
              <Button size="lg" variant="primary" className="gap-2">
                <span>Browse Gallery</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="secondary">
                Return Home
              </Button>
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
