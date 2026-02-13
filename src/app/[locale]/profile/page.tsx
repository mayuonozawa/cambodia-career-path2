import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AuthPrompt } from "@/components/auth/AuthPrompt";

export default async function ProfilePage() {
  const t = await getTranslations("profile");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 未ログイン → OAuthログイン画面を表示
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
        <AuthPrompt redirectPath="/profile" />
      </div>
    );
  }

  // ログイン済み → プロフィールフォームを表示
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      <ProfileForm initialProfile={profile} userId={user.id} />
    </div>
  );
}
