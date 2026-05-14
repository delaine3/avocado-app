"use client";

import { useFormStatus } from "react-dom";
import Spinner from "./Spinner";

type SubmitButtonProps = {
  idleText: string;
  pendingText?: string;
  className?: string;
};

export default function SubmitButton({
  idleText,
  pendingText = "Saving...",
  className = "submit-button",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={className}>
      <span className="inline-flex items-center justify-center gap-2">
        {pending && <Spinner />}
        {pending ? pendingText : idleText}
      </span>
    </button>
  );
}
