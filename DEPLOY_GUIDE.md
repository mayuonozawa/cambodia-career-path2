# Cambodia Career Path - デプロイ手順書

全5ステップでデプロイ完了します。所要時間: 約30〜45分

---

## ステップ 1: Supabase プロジェクト作成 (10分)

### 1-1. アカウント作成
1. https://supabase.com にアクセス
2. 「Start your project」をクリック
3. GitHub アカウントでサインアップ（推奨）

### 1-2. プロジェクト作成
1. ダッシュボードで「New Project」をクリック
2. 以下を入力:
   - **Organization**: 自分の組織名（初回は自動作成される）
   - **Project name**: `cambodia-career-path`
   - **Database Password**: 強いパスワードを設定（メモしておく）
   - **Region**: `Southeast Asia (Singapore)` ← カンボジアに最も近い
3. 「Create new project」をクリック
4. 2〜3分待つ（プロジェクト作成中...）

### 1-3. APIキーを取得
1. 左メニュー → 「Project Settings」（歯車アイコン）
2. 「API」をクリック
3. 以下2つをメモ:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJI...` で始まる長い文字列

### 1-4. .env.local を更新
ローカルの `.env.local` ファイルを開いて、メモした値に置き換え:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI.....
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## ステップ 2: データベースをセットアップ (5分)

### 2-1. スキーマを実行
1. Supabase ダッシュボード → 左メニュー「SQL Editor」
2. 「New query」をクリック
3. `supabase/schema.sql` の中身をすべてコピペ
4. 「Run」をクリック
5. 「Success. No rows returned」と表示されればOK

### 2-2. シードデータを投入
1. 再度「New query」をクリック
2. `supabase/seed.sql` の中身をすべてコピペ
3. 「Run」をクリック
4. 「Success」と表示されればOK

### 2-3. テーブル確認
1. 左メニュー「Table Editor」をクリック
2. 以下の5テーブルが表示されていればOK:
   - ✅ scholarships (6件)
   - ✅ universities (5件)
   - ✅ vocational_schools (3件)
   - ✅ scholarship_university_relations (6件)
   - ✅ profiles (0件 - ユーザー登録後に作成される)

---

## ステップ 3: Google OAuth 設定 (10分)

### 3-1. Google Cloud Console で設定
1. https://console.cloud.google.com にアクセス
2. 上部の「プロジェクト選択」→「新しいプロジェクト」
   - プロジェクト名: `Cambodia Career Path`
   - 「作成」をクリック
3. 左メニュー → 「APIとサービス」→「OAuth 同意画面」
   - User Type: 「外部」を選択
   - アプリ名: `Cambodia Career Path`
   - ユーザーサポートメール: 自分のメール
   - デベロッパー連絡先: 自分のメール
   - 「保存して次へ」→ スコープはそのまま「保存して次へ」→「保存して次へ」
4. 左メニュー → 「認証情報」→「認証情報を作成」→「OAuth クライアントID」
   - アプリケーションの種類: 「ウェブアプリケーション」
   - 名前: `Cambodia Career Path`
   - **承認済みのリダイレクトURI** に以下を追加:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
     ※ `xxxxx` は自分のSupabase Project URLのサブドメイン
   - 「作成」をクリック
5. 表示される **クライアントID** と **クライアントシークレット** をメモ

### 3-2. Supabase に Google を登録
1. Supabase ダッシュボード → 左メニュー「Authentication」
2. 「Providers」をクリック
3. 「Google」を見つけてクリック
4. 「Enable Sign in with Google」をON
5. 以下を入力:
   - **Client ID**: Google でメモしたクライアントID
   - **Client Secret**: Google でメモしたシークレット
6. 「Save」をクリック

---

## ステップ 4: Facebook OAuth 設定 (10分)

### 4-1. Facebook Developer Console で設定
1. https://developers.facebook.com にアクセス
2. 「マイアプリ」→「アプリを作成」
   - ユースケース: 「ユーザーにFacebookでログインさせる」
   - アプリ名: `Cambodia Career Path`
   - 「アプリを作成」をクリック
3. ダッシュボード → 左メニュー「Facebookログイン」→「設定」
4. 「有効なOAuthリダイレクトURI」に以下を追加:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
5. 「変更を保存」をクリック
6. 左メニュー「設定」→「ベーシック」
   - **アプリID** と **app secret** をメモ

### 4-2. Supabase に Facebook を登録
1. Supabase ダッシュボード → 「Authentication」→「Providers」
2. 「Facebook」を見つけてクリック
3. 「Enable Sign in with Facebook」をON
4. 以下を入力:
   - **Client ID**: Facebook のアプリID
   - **Client Secret**: Facebook の app secret
5. 「Save」をクリック

---

## ステップ 5: Vercel にデプロイ (10分)

### 5-1. GitHubにリポジトリ作成 & プッシュ
```bash
cd cambodia-career-path
git init
git add .
git commit -m "Initial commit: Cambodia Career Path MVP"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cambodia-career-path.git
git push -u origin main
```

### 5-2. Vercel でデプロイ
1. https://vercel.com にアクセス
2. GitHubでサインアップ/ログイン
3. 「Add New...」→「Project」
4. GitHubリポジトリ `cambodia-career-path` を選択 →「Import」
5. **Environment Variables** に以下3つを追加:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJI...` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` ※デプロイ後に分かる |

6. 「Deploy」をクリック
7. 2〜3分でデプロイ完了！

### 5-3. デプロイ後の設定更新
デプロイ完了後、VercelのURL（例: `https://cambodia-career-path.vercel.app`）が分かるので:

1. **Vercel**: Settings → Environment Variables で `NEXT_PUBLIC_SITE_URL` を本番URLに更新
2. **Supabase**: Authentication → URL Configuration で:
   - Site URL: `https://cambodia-career-path.vercel.app`
   - Redirect URLs に追加: `https://cambodia-career-path.vercel.app/auth/callback`
3. **Google Cloud Console**: OAuth リダイレクトURIは変更不要（Supabase経由）
4. **Facebook Developer**: リダイレクトURIは変更不要（Supabase経由）
5. **Vercel で再デプロイ**: Deployments → 最新の「...」→「Redeploy」

---

## 完了チェックリスト

デプロイ後、以下を確認:

- [ ] トップページが表示される
- [ ] クメール語/英語の切り替えができる
- [ ] 奨学金一覧が表示される（シードデータ6件）
- [ ] 大学一覧が表示される（シードデータ5件）
- [ ] Google ログインできる
- [ ] Facebook ログインできる
- [ ] ログイン後、奨学金詳細ページが見れる
- [ ] プロフィール編集・保存ができる
- [ ] 「奨学金とは？」ページが表示される
- [ ] モバイルでレイアウトが崩れない

---

## トラブルシューティング

### ログインしてもリダイレクトされない
→ Supabase の「Authentication」→「URL Configuration」でSite URLとRedirect URLsを確認

### データが表示されない
→ SQL Editor で `SELECT * FROM scholarships;` を実行してデータがあるか確認

### ビルドエラーが出る
→ Vercel のログを確認。環境変数が正しく設定されているか確認

### 「RLS policy error」が出る
→ SQL Editor で schema.sql を再実行（RLSポリシーが正しく作成されているか確認）
