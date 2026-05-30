"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/admin" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      toast.error("Supabase environment values are missing.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Studio unlocked.");
    router.push(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel w-full max-w-md rounded-[8px] p-6 shadow-glass">
      <p className="font-display text-sm uppercase text-cyan">Private studio</p>
      <h1 className="mt-4 font-display text-5xl uppercase leading-none text-chrome">Admin Access</h1>
      <div className="mt-8 space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit" className="mt-8 w-full" icon={<LogIn className="h-4 w-4" />} disabled={loading}>
        {loading ? "Opening" : "Login"}
      </Button>
    </form>
  );
}

