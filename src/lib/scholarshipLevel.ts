import type { Scholarship } from "@/types/database";

// 大学院（修士・博士）向けの奨学金かどうかを判定する。
//
// BrightDoorHubの主な利用者はカンボジアの高校生なので、大学院向けが一覧の先頭や
// トップの特集枠に出ると「自分向けではない」と思われて離脱されやすい。
// そこで大学院向けは一覧の後ろに回し、カードに「大学院向け」の札を付ける。
//
// いまはデータベースに「対象の学年」の列がないため、ScholarshipList の
// detectDestination（国内/海外の判定）と同じく、英語の名前・説明・応募資格の
// 文言から判定している。将来 study_level 列を足したら、そちらに置き換える。
//
// 注意："undergraduate" や "high school graduates" に反応しないよう、
// 単独の "graduate" は使わず、組み合わせの語だけで判定している。
const GRADUATE_KEYWORDS = [
  "master",
  "graduate-level",
  "graduate study",
  "graduate scholarship",
  "graduate program",
  "postgraduate",
  "phd",
  "doctoral",
];

export function isGraduateLevel(s: Scholarship): boolean {
  const text = [s.name_en, s.description_en, s.eligibility_en]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return GRADUATE_KEYWORDS.some((kw) => text.includes(kw));
}
