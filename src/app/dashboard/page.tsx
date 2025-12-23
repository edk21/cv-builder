"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabaseClient";
import { CVData } from "@/types/cv";
import {
  Copy,
  Edit3,
  FileText,
  Loader2,
  Lock,
  LogOut,
  MoreVertical,
  Plus,
  Search,
  Shield,
  Trash2,
  User
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [cvList, setCvList] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const supabase = createClient();

      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/auth/login");
        return;
      }

      setUser({
        email: authUser.email || "",
        name: authUser.user_metadata?.full_name,
      });

      // Vérifier si l'utilisateur est admin
      setIsUserAdmin(authUser.user_metadata?.isAdmin === true);

      try {
        const response = await fetch("/api/cv");
        if (response.ok) {
          const cvs = await response.json();
          setCvList(cvs);
        } else {
          console.error("Failed to fetch CVs");
        }
      } catch (error) {
        console.error("Error fetching CVs:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordLoading(true);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Veuillez remplir tous les champs");
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 6 caractères");
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas");
      setPasswordLoading(false);
      return;
    }

    try {
      // Utiliser l'API pour changer le mot de passe (qui vérifie l'ancien mot de passe)
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPasswordError(data.error || "Erreur lors du changement de mot de passe");
        setPasswordLoading(false);
        return;
      }

      // Succès
      setPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      alert("Mot de passe modifié avec succès !");
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce CV ?")) return;

    try {
      const response = await fetch(`/api/cv?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCvList(cvList.filter((cv) => cv.id !== id));
        setMenuOpen(null);
      } else {
        console.error("Failed to delete CV");
        alert("Erreur lors de la suppression du CV");
      }
    } catch (error) {
      console.error("Error deleting CV:", error);
      alert("Erreur lors de la suppression du CV");
    }
  };

  const handleDuplicate = async (cv: CVData) => {
    try {
      const newCVData = {
        ...cv,
        id: undefined, // Let the server/DB assign a new ID
        name: `${cv.name} (copie)`,
      };

      const response = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCVData),
      });

      if (response.ok) {
        const createdCV = await response.json();
        setCvList([createdCV, ...cvList]);
        setMenuOpen(null);
      } else {
        console.error("Failed to duplicate CV");
        alert("Erreur lors de la duplication du CV");
      }
    } catch (error) {
      console.error("Error duplicating CV:", error);
      alert("Erreur lors de la duplication du CV");
    }
  };

  // Filter relies on cv.name which comes correctly from the API now
  const filteredCVs = cvList.filter((cv) =>
    cv.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
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

            <div className="flex items-center gap-4">
              {isUserAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Administration
                  </Button>
                </Link>
              )}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-700">
                    {user?.name || user?.email}
                  </span>
                </button>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                      <button
                        className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50 flex items-center gap-2"
                        onClick={() => {
                          setPasswordDialogOpen(true);
                          setUserMenuOpen(false);
                        }}
                      >
                        <Lock className="w-4 h-4" />
                        Modifier le mot de passe
                      </button>
                      <button
                        className="w-full px-3 py-2 text-sm text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mes CV</h1>
            <p className="text-slate-600 mt-1">
              Gérez et créez vos CV professionnels
            </p>
          </div>
          <Link href="/editor/new">
            <Button className="shadow-lg shadow-blue-500/20">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau CV
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un CV..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* CV Grid */}
        {filteredCVs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {searchQuery ? "Aucun résultat" : "Aucun CV pour le moment"}
              </h3>
              <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                {searchQuery
                  ? "Aucun CV ne correspond à votre recherche."
                  : "Créez votre premier CV professionnel en quelques minutes."}
              </p>
              {!searchQuery && (
                <Link href="/editor/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Créer mon premier CV
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCVs.map((cv) => (
              <Card
                key={cv.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {cv.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Modifié le{" "}
                        {new Date(cv.updatedAt || "").toLocaleDateString("fr-FR")}
                      </CardDescription>
                    </div>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          setMenuOpen(menuOpen === cv.id ? null : cv.id || null)
                        }
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {menuOpen === cv.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setMenuOpen(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                            <button
                              className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50 flex items-center gap-2"
                              onClick={() => {
                                router.push(`/editor/${cv.id}`);
                                setMenuOpen(null);
                              }}
                            >
                              <Edit3 className="w-4 h-4" />
                              Modifier
                            </button>
                            <button
                              className="w-full px-3 py-2 text-sm text-left hover:bg-slate-50 flex items-center gap-2"
                              onClick={() => handleDuplicate(cv)}
                            >
                              <Copy className="w-4 h-4" />
                              Dupliquer
                            </button>
                            <button
                              className="w-full px-3 py-2 text-sm text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                              onClick={() => handleDelete(cv.id || "")}
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* CV Preview Thumbnail */}
                  <div
                    className="aspect-[210/297] bg-slate-100 rounded-lg border border-slate-200 mb-4 overflow-hidden cursor-pointer group-hover:border-blue-300 transition-colors"
                    onClick={() => router.push(`/editor/${cv.id}`)}
                  >
                    <div className="w-full h-full p-4 space-y-2">
                      <div
                        className="h-3 rounded w-1/2"
                        style={{ backgroundColor: cv.themeColor }}
                      />
                      <div className="h-2 bg-slate-200 rounded w-3/4" />
                      <div className="h-2 bg-slate-200 rounded w-2/3" />
                      <div className="h-2 bg-slate-200 rounded w-1/2" />
                      <div className="mt-3 h-2 rounded w-1/3" style={{ backgroundColor: cv.themeColor, opacity: 0.5 }} />
                      <div className="h-2 bg-slate-200 rounded w-full" />
                      <div className="h-2 bg-slate-200 rounded w-5/6" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cv.themeColor }}
                    />
                    <span className="text-xs text-slate-500 capitalize">
                      Template {cv.templateId}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Dialog pour changer le mot de passe */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre nouveau mot de passe. Il doit contenir au moins 6 caractères.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Input
                type="password"
                label="Ancien mot de passe"
                placeholder="Ancien mot de passe"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={passwordLoading}
              />
            </div>
            <div>
              <Input
                type="password"
                label="Nouveau mot de passe"
                placeholder="Nouveau mot de passe (min. 6 caractères)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={passwordLoading}
              />
            </div>
            <div>
              <Input
                type="password"
                label="Confirmer le nouveau mot de passe"
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={passwordLoading}
                error={passwordError}
              />
            </div>
            {passwordError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {passwordError}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setPasswordDialogOpen(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setPasswordError("");
              }}
              disabled={passwordLoading}
            >
              Annuler
            </Button>
            <Button onClick={handleChangePassword} disabled={passwordLoading}>
              {passwordLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Modification...
                </>
              ) : (
                "Modifier le mot de passe"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

