"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import type { ActionResult } from "../app/actions/plant-actions";

type Props = {
  careLogId: number;
  likeCount: number;
  likedByCurrentUser: boolean;
  action: (
    prevState: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
};

export default function CareLogLikeButton({
  careLogId,
  likeCount,
  likedByCurrentUser,
  action,
}: Props) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (!state) return;

    if (!state.ok) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="care_log_id" value={careLogId} />

      <button
        type="submit"
        disabled={pending}
        className={`rounded-full px-3 py-1 font-semibold transition ${
          likedByCurrentUser
            ? "bg-[#4a2c14] text-white"
            : "bg-white/70 text-[#5b4636] hover:bg-white"
        }`}
      >
        {likedByCurrentUser ? "♥" : "♡"} {likeCount}
      </button>
    </form>
  );
}
