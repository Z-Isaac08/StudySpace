# Task 5 : WebRTC Audio/Vidéo (Phase 3B - Part 3)

**Statut** : 🔜 À faire
**Priorité** : Moyenne
**Estimation** : 2 semaines
**Phase** : Phase 3B - Collaboration temps réel

---

## Objectif

Ajouter la communication audio/vidéo en temps réel dans les sessions avec WebRTC, permettant aux utilisateurs de parler pendant qu'ils collaborent.

---

## Sous-tâches

### 5.1 Choisir solution WebRTC

**Options** :

| Solution | Complexité | Coût | Scalabilité | Features |
|----------|-----------|------|-------------|----------|
| **Simple-peer (P2P)** | Facile | Gratuit | Faible (< 5 users) | Basique |
| **Agora** | Moyen | Payant | Excellente | Avancées |
| **Daily.co** | Facile | Payant | Excellente | Avancées |
| **Custom WebRTC** | Difficile | Gratuit | Moyenne | Custom |
| **Livekit** | Moyen | Payant | Excellente | Avancées |

**Recommandation MVP** : **Agora** (balance features/simplicité/coût)
- Free tier : 10,000 minutes/mois
- SDK simple, docs excellentes
- Scalabilité automatique

**Recommandation Alternative** : **Simple-peer** si budget limité (P2P uniquement)

- [ ] **Décision finale** : Agora, Daily.co, Simple-peer, ou Livekit ?

### 5.2 Setup Agora (si choisi)

- [ ] **Créer compte Agora**
  - https://console.agora.io
  - Créer projet
  - Obtenir App ID

- [ ] **Installer SDK**
  ```bash
  npm install agora-rtc-react agora-rtc-sdk-ng
  ```

- [ ] **Configurer environment variables**
  ```
  NEXT_PUBLIC_AGORA_APP_ID=...
  AGORA_APP_CERTIFICATE=...  # Pour token generation
  ```

- [ ] **Créer API route pour RTC token** (`app/api/sessions/[id]/rtc-token/route.ts`)
  ```typescript
  import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
  import { getCurrentUser } from '@/lib/auth/session';

  export async function GET(request, { params }) {
    const user = await getCurrentUser();
    if (!user) return unauthorizedResponse();

    const { id: sessionId } = await params;

    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE!;
    const channelName = `session-${sessionId}`;
    const uid = 0; // 0 = auto-assign
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    return successResponse({ token, channelName, uid });
  }
  ```

### 5.3 Créer composant VideoCall

- [ ] **Créer AgoraVideoCall component** (`components/AgoraVideoCall.tsx`)
  ```typescript
  'use client';
  import AgoraRTC, {
    IAgoraRTCClient,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
  } from 'agora-rtc-sdk-ng';
  import { useState, useEffect, useRef } from 'react';

  const client: IAgoraRTCClient = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
  });

  export default function AgoraVideoCall({ sessionId, userId, userName }) {
    const [users, setUsers] = useState([]);
    const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
    const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {
      const init = async () => {
        // Get RTC token from API
        const response = await fetch(`/api/sessions/${sessionId}/rtc-token`);
        const { token, channelName } = await response.json();

        // Join channel
        await client.join(
          process.env.NEXT_PUBLIC_AGORA_APP_ID!,
          channelName,
          token,
          userId
        );

        // Create local tracks
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack);

        // Publish tracks
        await client.publish([audioTrack, videoTrack]);

        // Listen to remote users
        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);

          if (mediaType === 'video') {
            setUsers((prev) => [...prev, user]);
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });

        client.on('user-unpublished', (user) => {
          setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });
      };

      init();

      return () => {
        localAudioTrack?.close();
        localVideoTrack?.close();
        client.leave();
      };
    }, [sessionId]);

    const toggleMute = () => {
      if (localAudioTrack) {
        localAudioTrack.setEnabled(isMuted);
        setIsMuted(!isMuted);
      }
    };

    const toggleVideo = () => {
      if (localVideoTrack) {
        localVideoTrack.setEnabled(isVideoOff);
        setIsVideoOff(!isVideoOff);
      }
    };

    return (
      <div className="flex flex-col gap-4">
        {/* Local video */}
        <div className="relative w-full h-64 bg-black rounded">
          <video
            ref={(ref) => {
              if (ref && localVideoTrack) {
                localVideoTrack.play(ref);
              }
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded">
            {userName} (Vous)
          </div>
        </div>

        {/* Remote videos */}
        <div className="grid grid-cols-2 gap-2">
          {users.map((user) => (
            <div key={user.uid} className="relative w-full h-48 bg-black rounded">
              <video
                ref={(ref) => {
                  if (ref && user.videoTrack) {
                    user.videoTrack.play(ref);
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded">
                User {user.uid}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          <Button onClick={toggleMute} variant={isMuted ? 'destructive' : 'default'}>
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </Button>
          <Button onClick={toggleVideo} variant={isVideoOff ? 'destructive' : 'default'}>
            {isVideoOff ? <VideoOffIcon /> : <VideoIcon />}
          </Button>
        </div>
      </div>
    );
  }
  ```

### 5.4 Intégrer dans SessionPage

- [ ] **Ajouter toggle vidéo call**
  ```typescript
  // app/(dashboard)/dashboard/session/[id]/page.tsx

  const [isVideoCallActive, setIsVideoCallActive] = useState(false);

  <div className="flex gap-2">
    <Button onClick={() => setIsVideoCallActive(!isVideoCallActive)}>
      {isVideoCallActive ? 'Quitter appel' : 'Démarrer appel vidéo'}
    </Button>
  </div>

  {isVideoCallActive && (
    <div className="absolute top-4 right-4 w-80 z-50">
      <AgoraVideoCall
        sessionId={sessionId}
        userId={user.id}
        userName={user.name}
      />
    </div>
  )}
  ```

- [ ] **Styliser video call overlay**
  - Position : floating dans coin supérieur droit
  - Draggable (optionnel)
  - Minimize/maximize

### 5.5 Fonctionnalités avancées

- [ ] **Screen sharing**
  ```typescript
  const [screenTrack, setScreenTrack] = useState(null);

  const startScreenShare = async () => {
    const track = await AgoraRTC.createScreenVideoTrack();
    await client.unpublish(localVideoTrack);
    await client.publish(track);
    setScreenTrack(track);
  };

  const stopScreenShare = async () => {
    await client.unpublish(screenTrack);
    await client.publish(localVideoTrack);
    screenTrack.close();
    setScreenTrack(null);
  };
  ```

- [ ] **Picture-in-picture mode**
  - Video flottante resizable
  - Minimize to small corner
  - Expand to fullscreen

- [ ] **Audio-only mode**
  - Toggle pour désactiver vidéo (économie bande passante)
  - Avatar placeholder au lieu de vidéo

- [ ] **Recording** (Phase 4+)
  - Agora Cloud Recording
  - Sauvegarder sessions audio/vidéo
  - Lecture après coup

### 5.6 Permissions & Feedback

- [ ] **Demander permissions caméra/micro**
  ```typescript
  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      return true;
    } catch (error) {
      console.error('Permission denied:', error);
      return false;
    }
  };

  // Avant de créer tracks
  const hasPermissions = await requestPermissions();
  if (!hasPermissions) {
    alert('Veuillez autoriser l\'accès à la caméra et au microphone');
    return;
  }
  ```

- [ ] **Indicateurs de connection**
  - "Connexion en cours..."
  - "Connecté"
  - "Connexion perdue" (network issue)

- [ ] **Quality indicators**
  - Network quality (good/average/poor)
  - Latency display (ms)

### 5.7 Alternative : Simple-peer (P2P)

**Si budget limité, utiliser simple-peer pour P2P direct** :

- [ ] **Installer simple-peer**
  ```bash
  npm install simple-peer
  ```

- [ ] **Setup signaling server** (WebSocket pour échange SDP)
  ```typescript
  // Utiliser Pusher pour signaling
  const channel = pusher.subscribe(`session-${sessionId}`);

  channel.bind('webrtc-offer', (data) => {
    peer.signal(data.offer);
  });

  const peer = new SimplePeer({ initiator: true });

  peer.on('signal', (offer) => {
    // Send offer via Pusher
    channel.trigger('webrtc-offer', { offer });
  });

  peer.on('stream', (stream) => {
    videoRef.current.srcObject = stream;
  });
  ```

**Limitation P2P** : Max 3-4 utilisateurs simultanés (bandwidth)

### 5.8 Tests

- [ ] **Tester 2 utilisateurs**
  - Audio bidirectionnel
  - Vidéo bidirectionnelle
  - Mute/unmute fonctionne

- [ ] **Tester network issues**
  - Throttle network dans DevTools (3G)
  - Vérifier dégradation gracieuse (audio-only fallback)

- [ ] **Tester devices différents**
  - Desktop (Chrome, Firefox)
  - Mobile (Safari iOS, Chrome Android)

- [ ] **Performance**
  - CPU usage < 50% pendant call
  - Pas de lag sur canvas/editor

---

## Critères d'acceptation

- ✅ Appel audio/vidéo fonctionne entre 2+ utilisateurs
- ✅ Mute/unmute audio
- ✅ Enable/disable vidéo
- ✅ Screen sharing (optionnel MVP)
- ✅ Permissions caméra/micro gérées
- ✅ UI video call dans session page
- ✅ Latence < 300ms
- ✅ Fonctionne sur mobile
- ✅ Quality indicators visibles

---

## Architecture

```
┌─────────────┐         ┌─────────────┐
│  Browser A  │         │  Browser B  │
│  - Camera   │         │  - Camera   │
│  - Micro    │         │  - Micro    │
└──────┬──────┘         └──────┬──────┘
       │                       │
       │ WebRTC (P2P or SFU)   │
       │                       │
       └───────────┬───────────┘
                   │
          ┌────────▼─────────┐
          │  Agora Server    │
          │  (SFU for        │
          │   multi-party)   │
          └──────────────────┘
```

**SFU (Selective Forwarding Unit)** : Agora server route streams efficacement pour > 4 users

---

## Dépendances

- ✅ Task 3 terminé (WebSocket setup)

---

## Risques

- **Bandwidth limité** : Vidéo consomme beaucoup (500 KB/s par stream)
  - Mitigation : Audio-only mode, quality auto-adjust
- **Permissions refusées** : Utilisateur refuse caméra/micro
  - Mitigation : Fallback audio-only, instructions claires
- **Agora coût dépassé** : Free tier = 10k min/mois
  - Mitigation : Monitor usage, upgrade plan ($99/mois)
- **Browser compatibility** : Safari parfois buggy
  - Mitigation : Tester sur vrais devices, fallback simple-peer

---

## Ressources

- Agora Docs : https://docs.agora.io/en/video-calling/get-started/get-started-sdk
- Agora React SDK : https://www.npmjs.com/package/agora-rtc-react
- Simple-peer : https://github.com/feross/simple-peer
- Daily.co : https://docs.daily.co
- Livekit : https://docs.livekit.io

---

## Coûts estimés (Agora)

**Free tier** :
- 10,000 minutes/mois
- HD video (720p)
- Audio illimité

**Pay-as-you-go** :
- $0.99 / 1000 minutes (SD video)
- $3.99 / 1000 minutes (HD video)

**Exemple** : 100 utilisateurs × 1h/mois = 6,000 min → Gratuit
