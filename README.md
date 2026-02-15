# NavViz

A web-based tool for 3D experience creators to visualize navigation algorithms on terrain in real time.

## Stack

- Vite + React 18 + TypeScript
- React Three Fiber + Drei
- Tailwind CSS + ShadCN-style components
- Lucide icons, Inter (Google Fonts)

## Preview

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Build

```bash
npm run build
npm run preview
```

## Publish (GitHub + GitHub Pages)

1. **Create a new repo on GitHub** named `NavViz` (do not add a README or .gitignore).

2. **Push this repo:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/NavViz.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

3. **Enable GitHub Pages:**  
   Repo → **Settings** → **Pages** → Source: **GitHub Actions**.  
   After the next push (or a re-run of the workflow), the app will be at **https://YOUR_USERNAME.github.io/NavViz/**.

## Features

- **3D terrain**: Perlin/Simplex noise, extruded solid, three color modes (plain, B&W height map, heat map)
- **Navigation algorithms**: A*, Dijkstra, Greedy best-first, Straight line (surface-sampled), Physics-based (simulated path)
- **Controls**: Algorithm selector, steepness penalty, set start/end (click terrain), terrain size, regenerate terrain
- **Path visualization**: White path line, solid start circle, outlined end circle, location pin that animates along the path

## Project structure

- `src/App.tsx` — Shell, top/bottom bars, expandable side panels
- `src/components/` — NavigationPanel, VisualizationPanel, Scene, TerrainMesh, PathOverlay, LocationPin, AxisGizmo
- `src/terrain/` — Height map (simplex noise), build extruded terrain geometry
- `src/navigation/` — Graph, A*, Dijkstra, Greedy, straight line, physics path; `computePath()` and `pathLength()`
