# twitter_api_bd

### Nicolas Lohya, Jean Puaud

## Installation

- Prérequis
  - Installer Python 3.X
  - Installer NodeJS (LTS)
  - Installer MongoDB
- Installer les bibliothèques Python présentes dans le fichier `src/requirements.txt`
- Executer dans une console Python les commandes `import nltk` et `nltk.download('all')`
- Créer un fichier `.env` respectant le format suivant:
  - BEARER=< bearer token twitter >
  - MONGO_URL=< url d'accès mongo ex: mongodb://localhost:27017 >
  - DEEPL_TOKEN=< clé d'api deepl (version free) >
- Se rendre dans le dossier `src/backend` et exécuter la commande : `python server.py`
- Se rendre dans le dossier `src/frontend/twitter_api_app` et exécuter la commande : `npm install`, puis la commande `npm run dev`
- Se rendre sur l'adresse spécifiée dans la console Node (ex : `http://localhost:xxxx`), le port étant défini en fonction des ports disponible sur votre machine
- Si le port 8000 de votre machine est déjà occupé, vous devez remplacer celui-ci dans le fichier `src/backend/server.py` tout en bas, ainsi que dans le fichier `src/frontend/twitter_api_app/src/http/api.http.ts` par le port de votre choix.
