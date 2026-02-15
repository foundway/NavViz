# NavViz

## Overview

NavViz is a professional web-based tool for 3D experience creators to see different navigation algorithms visually in real-time.

## Architecture

### 3D view

- Shows a 3D terrian. Extrude the side so it looks like a solid object (not just the surface). 
- Allows camera view control. Use common React 3 fiber components

### Navigation menu (expandable)

- Select navigation algorithms (see below)
- Control navigation algorithm parameters (if any)
- Control the penalty factor (based on slope)

### Visualization menu (expandable)

- Generate new random terrain. 
- Control terrain size.
- Control colloring methods: plain shaded, black-and-white height map, heat-map-style height map (red is high, blue is low)

### Path visualization

- Start point is a solid white circle (8px)
- End point is an outlined white circle (8px radius, 2px border)
- Path is a white line (4px)

### Pin visualization

- A pin would move from the start to end point once set
- The visual is a conventional location pin (upside-down droplet)

Reference:

<img src=./images/terrian_visual.png width=300>

### Navigation algorithms

- A*
- Dijkatra
- Greedy best-first
- Straight line 
  - Ignore the effort of slope
- Physics-based 
  - Step-by-step simulated. Show the predicted path.
## Design System

Mimic the follow references:

<img src=./images/camera_projection.png width=150>
<img src=./images/pose.png width=150>
<img src=./images/3d_visual.png width=150>

## Technical specs

- Vite + React + Typescript
- React 3 Fiber and supporting libraries
- ShadCN
- Tailwind