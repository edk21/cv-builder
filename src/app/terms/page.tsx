import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LuFileText as FileText, LuArrowLeft as ArrowLeft } from "react-icons/lu";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
        
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Conditions d'utilisation</h1>
          </div>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-4">Dernière mise à jour : 23 décembre 2025</p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Acceptation des conditions</h2>
              <p className="text-slate-600">
                En accédant et en utilisant CV Crafter, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Description du service</h2>
              <p className="text-slate-600">
                CV Crafter est un outil en ligne permettant aux utilisateurs de créer, modifier et exporter des curriculum vitae professionnels à l'aide de divers modèles.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Comptes utilisateurs</h2>
              <p className="text-slate-600">
                Pour utiliser certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de votre mot de passe et de toutes les activités effectuées sous votre compte.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Utilisation acceptable</h2>
              <p className="text-slate-600">
                Vous vous engagez à ne pas utiliser le service à des fins illégales ou pour publier du contenu diffamatoire, obscène ou portant atteinte aux droits de tiers.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Propriété intellectuelle</h2>
              <p className="text-slate-600">
                Le contenu que vous créez reste votre propriété. Cependant, les modèles, le design et le logiciel de CV Crafter sont protégés par le droit d'auteur et restent la propriété exclusive de CV Crafter.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Modifications des conditions</h2>
              <p className="text-slate-600">
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les changements seront effectifs dès leur publication sur le site.
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
