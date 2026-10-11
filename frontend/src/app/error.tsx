"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-site py-24 text-center">
      <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
      <p className="text-gray-600 mb-8">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded font-semibold"
        style={{ background: "var(--color-button)", color: "var(--color-button-text)" }}
      >
        Try again
      </button>
    </div>
  );
}