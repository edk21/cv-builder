"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CVEditor } from "@/components/cv/CVEditor";
import { CVPreview } from "@/components/cv/CVPreview";
import { TemplateSwitcher } from "@/components/cv/TemplateSwitcher";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCVStore } from "@/store/cvStore";
import { useTranslation, useLanguageStore } from "@/store/languageStore";
import { createClient } from "@/lib/supabaseClient";
import { defaultCVData } from "@/types/cv";
import { translations } from "@/lib/i18n/translations";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Download,
  Eye,
  FileText,
  Loader2,
  Lock,
  Save,
  User,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeModal } from "@/components/UpgradeModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditorPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const { cvData, setCVData, loadCVData, isDirty, setDirty } = useCVStore();
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [zoom, setZoom] = useState(0.7);
  const [editingName, setEditingName] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Subscription management
  const { isPremium, canSaveCV, canDownloadCV, loading: subscriptionLoading } = useSubscription();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"save" | "download" | "duplicate" | "create">("save");

  // Check if the CV name is a default translated name (for dynamic translation)
  const defaultCvNames = Object.values(translations).map(t => t["editor.newCvName"]).filter(Boolean);
  const isDefaultName = defaultCvNames.includes(cvData.name);
  const displayName = isDefaultName ? t("editor.newCvName") : cvData.name;

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email || "" });
      }

      if (id === "new") {
        // Get translation without adding dependency to avoid re-running on language change
        const translate = useLanguageStore.getState().t;
        loadCVData({ ...defaultCVData, name: translate("editor.newCvName") });
        // Mark as dirty since this is a new unsaved CV
        setDirty(true);
      } else {
        // Fetch existing CV via API
        try {
          const response = await fetch(`/api/cv?id=${id}`);
          if (response.ok) {
            const cv = await response.json();
            loadCVData(cv);
          } else {
            console.error("Failed to load CV");
            router.push("/editor/new");
          }
        } catch (error) {
          console.error("Error loading CV:", error);
          router.push("/editor/new");
        }
      }

      setLoading(false);
    };

    init();
  }, [id, loadCVData, router, setDirty]);

  // Check if this CV is in preview mode
  useEffect(() => {
    const checkPreviewMode = async () => {
      // Wait for everything to be loaded
      if (loading || subscriptionLoading || !user) {
        return;
      }

      // If it's a new CV
      if (id === "new") {
        setIsPreviewMode(!canSaveCV);
        return;
      }

      // If it's an existing CV, check if it's the 2nd+ CV for free user
      if (cvData.id && !isPremium) {
        try {
          const response = await fetch("/api/cv");
          if (response.ok) {
            const allCVs = await response.json();
            // Sort by creation date to find the index
            const sortedCVs = allCVs.sort((a: any, b: any) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            const cvIndex = sortedCVs.findIndex((cv: any) => cv.id === cvData.id);
            // If index > 0 (not the first CV), it's in preview mode
            setIsPreviewMode(cvIndex > 0);
          }
        } catch (error) {
          console.error("Error checking preview mode:", error);
        }
      } else {
        // Premium user or first CV - not in preview mode
        setIsPreviewMode(false);
      }
    };

    checkPreviewMode();
  }, [id, cvData.id, canSaveCV, isPremium, loading, subscriptionLoading, user]);

  const handleSave = async () => {
    // Check if in preview mode
    if (isPreviewMode || !canSaveCV) {
      setUpgradeReason("save");
      setUpgradeModalOpen(true);
      return;
    }
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setSaving(true);

    try {
      // Ensure all required fields are present
      const dataToSave = {
        ...cvData,
        name: cvData.name || t("editor.newCvName"),
        templateId: cvData.templateId || "modern",
        themeColor: cvData.themeColor || "#2563eb",
        personalInfo: cvData.personalInfo || {},
        experiences: cvData.experiences || [],
        education: cvData.education || [],
        skills: cvData.skills || [],
        projects: cvData.projects || [],
        languages: cvData.languages || [],
        certifications: cvData.certifications || [],
      };

      if (id === "new" || !cvData.id) {
        // Create new CV via API
        const response = await fetch("/api/cv", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
        });

        if (response.ok) {
          const savedCV = await response.json();
          loadCVData(savedCV);
          router.replace(`/editor/${savedCV.id}`);
          setSaving(false);
          setSaved(true);
          setDirty(false);
          setTimeout(() => setSaved(false), 2000);
        } else {
          let errorMessage = "Erreur inconnue";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
            console.error("Failed to create CV - API error:", errorData);
          } catch (e) {
            console.error("Failed to create CV - Response status:", response.status, response.statusText);
          }
          setSaving(false);
          alert(`Erreur lors de la sauvegarde: ${errorMessage}`);
        }
      } else {
        // Update existing CV via API
        const response = await fetch("/api/cv", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
        });

        if (response.ok) {
          const savedCV = await response.json();
          setSaving(false);
          setSaved(true);
          setDirty(false);
          setTimeout(() => setSaved(false), 2000);
        } else {
          let errorMessage = "Erreur inconnue";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
            console.error("Failed to update CV - API error:", errorData);
          } catch (e) {
            console.error("Failed to update CV - Response status:", response.status, response.statusText);
          }
          setSaving(false);
          alert(`Erreur lors de la sauvegarde: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      setSaving(false);
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      alert(`Erreur lors de la sauvegarde: ${errorMessage}`);
    }
  };

  const handleDownload = async () => {
    // Check if in preview mode or can't download
    if (isPreviewMode || !canDownloadCV) {
      setUpgradeReason("download");
      setUpgradeModalOpen(true);
      return;
    }

    if (!user) {
      router.push("/auth/login");
      return;
    }

    setDownloading(true);

    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cvData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${cvData.name || "cv"}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }

    setDownloading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href={user ? "/dashboard" : "/"}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
          </Link>
          
          {/* CV Name */}
          {editingName ? (
            <Input
              value={isDefaultName ? "" : cvData.name}
              placeholder={t("editor.newCvName")}
              onChange={(e) => setCVData({ name: e.target.value })}
              onBlur={() => {
                // If empty, set back to default translated name
                if (!cvData.name.trim()) {
                  setCVData({ name: t("editor.newCvName") });
                }
                setEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!cvData.name.trim()) {
                    setCVData({ name: t("editor.newCvName") });
                  }
                  setEditingName(false);
                }
              }}
              className="w-48 h-8 text-sm"
              autoFocus
            />
          ) : (
            <button
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              onClick={() => setEditingName(true)}
            >
              {displayName}
            </button>
          )}

          {isDirty && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              {t("editor.unsaved")}
            </span>
          )}

          {/* Preview Mode Banner */}
          {isPreviewMode && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-amber-700 font-medium">
                Mode Prévisualisation - Passez à Premium pour sauvegarder
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <TemplateSwitcher />

          <div className="h-6 w-px bg-slate-200 mx-2" />

          <LanguageSwitcher />

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saving || isPreviewMode}
            className="gap-2"
          >
            {isPreviewMode && <Lock className="w-4 h-4" />}
            {!isPreviewMode && (saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Save className="w-4 h-4" />
            ))}
            {saving ? t("editor.saving") : saved ? t("editor.saved") : t("editor.save")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(true)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            {t("editor.preview")}
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            disabled={downloading || !user || isPreviewMode}
            className="gap-2"
          >
            {isPreviewMode && <Lock className="w-4 h-4" />}
            {!isPreviewMode && (downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            ))}
            {t("editor.download")}
          </Button>

          {user ? (
            <Link href="/dashboard">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 ml-2">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-600 max-w-24 truncate">
                  {user.email}
                </span>
              </div>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                {t("nav.login")}
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-[480px] bg-white border-r border-slate-200 flex flex-col shrink-0">
          <CVEditor />
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-slate-200 overflow-auto relative">
          {/* Zoom Controls */}
          <div className="sticky top-4 left-4 z-10 flex items-center gap-2 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-slate-600 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Preview Container */}
          <div className="flex justify-center py-8 px-4">
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
              }}
            >
              <CVPreview />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle>{t("editor.previewTitle")}</DialogTitle>
            <DialogDescription>{t("editor.previewDesc")}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-slate-200 p-8">
            <div className="flex justify-center">
              <CVPreview />
            </div>
          </div>
          <div className="p-4 border-t bg-white flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              {t("common.back")}
            </Button>
            <Button onClick={() => { setShowPreview(false); handleDownload(); }} disabled={downloading || !user || isPreviewMode} className="gap-2">
              {isPreviewMode && <Lock className="w-4 h-4" />}
              {!isPreviewMode && (downloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              ))}
              {t("editor.download")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Modal */}
      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        reason={upgradeReason}
      />
    </div>
  );
}

