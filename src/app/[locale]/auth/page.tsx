import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuthPrompt } from "@/components/auth/AuthPrompt";
import { getLocale } from "next-intl/server";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const locale = await getLocale();
  const supabase = await createClient();
  const { next } = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログイン済み → リダイレクト
  if (user) {
    redirect(next ? `/${locale}${next}` : `/${locale}`);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <AuthPrompt redirectPath={next || "/"} />
    </div>
  );
}
