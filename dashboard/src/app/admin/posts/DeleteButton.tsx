"use client";

export function DeleteButton({
  action,
  confirmMessage = "Delete this post permanently?",
  label = "Delete",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <button type="submit" className="btn-danger">
        {label}
      </button>
    </form>
  );
}
