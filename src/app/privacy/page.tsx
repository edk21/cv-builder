import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LuShieldCheck as Shield, LuArrowLeft as ArrowLeft } from "react-icons/lu";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>
        
        <div className="bg-white rounded-2xl p-8 shadow-xs border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Politique de confidentialité</h1>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-4">Dernière mise à jour : 23 décembre 2025</p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Collecte des informations</h2>
              <p className="text-slate-600">
                Nous collectons les informations que vous nous fournissez directement lors de la création de votre compte et de votre CV (nom, email, parcours professionnel, etc.).
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Utilisation des données</h2>
              <p className="text-slate-600">
                Vos données sont utilisées exclusivement pour vous fournir le service CV Crafter, gérer votre compte et améliorer votre expérience utilisateur.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Protection des données</h2>
              <p className="text-slate-600">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre tout accès, modification ou divulgation non autorisés. Pour l&apos;authentification et le stockage, nous utilisons Supabase, un service sécurisé de confiance.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Partage avec des tiers</h2>
              <p className="text-slate-600">
                Nous ne vendons ni ne louons vos données personnelles à des tiers. Vos informations ne sont partagées que si nécessaire pour fournir le service ou si la loi l&apos;exige.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Vos droits</h2>
              <p className="text-slate-600">
                Vous avez le droit d&apos;accéder à vos données personnelles, de les rectifier ou de les supprimer à tout moment via les paramètres de votre compte ou en nous contactant.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Cookies</h2>
              <p className="text-slate-600">
                Nous utilisons des cookies pour maintenir votre session active et assurer le bon fonctionnement du site.
              </p>
            </section>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/auth/login">Retour à la connexion</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
