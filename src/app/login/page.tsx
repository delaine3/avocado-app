"use client";

import { useState } from "react";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "next/navigation";
import Spinner from "@/src/components/Spinner";

const demoCredentials = {
  email: "demo@avolog.com",
  password: "D3m0Pa$$w0rd783!",
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [demoPending, setDemoPending] = useState(false);

  const router = useRouter();

  async function loginWithCredentials(
    loginEmail: string,
    loginPassword: string,
  ) {
    setMessage("Logging in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data.session) {
      setMessage(
        "Login did not create a session. Check email confirmation settings.",
      );
      return;
    }

    setMessage("Logged in!");
    router.refresh();
    router.push("/");
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setPending(true);
      await loginWithCredentials(email, password);
    } finally {
      setPending(false);
    }
  }

  async function handleDemoLogin() {
    try {
      setDemoPending(true);
      setEmail(demoCredentials.email);
      setPassword(demoCredentials.password);

      await loginWithCredentials(
        demoCredentials.email,
        demoCredentials.password,
      );
    } finally {
      setDemoPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 page">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={pending || demoPending}
          className="submit-button mb-4 w-full"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {demoPending && <Spinner />}
            {demoPending ? "Opening Demo..." : "Login to Demo Account"}
          </span>
        </button>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded border px-4 py-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded border px-4 py-3"
            required
          />

          <button
            type="submit"
            disabled={pending || demoPending}
            className="submit-button w-full"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {pending && <Spinner />}
              {pending ? "Logging in..." : "Login"}
            </span>
          </button>

          {message && <p className="text-sm">{message}</p>}
        </form>
      </div>
    </main>
  );
}
