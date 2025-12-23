# Task 4 : Collaborative Whiteboard (Phase 3B - Part 2)

**Statut** : 🔜 À faire
**Priorité** : Moyenne
**Estimation** : 2-3 semaines
**Phase** : Phase 3B - Collaboration temps réel

---

## Objectif

Remplacer le canvas HTML5 basique par un whiteboard collaboratif avancé avec Konva.js ou Fabric.js, supportant formes, texte, images, et synchronisation temps réel.

---

## Sous-tâches

### 4.1 Choisir librairie Canvas

**Options** :

| Critère | Konva.js | Fabric.js | Excalidraw |
|---------|----------|-----------|------------|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Features | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Real-time support | ✅ (custom) | ✅ (custom) | ✅ (built-in) |
| TypeScript | ✅ | ✅ | ✅ |
| Bundle size | 200 KB | 400 KB | 1.2 MB |
| Learning curve | Moyen | Moyen | Facile |

**Recommandation** : **Konva.js** (performance + features + bundle size optimal)

- [ ] **Décision finale** : Konva.js, Fabric.js, ou Excalidraw ?

### 4.2 Setup Konva.js (si choisi)

- [ ] **Installer dépendances**
  ```bash
  npm install konva react-konva
  npm install --save-dev @types/konva
  ```

- [ ] **Créer composant KonvaWhiteboard** (`components/KonvaWhiteboard.tsx`)
  ```typescript
  'use client';
  import { Stage, Layer, Line, Circle, Rect, Text } from 'react-konva';
  import { useState, useRef } from 'react';

  export default function KonvaWhiteboard({ sessionId, width, height }) {
    const [tool, setTool] = useState('pen'); // pen, eraser, rectangle, circle, text
    const [color, setColor] = useState('#000000');
    const [shapes, setShapes] = useState([]);
    const isDrawing = useRef(false);

    const handleMouseDown = (e) => {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();

      if (tool === 'pen') {
        setShapes([...shapes, {
          type: 'line',
          points: [pos.x, pos.y],
          stroke: color,
          strokeWidth: 2,
        }]);
      }
    };

    const handleMouseMove = (e) => {
      if (!isDrawing.current) return;

      const pos = e.target.getStage().getPointerPosition();
      const lastShape = shapes[shapes.length - 1];

      if (tool === 'pen' && lastShape.type === 'line') {
        lastShape.points = [...lastShape.points, pos.x, pos.y];
        setShapes([...shapes.slice(0, -1), lastShape]);
      }
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
      // Sync shape to other users (Yjs or Pusher)
      syncShapeToServer(shapes[shapes.length - 1]);
    };

    return (
      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape, i) => {
            if (shape.type === 'line') {
              return <Line key={i} {...shape} />;
            }
            if (shape.type === 'rectangle') {
              return <Rect key={i} {...shape} />;
            }
            // ... autres formes
          })}
        </Layer>
      </Stage>
    );
  }
  ```

### 4.3 Outils de dessin

- [ ] **Toolbar avec outils**
  - ✏️ Pen (freehand drawing)
  - 🔲 Rectangle
  - ⭕ Circle
  - ➖ Line
  - 📝 Text
  - 🖼️ Image upload
  - 🗑️ Eraser
  - 🎨 Color picker
  - 📏 Stroke width slider

- [ ] **Créer composant WhiteboardToolbar** (`components/WhiteboardToolbar.tsx`)
  ```typescript
  export default function WhiteboardToolbar({ tool, setTool, color, setColor }) {
    return (
      <div className="flex gap-2 p-2 bg-white border rounded">
        <Button
          variant={tool === 'pen' ? 'default' : 'outline'}
          onClick={() => setTool('pen')}
        >
          <PenIcon />
        </Button>
        <Button
          variant={tool === 'rectangle' ? 'default' : 'outline'}
          onClick={() => setTool('rectangle')}
        >
          <SquareIcon />
        </Button>
        {/* ... autres outils */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-8 h-8"
        />
      </div>
    );
  }
  ```

### 4.4 Synchronisation temps réel (Yjs + Konva)

- [ ] **Créer Yjs Map pour shapes**
  ```typescript
  import * as Y from 'yjs';

  const ydoc = new Y.Doc();
  const yShapes = ydoc.getMap('shapes'); // Shared map

  // Add shape
  yShapes.set(shapeId, {
    type: 'line',
    points: [10, 20, 30, 40],
    stroke: '#000',
  });

  // Listen to changes
  yShapes.observe((event) => {
    event.changes.keys.forEach((change, key) => {
      if (change.action === 'add') {
        const shape = yShapes.get(key);
        setShapes(prev => [...prev, { id: key, ...shape }]);
      }
      if (change.action === 'delete') {
        setShapes(prev => prev.filter(s => s.id !== key));
      }
    });
  });
  ```

- [ ] **Sync shape creation**
  ```typescript
  const handleShapeCreated = (shape) => {
    const shapeId = generateId();
    yShapes.set(shapeId, shape); // Auto-synced to other users
  };
  ```

- [ ] **Sync shape updates** (drag, resize, color change)
  ```typescript
  const handleShapeUpdate = (shapeId, updates) => {
    const shape = yShapes.get(shapeId);
    yShapes.set(shapeId, { ...shape, ...updates });
  };
  ```

### 4.5 Fonctionnalités avancées

- [ ] **Undo/Redo**
  ```typescript
  import { UndoManager } from 'yjs';

  const undoManager = new UndoManager(yShapes);

  const handleUndo = () => undoManager.undo();
  const handleRedo = () => undoManager.redo();
  ```

- [ ] **Selection & Transform**
  - Sélectionner shapes (click)
  - Drag & drop
  - Resize (handles)
  - Rotate
  - Delete (suppr key)

  ```typescript
  import { Transformer } from 'react-konva';

  const [selectedId, setSelectedId] = useState(null);

  <Transformer
    ref={transformerRef}
    boundBoxFunc={(oldBox, newBox) => {
      // Limit resize
      if (newBox.width < 5 || newBox.height < 5) return oldBox;
      return newBox;
    }}
  />
  ```

- [ ] **Layers (z-index)**
  - Bring to front
  - Send to back
  - Layer order management

- [ ] **Export canvas**
  ```typescript
  const handleExport = () => {
    const stage = stageRef.current;
    const dataURL = stage.toDataURL();
    // Download as PNG
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = dataURL;
    link.click();
  };
  ```

- [ ] **Grid & Snap**
  - Background grid (optionnel)
  - Snap to grid (when dragging)

### 4.6 Touch support (Mobile)

- [ ] **Activer touch events**
  ```typescript
  <Stage
    width={width}
    height={height}
    onTouchStart={handleMouseDown}
    onTouchMove={handleMouseMove}
    onTouchEnd={handleMouseUp}
  >
  ```

- [ ] **Zoom & Pan** (pinch to zoom)
  ```typescript
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setScale(newScale);
    // Adjust position to zoom towards pointer
  };

  <Stage
    scaleX={scale}
    scaleY={scale}
    x={position.x}
    y={position.y}
    onWheel={handleWheel}
    draggable
  >
  ```

### 4.7 Persistance

- [ ] **Sauvegarder canvas state**
  ```typescript
  // Serialize Konva stage
  const json = stageRef.current.toJSON();

  // Save to DB
  await updateSession(sessionId, {
    canvasState: { konva: json }
  });
  ```

- [ ] **Restaurer canvas state**
  ```typescript
  // Load from DB
  const { canvasState } = session;
  if (canvasState?.konva) {
    const stage = Konva.Node.create(canvasState.konva, 'container');
  }
  ```

### 4.8 Remplacer dans SessionPage

- [ ] **Remplacer Canvas HTML5 par KonvaWhiteboard**
  ```typescript
  // app/(dashboard)/dashboard/session/[id]/page.tsx

  // AVANT
  <canvas ref={canvasRef} width={800} height={600} />

  // APRÈS
  <KonvaWhiteboard
    sessionId={sessionId}
    width={containerWidth}
    height={containerHeight}
  />
  ```

- [ ] **Gérer auto-save avec Konva**
  - Sauvegarder shapes array toutes les 30s
  - Ou sauvegarder après chaque shape creation (debounced)

### 4.9 Tests

- [ ] **Tester tous les outils**
  - Dessiner ligne, rectangle, cercle, texte
  - Vérifier couleurs et stroke width
  - Eraser fonctionne

- [ ] **Tester synchronisation**
  - 2 navigateurs, dessiner dans un → voir dans l'autre
  - Latence < 100ms

- [ ] **Tester mobile**
  - Touch drawing fonctionne
  - Zoom/pan fonctionne

- [ ] **Performance avec 1000+ shapes**
  - Dessiner beaucoup de formes
  - Vérifier FPS (devrait rester > 30 FPS)

---

## Critères d'acceptation

- ✅ Konva.js whiteboard remplace canvas HTML5
- ✅ Outils de dessin : pen, rectangle, circle, text, eraser
- ✅ Color picker + stroke width
- ✅ Synchronisation temps réel des shapes
- ✅ Undo/Redo fonctionne
- ✅ Selection, drag, resize, rotate
- ✅ Export canvas en PNG
- ✅ Touch support (mobile)
- ✅ Zoom & pan
- ✅ Performance > 30 FPS avec 1000 shapes
- ✅ Persistance state en DB

---

## Architecture

```
┌────────────────────────────┐
│  KonvaWhiteboard Component │
│  ┌──────────────────────┐  │
│  │  Konva.js Stage      │  │
│  │  ├─ Layer 1 (shapes) │  │
│  │  └─ Layer 2 (text)   │  │
│  └──────────────────────┘  │
│           │                 │
│           ▼                 │
│  ┌──────────────────────┐  │
│  │  Yjs Map (shapes)    │  │
│  │  - Real-time sync    │  │
│  └──────────────────────┘  │
└────────────┬───────────────┘
             │
             │ WebSocket
             │
    ┌────────▼─────────┐
    │  Pusher/WS       │
    │  Server          │
    └──────────────────┘
```

---

## Dépendances

- ✅ Task 3 terminé (Yjs + WebSocket setup)

---

## Risques

- **Performance dégradée avec beaucoup de shapes** : Limiter à 5000 shapes max, virtualisation si nécessaire
- **Bundle size trop lourd** : Konva.js = 200 KB, acceptable
- **Conflits lors de simultaneous drawing** : Yjs CRDT gère automatiquement
- **Touch events buggy** : Tester sur vrais devices (iPhone, Android)

---

## Ressources

- Konva.js Docs : https://konvajs.org/docs/
- react-konva : https://konvajs.org/docs/react/
- Yjs + Konva example : https://github.com/yjs/yjs-demos
- Excalidraw (alternative) : https://excalidraw.com

---

## Notes

**Alternative simple** : Si Konva complexe, utiliser **Excalidraw** :
```bash
npm install @excalidraw/excalidraw
```

```typescript
import { Excalidraw } from '@excalidraw/excalidraw';

<Excalidraw
  onChange={(elements) => syncToYjs(elements)}
  initialData={{ elements: loadedElements }}
/>
```

Avantages Excalidraw :
- ✅ Collaboration built-in
- ✅ UI/UX excellente
- ✅ Export SVG/PNG
- ❌ Bundle size lourd (1.2 MB)
- ❌ Moins customizable
