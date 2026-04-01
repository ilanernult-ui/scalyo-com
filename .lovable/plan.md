

## Plan : Migrer les Edge Functions vers l'API OpenAI

### Problème
Les 4 Edge Functions (`datadiag`, `growthpilot`, `loyaltyloop`, `scalyo-chat`) utilisent actuellement l'API Anthropic, mais la clé API configurée dans Supabase est une clé OpenAI (`OPENAI_API_KEY`).

### Solution
Modifier les 4 fonctions pour utiliser l'API OpenAI (`https://api.openai.com/v1/chat/completions`) avec le secret `OPENAI_API_KEY` déjà présent dans Supabase.

### Fichiers à modifier

**1. `supabase/functions/datadiag/index.ts`**
- Remplacer `ANTHROPIC_API_KEY` → `OPENAI_API_KEY`
- URL : `https://api.openai.com/v1/chat/completions`
- Header : `Authorization: Bearer ${key}`
- Format body : `{ model: "gpt-4o", messages: [...] }`
- Parsing réponse : `data.choices[0].message.content`

**2. `supabase/functions/growthpilot/index.ts`**
- Même migration Anthropic → OpenAI

**3. `supabase/functions/loyaltyloop/index.ts`**
- Même migration Anthropic → OpenAI

**4. `supabase/functions/scalyo-chat/index.ts`**
- Même migration, en gardant le system prompt et le contexte utilisateur intacts
- Adapter le format des messages (déjà compatible OpenAI)

### Détail technique
- Modèle utilisé : `gpt-4o` (meilleur rapport qualité/prix)
- Les prompts en français restent identiques
- Le format de réponse OpenAI diffère : `choices[0].message.content` au lieu de `content[0].text`
- Aucun changement côté frontend nécessaire

