"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ActionResult } from "../app/actions/plant-actions";

type HiddenField = {
  name: string;
  value: string | number;
};

type Props = {
  action: (
    prevState: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  hiddenFields: HiddenField[];
  title: string;
  description?: React.ReactNode;
  redirectTo?: string;
  className?: string;
  children: React.ReactNode;
};

export default function ActionFormButton({
  action,
  hiddenFields,
  title,
  description = "This action cannot be undone.",
  redirectTo,
  className,
  children,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (!state) return;

    if (state.ok) {
      toast.success(state.message);
      setOpen(false);

      if (redirectTo) {
        router.push(redirectTo);
      }
    } else {
      toast.error(state.message);
    }
  }, [state, router, redirectTo]);

  return (
    <>
      <button
        type="button"
        className={"delete-button"}
        aria-label="Delete care log"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            style={{ backgroundColor: "#ffffff88" }}
          >
            <h3 className="text-xl font-semibold ">{title}</h3>

            <p className="mt-2  ">{description}</p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cancel-button"
              >
                Cancel
              </button>

              <form action={formAction}>
                {hiddenFields.map((field) => (
                  <input
                    key={field.name}
                    type="hidden"
                    name={field.name}
                    value={field.value}
                  />
                ))}

                <button
                  type="submit"
                  disabled={pending}
                  className="delete-button"
                >
                  {pending ? "Deleting..." : "Delete"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
