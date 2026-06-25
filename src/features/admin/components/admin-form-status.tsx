"use client";

interface AdminFormStatusProps {
  error?: string;
  success?: string;
}

export function AdminFormStatus({ error, success }: AdminFormStatusProps) {
  if (!error && !success) {
    return null;
  }

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-error/20 bg-error/10 px-3 py-2 text-small text-error"
      >
        {error}
      </p>
    );
  }

  return (
    <p
      role="status"
      className="rounded-lg border border-success/20 bg-success/10 px-3 py-2 text-small text-success"
    >
      {success}
    </p>
  );
}
