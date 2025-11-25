Titre du projet : SaaS CV-Builder
Description générale :Un SaaS de création de CV basé sur Next.js latest (App Router) avec authentification, gestion de templates, prévisualisation PDF en temps réel et sauvegarde des CV liés au compte utilisateur.

🎨 Fonctionnalités MVP
Authentification
Login / Signup avec Supabase Auth.
Comptes utilisateurs avec tableau de bord listant les CV sauvegardés.
Éditeur de CV (page principale)
Interface en 2 colonnes :
Colonne gauche : formulaire divisé en sections (informations personnelles, expérience, formation, compétences, projets, etc.).
Colonne droite : rendu visuel du template en temps réel.
Changement de template : conservation des données et adaptation du rendu.
Prévisualisation PDF : affichage en A4 (1 page pour MVP).
Téléchargement du PDF (uniquement si connecté).
Sauvegarde automatique dans la base de données si connecté.
Tableau de bord utilisateur
Liste des CV créés par l’utilisateur.
Actions : éditer / dupliquer / supprimer.

🛠️ Stack technique
Framework : Next.js 16.0.4 (App Router, TypeScript)
UI : TailwindCSS + shadcn/ui + vite
State management : Zustand (ou React Query pour API)
Backend actions : Next.js Server Actions (sauvegarde, génération PDF, templates)
PDF preview : react-pdf
Auth + DB : Supabase (authentification + stockage JSON des CVs)
Bun: comme gestionnaire de packets
Traduction (au choix) IA SDK : utilisé pour la traduction des données (DeepL/Google Translate wrapper via LLM)

📂 Structure du projet (App Router)

src/
app/
layout.tsx # Layout global
page.tsx # Landing page (présentation du SaaS)
dashboard/
page.tsx # Tableau de bord utilisateur (liste des CV)
editor/[id]/
page.tsx # Page d’édition d’un CV
api/
cv/
route.ts # API CRUD pour CVs
pdf/
route.ts # API génération PDF
components/
cv/
CVEditor.tsx # Colonne gauche : formulaire
CVPreview.tsx # Colonne droite : rendu PDF temps réel
TemplateSwitcher.tsx # Sélecteur de templates
ThemeSelector.tsx # Sélecteur de couleurs
ui/ # Composants shadcn/ui
lib/
supabaseClient.ts # Connexion Supabase
templates.ts # Définition des templates
pdf.ts # Utilitaires génération PDF
translation.ts # Wrapper IA SDK (traduction)
styles/
globals.css # Tailwind global

📐 MVP (à générer avec AI Builder)
Landing page avec CTA "Créer mon CV"
Auth (Supabase) : inscription / connexion
Dashboard : liste des CV sauvegardés
Éditeur de CV :
Formulaire (infos perso, expérience, formation, compétences)
Preview en temps réel avec react-pdf
Bouton "Changer de template" (switch entre 2 templates simples)
Bouton "Télécharger en PDF" (uniquement si connecté)
Bouton "Sauvegarder" (server action → Supabase)

🔮 Roadmap évolutions
Multi-pages PDF (A4 auto)
Traduction automatique (IA SDK → DeepL/Google Translate)
Sélecteur de thème (couleurs)
Zoom sur la preview
Plus de templates professionnels

👉 Tâche pour l’AI Builder : Générer un projet Next.js App Router avec cette structure, contenant les fonctionnalités MVP listées ci-dessus.
