# 🚀 TimeLocal - Guide de Déploiement Complet

## 📋 Vue d'ensemble

Votre TimeLocal est maintenant organisé en **3 dossiers clairs** :

```
timelocal-deployment/
├── api-railway/        # 🚀 API pour Railway/Render
├── hostinger-files/    # 🌐 Interface pour Hostinger  
└── documentation/      # 📚 Guides et instructions
```

## 🎯 PLAN D'ACTION COMPLET

### **ÉTAPE 1 : Déployer l'API (Railway/Render)**

#### **Option A - Railway (Recommandée)**

1. **Créez un compte sur [railway.app](https://railway.app)**

2. **Préparez votre repo GitHub :**
   - Créez un nouveau repo "timelocal-api"
   - Uploadez **TOUT le contenu** du dossier `api-railway/`
   - Vérifiez que ces fichiers sont présents :
     ```
     app.py
     requirements.txt
     Procfile
     runtime.txt
     railway.json
     README.md
     ```

3. **Déployez sur Railway :**
   - "New Project" → "Deploy from GitHub repo"
   - Sélectionnez votre repo
   - Railway détectera automatiquement Python
   - Attendez le déploiement (2-3 minutes)

4. **Testez l'API :**
   - Notez votre URL : `https://xxx.up.railway.app`
   - Testez : `https://votre-url.railway.app/health`
   - Vous devriez voir : `{"status": "healthy"}`

#### **Option B - Render.com**

1. **Allez sur [render.com](https://render.com)**
2. **"New Web Service"**
3. **Connectez votre repo GitHub**
4. **Render configure automatiquement**
5. **Testez l'URL finale**

### **ÉTAPE 2 : Configurer Hostinger**

#### **2.1 Upload des fichiers**

1. **File Manager Hostinger** → `/public_html/`
2. **Uploadez TOUT le contenu** du dossier `hostinger-files/` :
   ```
   index.html
   .htaccess
   manifest.json
   static/ (dossier complet)
   ```

#### **2.2 Configuration cruciale**

**A. Configurer .htaccess :**
1. Ouvrez le fichier `.htaccess`
2. **Ligne 18** : Remplacez `YOUR_API_URL` par votre vraie URL
   ```apache
   # AVANT
   RewriteRule ^app/?(.*)$ https://YOUR_API_URL/$1 [P,L]
   
   # APRÈS (exemple avec Railway)
   RewriteRule ^app/?(.*)$ https://timelocal-api.up.railway.app/$1 [P,L]
   ```
3. **Ligne 25** : Même chose pour les WebSockets
4. **Ligne 35** : Remplacez dans les headers CORS

**B. Configurer app.js :**
1. Ouvrez `static/js/app.js`
2. **Ligne 8** : Remplacez `YOUR_API_URL`
   ```javascript
   // AVANT
   API_BASE: 'https://YOUR_API_URL',
   
   // APRÈS (exemple avec Railway)
   API_BASE: 'https://timelocal-api.up.railway.app',
   ```

### **ÉTAPE 3 : Test complet**

1. **Visitez votre site** : `https://votredomaine.com`
2. **Vérifiez l'indicateur** en haut à droite : 🟢 API connectée
3. **Cliquez "Accéder à l'application"**
4. **Si tout fonctionne** → SUCCESS ! 🎉

## 🔧 CONFIGURATION DÉTAILLÉE

### **Variables d'environnement Railway/Render**

Dans votre dashboard Railway/Render, ajoutez :

```env
SECRET_KEY=votre-cle-secrete-tres-longue-ici
FLASK_CONFIG=production
APP_URL=https://votredomaine.com
CORS_ORIGINS=https://votredomaine.com
```

### **Sécurité Hostinger**

Le fichier `.htaccess` inclut :
- ✅ Forçage HTTPS
- ✅ Headers de sécurité
- ✅ Protection contre les injections
- ✅ Cache optimisé
- ✅ Compression GZIP

## 🧪 TESTS DE VALIDATION

### **1. Test API directe**
```bash
# Health check
curl https://votre-api-url/health

# Test d'inscription
curl -X POST https://votre-api-url/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@test.com",
    "password": "password123"
  }'
```

### **2. Test interface web**
1. Page d'accueil charge correctement
2. Indicateur de statut API visible
3. Animations fonctionnent
4. Bouton "Accéder à l'application" fonctionne

### **3. Test PWA**
1. Visitez depuis mobile
2. Bannière d'installation apparaît
3. Application installable

## 🚨 DÉPANNAGE COMMUN

### **❌ "API déconnectée"**

**Causes possibles :**
1. URL incorrecte dans `.htaccess` ou `app.js`
2. API Railway/Render non déployée
3. CORS mal configuré

**Solutions :**
1. Vérifiez l'URL API directement dans le navigateur
2. Consultez les logs Railway/Render
3. Vérifiez la configuration CORS

### **❌ Erreur 500 sur Hostinger**

**Causes :**
1. Erreur dans `.htaccess`
2. Mod_rewrite désactivé

**Solutions :**
1. Vérifiez la syntaxe `.htaccess`
2. Contactez le support Hostinger

### **❌ Page blanche**

**Causes :**
1. Fichiers mal uploadés
2. Erreur JavaScript

**Solutions :**
1. Vérifiez la console navigateur (F12)
2. Re-uploadez les fichiers

## 📊 MONITORING

### **Surveillance API**
- Health check : `GET /health`
- Logs dans Railway/Render dashboard
- Métriques de performance

### **Surveillance web**
- Google Analytics (à ajouter)
- Console navigateur pour erreurs JS
- Outils développeur pour performance

## 🔄 MISES À JOUR

### **API (Railway/Render)**
1. Push sur GitHub → Déploiement automatique
2. Zero-downtime deployments
3. Rollback possible

### **Interface (Hostinger)**
1. Upload via File Manager
2. Cache navigateur à vider
3. Test immédiat

## 💰 COÛTS

### **Gratuit (pour commencer)**
- **Railway** : 500h/mois gratuit
- **Render** : Service gratuit avec limitations
- **Hostinger** : Plan Business existant

### **Upgrade (si nécessaire)**
- **Railway** : $5/mois pour plus de ressources
- **Render** : $7/mois pour service toujours actif

## 📞 SUPPORT

### **Si vous êtes bloqué :**

1. **Vérifiez les URLs** (le problème #1)
2. **Consultez les logs** Railway/Render
3. **Testez l'API directement** dans le navigateur
4. **Vérifiez la console** navigateur (F12)

### **Resources utiles :**
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Hostinger Support](https://support.hostinger.com)

### **Contact :**
- Créez une issue GitHub
- Email support avec capture d'écran des erreurs

## ✅ CHECKLIST FINALE

- [ ] API déployée et testée
- [ ] URL API notée et sauvegardée
- [ ] Fichiers uploadés sur Hostinger
- [ ] `.htaccess` configuré avec la bonne URL
- [ ] `app.js` configuré avec la bonne URL
- [ ] Test d'accès à l'application réussi
- [ ] Indicateur "API connectée" visible
- [ ] PWA installable sur mobile

**Une fois tous ces points validés, votre TimeLocal est OPÉRATIONNEL ! 🚀**

---

*TimeLocal v2.0 - Connectons les communautés locales !*