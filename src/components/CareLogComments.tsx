"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ActionResult } from "../app/actions/plant-actions";

type Comment = {
  id: number;
  body: string;
  created_at: string;
  profiles: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

type Props = {
  careLogId: number;
  comments: Comment[];
  action: (
    prevState: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
};

export default function CareLogComments({
  careLogId,
  comments,
  action,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (!state) return;

    if (state.ok) {
      formRef.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="mt-4 border-t border-[#4a2c14]/10 pt-3">
      {comments.length > 0 && (
        <div className="mb-3 space-y-2">
          {comments.map((comment) => {
            const username =
              comment.profiles?.username ??
              comment.profiles?.full_name ??
              "Unknown grower";

            return (
              <div key={comment.id} className="rounded bg-white/55 px-3 py-2">
                <p className="text-xs font-semibold text-[#586b20]">
                  @{username}
                </p>
                <p className="text-sm text-[#341705]">{comment.body}</p>
              </div>
            );
          })}
        </div>
      )}

      <form ref={formRef} action={formAction} className="flex gap-2">
        <input type="hidden" name="care_log_id" value={careLogId} />

        <input
          name="body"
          placeholder="Write a comment..."
          className="min-w-0 flex-1 rounded border border-[#4a2c14]/20 bg-white/70 px-4 py-2 text-sm outline-none"
        />

        <button
          type="submit"
          disabled={pending}
          className="rounded bg-[#4a2c14] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Post
        </button>
      </form>
    </div>
  );
}
