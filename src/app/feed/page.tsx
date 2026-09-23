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
import { MessageCircle } from "lucide-react";
import PhotoCarousel from "@/src/components/PhotoCarousel";
import LoadingLink from "@/src/components/LoadingLink";
import { redirect } from "next/navigation";
type FeedCareLog = {
  id: number;
  plant_id: number;
  user_id: string;
  action_type: string;
  action_date: string;
  notes: string | null;
  photo_url: string | null;
  is_private: boolean;
  created_at: string;
  plants: {
    id: number;
    name: string;
    user_id: string;
    is_private: boolean;
  };
  profiles: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  care_log_photos: {
    id: number;
    photo_url: string;
    storage_path: string | null;
    created_at: string;
  }[];
  care_log_likes: {
    id: number;
    user_id: string;
  }[];
  care_log_comments: {
    id: number;
    body: string;
    created_at: string;
    profiles: {
      username: string | null;
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  }[];
};

export default async function FeedPage({
  searchParams, // pull the searchParams property out of the object Next.js passes in
}: {
  searchParams: Promise<{ page?: string }>; // describes the type of the object Next.js will pass in
}) {
  const params = await searchParams; //get search parameter object
  const page = Math.max(1, Math.floor(Number(params.page)) || 1); //convert page to a number, default to 1, never allow anything below 1, round down to nearest int
  const pageSize = 10;
  const from = (page - 1) * pageSize; // - 1 makes sure that we index starting at 0
  const to = from + pageSize - 1; // take the starting index and calculate the inclusive end index for 10 records
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: careLogs,
    error,
    count,
  } = await supabase
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
        care_log_photos (
          id,
          photo_url,
          storage_path,
          created_at
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
      { count: "exact" },
    )
    .eq("is_private", false)
    .eq("plants.is_private", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count ?? 0) / pageSize);
  if (totalPages > 0 && page > totalPages) {
    redirect(`/feed?page=${totalPages}`);
  }

  `/feed?page=${totalPages}`;
  const typedCareLogs = (careLogs ?? []) as unknown as FeedCareLog[];

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

              const photos =
                log.care_log_photos && log.care_log_photos.length > 0
                  ? log.care_log_photos
                  : log.photo_url
                    ? [
                        {
                          id: log.id,
                          photo_url: log.photo_url,
                          storage_path: null,
                          created_at: log.created_at,
                        },
                      ]
                    : [];

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

                        <LoadingLink
                          href={`/plants/${log.plant_id}`}
                          className="text-xl font-bold text-[#4a2c14] hover:underline"
                        >
                          {log.plants.name}
                        </LoadingLink>

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

                  {photos.length > 0 && (
                    <PhotoCarousel
                      photos={photos}
                      altBase={`Care log photo for ${log.plants.name}`}
                    />
                  )}

                  <div className="mt-4 flex items-center gap-3 border-t border-[#4a2c14]/10 pt-3 text-sm text-[#5b4636]">
                    <CareLogLikeButton
                      careLogId={log.id}
                      likeCount={likeCount}
                      likedByCurrentUser={likedByCurrentUser}
                      action={toggleCareLogLike}
                    />

                    <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 font-semibold">
                      <MessageCircle size={16} />
                      {log.care_log_comments?.length ?? 0}
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

        <div className="mt-8 flex items-center jsutify-center gap-4">
          {page > 1 && (
            <Link
              className="rounded-lg bg-[#4a2c14] px-4 py-2 text-lg text-white"
              href={`/feed?page=${page - 1}`}
            >
              ❮
            </Link>
          )}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              className="rounded-lg bg-[#4a2c14] px-4 py-2 text-lg text-white"
              href={`/feed?page=${page + 1}`}
            >
              ❯
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
