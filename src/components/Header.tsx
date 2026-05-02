"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import BulkCareLogForm from "./BulkCareLogForm";
import { createCareLogForAllPlants } from "../app/actions/plant-actions";
import ProfileDropdown from "@/ProfileDropdown";

type UserProfile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  async function getUserAndProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUserEmail(user?.email ?? null);

    if (!user) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error.message);
      setProfile(null);
      return;
    }

    setProfile(data);
  }

  useEffect(() => {
    getUserAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUserAndProfile();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const displayName = profile?.username ?? profile?.full_name ?? userEmail;
  const initial = displayName?.charAt(0).toUpperCase() ?? "?";

  return (
    <header
      className="sticky top-0 z-40 w-full border-b px-4 py-3 backdrop-blur-md"
      style={{ background: "#455411" }}
    >
      <div className="mx-auto flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="text-2xl">🥑</span>
          <span className="text-xl font-extrabold">AvoLog</span>
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="border-l-2 border-[white]">
            <Link
              className="flex items-center gap-3 rounded px-3 py-2 text-white hover:bg-white/20 "
              href="/"
            >
              Dashboard
            </Link>
          </div>
          <div className="border-l-2 border-[white]">
            <Link
              className="flex items-center gap-3 rounded px-3 py-2 text-white hover:bg-white/20 "
              href="/feed"
            >
              Feed
            </Link>
          </div>

          {userEmail ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <div className="border-l-2 border-[white]">
                  <BulkCareLogForm action={createCareLogForAllPlants} />
                </div>
                <div className="border-l-2 border-[white]">
                  <Link
                    href="/plants/new"
                    className="flex items-center gap-3 rounded px-3 py-2 text-white hover:bg-white/20 "
                  >
                    Add Plant
                  </Link>
                </div>
                <ProfileDropdown
                  displayName={displayName}
                  userEmail={userEmail}
                  avatarUrl={profile?.avatar_url ?? null}
                  initial={initial}
                  onLogout={handleLogout}
                />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm text-white">
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded bg-white px-3 py-2 text-sm font-semibold text-[#455411]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
