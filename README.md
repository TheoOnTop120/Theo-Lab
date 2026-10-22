# Théo / Lab

Site personnel statique réalisé avec React, TypeScript et Vite.

## Démarrer en local

```powershell
npm install
npm run dev
```

Vite affiche l’adresse locale dans le terminal. Pour vérifier le projet et générer le site de production :

```powershell
npm run check:data
npm run build
npm run preview
```

## Données et confidentialité

`500_infos_sur_theo.md` est la source locale. Le script `scripts/generate-public-data.mjs` en extrait uniquement les entrées dont les numéros sont explicitement autorisés dans sa liste `publishedIds`, puis vérifie les contenus générés. Il produit `src/data/public-facts.json`, seule copie des informations personnelles importée par l’application.

Les 500 entrées ne sont donc pas toutes affichées ni livrées au navigateur. Les adresses, lieux précis, données de santé, habitudes, chemins locaux et détails d’infrastructure sont exclus. Le serveur Vite refuse aussi les requêtes directes vers le Markdown brut. Réexaminer la liste autorisée avant toute nouvelle publication.

`npm run dev` et `npm run build` régénèrent automatiquement le jeu de données public à partir du Markdown local. Le site ne dépend d’aucune API ni police distante.
