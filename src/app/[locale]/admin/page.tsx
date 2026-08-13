"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft, Home } from "lucide-react";
import {
  buildExportCSV,
  parseImportCSV,
  parseSingleColumnUpdateCSV,
  type ImportResult,
  type ImportRowError,
} from "@/lib/adminCsv";
import { ADMIN_CSV_COLUMNS } from "@/lib/adminCsvSchema";
import { downloadCSV, readTextFileSmart } from "@/lib/csv";

const ADMIN_EMAIL = "mayuonozawa.taylors@gmail.com";

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "読み込みに失敗しました";
}

type Tab = "scholarships" | "universities" | "vocational_schools";
type Filter = "all" | "domestic" | "international";

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<Tab>("scholarships");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [singleColumnMode, setSingleColumnMode] = useState(false);
  const [singleColumnKey, setSingleColumnKey] = useState(
    () => ADMIN_CSV_COLUMNS.scholarships.find((c) => c.key !== "id")?.key ?? ""
  );
  const [singleColumnResult, setSingleColumnResult] = useState<{ updated: number; errors: ImportRowError[] } | null>(null);

  // 認証チェック（特定メールアドレスのみ許可）
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || session.user.email !== ADMIN_EMAIL) {
          window.location.href = "/en/auth";
          return;
        }
        setLoading(false);
      } catch (e) {
        window.location.href = "/en/auth";
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) fetchData();
  }, [activeTab, filter, loading]);

  const fetchData = async () => {
    let query = supabase.from(activeTab).select("*").order("created_at", { ascending: false });
    if (activeTab !== "vocational_schools" && filter !== "all") {
      query = query.eq("is_domestic", filter === "domestic");
    }
    const { data: rows } = await query;
    setData(rows ?? []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return;
    const { error } = await supabase.from(activeTab).delete().eq("id", id);
    if (error) {
      alert(`削除に失敗しました:\n${error.message}`);
      return;
    }
    fetchData();
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleBack = () => {
    if (showForm) {
      setShowForm(false);
      setEditItem(null);
    } else {
      router.push("/");
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setFilter("all");
    setShowForm(false);
    setImportResult(null);
    setSingleColumnResult(null);
    setSingleColumnKey(ADMIN_CSV_COLUMNS[tab].find((c) => c.key !== "id")?.key ?? "");
  };

  const handleExport = () => {
    const csv = buildExportCSV(activeTab, data);
    downloadCSV(csv, `${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file next time
    if (!file) return;

    if (singleColumnMode) {
      await runSingleColumnImport(file);
    } else {
      await runFullRowImport(file);
    }
  };

  const runFullRowImport = async (file: File) => {
    setImporting(true);
    setImportResult(null);
    try {
      const text = await readTextFileSmart(file);
      const { toInsert, toUpsert, errors } = parseImportCSV(activeTab, text);

      let inserted = 0;
      let upserted = 0;

      if (toInsert.length > 0) {
        const { error, data: rows } = await supabase.from(activeTab).insert(toInsert).select("id");
        if (error) errors.push({ row: 0, message: `新規追加でエラー: ${error.message}` });
        else inserted = rows?.length ?? toInsert.length;
      }

      if (toUpsert.length > 0) {
        const { error, data: rows } = await supabase
          .from(activeTab)
          .upsert(toUpsert, { onConflict: "id" })
          .select("id");
        if (error) errors.push({ row: 0, message: `更新でエラー: ${error.message}` });
        else upserted = rows?.length ?? toUpsert.length;
      }

      setImportResult({ inserted, upserted, errors });
      fetchData();
    } catch (err) {
      setImportResult({
        inserted: 0,
        upserted: 0,
        errors: [{ row: 0, message: errorMessage(err) }],
      });
    } finally {
      setImporting(false);
    }
  };

  // 指定した1列だけを id 単位で更新する。他の列（description等）には一切触れない。
  const runSingleColumnImport = async (file: File) => {
    setImporting(true);
    setSingleColumnResult(null);
    try {
      const text = await readTextFileSmart(file);
      const { updates, errors } = parseSingleColumnUpdateCSV(activeTab, singleColumnKey, text);

      let updated = 0;
      // 1件ずつ update するので、ある行の失敗が他の行を巻き込まない
      for (const u of updates) {
        const { error } = await supabase.from(activeTab).update({ [singleColumnKey]: u.value }).eq("id", u.id);
        if (error) {
          errors.push({ row: 0, message: `id=${u.id} の更新に失敗: ${error.message}` });
        } else {
          updated += 1;
        }
      }

      setSingleColumnResult({ updated, errors });
      fetchData();
    } catch (err) {
      setSingleColumnResult({
        updated: 0,
        errors: [{ row: 0, message: errorMessage(err) }],
      });
    } finally {
      setImporting(false);
    }
  };

  if (loading) return <div className="p-8">読み込み中...</div>;

  const showDomesticFilter = activeTab !== "vocational_schools";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 独自Backボタン */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors mb-6"
      >
        {showForm ? <ArrowLeft className="w-4 h-4" /> : <Home className="w-4 h-4" />}
        {showForm ? "一覧に戻る" : "トップへ"}
      </button>

      <h1 className="text-2xl font-bold mb-6">管理画面</h1>

      {/* メインタブ */}
      <div className="flex gap-2 mb-4">
        {(["scholarships", "universities", "vocational_schools"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            {tab === "scholarships" ? "奨学金" : tab === "universities" ? "大学" : "職業訓練校"}
          </button>
        ))}
      </div>

      {/* 国内/国外フィルター（奨学金・大学のみ） */}
      {showDomesticFilter && !showForm && (
        <div className="flex gap-2 mb-6">
          {(["all", "domestic", "international"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                filter === f
                  ? f === "domestic"
                    ? "bg-green-600 text-white border-green-600"
                    : f === "international"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-gray-700 text-white border-gray-700"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              {f === "all" ? "全て" : f === "domestic" ? "🇰🇭 国内" : "🌏 国外"}
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-400 self-center">{data.length}件</span>
        </div>
      )}

      {/* 新規追加 / CSV入出力ボタン */}
      {!showForm && (
        <div className="mb-4 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={handleNew} className="px-4 py-2 bg-green-600 text-white rounded-lg">
              ＋ 新規追加
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              CSVエクスポート
            </button>
            <button
              onClick={handleImportClick}
              disabled={importing}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              {importing ? "取り込み中..." : singleColumnMode ? `CSVで${singleColumnKey}だけ更新` : "CSVインポート"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>

          {/* 1列だけ更新モード */}
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-600">
              <input
                type="checkbox"
                checked={singleColumnMode}
                onChange={(e) => {
                  setSingleColumnMode(e.target.checked);
                  setImportResult(null);
                  setSingleColumnResult(null);
                }}
              />
              1列だけ更新する（他の項目には触れない）
            </label>
            {singleColumnMode && (
              <select
                className="border rounded px-2 py-1 text-sm"
                value={singleColumnKey}
                onChange={(e) => setSingleColumnKey(e.target.value)}
              >
                {ADMIN_CSV_COLUMNS[activeTab]
                  .filter((c) => c.key !== "id")
                  .map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.key}
                    </option>
                  ))}
              </select>
            )}
          </div>
          {singleColumnMode && (
            <p className="text-xs text-gray-400">
              CSVは &ldquo;id&rdquo; と &ldquo;{singleColumnKey}&rdquo; の2列だけでOK（他の列があっても無視されます）。id が既存データと一致する行だけ、その1項目を更新します。新規追加はできません。
            </p>
          )}
        </div>
      )}

      {/* CSVインポート結果 */}
      {importResult && !showForm && (
        <div
          className={`mb-4 p-4 rounded-lg border text-sm ${
            importResult.errors.length > 0
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-green-50 border-green-200 text-green-800"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium">
              新規追加: {importResult.inserted}件 / id指定分(新規作成 or 更新): {importResult.upserted}件
              {importResult.errors.length > 0 && ` / スキップ: ${importResult.errors.length}件`}
            </p>
            <button
              onClick={() => setImportResult(null)}
              className="shrink-0 text-current opacity-60 hover:opacity-100"
              aria-label="閉じる"
            >
              ✕
            </button>
          </div>
          {importResult.errors.length > 0 && (
            <ul className="mt-2 space-y-1 list-disc list-inside">
              {importResult.errors.map((err, i) => (
                <li key={i}>
                  {err.row > 0 ? `${err.row}行目: ` : ""}
                  {err.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 1列だけ更新の結果 */}
      {singleColumnResult && !showForm && (
        <div
          className={`mb-4 p-4 rounded-lg border text-sm ${
            singleColumnResult.errors.length > 0
              ? "bg-amber-50 border-amber-200 text-amber-800"
              : "bg-green-50 border-green-200 text-green-800"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium">
              更新: {singleColumnResult.updated}件
              {singleColumnResult.errors.length > 0 && ` / スキップ: ${singleColumnResult.errors.length}件`}
            </p>
            <button
              onClick={() => setSingleColumnResult(null)}
              className="shrink-0 text-current opacity-60 hover:opacity-100"
              aria-label="閉じる"
            >
              ✕
            </button>
          </div>
          {singleColumnResult.errors.length > 0 && (
            <ul className="mt-2 space-y-1 list-disc list-inside">
              {singleColumnResult.errors.map((err, i) => (
                <li key={i}>
                  {err.row > 0 ? `${err.row}行目: ` : ""}
                  {err.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* フォーム */}
      {showForm && (
        <AdminForm
          tab={activeTab}
          item={editItem}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); fetchData(); router.refresh(); }}
        />
      )}

      {/* 一覧 */}
      {!showForm && (
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
              <div className="flex items-center gap-3">
                {/* 国内/国外バッジ */}
                {showDomesticFilter && (
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                    item.is_domestic
                      ? "bg-green-100 text-green-700"
                      : "bg-indigo-100 text-indigo-700"
                  }`}>
                    {item.is_domestic ? "国内" : "国外"}
                  </span>
                )}
                <div>
                  <p className="font-medium">{item.name_en}</p>
                  <p className="text-sm text-gray-500">{item.name_km}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-blue-100 text-blue-700 rounded">編集</button>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-100 text-red-700 rounded">削除</button>
              </div>
            </div>
          ))}
          {data.length === 0 && <p className="text-gray-500">データがありません</p>}
        </div>
      )}
    </div>
  );
}

function AdminForm({ tab, item, onClose, onSaved }: { tab: Tab; item: any; onClose: () => void; onSaved: () => void }) {
  const supabase = createClient();
  const isEdit = !!item;
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const scholarshipFields = ["name_en","name_km","provider_en","provider_km","description_en","description_km","coverage_en","coverage_km","eligibility_en","eligibility_km","application_url","deadline"];
  const universityFields = ["name_en","name_km","location_en","location_km","description_en","description_km","website","tuition_info_en","tuition_info_km"];
  const vocationalFields = ["name_en","name_km","location_en","location_km","description_en","description_km","website","contact"];

  const fields = tab === "scholarships" ? scholarshipFields : tab === "universities" ? universityFields : vocationalFields;

  const [form, setForm] = useState<any>(() => {
    if (item) {
      const base = { ...item };
      if (tab === "scholarships" || tab === "universities") {
        base.is_domestic = item.is_domestic ?? true;
      }
      if (tab === "universities" || tab === "vocational_schools") {
        base.programs_en = item.programs_en?.join(", ") ?? "";
        base.programs_km = item.programs_km?.join(", ") ?? "";
      }
      return base;
    }
    const initial: any = {};
    fields.forEach(f => initial[f] = "");
    if (tab === "scholarships") { initial.type = "full"; initial.is_active = true; initial.is_domestic = true; }
    if (tab === "universities") { initial.type = "public"; initial.is_domestic = true; initial.programs_en = ""; initial.programs_km = ""; }
    if (tab === "vocational_schools") { initial.programs_en = ""; initial.programs_km = ""; }
    return initial;
  });

  const handleSubmit = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const payload = { ...form };
      // DBが管理するフィールドは送らない
      delete payload.id;
      delete payload.created_at;
      delete payload.updated_at;

      // 各テーブルに存在しないフィールドを除外
      if (tab === "scholarships") {
        delete payload.programs_en;
        delete payload.programs_km;
      }
      if (tab === "vocational_schools") {
        delete payload.is_domestic;
      }

      if (tab === "universities" || tab === "vocational_schools") {
        payload.programs_en = form.programs_en.split(",").map((s: string) => s.trim()).filter(Boolean);
        payload.programs_km = form.programs_km.split(",").map((s: string) => s.trim()).filter(Boolean);
      }

      let error;
      if (isEdit) {
        ({ error } = await supabase.from(tab).update(payload).eq("id", item.id));
      } else {
        ({ error } = await supabase.from(tab).insert(payload));
      }

      if (error) {
        setSaveError(error.message);
        return;
      }
      onSaved();
    } catch (e: any) {
      setSaveError(e?.message ?? "不明なエラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const showDomesticField = tab === "scholarships" || tab === "universities";

  return (
    <div className="mb-6 p-6 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-bold mb-4">{isEdit ? "編集" : "新規追加"}</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* 国内/国外（最初に表示） */}
        {showDomesticField && (
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">国内 / 国外</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="is_domestic"
                  checked={form.is_domestic === true}
                  onChange={() => setForm({ ...form, is_domestic: true })}
                />
                <span className="text-sm">🇰🇭 国内（カンボジア国内）</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="is_domestic"
                  checked={form.is_domestic === false}
                  onChange={() => setForm({ ...form, is_domestic: false })}
                />
                <span className="text-sm">🌏 国外（海外・国際）</span>
              </label>
            </div>
          </div>
        )}

        {fields.map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">{field}</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={form[field] ?? ""}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          </div>
        ))}

        {/* type フィールド */}
        {tab === "scholarships" && (
          <div>
            <label className="block text-sm font-medium mb-1">type</label>
            <select className="w-full border rounded px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="full">full</option>
              <option value="partial">partial</option>
              <option value="grant">grant</option>
            </select>
          </div>
        )}
        {tab === "universities" && (
          <div>
            <label className="block text-sm font-medium mb-1">type</label>
            <select className="w-full border rounded px-3 py-2 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="public">public</option>
              <option value="private">private</option>
            </select>
          </div>
        )}

        {/* programs（配列） */}
        {(tab === "universities" || tab === "vocational_schools") && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">programs_en（カンマ区切り）</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={form.programs_en} onChange={(e) => setForm({ ...form, programs_en: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">programs_km（カンマ区切り）</label>
              <input className="w-full border rounded px-3 py-2 text-sm" value={form.programs_km} onChange={(e) => setForm({ ...form, programs_km: e.target.value })} />
            </div>
          </>
        )}

        {/* is_active */}
        {tab === "scholarships" && (
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            <label className="text-sm font-medium">公開中（is_active）</label>
          </div>
        )}
      </div>

      {saveError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <strong>保存エラー：</strong> {saveError}
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存"}
        </button>
        <button onClick={onClose} disabled={saving} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50">キャンセル</button>
      </div>
    </div>
  );
}
