"use client";

import { templates, themeColors } from "@/lib/templates";
import { useCVStore } from "@/store/cvStore";
import { useTranslation } from "@/store/languageStore";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Layout, Check } from "lucide-react";
import { useState } from "react";

export function TemplateSwitcher() {
  const { cvData, setTemplate, setThemeColor } = useCVStore();
  const { t } = useTranslation();
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [colorDialogOpen, setColorDialogOpen] = useState(false);

  const templateTranslations: Record<string, { name: string; desc: string }> = {
    modern: { name: t("template.modern"), desc: t("template.modernDesc") },
    classic: { name: t("template.classic"), desc: t("template.classicDesc") },
    minimal: { name: t("template.minimal"), desc: t("template.minimalDesc") },
    creative: { name: t("template.creative"), desc: t("template.creativeDesc") },
  };

  return (
    <div className="flex items-center gap-2">
      {/* Template Selector */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Layout className="w-4 h-4" />
            {t("editor.template")}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("template.choose")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {templates.map((template) => (
              <button
                key={template.id}
                className={cn(
                  "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
                  cvData.templateId === template.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                )}
                onClick={() => {
                  setTemplate(template.id);
                  setTemplateDialogOpen(false);
                }}
              >
                {cvData.templateId === template.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                {/* Template Preview */}
                <div className="aspect-[210/297] bg-slate-100 rounded-lg mb-3 overflow-hidden">
                  <div className="w-full h-full p-3 space-y-2">
                    <div
                      className="h-2 rounded w-1/2"
                      style={{ backgroundColor: cvData.themeColor }}
                    />
                    <div className="h-1.5 bg-slate-200 rounded w-3/4" />
                    <div className="h-1.5 bg-slate-200 rounded w-2/3" />
                    <div className="mt-2 h-1.5 rounded w-1/3" style={{ backgroundColor: cvData.themeColor, opacity: 0.5 }} />
                    <div className="h-1.5 bg-slate-200 rounded w-full" />
                    <div className="h-1.5 bg-slate-200 rounded w-5/6" />
                  </div>
                </div>
                <h3 className="font-medium text-slate-900">{templateTranslations[template.id]?.name || template.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {templateTranslations[template.id]?.desc || template.description}
                </p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Color Selector */}
      <Dialog open={colorDialogOpen} onOpenChange={setColorDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <div
              className="w-4 h-4 rounded-full border border-slate-200"
              style={{ backgroundColor: cvData.themeColor }}
            />
            {t("editor.color")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("color.choose")}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3 mt-4">
            {themeColors.map((color) => (
              <button
                key={color.value}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                  cvData.themeColor === color.value
                    ? "border-slate-900"
                    : "border-transparent hover:border-slate-200"
                )}
                onClick={() => {
                  setThemeColor(color.value);
                  setColorDialogOpen(false);
                }}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full shadow-sm",
                    cvData.themeColor === color.value && "ring-2 ring-offset-2 ring-slate-900"
                  )}
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs text-slate-600">{color.name}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

