# Configuration du Panneau d'Administration

## Vue d'ensemble

Un panneau d'administration a été créé pour gérer les utilisateurs de l'application. Ce panneau permet de :

- Voir tous les utilisateurs inscrits
- Visualiser leurs informations (email, nom, date d'inscription, dernière connexion)
- Voir le nombre de CVs créés par chaque utilisateur
- Donner ou retirer les droits administrateur à un utilisateur

## Accès au panneau admin

Pour accéder au panneau d'administration, un utilisateur doit :

1. Être connecté
2. Avoir le flag `isAdmin: true` dans ses métadonnées utilisateur (`user_metadata`)

L'URL du panneau admin est : `/admin`

## Configuration initiale

### 1. Définir la clé de service Supabase

Pour que le panneau admin fonctionne, vous devez ajouter la clé de service Supabase dans vos variables d'environnement :

```env
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici
```

Cette clé se trouve dans votre tableau de bord Supabase :

1. Allez dans Settings > API
2. Copiez la "service_role" key (⚠️ Attention : cette clé ne doit jamais être exposée côté client)

### 2. Créer le premier administrateur

Pour créer le premier administrateur, vous devez mettre à jour les métadonnées d'un utilisateur directement dans Supabase :

#### Option A : Via le tableau de bord Supabase

1. Allez dans Authentication > Users
2. Sélectionnez l'utilisateur à promouvoir administrateur
3. Dans "User Metadata", ajoutez :
   ```json
   {
     "isAdmin": true
   }
   ```
4. Sauvegardez

#### Option B : Via SQL (Supabase SQL Editor)

```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{isAdmin}',
  'true'::jsonb
)
WHERE email = 'votre-email@example.com';
```

#### Option C : Via l'API Supabase (depuis une console Node.js)

```javascript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { data, error } = await supabase.auth.admin.updateUserById(
  "user-id-here",
  {
    user_metadata: {
      isAdmin: true,
    },
  }
);
```

### 3. Vérifier l'accès

Une fois qu'un utilisateur a été promu administrateur :

1. Déconnectez-vous et reconnectez-vous (pour rafraîchir les métadonnées)
2. Vous devriez voir un bouton "Administration" dans le dashboard
3. Accédez à `/admin` pour voir le panneau d'administration

## Utilisation

### Visualiser les utilisateurs

Le panneau affiche une table avec :

- **Utilisateur** : Avatar et nom
- **Email** : Adresse email (avec indicateur de vérification)
- **Inscription** : Date et heure d'inscription
- **Dernière connexion** : Date et heure de la dernière connexion
- **CVs** : Nombre de CVs créés par l'utilisateur
- **Statut** : Admin ou Utilisateur
- **Actions** : Bouton pour donner/retirer les droits admin

### Gérer les administrateurs

Pour donner les droits admin à un utilisateur :

1. Cliquez sur le bouton "Donner admin" dans la colonne Actions
2. Le statut de l'utilisateur sera mis à jour immédiatement

Pour retirer les droits admin :

1. Cliquez sur le bouton "Retirer admin" dans la colonne Actions
2. Le statut de l'utilisateur sera mis à jour immédiatement

### Rechercher un utilisateur

Utilisez la barre de recherche en haut du panneau pour filtrer les utilisateurs par email ou nom.

### Statistiques

Le panneau affiche trois cartes de statistiques :

- **Total utilisateurs** : Nombre total d'utilisateurs inscrits
- **Administrateurs** : Nombre d'utilisateurs avec droits admin
- **Total CVs créés** : Nombre total de CVs créés par tous les utilisateurs

## Sécurité

- Le panneau admin vérifie les droits administrateur à chaque chargement
- Les routes API admin vérifient également les droits avant de retourner des données
- La clé de service Supabase est utilisée uniquement côté serveur et n'est jamais exposée au client
- Seuls les utilisateurs avec `isAdmin: true` peuvent accéder au panneau et aux routes API admin

## Notes importantes

⚠️ **Sécurité** : La clé de service Supabase (`SUPABASE_SERVICE_ROLE_KEY`) contourne les politiques RLS (Row Level Security). Elle ne doit être utilisée que côté serveur et jamais exposée au client.

⚠️ **Métadonnées utilisateur** : Les métadonnées utilisateur sont lues depuis `user_metadata` lors de l'authentification. Si vous modifiez les métadonnées d'un utilisateur, il devra se déconnecter et se reconnecter pour que les changements prennent effet (ou utilisez `router.refresh()` côté client).

## Structure des fichiers

- `/src/lib/adminUtils.ts` : Utilitaires pour vérifier les droits admin et créer un client Supabase admin
- `/src/app/api/admin/users/route.ts` : Route API pour récupérer et modifier les utilisateurs
- `/src/app/admin/page.tsx` : Interface du panneau d'administration
- `/src/middleware.ts` : Protection de la route `/admin` (vérification d'authentification)
