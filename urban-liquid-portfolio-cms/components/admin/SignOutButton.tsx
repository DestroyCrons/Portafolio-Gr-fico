"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;

    await supabase.auth.signOut();
    toast.success("Signed out.");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button variant="ghost" icon={<LogOut className="h-4 w-4" />} onClick={signOut}>
      Exit
    </Button>
  );
}

