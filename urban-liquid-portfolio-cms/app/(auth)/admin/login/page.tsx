import { LoginForm } from "@/components/admin/LoginForm";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  const params = (await searchParams) ?? {};
  const next = Array.isArray(params.next) ? params.next[0] : params.next;

  return (
    <main className="admin-surface flex min-h-screen items-center justify-center px-5 py-12">
      <LoginForm nextPath={next ?? "/admin"} />
    </main>
  );
}

