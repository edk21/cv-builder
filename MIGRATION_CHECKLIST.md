# Checklist de Migration - Système d'Abonnement

## ✅ Étapes à suivre après avoir exécuté la migration SQL

### 1. Vérifier la création de la table
- [ ] Ouvrir Supabase Dashboard → Table Editor
- [ ] Confirmer que la table `subscriptions` existe
- [ ] Vérifier les colonnes : id, user_id, plan_type, status, start_date, end_date, created_at, updated_at

### 2. Vérifier les index
Dans Supabase Dashboard → Database → Indexes, vérifier :
- [ ] `subscriptions_user_id_idx`
- [ ] `subscriptions_status_idx`
- [ ] `subscriptions_end_date_idx`

### 3. Vérifier les RLS Policies
Dans Supabase Dashboard → Authentication → Policies, pour la table `subscriptions` :
- [ ] "Users can view own subscription" (SELECT)
- [ ] "Service role can manage subscriptions" (ALL)

### 4. Vérifier les fonctions PostgreSQL
Dans Supabase Dashboard → SQL Editor, exécuter :
```sql
SELECT * FROM get_active_subscription('user-id-test');
SELECT is_user_premium('user-id-test');
```

### 5. Vérifier l'initialisation des données
Dans Supabase Dashboard → Table Editor → subscriptions :
- [ ] Tous les utilisateurs existants ont un abonnement 'free'
- [ ] Les dates sont correctement définies

### 6. Tester l'API
```bash
# Tester l'endpoint subscription (remplacez par votre URL locale ou de production)
curl http://localhost:3000/api/user/subscription

# Devrait retourner un objet avec isPremium, planType, cvCount, etc.
```

### 7. Tester les limitations
- [ ] Créer un utilisateur gratuit
- [ ] Créer 1 CV → devrait fonctionner
- [ ] Essayer de créer un 2ème CV → devrait passer en mode prévisualisation
- [ ] Essayer de sauvegarder le 2ème CV → devrait afficher modal upgrade

### 8. Tester le panneau admin
- [ ] Se connecter avec un compte admin
- [ ] Aller sur /admin
- [ ] Vérifier que la colonne "Abonnement" s'affiche
- [ ] Tester "Donner Premium" sur un utilisateur
- [ ] Vérifier que l'utilisateur peut maintenant créer des CVs illimités

## 🔧 En cas de problème

### Erreur "table already exists"
Si vous avez déjà une table subscriptions :
```sql
DROP TABLE IF EXISTS subscriptions CASCADE;
-- Puis réexécuter la migration complète
```

### Les utilisateurs existants n'ont pas d'abonnement
```sql
INSERT INTO subscriptions (user_id, plan_type, status, start_date, end_date)
SELECT id, 'free', 'active', NOW(), NULL
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM subscriptions)
ON CONFLICT DO NOTHING;
```

### Les RLS policies ne fonctionnent pas
```sql
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
```

## 📝 Variables d'environnement requises

Vérifier que ces variables sont bien définies dans `.env.local` :
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (pour les opérations admin)

## 🎉 Une fois tout validé

Vous êtes prêt ! Le système de limitation de CVs est opérationnel.

Pour tester en local :
```bash
npm run dev
# ou
yarn dev
```

Puis naviguez vers http://localhost:3000
