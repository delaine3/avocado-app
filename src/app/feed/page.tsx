import Link from "next/link";
import { createSupabaseServerClient } from "@/src/lib/supabase-server";
import { formatDate, formatDateTime } from "../utilities/format";
import { getLogTypeMeta } from "@/src/lib/getLogTypeMeta";
import CareLogComments from "@/src/components/CareLogComments";
import {
  createCareLogComment,
  toggleCareLogLike,
} from "../actions/plant-actions";
import CareLogLikeButton from "@/src/components/CareLogLikeButton";

export default async function FeedPage() {
  const supabase = await createSupabaseServerClient();

  const { data: careLogs, error } = await supabase
    .from("care_logs")
    .select(
      `
        id,
        plant_id,
        user_id,
        action_type,
        action_date,
        notes,
        photo_url,
        is_private,
        created_at,
        plants!inner (
          id,
          name,
          user_id,
          is_private
        ),
        profiles (
          id,
          username,
          full_name,
          avatar_url
        ),
      care_log_likes (
        id,
        user_id
      ),
      care_log_comments (
        id,
        body,
        created_at,
        profiles (
          username,
          full_name,
          avatar_url
        )
      )
      `,
    )
    .eq("is_private", false)
    .eq("plants.is_private", false)
    .order("created_at", { ascending: false });

  const typedCareLogs = (careLogs ?? []) as unknown as FeedCareLog[];
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-10 page">
      <div className="mx-auto max-w-3xl">
        <div className="page-header">
          <h1 className="title">AvoLog Feed</h1>
          <p>See public plant updates from the community.</p>
        </div>

        {error && (
          <div className="mt-8 rounded border border-red-200 bg-red-50 p-5 text-red-700">
            Failed to load feed: {error.message}
          </div>
        )}

        {typedCareLogs.length === 0 ? (
          <div className="mt-8 rounded border bg-white/50 p-6 text-center">
            <p className="font-semibold">No public updates yet.</p>
            <p className="mt-2 text-sm">
              Public care logs from public plants will appear here.
            </p>
          </div>
        ) : (
          <section className="mt-8 space-y-5">
            {typedCareLogs.map((log) => {
              const likeCount = log.care_log_likes?.length ?? 0;
              const likedByCurrentUser = Boolean(
                user &&
                log.care_log_likes?.some((like) => like.user_id === user.id),
              );
              const logMeta = getLogTypeMeta(log.action_type);
              const username =
                log.profiles?.username ??
                log.profiles?.full_name ??
                "Unknown grower";

              return (
                <article
                  key={log.id}
                  className="rounded-3xl border border-white/30 bg-white/60 p-4 shadow-sm backdrop-blur-md sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      {log.profiles?.avatar_url ? (
                        <img
                          src={log.profiles.avatar_url}
                          alt={username}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4a2c14] font-bold text-white">
                          {username.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <p className="text-md text-[#586b20]">
                          @{username} {formatDateTime(log.created_at)}
                        </p>

                        <Link
                          href={`/plants/${log.plant_id}`}
                          className="text-xl font-bold text-[#4a2c14] hover:underline"
                        >
                          {log.plants.name}
                        </Link>

                        <p className="mt-1 text-sm text-[#5b4636]">
                          Care Date {formatDate(log.action_date)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex w-fit max-w-full items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-normal sm:px-3 sm:text-xs sm:tracking-wide ${logMeta.className}`}
                    >
                      <span className="leading-none">{logMeta.icon}</span>
                      {logMeta.label}
                    </span>
                  </div>

                  {log.notes && (
                    <p className="mt-4 leading-relaxed text-[#341705]">
                      {log.notes}
                    </p>
                  )}

                  {log.photo_url && (
                    <div className="mt-4 flex max-h-[28rem] w-full items-center justify-center overflow-hidden rounded bg-black/5">
                      <img
                        src={log.photo_url}
                        alt={`Care log photo for ${log.plants.name}`}
                        className="max-h-[28rem] w-auto object-contain"
                      />
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-3 border-t border-[#4a2c14]/10 pt-3 text-sm text-[#5b4636]">
                    <CareLogLikeButton
                      careLogId={log.id}
                      likeCount={likeCount}
                      likedByCurrentUser={likedByCurrentUser}
                      action={toggleCareLogLike}
                    />

                    <span className="rounded-full bg-white/70 px-3 py-1 font-semibold">
                      {log.care_log_comments?.length ?? 0} comments
                    </span>
                  </div>

                  <CareLogComments
                    careLogId={log.id}
                    comments={log.care_log_comments ?? []}
                    action={createCareLogComment}
                  />
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
