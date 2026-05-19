import { Container } from "@/components/common/Container";
import { Button } from "@/components/common/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <Container className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-slate-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8">
          <Button href="/">Back to Home</Button>
        </div>
      </Container>
    </section>
  );
}
