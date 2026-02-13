import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AuthPrompt } from "@/components/auth/AuthPrompt";
import { getLocale } from "next-intl/server";

export default async function AuthPage() {
  const locale = await getLocale();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログイン済み → ホームへリダイレクト
  if (user) {
    redirect(`/${locale}`);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <AuthPrompt redirectPath="/" />
    </div>
  );
}
