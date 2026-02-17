"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {
  Sparkles,
  Heart,
  Users,
  ChevronRight,
  RotateCcw,
  GraduationCap,
  Award,
  Wrench,
  Briefcase,
  Star,
  ArrowDown,
} from "lucide-react";

// ─── Types ───

type AnswerKey = string;
type Answers = Record<AnswerKey, string | string[]>;
type PersonalityType = "people" | "tech" | "creative";

interface DiagnosisResult {
  topType: PersonalityType;
  strengths: { en: string; km: string }[];
  careers: { nameEn: string; nameKm: string; descEn: string; descKm: string; color: string }[];
  senpai: { nameEn: string; nameKm: string; jobEn: string; jobKm: string; storyEn: string; storyKm: string; quoteEn: string; quoteKm: string };
}

// ─── Data ───

const QUESTIONS: {
  id: string;
  questionEn: string;
  questionKm: string;
  optionA: { textEn: string; textKm: string; emoji: string };
  optionB: { textEn: string; textKm: string; emoji: string };
}[] = [
  {
    id: "social",
    questionEn: "Which is more like you?",
    questionKm: "មួយណាដូចអ្នកជាង?",
    optionA: { textEn: "Comfortable speaking in front of people", textKm: "មិនខ្លាចនិយាយមុខមនុស្សច្រើន", emoji: "👥" },
    optionB: { textEn: "Prefer focusing alone", textKm: "ចូលចិត្តផ្តោតអារម្មណ៍ម្នាក់ឯង", emoji: "📚" },
  },
  {
    id: "people_vs_things",
    questionEn: "Which sounds more fun?",
    questionKm: "មួយណាសប្បាយជាង?",
    optionA: { textEn: "Helping people with their problems", textKm: "ជួយមនុស្សដោះស្រាយបញ្ហា", emoji: "💬" },
    optionB: { textEn: "Building or fixing something", textKm: "សាងសង់ ឬជួសជុលអ្វីមួយ", emoji: "🔧" },
  },
  {
    id: "indoor_outdoor",
    questionEn: "Which do you prefer?",
    questionKm: "អ្នកចូលចិត្តមួយណា?",
    optionA: { textEn: "Working outdoors", textKm: "ធ្វើការនៅក្រៅ", emoji: "🌳" },
    optionB: { textEn: "Working with a computer", textKm: "ធ្វើការជាមួយកុំព្យូទ័រ", emoji: "💻" },
  },
  {
    id: "plan_vs_flexible",
    questionEn: "Which is easier for you?",
    questionKm: "មួយណាងាយស្រួលជាងសម្រាប់អ្នក?",
    optionA: { textEn: "Following a fixed plan", textKm: "ធ្វើតាមផែនការច្បាស់លាស់", emoji: "📋" },
    optionB: { textEn: "Figuring things out as you go", textKm: "គិតស្វែងរកដំណោះស្រាយពេលធ្វើ", emoji: "✨" },
  },
  {
    id: "team_vs_solo",
    questionEn: "When do you do your best?",
    questionKm: "ពេលណាអ្នកធ្វើបានល្អបំផុត?",
    optionA: { textEn: "Working with a team", textKm: "ធ្វើការជាមួយក្រុម", emoji: "🤝" },
    optionB: { textEn: "Working at my own pace", textKm: "ធ្វើការតាមល្បឿនខ្លួនឯង", emoji: "⚡" },
  },
  {
    id: "teach_vs_do",
    questionEn: "Which is more enjoyable?",
    questionKm: "មួយណារីករាយជាង?",
    optionA: { textEn: "Teaching someone", textKm: "បង្រៀនអ្នកដទៃ", emoji: "📖" },
    optionB: { textEn: "Doing it yourself", textKm: "ធ្វើដោយខ្លួនឯង", emoji: "🛠️" },
  },
];

const RECENT_JOYS: { id: string; textEn: string; textKm: string; emoji: string; category: string }[] = [
  { id: "thanks", textEn: "Someone thanked me", textKm: "មាននរណាម្នាក់អរគុណខ្ញុំ", emoji: "🙏", category: "people" },
  { id: "complete", textEn: "I finished something", textKm: "ខ្ញុំបានបញ្ចប់អ្វីមួយ", emoji: "✅", category: "achievement" },
  { id: "score", textEn: "Good exam results", textKm: "ពិន្ទុប្រឡងល្អ", emoji: "💯", category: "achievement" },
  { id: "learn", textEn: "Learned something new", textKm: "រៀនអ្វីថ្មី", emoji: "💡", category: "learning" },
  { id: "help", textEn: "Helped someone", textKm: "ជួយអ្នកដទៃ", emoji: "🤝", category: "people" },
  { id: "create", textEn: "Created something", textKm: "បង្កើតអ្វីមួយ", emoji: "🎨", category: "creative" },
];

const FUTURE_OPTIONS = {
  education: [
    { id: "university", textEn: "Go to university", textKm: "ចូលរៀននៅសាកលវិទ្យាល័យ", emoji: "🎓" },
    { id: "work_soon", textEn: "Start working soon", textKm: "ចាប់ផ្តើមធ្វើការឆាប់ៗ", emoji: "💼" },
    { id: "not_sure", textEn: "Not sure yet", textKm: "មិនទាន់ប្រាកដ", emoji: "🤔" },
  ],
  location: [
    { id: "city", textEn: "Move to the city", textKm: "ផ្លាស់ទៅទីក្រុង", emoji: "🏙️" },
    { id: "local", textEn: "Stay in my area", textKm: "នៅក្នុងតំបន់ខ្ញុំ", emoji: "🏡" },
    { id: "flexible", textEn: "Either is fine", textKm: "ទាំងពីរបាន", emoji: "🌏" },
  ],
  english: [
    { id: "good", textEn: "Good at English", textKm: "ពូកែភាសាអង់គ្លេស", emoji: "🗣️" },
    { id: "ok", textEn: "Okay at English", textKm: "អង់គ្លេសមធ្យម", emoji: "📝" },
    { id: "not_good", textEn: "Not confident", textKm: "មិនសូវជឿជាក់", emoji: "💭" },
  ],
};

function getStrengths(type: PersonalityType): { en: string; km: string }[] {
  const map: Record<PersonalityType, { en: string; km: string }[]> = {
    people: [
      { en: "You naturally notice how others feel", km: "អ្នកដឹងអារម្មណ៍អ្នកដទៃជាធម្មជាតិ" },
      { en: "People feel at ease around you", km: "មនុស្សមានអារម្មណ៍ស្រួលនៅជិតអ្នក" },
      { en: "You shine in team environments", km: "អ្នកភ្លឺចាំងនៅក្នុងបរិយាកាសក្រុម" },
    ],
    tech: [
      { en: "You can focus and keep going", km: "អ្នកអាចផ្តោតអារម្មណ៍ និងបន្តទៅមុខ" },
      { en: "You find and fix problems well", km: "អ្នកពូកែស្វែងរក និងដោះស្រាយបញ្ហា" },
      { en: "You work well independently", km: "អ្នកធ្វើការបានល្អដោយខ្លួនឯង" },
    ],
    creative: [
      { en: "New ideas come to you naturally", km: "គំនិតថ្មីៗមកដល់អ្នកជាធម្មជាតិ" },
      { en: "You enjoy change and variety", km: "អ្នកចូលចិត្តការផ្លាស់ប្តូរ និងភាពចម្រុះ" },
      { en: "You create your own way of doing things", km: "អ្នកបង្កើតវិធីផ្ទាល់ខ្លួនក្នុងការធ្វើអ្វីៗ" },
    ],
  };
  return map[type];
}

function getCareers(type: PersonalityType) {
  const map: Record<PersonalityType, DiagnosisResult["careers"]> = {
    people: [
      { nameEn: "Teacher", nameKm: "គ្រូបង្រៀន", descEn: "Educate children across Cambodia", descKm: "បង្រៀនកុមារទូទាំងប្រទេសកម្ពុជា", color: "from-brand-primary to-brand-tertiary" },
      { nameEn: "Healthcare Worker", nameKm: "បុគ្គលិកសុខាភិបាល", descEn: "Help communities stay healthy", descKm: "ជួយសហគមន៍ឱ្យមានសុខភាពល្អ", color: "from-brand-primary to-brand-tertiary" },
      { nameEn: "Hotel / Hospitality", nameKm: "បុគ្គលិកសណ្ឋាគារ", descEn: "Create great guest experiences", descKm: "បង្កើតបទពិសោធន៍ដ៏ល្អសម្រាប់ភ្ញៀវ", color: "from-brand-primary to-brand-tertiary" },
    ],
    tech: [
      { nameEn: "Software Developer", nameKm: "អ្នកអភិវឌ្ឍន៍កម្មវិធី", descEn: "Build apps and websites", descKm: "បង្កើតកម្មវិធី និងគេហទំព័រ", color: "from-brand-secondary to-orange-500" },
      { nameEn: "Construction Technician", nameKm: "ជាងសំណង់", descEn: "Build Cambodia's future infrastructure", descKm: "សាងសង់ហេដ្ឋារចនាសម្ព័ន្ធអនាគតកម្ពុជា", color: "from-brand-secondary to-orange-500" },
      { nameEn: "Finance & Banking", nameKm: "ហិរញ្ញវត្ថុ និងធនាគារ", descEn: "Manage money and investments", descKm: "គ្រប់គ្រងប្រាក់ និងការវិនិយោគ", color: "from-brand-secondary to-orange-500" },
    ],
    creative: [
      { nameEn: "UI/UX Designer", nameKm: "អ្នករចនា UI/UX", descEn: "Design beautiful digital products", descKm: "រចនាផលិតផលឌីជីថលដ៏ស្រស់ស្អាត", color: "from-rose-400 to-pink-500" },
      { nameEn: "Digital Marketer", nameKm: "អ្នកទីផ្សារឌីជីថល", descEn: "Create engaging online campaigns", descKm: "បង្កើតយុទ្ធនាការអនឡាញដ៏ទាក់ទាញ", color: "from-rose-400 to-pink-500" },
      { nameEn: "Environmental Specialist", nameKm: "អ្នកជំនាញបរិស្ថាន", descEn: "Protect Cambodia's natural resources", descKm: "ការពារធនធានធម្មជាតិកម្ពុជា", color: "from-rose-400 to-pink-500" },
    ],
  };
  return map[type];
}

function getSenpai(type: PersonalityType): DiagnosisResult["senpai"] {
  const map: Record<PersonalityType, DiagnosisResult["senpai"]> = {
    people: {
      nameEn: "Sreymom (24)", nameKm: "ស្រីមុំ (២៤ឆ្នាំ)",
      jobEn: "Primary School Teacher", jobKm: "គ្រូបង្រៀនបឋមសិក្សា",
      storyEn: "From Battambang → scholarship → university → teaching in her hometown",
      storyKm: "មកពីបាត់ដំបង → អាហារូបករណ៍ → សាកលវិទ្យាល័យ → បង្រៀននៅស្រុកកំណើត",
      quoteEn: "\"Seeing my students smile is my daily motivation\"",
      quoteKm: "\"ការឃើញសិស្សរបស់ខ្ញុំញញឹម គឺជាការលើកទឹកចិត្តប្រចាំថ្ងៃរបស់ខ្ញុំ\"",
    },
    tech: {
      nameEn: "Dara (22)", nameKm: "តារា (២២ឆ្នាំ)",
      jobEn: "Software Developer", jobKm: "អ្នកអភិវឌ្ឍន៍កម្មវិធី",
      storyEn: "Self-taught coding → bootcamp → now working at a Phnom Penh tech company",
      storyKm: "រៀនកូដដោយខ្លួនឯង → bootcamp → ឥឡូវធ្វើការនៅក្រុមហ៊ុនបច្ចេកវិទ្យាភ្នំពេញ",
      quoteEn: "\"I started from zero. Now I build apps used by thousands\"",
      quoteKm: "\"ខ្ញុំចាប់ផ្តើមពីសូន្យ។ ឥឡូវខ្ញុំបង្កើតកម្មវិធីដែលមានមនុស្សរាប់ពាន់នាក់ប្រើ\"",
    },
    creative: {
      nameEn: "Channary (25)", nameKm: "ចន្នារី (២៥ឆ្នាំ)",
      jobEn: "Freelance Designer", jobKm: "អ្នករចនាឯករាជ្យ",
      storyEn: "Art school → design agency → now freelancing for international clients",
      storyKm: "សាលាសិល្បៈ → ទីភ្នាក់ងាររចនា → ឥឡូវធ្វើការឯករាជ្យសម្រាប់អតិថិជនអន្តរជាតិ",
      quoteEn: "\"Turning my ideas into reality is the best feeling\"",
      quoteKm: "\"ការបម្លែងគំនិតរបស់ខ្ញុំទៅជាការពិត គឺជាអារម្មណ៍ដ៏ល្អបំផុត\"",
    },
  };
  return map[type];
}

// ─── Component ───

export default function CareerDiagnosis() {
  const t = useTranslations("diagnosis");
  const locale = useLocale();
  const isKm = locale === "km";

  const [step, setStep] = useState(0); // 0=not started, 1=questions, 2=joys, 3=future, 4=result
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const handleAnswer = useCallback((key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const calculateResult = useCallback(() => {
    let peopleScore = 0;
    let techScore = 0;
    let creativeScore = 0;

    if (answers.social === "A") peopleScore += 2;
    if (answers.people_vs_things === "A") peopleScore += 3;
    if (answers.people_vs_things === "B") techScore += 2;
    if (answers.indoor_outdoor === "B") techScore += 1;
    if (answers.plan_vs_flexible === "B") creativeScore += 1;
    if (answers.team_vs_solo === "A") peopleScore += 2;
    if (answers.teach_vs_do === "A") peopleScore += 2;
    if ((answers as Record<string, string>).change_vs_stable === "A") creativeScore += 2;

    const joyAnswers = (answers.recent_joy as string[]) || [];
    joyAnswers.forEach((joyId) => {
      const joy = RECENT_JOYS.find((j) => j.id === joyId);
      if (joy?.category === "people") peopleScore += 2;
      if (joy?.category === "achievement") techScore += 1;
      if (joy?.category === "creative") creativeScore += 2;
      if (joy?.category === "learning") techScore += 1;
    });

    const scores = [
      { type: "people" as PersonalityType, score: peopleScore },
      { type: "tech" as PersonalityType, score: techScore },
      { type: "creative" as PersonalityType, score: creativeScore },
    ].sort((a, b) => b.score - a.score);

    const topType = scores[0].score > 0 ? scores[0].type : "people";

    setResult({
      topType,
      strengths: getStrengths(topType),
      careers: getCareers(topType),
      senpai: getSenpai(topType),
    });
    setStep(4);
  }, [answers]);

  const canProceed = () => {
    if (step === 1) return QUESTIONS.every((q) => answers[q.id]);
    if (step === 2) return (answers.recent_joy as string[] | undefined)?.length;
    if (step === 3) return answers.education && answers.location && answers.english;
    return false;
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  // ─── Not started: CTA card ───
  if (step === 0) {
    return (
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <div
            className="group relative overflow-hidden rounded-3xl border-2 border-brand-primary/20 bg-gradient-to-br from-brand-primary-light/60 via-white to-brand-secondary-light/60 p-6 sm:p-8 text-center cursor-pointer transition-all hover:border-brand-primary/40 hover:shadow-xl hover:shadow-brand-primary/10"
            onClick={() => setStep(1)}
          >
            {/* Decorative circles */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-primary/5 blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-brand-secondary/5 blur-xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                {t("badge")}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                {t("ctaTitle")}
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                {t("ctaDesc")}
              </p>

              <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand-primary/20 group-hover:shadow-lg group-hover:shadow-brand-primary/30 transition-all group-hover:scale-[1.03]">
                {t("ctaButton")}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>

              <p className="text-[11px] text-muted-foreground mt-3">{t("ctaTime")}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Result screen ───
  if (step === 4 && result) {
    const typeLabels: Record<PersonalityType, { en: string; km: string; emoji: string }> = {
      people: { en: "People Person", km: "អ្នកស្រឡាញ់មនុស្ស", emoji: "💬" },
      tech: { en: "Problem Solver", km: "អ្នកដោះស្រាយបញ្ហា", emoji: "🔧" },
      creative: { en: "Creative Mind", km: "គំនិតច្នៃប្រឌិត", emoji: "🎨" },
    };
    const tl = typeLabels[result.topType];

    return (
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Result header */}
          <div className="text-center animate-[fadeIn_0.5s_ease]">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-secondary/10 px-3 py-1 text-xs font-semibold text-brand-secondary mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              {t("resultBadge")}
            </div>
            <div className="text-4xl mb-2">{tl.emoji}</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              {isKm ? tl.km : tl.en}
            </h2>
            <p className="text-sm text-muted-foreground">{t("resultSubtitle")}</p>
          </div>

          {/* Strengths */}
          <div className="rounded-2xl border border-brand-primary/20 bg-white p-5 animate-[fadeIn_0.5s_ease_0.1s_both]">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-brand-secondary" />
              {t("yourStrengths")}
            </h3>
            <div className="space-y-2">
              {result.strengths.map((s, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-xl bg-brand-primary-light/40 px-3 py-2.5">
                  <span className="text-brand-primary text-sm">✦</span>
                  <span className="text-sm font-medium text-foreground">{isKm ? s.km : s.en}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Matching careers */}
          <div className="rounded-2xl border border-brand-secondary/20 bg-white p-5 animate-[fadeIn_0.5s_ease_0.2s_both]">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500" />
              {t("matchingCareers")}
            </h3>
            <div className="space-y-2.5">
              {result.careers.map((c, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${c.color} text-white`}>
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-foreground">
                      {isKm ? c.nameKm : c.nameEn}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {isKm ? c.descKm : c.descEn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Senpai story */}
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50 p-5 animate-[fadeIn_0.5s_ease_0.3s_both]">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-600" />
              {t("senpaiTitle")}
            </h3>
            <div className="flex items-start gap-3 mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-tertiary text-white text-sm font-bold">
                {(isKm ? result.senpai.nameKm : result.senpai.nameEn).charAt(0)}
              </div>
              <div>
                <span className="block text-sm font-bold text-foreground">
                  {isKm ? result.senpai.nameKm : result.senpai.nameEn}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  {isKm ? result.senpai.jobKm : result.senpai.jobEn}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {isKm ? result.senpai.storyKm : result.senpai.storyEn}
            </p>
            <div className="rounded-lg bg-white/70 border-l-3 border-brand-primary px-3 py-2">
              <p className="text-xs italic text-foreground">
                {isKm ? result.senpai.quoteKm : result.senpai.quoteEn}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 animate-[fadeIn_0.5s_ease_0.4s_both]">
            <h3 className="text-sm font-bold text-foreground mb-3 text-center">{t("nextSteps")}</h3>
            <div className="grid grid-cols-2 gap-2">
              <a href={`/${locale}/scholarships`} className="flex items-center gap-2 rounded-xl border border-brand-primary/15 bg-brand-primary-light/30 p-3 hover:bg-brand-primary-light/60 transition-colors">
                <Award className="h-4 w-4 text-brand-primary shrink-0" />
                <span className="text-xs font-semibold text-foreground">{t("cta.scholarships")}</span>
              </a>
              <a href={`/${locale}/universities`} className="flex items-center gap-2 rounded-xl border border-brand-secondary/15 bg-brand-secondary-light/30 p-3 hover:bg-brand-secondary-light/60 transition-colors">
                <GraduationCap className="h-4 w-4 text-brand-secondary shrink-0" />
                <span className="text-xs font-semibold text-foreground">{t("cta.universities")}</span>
              </a>
              <a href={`/${locale}/vocational-schools`} className="flex items-center gap-2 rounded-xl border border-brand-tertiary/15 bg-brand-primary-light/30 p-3 hover:bg-brand-primary-light/60 transition-colors">
                <Wrench className="h-4 w-4 text-brand-tertiary shrink-0" />
                <span className="text-xs font-semibold text-foreground">{t("cta.vocational")}</span>
              </a>
              <button onClick={() => document.getElementById("career-explorer")?.scrollIntoView({ behavior: "smooth" })} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 hover:bg-gray-100 transition-colors">
                <Briefcase className="h-4 w-4 text-gray-600 shrink-0" />
                <span className="text-xs font-semibold text-foreground">{t("cta.explore")}</span>
              </button>
            </div>
          </div>

          {/* Explore careers hint */}
          <div className="text-center animate-[fadeIn_0.5s_ease_0.5s_both]">
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-brand-primary transition-colors mr-4">
              <RotateCcw className="h-3 w-3" />
              {t("retake")}
            </button>
            <button onClick={() => document.getElementById("career-explorer")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:underline">
              {t("scrollToCareers")}
              <ArrowDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ─── Diagnostic steps ───
  const stepLabels = [t("step1Label"), t("step2Label"), t("step3Label")];
  const currentStepIdx = step - 1; // 0,1,2

  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                i <= currentStepIdx ? "bg-brand-primary text-white scale-110" : "bg-gray-200 text-gray-500"
              }`}>
                {i + 1}
              </div>
              <span className={`text-[10px] font-medium ${i <= currentStepIdx ? "text-brand-primary" : "text-gray-400"}`}>{label}</span>
            </div>
          ))}
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-500 rounded-full"
            style={{ width: `${((currentStepIdx + 1) / 3) * 100}%` }}
          />
        </div>

        {/* Step 1: Questions */}
        {step === 1 && (
          <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
            <h2 className="text-lg font-bold text-foreground text-center mb-6">{t("step1Title")}</h2>
            {QUESTIONS.map((q) => (
              <div key={q.id} className="rounded-xl border border-gray-100 bg-white p-4">
                <p className="text-sm font-semibold text-foreground mb-3">{isKm ? q.questionKm : q.questionEn}</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["A", "B"] as const).map((opt) => {
                    const option = opt === "A" ? q.optionA : q.optionB;
                    const isActive = answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(q.id, opt)}
                        className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all ${
                          isActive
                            ? "border-brand-primary bg-brand-primary-light/50 scale-[1.02]"
                            : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                        }`}
                      >
                        <span className="text-xl shrink-0">{option.emoji}</span>
                        <span className="text-xs font-medium text-foreground leading-tight">{isKm ? option.textKm : option.textEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Recent joys */}
        {step === 2 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <h2 className="text-lg font-bold text-foreground text-center mb-2">{t("step2Title")}</h2>
            <p className="text-xs text-muted-foreground text-center mb-6">{t("step2Hint")}</p>
            <div className="grid grid-cols-2 gap-2.5">
              {RECENT_JOYS.map((joy) => {
                const joyList = (answers.recent_joy as string[] | undefined) || [];
                const isActive = joyList.includes(joy.id);
                return (
                  <button
                    key={joy.id}
                    onClick={() => {
                      const current = joyList;
                      handleAnswer("recent_joy", isActive ? current.filter((id) => id !== joy.id) : [...current, joy.id]);
                    }}
                    className={`flex items-center gap-2.5 rounded-xl border-2 p-3.5 text-left transition-all ${
                      isActive
                        ? "border-brand-secondary bg-brand-secondary-light/50 scale-[1.02]"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <span className="text-2xl shrink-0">{joy.emoji}</span>
                    <span className="text-xs font-medium text-foreground leading-tight">{isKm ? joy.textKm : joy.textEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Future */}
        {step === 3 && (
          <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
            {(["education", "location", "english"] as const).map((group) => (
              <div key={group} className="rounded-xl border border-gray-100 bg-white p-4">
                <p className="text-sm font-semibold text-foreground mb-3">{t(`step3.${group}`)}</p>
                <div className="space-y-1.5">
                  {FUTURE_OPTIONS[group].map((opt) => {
                    const isActive = answers[group] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleAnswer(group, opt.id)}
                        className={`flex items-center gap-3 w-full rounded-lg border-2 px-3 py-2.5 text-left transition-all ${
                          isActive
                            ? "border-brand-primary bg-brand-primary-light/50"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <span className="text-xl">{opt.emoji}</span>
                        <span className="text-sm font-medium text-foreground">{isKm ? opt.textKm : opt.textEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Next button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              if (step === 3) calculateResult();
              else setStep(step + 1);
            }}
            disabled={!canProceed()}
            className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold transition-all shadow-md ${
              canProceed()
                ? "bg-brand-primary text-white hover:bg-brand-primary-hover hover:scale-[1.03] shadow-brand-primary/20"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }`}
          >
            {step === 3 ? t("seeResults") : t("next")}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
