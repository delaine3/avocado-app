"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import BulkCareLogForm from "./BulkCareLogForm";
import { createCareLogForAllPlants } from "../app/actions/plant-actions";
import Link from "next/link";

export default function Header() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email ?? null);
    }

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
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

  return (
    <header className="w-full px-4 py-3 flex items-center justify-between border-b bg-white/60 backdrop-blur-md">
      <h1 className="font-bold text-lg">🥑 AvoLog</h1>

      <div className="flex items-center gap-3">
        <BulkCareLogForm action={createCareLogForAllPlants} />
        <Link href="/plants/new">Add Plant</Link>
        {userEmail ? (
          <>
            <span className="text-sm opacity-70">{userEmail}</span>

            <button
              onClick={handleLogout}
              className="rounded-xl px-3 py-2 border text-sm hover:bg-black/5"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="text-sm">
              Login
            </a>
            <a href="/signup" className="text-sm">
              Sign up
            </a>
          </>
        )}
      </div>
    </header>
  );
}
