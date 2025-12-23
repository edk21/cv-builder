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

  // Generate realistic preview based on template type
  const getTemplatePreview = (templateId: string) => {
    const previews: Record<string, JSX.Element> = {
      modern: (
        <div className="grid grid-cols-3 gap-3 h-full">
          <div className="col-span-1 bg-slate-800 p-3 space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-400 mx-auto" />
            <div className="space-y-1">
              <div className="h-1.5 bg-slate-600 rounded w-3/4 mx-auto" />
              <div className="h-1.5 bg-slate-600 rounded w-2/3 mx-auto" />
            </div>
            <div className="space-y-2 pt-3">
              <div className="h-1 bg-slate-700 rounded w-full" />
              <div className="h-1 bg-slate-700 rounded w-5/6" />
              <div className="h-1 bg-slate-700 rounded w-full" />
            </div>
          </div>
          <div className="col-span-2 space-y-3 p-3">
            <div>
              <div className="h-3 bg-slate-800 rounded w-2/3 mb-1" />
              <div className="h-1.5 bg-blue-500 rounded w-1/3" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2 bg-blue-400 rounded w-1/4" />
              <div className="h-1 bg-slate-200 rounded w-full" />
              <div className="h-1 bg-slate-200 rounded w-5/6" />
              <div className="h-1 bg-slate-200 rounded w-4/5" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2 bg-blue-400 rounded w-1/3" />
              <div className="h-1 bg-slate-200 rounded w-full" />
              <div className="h-1 bg-slate-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      ),
      elegant: (
        <div className="h-full bg-white">
          <div className="bg-gradient-to-r from-rose-100 to-orange-100 p-3 space-y-1">
            <div className="h-3.5 bg-slate-800 rounded w-1/2" />
            <div className="h-1.5 bg-slate-600 rounded w-1/3" />
          </div>
          <div className="grid grid-cols-3 gap-3 p-3">
            <div className="col-span-1 space-y-2">
              <div className="space-y-1">
                <div className="h-2 bg-rose-400 rounded w-3/4" />
                <div className="h-1 bg-slate-300 rounded w-full" />
                <div className="h-1 bg-slate-300 rounded w-5/6" />
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-rose-400 rounded w-2/3" />
                <div className="h-1 bg-slate-300 rounded w-full" />
                <div className="h-1 bg-slate-300 rounded w-4/5" />
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-rose-400 rounded w-3/5" />
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-rose-300 rounded-full" />
                  <div className="h-1 bg-slate-200 rounded flex-1" />
                </div>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-rose-300 rounded-full" />
                  <div className="h-1 bg-slate-200 rounded flex-1" />
                </div>
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <div className="space-y-1">
                <div className="h-2 bg-rose-400 rounded w-1/3" />
                <div className="h-1 bg-slate-200 rounded w-full" />
                <div className="h-1 bg-slate-200 rounded w-5/6" />
                <div className="h-1 bg-slate-200 rounded w-4/5" />
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-rose-400 rounded w-2/5" />
                <div className="h-1 bg-slate-200 rounded w-full" />
                <div className="h-1 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      ),
      classic: (
        <div className="p-4 space-y-3 h-full bg-white">
          <div className="text-center space-y-2 pb-2 border-b-2 border-slate-800">
            <div className="h-4 bg-slate-800 rounded w-1/2 mx-auto" />
            <div className="h-2 bg-slate-600 rounded w-1/3 mx-auto" />
            <div className="flex justify-center gap-2">
              <div className="h-1 bg-slate-400 rounded w-16" />
              <div className="h-1 bg-slate-400 rounded w-16" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2.5 bg-slate-700 rounded w-1/4 border-b border-slate-400" />
            <div className="space-y-1">
              <div className="h-1.5 bg-slate-300 rounded w-full" />
              <div className="h-1.5 bg-slate-300 rounded w-5/6" />
              <div className="h-1.5 bg-slate-300 rounded w-4/5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2.5 bg-slate-700 rounded w-1/3 border-b border-slate-400" />
            <div className="space-y-1">
              <div className="h-1.5 bg-slate-300 rounded w-full" />
              <div className="h-1.5 bg-slate-300 rounded w-3/4" />
            </div>
          </div>
        </div>
      ),
      minimal: (
        <div className="p-4 space-y-4 h-full bg-white">
          <div className="space-y-1">
            <div className="h-5 bg-slate-900 rounded w-1/2" />
            <div className="h-1.5 bg-slate-500 rounded w-1/4" />
          </div>
          <div className="space-y-2">
            <div className="h-1.5 bg-slate-800 rounded w-1/5" />
            <div className="h-1 bg-slate-200 rounded w-full" />
            <div className="h-1 bg-slate-200 rounded w-5/6" />
            <div className="h-1 bg-slate-200 rounded w-4/5" />
          </div>
          <div className="space-y-2">
            <div className="h-1.5 bg-slate-800 rounded w-1/4" />
            <div className="h-1 bg-slate-200 rounded w-full" />
            <div className="h-1 bg-slate-200 rounded w-3/4" />
          </div>
          <div className="space-y-2">
            <div className="h-1.5 bg-slate-800 rounded w-1/6" />
            <div className="flex gap-2">
              <div className="h-5 bg-slate-100 rounded flex-1" />
              <div className="h-5 bg-slate-100 rounded flex-1" />
              <div className="h-5 bg-slate-100 rounded flex-1" />
            </div>
          </div>
        </div>
      ),
      creative: (
        <div className="relative h-full bg-gradient-to-br from-purple-50 to-pink-50 p-4">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 opacity-20 rounded-bl-full" />
          <div className="relative space-y-3">
            <div className="space-y-1">
              <div className="h-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded w-2/3" />
              <div className="h-2 bg-purple-400 rounded w-1/3" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="w-8 h-8 rounded-lg bg-purple-400" />
              <div className="w-8 h-8 rounded-lg bg-pink-400" />
              <div className="w-8 h-8 rounded-lg bg-purple-300" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-2 bg-purple-500 rounded w-1/4" />
              <div className="h-1 bg-slate-300 rounded w-full" />
              <div className="h-1 bg-slate-300 rounded w-5/6" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-12 bg-white/50 rounded-lg" />
              <div className="h-12 bg-white/50 rounded-lg" />
            </div>
          </div>
        </div>
      ),
      professional: (
        <div className="p-4 space-y-2 h-full bg-white">
          <div className="space-y-1 pb-2 border-b border-slate-300">
            <div className="h-4 bg-slate-900 rounded w-1/2" />
            <div className="h-1.5 bg-blue-600 rounded w-1/4" />
            <div className="h-1 bg-slate-400 rounded w-2/3" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2 bg-blue-600 rounded w-1/4" />
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-slate-400 rounded-full mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="h-1 bg-slate-200 rounded w-full" />
                <div className="h-1 bg-slate-200 rounded w-5/6" />
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-slate-400 rounded-full mt-0.5" />
              <div className="flex-1 space-y-1">
                <div className="h-1 bg-slate-200 rounded w-full" />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 bg-blue-600 rounded w-1/3" />
            <div className="h-1 bg-slate-200 rounded w-full" />
            <div className="h-1 bg-slate-200 rounded w-4/5" />
          </div>
        </div>
      ),
      executive: (
        <div className="h-full bg-slate-50">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-3 space-y-1">
            <div className="h-4 bg-white rounded w-1/2" />
            <div className="h-1.5 bg-slate-400 rounded w-1/3" />
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-white p-2 rounded shadow-sm space-y-1">
              <div className="h-2 bg-slate-700 rounded w-1/4" />
              <div className="h-1 bg-slate-300 rounded w-full" />
              <div className="h-1 bg-slate-300 rounded w-5/6" />
            </div>
            <div className="bg-white p-2 rounded shadow-sm space-y-1">
              <div className="h-2 bg-slate-700 rounded w-1/3" />
              <div className="h-1 bg-slate-300 rounded w-full" />
              <div className="h-1 bg-slate-300 rounded w-3/4" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-700 h-8 rounded" />
              <div className="flex-1 bg-slate-700 h-8 rounded" />
            </div>
          </div>
        </div>
      ),
      compact: (
        <div className="p-3 space-y-2 h-full bg-white text-xs">
          <div className="flex justify-between items-start pb-1 border-b border-slate-300">
            <div className="space-y-0.5">
              <div className="h-2.5 bg-slate-900 rounded w-20" />
              <div className="h-1 bg-slate-500 rounded w-16" />
            </div>
            <div className="space-y-0.5 text-right">
              <div className="h-1 bg-slate-400 rounded w-16 ml-auto" />
              <div className="h-1 bg-slate-400 rounded w-12 ml-auto" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="h-1.5 bg-blue-600 rounded w-2/3" />
              <div className="h-0.5 bg-slate-200 rounded w-full" />
              <div className="h-0.5 bg-slate-200 rounded w-5/6" />
              <div className="h-0.5 bg-slate-200 rounded w-4/5" />
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-blue-600 rounded w-2/3" />
              <div className="h-0.5 bg-slate-200 rounded w-full" />
              <div className="h-0.5 bg-slate-200 rounded w-3/4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 bg-blue-600 rounded w-1/4" />
            <div className="flex gap-1">
              <div className="h-4 bg-slate-100 rounded flex-1" />
              <div className="h-4 bg-slate-100 rounded flex-1" />
              <div className="h-4 bg-slate-100 rounded flex-1" />
              <div className="h-4 bg-slate-100 rounded flex-1" />
            </div>
          </div>
        </div>
      ),
      tech: (
        <div className="h-full bg-slate-900 p-4 font-mono">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <div className="h-3 bg-green-400 rounded w-1/3" />
            </div>
            <div className="h-1.5 bg-slate-700 rounded w-1/4" />
            <div className="bg-slate-800 p-2 rounded space-y-1 border border-slate-700">
              <div className="h-1.5 bg-blue-400 rounded w-1/5" />
              <div className="flex gap-2">
                <div className="h-4 bg-slate-700 rounded px-2 flex-1" />
                <div className="h-4 bg-slate-700 rounded px-2 flex-1" />
                <div className="h-4 bg-slate-700 rounded px-2 flex-1" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-blue-400 rounded w-1/4" />
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-green-400" />
                <div className="h-1 bg-slate-600 rounded flex-1" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-green-400" />
                <div className="h-1 bg-slate-600 rounded flex-1" />
              </div>
            </div>
          </div>
        </div>
      ),
      academic: (
        <div className="p-4 space-y-2 h-full bg-white">
          <div className="text-center space-y-1 pb-2">
            <div className="h-3 bg-slate-900 rounded w-1/2 mx-auto" />
            <div className="h-1.5 bg-slate-600 rounded w-1/3 mx-auto" />
            <div className="h-1 bg-slate-400 rounded w-2/5 mx-auto" />
          </div>
          <div className="space-y-1.5">
            <div className="h-2 bg-slate-700 rounded w-1/3" />
            <div className="pl-2 space-y-1">
              <div className="h-1 bg-slate-300 rounded w-full" />
              <div className="h-1 bg-slate-300 rounded w-5/6" />
              <div className="text-xs italic">
                <div className="h-0.5 bg-slate-200 rounded w-3/4" />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 bg-slate-700 rounded w-2/5" />
            <div className="space-y-0.5">
              <div className="h-1 bg-slate-200 rounded w-full" />
              <div className="h-1 bg-slate-200 rounded w-4/5" />
            </div>
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