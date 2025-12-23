"use client";

import { UserInfo } from "@/app/api/admin/users/route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  Calendar,
  Crown,
  FileCheck,
  FileText,
  Loader2,
  LogOut,
  Mail,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  ShieldX,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const supabase = createClient();

      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/auth/login?redirect=/admin");
        return;
      }

      setUser({
        email: authUser.email || "",
        name: authUser.user_metadata?.full_name,
      });

      try {
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const usersData = await response.json();
          setUsers(usersData);
        } else if (response.status === 403) {
          setError("Accès refusé. Vous n'avez pas les droits administrateur.");
        } else {
          setError("Erreur lors de la récupération des utilisateurs");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Erreur lors de la récupération des utilisateurs");
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

  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        setError("Erreur lors de la récupération des utilisateurs");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Erreur lors de la récupération des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    setUpdating(userId);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          isAdmin: !currentStatus,
        }),
      });

      if (response.ok) {
        // Mettre à jour l'état local
        setUsers(
          users.map((u) =>
            u.id === userId ? { ...u, isAdmin: !currentStatus } : u
          )
        );
      } else {
        alert("Erreur lors de la mise à jour du statut administrateur");
      }
    } catch (error) {
      console.error("Error updating admin status:", error);
      alert("Erreur lors de la mise à jour du statut administrateur");
    } finally {
      setUpdating(null);
    }
  };

  const toggleSubscription = async (userId: string, currentPlan: string) => {
    setUpdating(userId);
    const newPlan = currentPlan === "premium" ? "free" : "premium";

    try {
      const response = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          planType: newPlan,
          endDate: null, // Unlimited subscription
        }),
      });

      if (response.ok) {
        // Mettre à jour l'état local
        setUsers(
          users.map((u) =>
            u.id === userId
              ? { ...u, subscriptionPlan: newPlan, subscriptionStatus: "active", subscriptionEndDate: null }
              : u
          )
        );
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Erreur lors de la mise à jour de l'abonnement");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert("Erreur lors de la mise à jour de l'abonnement");
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !users.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au tableau de bord
              </Button>
              <Button onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Administration
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">
                  {user?.name || user?.email}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestion des utilisateurs</h1>
            <p className="text-slate-600 mt-1">
              Visualisez et gérez tous les utilisateurs de l'application
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total utilisateurs</CardDescription>
              <CardTitle className="text-3xl">{users.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <Users className="w-4 h-4 mr-1" />
                Utilisateurs inscrits
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Administrateurs</CardDescription>
              <CardTitle className="text-3xl">
                {users.filter((u) => u.isAdmin).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <ShieldCheck className="w-4 h-4 mr-1" />
                Utilisateurs avec droits admin
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total CVs créés</CardDescription>
              <CardTitle className="text-3xl">
                {users.reduce((sum, u) => sum + u.cvCount, 0)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-slate-600">
                <FileText className="w-4 h-4 mr-1" />
                CVs au total
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Rechercher un utilisateur par email ou nom..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>
              {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""} trouvé
              {searchQuery && ` pour "${searchQuery}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">
                  {searchQuery
                    ? "Aucun utilisateur ne correspond à votre recherche."
                    : "Aucun utilisateur trouvé."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Utilisateur
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Inscription
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Dernière connexion
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        CVs
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Abonnement
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Statut
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((userInfo) => (
                      <tr
                        key={userInfo.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {userInfo.name
                                ? userInfo.name.charAt(0).toUpperCase()
                                : userInfo.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">
                                {userInfo.name || "Sans nom"}
                              </div>
                              {userInfo.emailVerified && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                  <Mail className="w-3 h-3" />
                                  Vérifié
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-700">
                          {userInfo.email}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(userInfo.createdAt)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-600">
                          {formatDate(userInfo.lastSignInAt)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">{userInfo.cvCount}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {userInfo.subscriptionPlan === "premium" || userInfo.subscriptionPlan === "enterprise" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-medium">
                              <Crown className="w-3 h-3" />
                              Premium
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                              Gratuit
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {userInfo.isAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-medium">
                              <ShieldCheck className="w-3 h-3" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                              <ShieldX className="w-3 h-3" />
                              Utilisateur
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                toggleSubscription(userInfo.id, userInfo.subscriptionPlan)
                              }
                              disabled={updating === userInfo.id}
                            >
                              {updating === userInfo.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : userInfo.subscriptionPlan === "premium" || userInfo.subscriptionPlan === "enterprise" ? (
                                <>
                                  <Crown className="w-4 h-4 mr-1" />
                                  Révoquer Premium
                                </>
                              ) : (
                                <>
                                  <Crown className="w-4 h-4 mr-1" />
                                  Donner Premium
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                toggleAdminStatus(userInfo.id, userInfo.isAdmin)
                              }
                              disabled={updating === userInfo.id}
                            >
                              {updating === userInfo.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : userInfo.isAdmin ? (
                                <>
                                  <ShieldX className="w-4 h-4 mr-1" />
                                  Retirer admin
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="w-4 h-4 mr-1" />
                                  Donner admin
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}