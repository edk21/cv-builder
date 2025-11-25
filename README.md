# 📄 CV Builder

Un SaaS moderne de création de CV avec prévisualisation en temps réel, templates professionnels et export PDF.

![CV Builder Preview](./preview.png)

## ✨ Fonctionnalités

- 🎨 **Templates professionnels** - Plusieurs templates modernes et élégants
- 👁️ **Prévisualisation en temps réel** - Visualisez vos modifications instantanément
- 🎯 **Personnalisation** - Couleurs et mise en page adaptables
- 📥 **Export PDF** - Téléchargez votre CV en haute qualité
- 🔐 **Authentification** - Sauvegardez et gérez vos CV
- 📱 **Responsive** - Interface adaptée à tous les écrans

## 🛠️ Stack Technique

- **Framework**: Next.js 15 (App Router, TypeScript)
- **UI**: TailwindCSS + Composants personnalisés
- **State Management**: Zustand
- **Auth & DB**: Supabase
- **Package Manager**: Bun

## 🚀 Installation

### Prérequis

- [Bun](https://bun.sh/) (ou Node.js 18+)
- Un compte [Supabase](https://supabase.com)

### Étapes

1. **Cloner le projet**

```bash
git clone <repo-url>
cd cv-builder
```

2. **Installer les dépendances**

```bash
bun install
```

3. **Configurer Supabase**

   - Créez un projet sur [Supabase](https://supabase.com)
   - Allez dans SQL Editor et exécutez le script `supabase/schema.sql`
   - Récupérez votre URL et clé API dans Settings > API

4. **Configurer les variables d'environnement**

```bash
cp .env.local.example .env.local
```

Puis éditez `.env.local` avec vos credentials Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

5. **Lancer le serveur de développement**

```bash
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📂 Structure du Projet

```
src/
├── app/
│   ├── layout.tsx          # Layout global
│   ├── page.tsx            # Landing page
│   ├── dashboard/          # Tableau de bord utilisateur
│   ├── editor/[id]/        # Éditeur de CV
│   ├── auth/               # Pages d'authentification
│   └── api/                # API Routes
├── components/
│   ├── cv/                 # Composants CV (Editor, Preview, etc.)
│   └── ui/                 # Composants UI réutilisables
├── lib/                    # Utilitaires et configuration
├── store/                  # État global (Zustand)
└── types/                  # Types TypeScript
```

## 🎨 Templates Disponibles

| Template     | Description                        |
| ------------ | ---------------------------------- |
| **Modern**   | Design épuré et contemporain       |
| **Classic**  | Style traditionnel à deux colonnes |
| **Minimal**  | Design simple et élégant           |
| **Creative** | Style audacieux et original        |

## 🔧 Scripts Disponibles

```bash
bun dev      # Lancer en mode développement
bun build    # Build de production
bun start    # Lancer le build de production
bun lint     # Linter le code
```

## 📝 Fonctionnalités MVP

- [x] Landing page avec CTA
- [x] Authentification (Login/Signup)
- [x] Dashboard utilisateur
- [x] Éditeur de CV en deux colonnes
- [x] Prévisualisation en temps réel
- [x] Changement de template
- [x] Sélection de couleur
- [x] Sauvegarde automatique
- [x] Export PDF

## 🔮 Roadmap

- [ ] Multi-pages PDF (A4 auto)
- [ ] Traduction automatique (IA)
- [ ] Plus de templates
- [ ] Import depuis LinkedIn
- [ ] Partage public du CV

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

Fait avec ❤️ par McKen Team
