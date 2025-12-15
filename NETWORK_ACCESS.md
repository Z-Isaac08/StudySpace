# 📱 Accès Réseau - Tester sur Autres Appareils

Ce guide explique comment accéder à StudySpace depuis d'autres appareils sur le même réseau (téléphone, tablette, autre ordinateur).

---

## 🚀 Démarrage Rapide

### 1. Démarrer le serveur en mode réseau

```bash
npm run dev
```

Le serveur démarre maintenant sur `0.0.0.0:3000` (accessible depuis tous les appareils du réseau).

### 2. Obtenir l'adresse IP locale

```bash
npm run network
```

Cette commande affiche :
```
🌐 Network Access Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 Access from other devices on your network:

   Interface: Wi-Fi
   Local:     http://localhost:3000
   Network:   http://192.168.1.10:3000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 Tips:
   • Use the Network URL on your phone/tablet
   • Make sure devices are on the same WiFi
   • Check firewall if connection fails
```

### 3. Accéder depuis un autre appareil

Sur ton téléphone/tablette :
1. Connecte-toi au **même réseau WiFi** que ton PC
2. Ouvre le navigateur
3. Tape l'URL Network (ex: `http://192.168.1.10:3000`)

---

## 🛠️ Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur accessible sur le réseau (défaut) |
| `npm run dev:local` | Serveur local uniquement (localhost) |
| `npm run network` | Affiche les URLs d'accès réseau |
| `npm run start` | Production avec accès réseau |
| `npm run start:local` | Production local uniquement |

---

## ⚙️ Configuration Technique

### Ce qui a changé

**package.json**
```json
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0",      // Listen sur toutes les interfaces
    "dev:local": "next dev",             // Listen sur localhost uniquement
    "network": "node scripts/show-network-info.js"
  }
}
```

**Flag `-H 0.0.0.0`**
- Permet à Next.js d'écouter sur toutes les interfaces réseau
- Par défaut, Next.js écoute uniquement sur `localhost`
- `0.0.0.0` = accessible depuis n'importe quelle IP du réseau

---

## 🔧 Résolution de Problèmes

### ❌ Impossible de se connecter depuis le téléphone

**1. Vérifier que les appareils sont sur le même WiFi**
```bash
# Sur PC (Windows)
ipconfig

# Chercher "Wireless LAN adapter Wi-Fi"
# Vérifier l'adresse IPv4 (ex: 192.168.1.10)
```

**2. Vérifier le pare-feu Windows**
- Ouvrir "Pare-feu Windows Defender"
- Autoriser Node.js sur le réseau privé
- Ou créer une règle pour le port 3000

**3. Tester avec QR Code (optionnel)**

Installer un générateur de QR code :
```bash
npm install --save-dev qrcode-terminal
```

Modifier `scripts/show-network-info.js` pour afficher un QR code (scan direct depuis le téléphone).

---

## 🌐 Accès depuis Internet (Tunneling)

Si tu veux tester depuis l'extérieur du réseau local :

### Option 1: ngrok (Gratuit)
```bash
# Installer ngrok
npm install -g ngrok

# Créer un tunnel
ngrok http 3000
```

Tu obtiens une URL publique : `https://abc123.ngrok.io`

### Option 2: Cloudflare Tunnel (Gratuit)
```bash
# Installer cloudflared
npm install -g @cloudflare/cloudflared

# Créer un tunnel
cloudflared tunnel --url http://localhost:3000
```

### Option 3: LocalTunnel (Gratuit, simple)
```bash
# Installer localtunnel
npm install -g localtunnel

# Créer un tunnel
lt --port 3000
```

⚠️ **Attention** : Ces solutions exposent ton app sur Internet. À utiliser uniquement pour tester, pas en production.

---

## 📝 Variables d'Environnement

Si tu utilises des URLs absolues dans ton app, ajoute à `.env.local` :

```env
# Development local
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development réseau (remplacer par ton IP)
NEXT_PUBLIC_APP_URL=http://192.168.1.10:3000

# Production
NEXT_PUBLIC_APP_URL=https://studyspace.com
```

Dans ton code :
```typescript
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
```

---

## 🔐 Sécurité

### En développement (réseau local)
- ✅ Sûr : Accessible uniquement sur ton réseau WiFi privé
- ⚠️ Attention : Toute personne sur le même WiFi peut y accéder

### Recommandations
1. Ne jamais exposer le mode dev sur Internet public
2. Utiliser HTTPS en production
3. Toujours vérifier l'authentification
4. Ne pas commit `.env.local` dans Git

---

## 🎯 Cas d'Usage

### Test sur mobile (même WiFi)
```bash
npm run dev
npm run network  # Note l'IP affichée
# Accéder depuis le téléphone
```

### Test avec un ami (tunneling)
```bash
npm run dev
ngrok http 3000
# Partager l'URL ngrok
```

### Test multi-appareils (local)
```bash
npm run dev
# Ouvrir sur PC : http://localhost:3000
# Ouvrir sur téléphone : http://192.168.x.x:3000
# Ouvrir sur tablette : http://192.168.x.x:3000
```

---

## 💡 Tips & Astuces

### Afficher automatiquement l'IP au démarrage

Modifier `package.json` :
```json
{
  "scripts": {
    "dev": "node scripts/show-network-info.js && next dev -H 0.0.0.0"
  }
}
```

### Créer un alias PowerShell (Windows)

Ajouter à ton profil PowerShell :
```powershell
function Start-StudySpace {
  cd "C:\Users\DPcomputer\Desktop\P_DOC\HTML_CSS_JS\NEXT\StudySpace"
  npm run network
  npm run dev
}

Set-Alias ss Start-StudySpace
```

Usage : taper `ss` dans PowerShell.

---

## ✅ Checklist de Test

Avant de déployer, tester sur :

- [ ] Chrome Desktop (localhost)
- [ ] Chrome Mobile (réseau local)
- [ ] Safari iOS (réseau local)
- [ ] Firefox Desktop
- [ ] Edge
- [ ] Différentes tailles d'écran (responsive)
- [ ] Mode portrait et paysage (mobile)
- [ ] Connexion lente (throttling)

---

**Prêt à tester ?** Lance `npm run dev` et `npm run network` !
