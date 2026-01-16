"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/store/languageStore";
import { templates } from "@/lib/templates";
import { LuFileText as FileText, LuArrowRight as ArrowRight, LuUser as User, LuCheck as Check } from "react-icons/lu";
import { createClient } from "@/lib/supabaseClient";
import { useEffect } from "react";

export default function TemplatesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const categories = [
    { id: "all", label: t("templates.category.all") },
    { id: "modern", label: t("templates.category.modern") },
    { id: "classic", label: t("templates.category.classic") },
    { id: "creative", label: t("templates.category.creative") },
    { id: "professional", label: t("templates.category.professional") },
  ];

  const filteredTemplates = selectedCategory === "all"
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const getTemplateTranslation = (templateId: string) => {
    return {
      name: t(`template.${templateId}`),
      desc: t(`template.${templateId}Desc`),
    };
  };

  const handleUseTemplate = (templateId: string) => {
    router.push(`/editor/new?template=${templateId}`);
  };

  const previewNames = [
    "Camille Morel",
    "Lucas Bernard",
    "Sarah Nguyen",
    "Amadou Diallo",
    "Ines Laurent",
    "Thomas Girard",
  ];
  const previewTitles = [
    "Product Designer",
    "Developpeur Full-Stack",
    "Data Analyst",
    "Chef de projet",
    "UX Researcher",
    "Marketing Manager",
  ];
  const previewCities = ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Nantes"];
  const previewEmails = [
    "camille.morel@mail.com",
    "lucas.bernard@mail.com",
    "sarah.nguyen@mail.com",
    "amadou.diallo@mail.com",
    "ines.laurent@mail.com",
    "thomas.girard@mail.com",
  ];
  const previewPhones = [
    "+33 6 12 34 56 78",
    "+33 6 98 76 54 32",
    "+33 7 22 11 33 44",
    "+33 6 55 12 87 09",
    "+33 7 01 23 45 67",
    "+33 6 44 88 19 20",
  ];
  const previewWebsites = [
    "camille.design",
    "lucas.dev",
    "sarahdata.io",
    "amadou.pm",
    "inesux.com",
    "thomas.marketing",
  ];
  const previewSummaries = [
    "Profil oriente produit avec 6+ ans d'experience, focus sur la clarte et l'impact.",
    "Specialiste web avec une approche simple et robuste, livraison rapide et fiable.",
    "Analyse de donnees, tableaux de bord et insights actionnables pour les equipes.",
    "Pilotage de projets multi-equipes, coordination agile et livrables qualitatifs.",
    "Recherche utilisateur et tests pour transformer des besoins en solutions utiles.",
    "Positionnement, contenu et croissance basee sur la mesure et l'optimisation.",
  ];
  const previewExperiences = [
    {
      role: "Product Designer",
      company: "Studio Atlas",
      period: "2022 — Aujourd'hui",
      detail: "Refonte du parcours d'inscription, +28% de conversion.",
    },
    {
      role: "UI/UX Designer",
      company: "WaveLab",
      period: "2019 — 2022",
      detail: "Creation d'un design system modulaire pour 4 produits.",
    },
    {
      role: "Full-Stack Dev",
      company: "BlueStack",
      period: "2021 — 2024",
      detail: "APIs et interfaces web, performance et accessibilite.",
    },
    {
      role: "Data Analyst",
      company: "Karma Insights",
      period: "2020 — 2023",
      detail: "Dashboards KPI et automatisation des rapports.",
    },
    {
      role: "Project Manager",
      company: "Nova Group",
      period: "2018 — 2022",
      detail: "Pilotage de 12 projets avec succes et budget respecte.",
    },
    {
      role: "Growth Marketer",
      company: "Flowly",
      period: "2019 — 2024",
      detail: "Acquisition multicanal et tests A/B continus.",
    },
  ];
  const previewEducations = [
    { degree: "Master Design Numerique", school: "ENSCI", period: "2017 — 2019" },
    { degree: "Master Informatique", school: "Univ. Lyon 1", period: "2016 — 2018" },
    { degree: "Master Data", school: "ESILV", period: "2015 — 2017" },
    { degree: "Master Marketing", school: "IAE Nantes", period: "2014 — 2016" },
  ];
  const previewSkills = [
    ["Figma", "Design system", "Prototypage", "Research"],
    ["React", "Node.js", "PostgreSQL", "Tests"],
    ["SQL", "Python", "Tableau", "Looker"],
    ["Planning", "Agile", "Roadmap", "Stakeholders"],
    ["Content", "SEO", "Ads", "Analytics"],
  ];
  const previewLanguages = [
    ["Francais", "Anglais C1"],
    ["Francais", "Anglais B2"],
    ["Francais", "Anglais C1", "Espagnol B1"],
  ];

  const hashString = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash * 31 + value.charCodeAt(i)) % 100000;
    }
    return hash;
  };

  const pickFrom = <T,>(list: T[], seed: number, offset = 0) =>
    list[(seed + offset) % list.length];

  const getPreviewData = (templateId: string) => {
    const seed = hashString(templateId);
    const name = pickFrom(previewNames, seed);
    const title = pickFrom(previewTitles, seed, 2);
    const city = pickFrom(previewCities, seed, 3);
    const email = pickFrom(previewEmails, seed, 1);
    const phone = pickFrom(previewPhones, seed, 4);
    const website = pickFrom(previewWebsites, seed, 5);
    const summary = pickFrom(previewSummaries, seed, 2);
    const expA = pickFrom(previewExperiences, seed, 1);
    const expB = pickFrom(previewExperiences, seed, 4);
    const education = pickFrom(previewEducations, seed, 2);
    const skills = pickFrom(previewSkills, seed, 3);
    const languages = pickFrom(previewLanguages, seed, 1);

    return {
      name,
      title,
      city,
      email,
      phone,
      website,
      summary,
      experiences: [expA, expB],
      education,
      skills,
      languages,
    };
  };

  // Generate realistic preview based on template type
  const getTemplatePreview = (templateId: string) => {
    const data = getPreviewData(templateId);
    const previews: Record<string, JSX.Element> = {
      modern: (
        <div className="grid grid-cols-3 gap-3 h-full text-[10px] leading-4">
          <div className="col-span-1 bg-slate-800 p-3 space-y-3 text-slate-200">
            <div className="w-12 h-12 rounded-full bg-blue-400 mx-auto" />
            <div className="text-center">
              <div className="font-semibold">{data.name}</div>
              <div className="text-slate-400">{data.title}</div>
              <div className="text-[9px] text-slate-500">{data.city}</div>
            </div>
            <div className="space-y-1 text-[9px] text-slate-400">
              <div>{data.email}</div>
              <div>{data.phone}</div>
              <div>{data.website}</div>
            </div>
            <div className="pt-2">
              <div className="text-[9px] uppercase tracking-wide text-blue-300">
                Skills
              </div>
              <div className="mt-1 space-y-1 text-[9px]">
                {data.skills.slice(0, 3).map((skill) => (
                  <div key={skill}>{skill}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-2 space-y-3 p-3">
            <div>
              <div className="text-[11px] font-semibold text-slate-900">
                {data.title}
              </div>
              <div className="text-[9px] text-blue-600">Profil</div>
              <div className="text-slate-600">{data.summary}</div>
            </div>
            <div className="space-y-1.5">
              <div className="text-[9px] uppercase tracking-wide text-blue-600">
                Experience
              </div>
              <div className="text-slate-900 font-medium">
                {data.experiences[0].role} • {data.experiences[0].company}
              </div>
              <div className="text-slate-500">{data.experiences[0].period}</div>
              <div className="text-slate-600">{data.experiences[0].detail}</div>
            </div>
          </div>
        </div>
      ),
      elegant: (
        <div className="h-full bg-white text-[10px] leading-4">
          <div className="bg-gradient-to-r from-rose-100 to-orange-100 p-3 space-y-1">
            <div className="text-[11px] font-semibold text-slate-900">{data.name}</div>
            <div className="text-slate-600">{data.title} • {data.city}</div>
          </div>
          <div className="grid grid-cols-3 gap-3 p-3">
            <div className="col-span-1 space-y-2">
              <div>
                <div className="text-[9px] uppercase tracking-wide text-rose-600">
                  Contact
                </div>
                <div className="text-slate-600">{data.email}</div>
                <div className="text-slate-600">{data.phone}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wide text-rose-600">
                  Skills
                </div>
                <div className="text-slate-600">{data.skills.slice(0, 3).join(" · ")}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wide text-rose-600">
                  Langues
                </div>
                <div className="text-slate-600">{data.languages.join(", ")}</div>
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <div>
                <div className="text-[9px] uppercase tracking-wide text-rose-600">
                  Experience
                </div>
                <div className="text-slate-900 font-medium">
                  {data.experiences[0].role} • {data.experiences[0].company}
                </div>
                <div className="text-slate-500">{data.experiences[0].period}</div>
                <div className="text-slate-600">{data.experiences[0].detail}</div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wide text-rose-600">
                  Formation
                </div>
                <div className="text-slate-900 font-medium">{data.education.degree}</div>
                <div className="text-slate-500">
                  {data.education.school} • {data.education.period}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      classic: (
        <div className="p-4 space-y-3 h-full bg-white text-[10px] leading-4">
          <div className="text-center space-y-1 pb-2 border-b-2 border-slate-800">
            <div className="text-[12px] font-semibold text-slate-900">{data.name}</div>
            <div className="text-slate-600">{data.title}</div>
            <div className="text-slate-500">{data.email} • {data.phone}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] uppercase tracking-wide text-slate-700 border-b border-slate-400 w-fit">
              Profil
            </div>
            <div className="text-slate-600">{data.summary}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] uppercase tracking-wide text-slate-700 border-b border-slate-400 w-fit">
              Experience
            </div>
            <div className="text-slate-900 font-medium">
              {data.experiences[1].role} • {data.experiences[1].company}
            </div>
            <div className="text-slate-500">{data.experiences[1].period}</div>
            <div className="text-slate-600">{data.experiences[1].detail}</div>
          </div>
        </div>
      ),
      minimal: (
        <div className="p-4 space-y-4 h-full bg-white text-[10px] leading-4">
          <div className="space-y-1">
            <div className="text-[12px] font-semibold text-slate-900">{data.name}</div>
            <div className="text-slate-500">{data.title} • {data.city}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] uppercase tracking-wide text-slate-700">
              Profil
            </div>
            <div className="text-slate-600">{data.summary}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] uppercase tracking-wide text-slate-700">
              Formation
            </div>
            <div className="text-slate-900">{data.education.degree}</div>
            <div className="text-slate-500">{data.education.school}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] uppercase tracking-wide text-slate-700">
              Skills
            </div>
            <div className="flex flex-wrap gap-1 text-slate-600">
              {data.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="px-1.5 py-0.5 rounded bg-slate-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
      creative: (
        <div className="relative h-full bg-gradient-to-br from-purple-50 to-pink-50 p-4 text-[10px] leading-4">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 rounded-bl-full" />
          <div className="relative space-y-3">
            <div>
              <div className="text-[12px] font-semibold text-purple-800">{data.name}</div>
              <div className="text-purple-600">{data.title}</div>
            </div>
            <div className="flex gap-2 pt-2 text-[9px] text-purple-700">
              <div className="px-2 py-1 rounded-lg bg-purple-100">Brand</div>
              <div className="px-2 py-1 rounded-lg bg-pink-100">UI</div>
              <div className="px-2 py-1 rounded-lg bg-purple-100">Motion</div>
            </div>
            <div className="space-y-1 pt-1">
              <div className="text-[9px] uppercase tracking-wide text-purple-600">
                Projects
              </div>
              <div className="text-slate-700">Refonte landing SaaS</div>
              <div className="text-slate-700">Kit UI mobile</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-white/70 rounded-lg text-slate-700">
                Portfolio visuel et cas clients.
              </div>
              <div className="p-2 bg-white/70 rounded-lg text-slate-700">
                Workshops & prototypes rapides.
              </div>
            </div>
          </div>
        </div>
      ),
      professional: (
        <div className="p-4 space-y-2 h-full bg-white text-[10px] leading-4">
          <div className="space-y-1 pb-2 border-b border-slate-300">
            <div className="text-[12px] font-semibold text-slate-900">{data.name}</div>
            <div className="text-blue-600">{data.title}</div>
            <div className="text-slate-500">{data.email}</div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[9px] uppercase tracking-wide text-blue-600">
              Resultats
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <span className="mt-0.5">•</span>
              <span>Optimisation du funnel, +18% MQL.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-700">
              <span className="mt-0.5">•</span>
              <span>Lancement de 3 offres en 6 mois.</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="text-[9px] uppercase tracking-wide text-blue-600">
              Experience
            </div>
            <div className="text-slate-900 font-medium">
              {data.experiences[0].role} • {data.experiences[0].company}
            </div>
            <div className="text-slate-500">{data.experiences[0].period}</div>
          </div>
        </div>
      ),
      executive: (
        <div className="h-full bg-slate-50 text-[10px] leading-4">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-3 space-y-1 text-white">
            <div className="text-[12px] font-semibold">{data.name}</div>
            <div className="text-slate-300">{data.title}</div>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-white p-2 rounded shadow-sm space-y-1">
              <div className="text-[9px] uppercase tracking-wide text-slate-600">
                Leadership
              </div>
              <div className="text-slate-700">
                Pilotage d'equipes produit et delivery.
              </div>
            </div>
            <div className="bg-white p-2 rounded shadow-sm space-y-1">
              <div className="text-[9px] uppercase tracking-wide text-slate-600">
                Impact
              </div>
              <div className="text-slate-700">
                +22% de marge sur 3 trimestres.
              </div>
            </div>
            <div className="flex gap-2 text-[9px] text-white">
              <div className="flex-1 bg-slate-700 rounded p-2">Strategy</div>
              <div className="flex-1 bg-slate-700 rounded p-2">Operations</div>
            </div>
          </div>
        </div>
      ),
      compact: (
        <div className="p-3 space-y-2 h-full bg-white text-[9px] leading-4">
          <div className="flex justify-between items-start pb-1 border-b border-slate-300">
            <div>
              <div className="font-semibold text-slate-900">{data.name}</div>
              <div className="text-slate-500">{data.title}</div>
            </div>
            <div className="text-right text-slate-500">
              <div>{data.email}</div>
              <div>{data.city}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="text-blue-600 uppercase tracking-wide">Experience</div>
              <div className="text-slate-700">{data.experiences[0].role}</div>
              <div className="text-slate-500">{data.experiences[0].company}</div>
            </div>
            <div className="space-y-1">
              <div className="text-blue-600 uppercase tracking-wide">Formation</div>
              <div className="text-slate-700">{data.education.degree}</div>
              <div className="text-slate-500">{data.education.school}</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-blue-600 uppercase tracking-wide">Skills</div>
            <div className="flex gap-1 flex-wrap">
              {data.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="px-1.5 py-0.5 rounded bg-slate-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
      tech: (
        <div className="h-full bg-slate-900 p-4 font-mono text-[10px] leading-4">
          <div className="space-y-2 text-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <div className="text-green-300">{data.name}</div>
            </div>
            <div className="text-blue-300">{data.title}</div>
            <div className="bg-slate-800 p-2 rounded space-y-1 border border-slate-700">
              <div className="text-blue-300">stack:</div>
              <div className="flex gap-2 text-slate-300">
                {data.skills.slice(0, 3).map((skill) => (
                  <span key={skill} className="px-2 py-0.5 bg-slate-700 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-blue-300">projects:</div>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-green-400">•</span>
                <span>api-gateway / perf 120ms</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <span className="text-green-400">•</span>
                <span>design-system / 24 components</span>
              </div>
            </div>
          </div>
        </div>
      ),
      academic: (
        <div className="p-4 space-y-2 h-full bg-white text-[10px] leading-4">
          <div className="text-center space-y-1 pb-2">
            <div className="text-[12px] font-semibold text-slate-900">{data.name}</div>
            <div className="text-slate-600">{data.title}</div>
            <div className="text-slate-500">{data.email}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] uppercase tracking-wide text-slate-700">
              Recherche
            </div>
            <div className="pl-2 text-slate-700">
              Article: "Human factors in UX"
            </div>
            <div className="pl-2 text-slate-500 italic">
              Conf. HCI 2023, Paris
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-[9px] uppercase tracking-wide text-slate-700">
              Formation
            </div>
            <div className="text-slate-700">{data.education.degree}</div>
            <div className="text-slate-500">{data.education.school}</div>
          </div>
        </div>
      ),
    };

    return previews[templateId] || previews.modern;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CV Crafter
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {t("nav.home")}
              </Link>
              <Link
                href="/templates"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {t("nav.templates")}
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              {user ? (
                <Link href="/dashboard">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-600">
                      {user.email}
                    </span>
                  </div>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">{t("nav.signup")}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              {t("templates.title")}{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t("templates.titleHighlight")}
              </span>
            </h1>
            <p className="mt-6 text-xl text-slate-600">
              {t("templates.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                type="button"
                aria-pressed={selectedCategory === category.id}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => {
              const translation = getTemplateTranslation(template.id);
              return (
                <div
                  key={template.id}
                  className="group bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
                >
                  {/* Template Preview */}
                  <div className="aspect-[210/297] relative overflow-hidden border-b-2 border-slate-200">
                    {getTemplatePreview(template.id)}
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-medium text-slate-600 shadow-sm">
                      {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {translation.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {translation.desc}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Check className="w-3 h-3 text-green-500" />
                        <span>{t("templates.feature.ats")}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Check className="w-3 h-3 text-green-500" />
                        <span>{t("templates.feature.customizable")}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleUseTemplate(template.id)}
                      className="w-full group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all"
                    >
                      {t("templates.useTemplate")}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl shadow-indigo-500/25">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t("templates.cta.title")}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t("templates.cta.subtitle")}
            </p>
            <Link href="/editor/new">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-blue-50 text-base px-8 h-14 shadow-lg"
              >
                {t("templates.cta.button")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900">CV Crafter</span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher variant="inline" />
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} CV Crafter. {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}