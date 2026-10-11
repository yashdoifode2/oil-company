import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-site py-24 text-center">
      <p className="text-6xl font-bold" style={{ color: "var(--color-primary)" }}>404</p>
      <h1 className="text-3xl font-bold mt-4 mb-3">Page not found</h1>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Button href="/">Return home</Button>
    </div>
  );
}