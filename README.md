# Peggle Clone With Ball Prediction

This project is a Peggle-like game built with TypeScript and Vite.

## Project Structure

```
peggle-clone/
├── src/
│   ├── main.ts
│   ├── game.ts
│   ├── ball.ts
│   ├── peg.ts
│   ├── launcher.ts
│   ├── ghostLauncher.ts
│   ├── utils.ts
│   ├── uiControls.ts
│   ├── levelFormations.ts
│   └── styles.css
├── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open `http://localhost:5173` in your browser

## Build

Run `npm run build` to build the project for production. The built files will be in the `dist` directory.

## Features

- Peggle-like gameplay with ball and peg collisions
- Ball trajectory prediction
- Ghost launcher preview for next shot
- User interface controls for adjusting:
  - Ball gravity
  - Ball friction
  - Bounce impulse
- Reset button to restore default physics values
- 5 different levels:
  1. Classic Grid
  2. Diamond
  3. Circular
  4. Zigzag
  5. Sparse Triangle
- Press 'N' key to switch to the next level

## How to Play

- Use your mouse to aim the launcher
- Click to launch the ball
- Try to hit as many pegs as possible
- When ball is in play, move mouse to see ghost launcher and predicted trajectory for next shot
- Adjust the ball's physics properties using the UI controls
- Press 'N' to switch to the next level