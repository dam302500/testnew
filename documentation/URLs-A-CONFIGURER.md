# 🔧 URLs à Configurer - TimeLocal

## ⚠️ TRÈS IMPORTANT

**Vous devez remplacer `YOUR_API_URL` par votre vraie URL dans 2 fichiers :**

## 📄 FICHIER 1 : .htaccess

**Emplacement :** `hostinger-files/.htaccess`

### **Lignes à modifier :**

**Ligne 18 :**
```apache
# AVANT
RewriteRule ^app/?(.*)$ https://YOUR_API_URL/$1 [P,L]

# APRÈS (remplacez par votre URL Railway/Render)
RewriteRule ^app/?(.*)$ https://votre-app.up.railway.app/$1 [P,L]
```

**Ligne 25 :**
```apache
# AVANT
RewriteRule ^socket\.io/(.*)$ https://YOUR_API_URL/socket.io/$1 [P,L]

# APRÈS
RewriteRule ^socket\.io/(.*)$ https://votre-app.up.railway.app/socket.io/$1 [P,L]
```

**Ligne 35 :**
```apache
# AVANT
Header set Access-Control-Allow-Origin "https://YOUR_API_URL"

# APRÈS
Header set Access-Control-Allow-Origin "https://votre-app.up.railway.app"
```

## 📄 FICHIER 2 : app.js

**Emplacement :** `hostinger-files/static/js/app.js`

### **Ligne à modifier :**

**Ligne 8 :**
```javascript
// AVANT
API_BASE: 'https://YOUR_API_URL',

// APRÈS (remplacez par votre URL)
API_BASE: 'https://votre-app.up.railway.app',
```

## 🌐 EXEMPLES D'URLs

### **Railway :**
```
https://timelocal-production.up.railway.app
https://timelocal-api.up.railway.app
https://votre-projet-name.up.railway.app
```

### **Render :**
```
https://timelocal-api.onrender.com
https://votre-service-name.onrender.com
```

### **Heroku :**
```
https://timelocal-api.herokuapp.com
https://votre-app-name.herokuapp.com
```

## ✅ VÉRIFICATION

### **1. Testez l'URL API directement :**
```
https://votre-url-api/health
```

**Réponse attendue :**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-02T...",
  "database": "connected"
}
```

### **2. Vérifiez dans les fichiers :**

**Dans .htaccess :**
- [ ] Ligne 18 : URL correcte
- [ ] Ligne 25 : URL correcte  
- [ ] Ligne 35 : URL correcte

**Dans app.js :**
- [ ] Ligne 8 : URL correcte

## 🚨 ERREURS COMMUNES

### **❌ URL avec /api à la fin**
```javascript
// FAUX
API_BASE: 'https://votre-app.railway.app/api',

// CORRECT
API_BASE: 'https://votre-app.railway.app',
```

### **❌ HTTP au lieu de HTTPS**
```javascript
// FAUX
API_BASE: 'http://votre-app.railway.app',

// CORRECT
API_BASE: 'https://votre-app.railway.app',
```

### **❌ Slash à la fin**
```javascript
// FAUX
API_BASE: 'https://votre-app.railway.app/',

// CORRECT
API_BASE: 'https://votre-app.railway.app',
```

## 🔄 APRÈS MODIFICATION

### **1. Re-uploadez les fichiers sur Hostinger**
- `.htaccess`
- `static/js/app.js`

### **2. Videz le cache navigateur**
- Ctrl+F5 (Windows)
- Cmd+R (Mac)
- Mode privé pour tester

### **3. Testez l'application**
- Visitez votre site
- Vérifiez l'indicateur "🟢 API connectée"
- Cliquez "Accéder à l'application"

## 📝 AIDE-MÉMOIRE

**Mon URL API Railway/Render :**
```
https://________________________________
```

**Fichiers modifiés :**
- [ ] .htaccess ligne 18, 25, 35
- [ ] app.js ligne 8

**Tests effectués :**
- [ ] /health répond correctement
- [ ] Interface web fonctionne
- [ ] Pas d'erreurs console

## 🆘 SI ÇA NE MARCHE PAS

### **Vérifiez dans l'ordre :**

1. **L'URL API est accessible :**
   ```
   https://votre-url/health
   ```

2. **Les fichiers sont bien modifiés :**
   - Ouvrez les fichiers et vérifiez visuellement

3. **Les fichiers sont bien uploadés :**
   - Re-uploadez pour être sûr

4. **Cache navigateur vidé :**
   - Testez en mode privé

5. **Console navigateur :**
   - F12 → Console → Cherchez les erreurs

**Si toujours bloqué, envoyez-moi :**
- Votre URL API
- Capture d'écran des erreurs console
- Contenu des lignes modifiées

---

*🔧 Une fois configuré correctement, tout fonctionnera parfaitement !*