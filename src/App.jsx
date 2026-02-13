import "./index.css";
import { Suspense, useEffect, useState, useRef } from "react";
import { HomePage } from "./components/HomePage";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Leva, useControls } from "leva";
import { Experience } from "./components/Experience";
import {
  useProgress,
  SoftShadows,
  OrbitControls,
  CameraControls,
} from "@react-three/drei";

import "@mantine/core/styles.css";

// import { getProject } from "@theatre/core";
// import { PerspectiveCamera, SheetProvider, editable as e } from "@theatre/r3f";
// import extension from "@theatre/r3f/dist/extension";
// import studio from "@theatre/studio";
// import projectState from "./assets/MedievalTown.theatre-project-state.json";
// import Interface360 from "./components/Interface.jsx";
import { ScreenTransition } from "./components/ScreenTransition.jsx";
import { atom, useAtom } from "jotai";
// import { transitionAtom, UI } from "./components/UI.jsx";
import {
  transitionAtom,
  UI,
  TRANSITION_DURATION,
  TRANSITION_DELAY,
} from "./components/UI.jsx";
import Overlay from "./components/Overlay.jsx";

import Recorrido360 from "./components/360/Recorrido360.jsx";
import UI360 from "./components/360/UI360.jsx";
import Overlay360 from "./components/360/Overlay360.jsx";

import { degToRad } from "three/src/math/MathUtils.js";

// LOADING SCREEN
// const LoadingScreen = ({ onLoadingChange }) => {
//   const { progress, active } = useProgress();

//   useEffect(() => {
//     if (onLoadingChange) {
//       onLoadingChange(active);
//     }
//   }, [active, onLoadingChange]);

//   console.log(progress);

//   return (
//     <div className={`loading-screen ${active ? "" : "loading-screen--hidden"}`}>
//       <div className="loading-screen__container">
//         <div className="logo-main">
//           <img src="./logos/Soho_Logo.png" alt="Soho Logo" />
//         </div>
//         <h1 className="loading-screen__title">SOHO RESIDENCES</h1>
//         <div className="progress__container">
//           <div
//             className="progress__bar"
//             style={{
//               width: `${progress}%`,
//             }}
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// };

//Theatre js
// export const isProd = import.meta.env.MODE === "production";

// if (!isProd) {
//   studio.initialize();
//   studio.extend(extension);
// }
// const project = getProject(
//   "MedievalTown",
//   isProd
//     ? {
//         state: projectState,
//       }
//     : undefined,
// );
// const mainSheet = project.sheet("Main");

// const transitions = {
//   Home: [0, 5],
//   Castle: [6, 12 + 22 / 30],
//   Windmill: [13 + 2 / 30, 17 + 23 / 30],
// };

export const transitionHome = atom(false);

function LoadingGate() {
  const [, setTransition] = useAtom(transitionAtom);
  const { active, progress } = useProgress();
  const last = useRef(null);

  useEffect(() => {
    const shouldBeOn = active || progress < 100;

    // ✅ evita setTransition repetido (y warnings raros en StrictMode)
    if (last.current === shouldBeOn) return;
    last.current = shouldBeOn;

    if (shouldBeOn) {
      setTransition(true);
      return;
    }

    const t = setTimeout(() => setTransition(false), 200);
    return () => clearTimeout(t);
  }, [active, progress, setTransition]);

  return null;
}

function App() {
  const [showRecorrido360, setShowRecorrido360] = useState(false);
  const [transitionHomepage, setTransitionHomepage] = useAtom(transitionHome);
  const [returnToMesh, setReturnToMesh] = useState(null);
  const timeoutTourRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);

  const [transition, setTransition] = useAtom(transitionAtom);

  //////////

  // const { progress } = useProgress();

  // console.log(progress);

  // useEffect(() => {
  //   if (progress === 100) {
  //     setTransition(false);
  //   }
  // }, [progress]);

  ////////////

  // const cameraTargetRef = useRef();

  // const [currentScreen, setCurrentScreen] = useState("Intro");
  // const [targetScreen, setTargetScreen] = useState("Home");
  // const isSetup = useRef(false);

  const { backgroundColor } = useControls({
    backgroundColor: "#ffffff",
  });

  // const handleTourClick = () => {
  //   // setReturnToMesh(meshName);
  //   setShowRecorrido360(true);
  // };

  useEffect(() => {
    const handleTourButtonClick = (event) => {
      const meshKey = event.detail?.returnToMesh ?? null;
      setReturnToMesh(meshKey);
      setTransition(true);
      if (timeoutTourRef.current) clearTimeout(timeoutTourRef.current);
      timeoutTourRef.current = setTimeout(
        () => {
          setShowRecorrido360(true);
          setTransition(false);
          timeoutTourRef.current = null;
        },
        (TRANSITION_DURATION + TRANSITION_DELAY) * 1000 + 3000,
      );
    };
    window.addEventListener("tour-button-click", handleTourButtonClick);
    return () => {
      window.removeEventListener("tour-button-click", handleTourButtonClick);
      if (timeoutTourRef.current) clearTimeout(timeoutTourRef.current);
    };
  }, [setTransition]);

  // const handleReturnClick = () => {
  //   setShowRecorrido360(false);
  // Dispatch event to reopen the floating panel after return
  // if (returnToMesh) {
  //   setTimeout(() => {
  //     window.dispatchEvent(
  //       new CustomEvent("return-from-360", {
  //         detail: {
  //           meshName: returnToMesh,
  //         },
  //       }),
  //     );
  //   }, 100);
  // }
  const handleReturnFrom360 = () => {
    setTransition(true);
    if (timeoutTourRef.current) clearTimeout(timeoutTourRef.current);
    timeoutTourRef.current = setTimeout(
      () => {
        setShowRecorrido360(false);
        setReturnToMesh(null);
        // setTransition(false);
        timeoutTourRef.current = null;
      },
      (TRANSITION_DURATION + TRANSITION_DELAY) * 1000,
    );
  };

  // useEffect(() => {
  //   project.ready.then(() => {
  //     if (currentScreen === targetScreen) {
  //       return;
  //     }
  //     if (isSetup.current && currentScreen === "Intro") {
  //       // Strict mode in development will trigger the useEffect twice, so we need to check if it's already setup
  //       return;
  //     }
  //     isSetup.current = true;
  //     const reverse = targetScreen === "Home" && currentScreen !== "Intro";
  //     const transition = transitions[reverse ? currentScreen : targetScreen];
  //     if (!transition) {
  //       return;
  //     }

  //     mainSheet.sequence
  //       .play({
  //         range: transition,
  //         direction: reverse ? "reverse" : "normal",
  //         rate: reverse ? 2 : 1,
  //       })
  //       .then(() => {
  //         setCurrentScreen(targetScreen);
  //       });
  //   });
  // }, [targetScreen]);

  const flippedTourIds = [
    "2BR_G_B",
    "2BR_N1_B",
    "2BR_N2_B",
    "3BR_G_B",
    "3BR_N1_B",
    "3BR_N2_B",
    "4BR_B",
  ];

  const tourMappings = {
    "2BR_G_A": {
      folder: "2_BR",
      image: "./FP/2BR_A.jpg",
      imageMap: "./FP/map/2BR_A_G.png",
      title: "2 Bedroom Garden A",
      flips: [
        "LO_01.png",
        "LO_02.png",
        "PA_01.png",
        "LI.png",
        "BR_M.png",
        "BA_M.png",
        "BR_01.png",
        "BA_01.png",
        "T_G.png",
      ],
      spaces: [
        "Lobby",
        "Lobby Bedroom",
        "Hall",
        "Living",
        "Master Bedroom",
        "Master Bathroom",
        "Bedroom 2",
        "Bathroom 2",
        "Terrace",
      ],
      hotspots: [
        [[0, 0, -8]],
        [
          [7, 0, -3.2],
          [-7.8, 0, 1.1],
        ],
        [
          [-7.2, 0, 2.2],
          [6.6, 0, -0.2],
          [-7.2, 0, -1.4],
        ],
        [
          [9.6, 0, 1.6],
          [4.8, 0, -7.6],
          [-10, 0, -2],
        ],
        [
          [5.8, 0, -3.2],
          [-10.2, 0, -1.4],
          [-8.6, 0, 2.3],
        ],
        [[5.8, 0, -5.0]],
        [
          [-1.2, 0, 8.0],
          [-5.2, 0, 6.3],
        ],
        [[-7.2, 0, 2.4]],
        [
          [-7.4, 0, 5.3],
          [6.2, 0, 5.3],
        ],
      ],
      hotspotIndexTargets: [
        [3],
        [2, 4],
        [1, 3, 6],
        [0, 2, 8],
        [1, 5, 8],
        [4],
        [2, 7],
        [6],
        [3, 4],
      ],
      labels: [
        ["Living"],
        ["Hall", "Master Bedroom"],
        ["Lobby Bedroom", "Living", "Bedroom 2"],
        ["Lobby", "Hall", "Terrace"],
        ["Lobby Bedroom", "Master Bathroom", "Terrace"],
        ["Master Bedroom"],
        ["Hall", "Bathroom 2"],
        ["Bedroom 2"],
        ["Living", "Master Bedroom"],
      ],
      locationpoints: [
        [0.4, 0.36],
        [0.32, 0.52],
        [0.35, 0.47],
        [0.38, 0.51],
        [0.3, 0.63],
        [0.25, 0.61],
        [0.29, 0.38],
        [0.27, 0.45],
        [0.33, 0.69],
      ],
    },
    "2BR_G_B": {
      folder: "2_BR",
      image: "./FP/2BR_B.jpg",
      imageMap: "./FP/map/2BR_B_G.png",
      title: "2 Bedroom Garden B",
      flips: [
        "LO_01_F.png",
        "LO_02.png",
        "PA_01.png",
        "LI.png",
        "BR_M.png",
        "BA_M.png",
        "BR_01.png",
        "BA_01.png",
        "T_G_F.png",
      ],
      spaces: [
        "Lobby",
        "Lobby Bedroom",
        "Hall",
        "Living",
        "Master Bedroom",
        "Master Bathroom",
        "Bedroom 2",
        "Bathroom 2",
        "Terrace",
      ],
      hotspots: [
        [[-0.8, 0, -8]],
        [
          [7, 0, 3.2],
          [-7.8, 0, -1.1],
        ],
        [
          [-7.2, 0, -2.2],
          [6.6, 0, 0.2],
          [-7.2, 0, 1.4],
        ],
        [
          [9.6, 0, -1.6],
          [4.8, 0, 7.6],
          [-10, 0, 2],
        ],
        [
          [5.8, 0, 3.2],
          [-10.2, 0, 1.4],
          [-8.6, 0, -2.3],
        ],
        [[5.8, 0, 5.0]],
        [
          [-1.2, 0, -8.0],
          [-5.2, 0, -6.3],
        ],
        [[-7.2, 0, -2.4]],
        [
          [3.2, 0, 6.8],
          [-7.6, 0, 3.95],
        ],
      ],
      hotspotIndexTargets: [
        [3],
        [2, 4],
        [1, 3, 6],
        [0, 2, 8],
        [1, 5, 8],
        [4],
        [2, 7],
        [6],
        [3, 4],
      ],
      labels: [
        ["Living"],
        ["Hall", "Master Bedroom"],
        ["Lobby Bedroom", "Living", "Bedroom 2"],
        ["Lobby", "Hall", "Terrace"],
        ["Lobby Bedroom", "Master Bathroom", "Terrace"],
        ["Master Bedroom"],
        ["Hall", "Bathroom 2"],
        ["Bedroom 2"],
        ["Living", "Master Bedroom"],
      ],
      locationpoints: [
        [0.62, 0.36],
        [0.7, 0.52],
        [0.67, 0.47],
        [0.64, 0.51],
        [0.72, 0.64],
        [0.77, 0.61],
        [0.72, 0.38],
        [0.74, 0.45],
        [0.68, 0.69],
      ],
    },
    "2BR_N1_A": {
      folder: "2_BR",
      image: "./FP/2BR_A.jpg",
      imageMap: "./FP/map/2BR_A_.png",
      title: "2 Bedroom Level 1 A",
      flips: [
        "LO_01.png",
        "LO_02.png",
        "PA_01.png",
        "LI.png",
        "BR_M.png",
        "BA_M.png",
        "BR_01.png",
        "BA_01.png",
        "T_01.png",
      ],
      spaces: [
        "Lobby",
        "Lobby Bedroom",
        "Hall",
        "Living",
        "Master Bedroom",
        "Master Bathroom",
        "Bedroom 2",
        "Bathroom 2",
        "Terrace",
      ],
      hotspots: [
        [[0, 0, -8]],
        [
          [7, 0, -3.2],
          [-7.8, 0, 1.1],
        ],
        [
          [-7.2, 0, 2.2],
          [6.6, 0, -0.2],
          [-7.2, 0, -1.4],
        ],
        [
          [9.6, 0, 1.6],
          [4.8, 0, -7.6],
          [-10, 0, -2],
        ],
        [
          [5.8, 0, -3.2],
          [-10.2, 0, -1.4],
          [-8.6, 0, 2.3],
        ], //*
        [[5.8, 0, -5.0]],
        [
          [-1.2, 0, 8.0],
          [-5.2, 0, 6.3],
        ],
        [[-7.2, 0, 2.4]],
        [
          [-7.4, 0, 5.3],
          [6.2, 0, 5.3],
        ],
      ],
      hotspotIndexTargets: [
        [3],
        [2, 4],
        [1, 3, 6],
        [0, 2, 8],
        [1, 5, 8],
        [4],
        [2, 7],
        [6],
        [3, 4],
      ],
      labels: [
        ["Living"],
        ["Hall", "Master Bedroom"],
        ["Lobby Bedroom", "Living", "Bedroom 2"],
        ["Lobby", "Hall", "Terrace"],
        ["Lobby Bedroom", "Master Bathroom", "Terrace"],
        ["Master Bedroom"],
        ["Hall", "Bathroom 2"],
        ["Bedroom 2"],
        ["Living", "Master Bedroom"],
      ],
      locationpoints: [
        [0.4, 0.36],
        [0.32, 0.52],
        [0.35, 0.47],
        [0.38, 0.51],
        [0.3, 0.63],
        [0.25, 0.61],
        [0.29, 0.38],
        [0.27, 0.45],
        [0.33, 0.69],
      ],
    },
    "2BR_N1_B": {
      folder: "2_BR",
      image: "./FP/2BR_B.jpg",
      imageMap: "./FP/map/2BR_B_.png",
      title: "2 Bedroom Level 1 B",
      flips: [
        "LO_01_F.png",
        "LO_02.png",
        "PA_01.png",
        "LI.png",
        "BR_M.png",
        "BA_M.png",
        "BR_01.png",
        "BA_01.png",
        "T_01_F.png",
      ],
      spaces: [
        "Lobby",
        "Lobby Bedroom",
        "Hall",
        "Living",
        "Master Bedroom",
        "Master Bathroom",
        "Bedroom 2",
        "Bathroom 2",
        "Terrace",
      ],
      hotspots: [
        [[-0.8, 0, -8]],
        [
          [7, 0, 3.2],
          [-7.8, 0, -1.1],
        ],
        [
          [-7.2, 0, -2.2],
          [6.6, 0, 0.2],
          [-7.2, 0, 1.4],
        ],
        [
          [9.6, 0, -1.6],
          [4.8, 0, 7.6],
          [-10, 0, 2],
        ],
        [
          [5.8, 0, 3.2],
          [-10.2, 0, 1.4],
          [-8.6, 0, -2.3],
        ],
        [[5.8, 0, 5.0]],
        [
          [-1.2, 0, -8.0],
          [-5.2, 0, -6.3],
        ],
        [[-7.2, 0, -2.4]],
        [
          [3.2, 0, 6.8],
          [-7.6, 0, 3.95],
        ],
      ],
      hotspotIndexTargets: [
        [3],
        [2, 4],
        [1, 3, 6],
        [0, 2, 8],
        [1, 5, 8],
        [4],
        [2, 7],
        [6],
        [3, 4],
      ],
      labels: [
        ["Living"],
        ["Hall", "Master Bedroom"],
        ["Lobby Bedroom", "Living", "Bedroom 2"],
        ["Lobby", "Hall", "Terrace"],
        ["Lobby Bedroom", "Master Bathroom", "Terrace"],
        ["Master Bedroom"],
        ["Hall", "Bathroom 2"],
        ["Bedroom 2"],
        ["Living", "Master Bedroom"],
      ],
      locationpoints: [
        [0.62, 0.36],
        [0.7, 0.52],
        [0.67, 0.47],
        [0.64, 0.51],
        [0.72, 0.64],
        [0.77, 0.61],
        [0.72, 0.38],
        [0.74, 0.45],
        [0.68, 0.69],
      ],
    },
    "2BR_N2_A": {
      folder: "2_BR",
      image: "./FP/2BR_A.jpg",
      imageMap: "./FP/map/2BR_A_.png",
      title: "2 Bedroom Level 2 A",
      flips: [
        "LO_01.png",
        "LO_02.png",
        "PA_01.png",
        "LI.png",
        "BR_M.png",
        "BA_M.png",
        "BR_01.png",
        "BA_01.png",
        "T_02.png",
      ],
      spaces: [
        "Lobby",
        "Lobby Bedroom",
        "Hall",
        "Living",
        "Master Bedroom",
        "Master Bathroom",
        "Bedroom 2",
        "Bathroom 2",
        "Terrace",
      ],
      hotspots: [
        [[0, 0, -8]],
        [
          [7, 0, -3.2],
          [-7.8, 0, 1.1],
        ],
        [
          [-7.2, 0, 2.2],
          [6.6, 0, -0.2],
          [-7.2, 0, -1.4],
        ],
        [
          [9.6, 0, 1.6],
          [4.8, 0, -7.6],
          [-10, 0, -2],
        ],
        [
          [5.8, 0, -3.2],
          [-10.2, 0, -1.4],
          [-8.6, 0, 2.3],
        ],
        [[5.8, 0, -5.0]],
        [
          [-1.2, 0, 8.0],
          [-5.2, 0, 6.3],
        ],
        [[-7.2, 0, 2.4]],
        [
          [-7.4, 0, 5.3],
          [6.2, 0, 5.3],
        ],
      ],
      hotspotIndexTargets: [
        [3],
        [2, 4],
        [1, 3, 6],
        [0, 2, 8],
        [1, 5, 8],
        [4],
        [2, 7],
        [6],
        [3, 4],
      ],
      labels: [
        ["Living"],
        ["Hall", "Master Bedroom"],
        ["Lobby Bedroom", "Living", "Bedroom 2"],
        ["Lobby", "Hall", "Terrace"],
        ["Lobby Bedroom", "Master Bathroom", "Terrace"],
        ["Master Bedroom"],
        ["Hall", "Bathroom 2"],
        ["Bedroom 2"],
        ["Living", "Master Bedroom"],
      ],
      locationpoints: [
        [0.4, 0.36],
        [0.32, 0.52],
        [0.35, 0.47],
        [0.38, 0.51],
        [0.3, 0.63],
        [0.25, 0.61],
        [0.29, 0.38],
        [0.27, 0.45],
        [0.33, 0.69],
      ],
    },
    "2BR_N2_B": {
      folder: "2_BR",
      image: "./FP/2BR_B.jpg",
      imageMap: "./FP/map/2BR_B_.png",
      title: "2 Bedroom Level 2 B",
      flips: [
        "LO_01_F.png",
        "LO_02.png",
        "PA_01.png",
        "LI.png",
        "BR_M.png",
        "BA_M.png",
        "BR_01.png",
        "BA_01.png",
        "T_02_F.png",
      ],
      spaces: [
        "Lobby",
        "Lobby Bedroom",
        "Hall",
        "Living",
        "Master Bedroom",
        "Master Bathroom",
        "Bedroom 2",
        "Bathroom 2",
        "Terrace",
      ],
      hotspots: [
        [[-0.8, 0, -8]],
        [
          [7, 0, 3.2],
          [-7.8, 0, -1.1],
        ],
        [
          [-7.2, 0, -2.2],
          [6.6, 0, 0.2],
          [-7.2, 0, 1.4],
        ],
        [
          [9.6, 0, -1.6],
          [4.8, 0, 7.6],
          [-10, 0, 2],
        ],
        [
          [5.8, 0, 3.2],
          [-10.2, 0, 1.4],
          [-8.6, 0, -2.3],
        ],
        [[5.8, 0, 5.0]],
        [
          [-1.2, 0, -8.0],
          [-5.2, 0, -6.3],
        ],
        [[-7.2, 0, -2.4]],
        [
          [3.2, 0, 6.8],
          [-7.6, 0, 3.95],
        ],
      ],
      hotspotIndexTargets: [
        [3],
        [2, 4],
        [1, 3, 6],
        [0, 2, 8],
        [1, 5, 8],
        [4],
        [2, 7],
        [6],
        [3, 4],
      ],
      labels: [
        ["Living"],
        ["Hall", "Master Bedroom"],
        ["Lobby Bedroom", "Living", "Bedroom 2"],
        ["Lobby", "Hall", "Terrace"],
        ["Lobby Bedroom", "Master Bathroom", "Terrace"],
        ["Master Bedroom"],
        ["Hall", "Bathroom 2"],
        ["Bedroom 2"],
        ["Living", "Master Bedroom"],
      ],
      locationpoints: [
        [0.62, 0.36],
        [0.7, 0.52],
        [0.67, 0.47],
        [0.64, 0.51],
        [0.72, 0.64],
        [0.77, 0.61],
        [0.72, 0.38],
        [0.74, 0.45],
        [0.68, 0.69],
      ],
    },
    "3BR_G_A": {
      folder: "3_BR",
      image: "./FP/3BR_A.jpg",
      imageMap: "./FP/map/3BR_A_G.png",
      title: "3 Bedroom Garden A",
      // flips: ['LO.png'(0), 'LI_01.png'(1), 'LI_02.png'(2), 'KI.png'(3), 'PA_01.png'(4), 'PA_02.png'(5), 'BR_M.png'(6),  'BA_M.png'(7),  'BR_01.png'(8),  'BA_01.png'(9),  'BR_02.png'(10),  'BA_02.png'(11), 'T_01.png'(12)],
      flips: [
        "LO.png",
        "LI_01.png",
        "LI_02.png",
        "KI.png",
        "PA_01.png",
        "PA_02.png",
        "BR_M_V.png",
        "BR_M.png",
        "BA_M.png",
        "BR_01.png",
        "BA_01.png",
        "BR_02.png",
        "BA_02.png",
        "T_G.png",
      ],
      spaces: [
        "Lobby",
        "Living 1",
        "Living 2",
        "Kitchen",
        "Hall 1",
        "Hall 2",
        "Bedroom Hall",
        "Master Bedroom",
        "Master Bathroom",
        "Bedroom 1",
        "Bathroom 1",
        "Bedroom 2",
        "Bathroom 2",
        "Terrace",
      ],
      hotspots: [
        [[3.4, 0, -8]],
        [
          [-3, 0, 8],
          [4.7, 0, 7.0],
          [8.6, 0, -1.6],
          [2.6, 0, 11.0],
          [-5.8, 0, -5.6],
        ],
        [
          [-2.2, 0, -7.2],
          [5.8, 0, -4.8],
          [0, 0, -9.8],
          [-9.4, 0, -2.2],
        ],
        [
          [2.2, 0, -8.4],
          [-3, 0, -8.5],
          [-7, 0, 0],
        ],
        [
          [5.4, 0, 5.8],
          [9.2, 0, 1.0],
          [5, 0, -6.8],
          [-8, 0, 1.2],
        ],
        [
          [12, 0, 2.4],
          [2, 0, 7.6],
          [-7.6, 0, -2.15],
          [-8.0, 0, -0.15],
        ],
        [
          [5.2, 0, -7.2],
          [-8.6, 0, 0.6],
          [-3.6, 0, 6.2],
        ],
        [[-2.6, 0, -8.4]],
        [[7.2, 0, 1.1]],
        [
          [6.8, 0, 1.4],
          [4.4, 0, -8],
          [-6, 0, -8.15],
        ],
        [[-7.2, 0, 3.6]],
        [
          [-10, 0, 0.5],
          [2.1, 0, -8.5],
        ],
        [[0.8, 0, 8.6]],
        [
          [-7.4, 0, 6.1],
          [-10, 0, 4.4],
          [5.1, 0, 5.4],
        ],
      ],
      hotspotIndexTargets: [
        [1],
        [2, 3, 4, 5, 13],
        [1, 3, 4, 13],
        [1, 2, 5],
        [1, 2, 3, 9],
        [2, 3, 6, 11],
        [5, 7, 8],
        [6],
        [6],
        [4, 10, 13],
        [9],
        [5, 12],
        [11],
        [1, 2, 9],
      ],
      labels: [
        ["Living 1"],
        ["Living 2", "Kitchen", "Hall 1", "Hall 2", "Terrace"],
        ["Living 1", "Kitchen", "Hall 1", "Terrace"],
        ["Living 1", "Living 2", "Hall 2"],
        ["Living 1", "Living 2", "Kitchen", "Bedroom 1"],
        ["Living 2", "Kitchen", "Master Bedroom", "Bedroom 2"],
        ["Hall 2", "Master Bedroom", "Master Bathroom"],
        ["Bedroom Hall"],
        ["Bedroom Hall"],
        ["Hall 1", "Bathroom 1", "Terrace"],
        ["Bedroom 1"],
        ["Hall 2", "Bathroom 2"],
        ["Bedroom 2"],
        ["Living 1", "Living 2", "Bedroom 1"],
      ],
      locationpoints: [
        [0.47, 0.43],
        [0.57, 0.43],
        [0.62, 0.43],
        [0.59, 0.37],
        [0.54, 0.43],
        [0.62, 0.36],
        [0.65, 0.31],
        [0.68, 0.47],
        [0.68, 0.34],
        [0.52, 0.52],
        [0.46, 0.51],
        [0.58, 0.27],
        [0.54, 0.3],
        [0.57, 0.61],
      ],
    },
    "3BR_G_B": {
      folder: "3_BR",
      image: "./FP/3BR_B.jpg",
      imageMap: "./FP/map/3BR_B_G.png",
      title: "3 Bedroom Garden B",
      flips: [
        "LO_F.png",
        "LI_01.png",
        "LI_02.png",
        "KI.png",
        "PA_01.png",
        "PA_02.png",
        "BR_M_V.png",
        "BR_M.png",
        "BA_M.png",
        "BR_01.png",
        "BA_01.png",
        "BR_02.png",
        "BA_02.png",
        "T_G_F.png",
      ],
      spaces: [
        "Lobby",
        "Living 1",
        "Living 2",
        "Kitchen",
        "Hall 1",
        "Hall 2",
        "Bedroom Hall",
        "Master Bedroom",
        "Master Bathroom",
        "Bedroom 1",
        "Bathroom 1",
        "Bedroom 2",
        "Bathroom 2",
        "Terrace",
      ],
      hotspots: [
        [[4.7, 0, -8]],
        [
          [-3, 0, -8],
          [4.7, 0, -7.0],
          [8.6, 0, 1.6],
          [2.6, 0, -11.0],
          [-5.8, 0, 5.6],
        ],
        [
          [-2.2, 0, 7.2],
          [5.8, 0, 4.8],
          [0, 0, 9.8],
          [-9.4, 0, 2.2],
        ],
        [
          [2.2, 0, 8.4],
          [-3, 0, 8.5],
          [-7, 0, 0],
        ],
        [
          [5.4, 0, -5.8],
          [9.2, 0, -1.0],
          [5, 0, 6.8],
          [-8, 0, -1.2],
        ],
        [
          [12, 0, -2.4],
          [2, 0, -7.6],
          [-7.6, 0, 2.15],
          [-8.0, 0, 0.15],
        ],
        [
          [5.2, 0, 7.2],
          [-8.6, 0, -0.6],
          [-3.6, 0, -6.2],
        ],
        [[-2.6, 0, 8.4]],
        [[7.2, 0, -1.1]],
        [
          [6.8, 0, -1.4],
          [4.4, 0, 8],
          [-6, 0, 8.15],
        ],
        [[-7.2, 0, -3.6]],
        [
          [-10, 0, -0.5],
          [2.1, 0, 8.5],
        ],
        [[0.8, 0, -8.6]],
        [
          [-9, 0, -1],
          [-7.6, 0, -2.6],
          [1.2, 0, -9.2],
        ],
      ],
      hotspotIndexTargets: [
        [1],
        [2, 3, 4, 5, 13],
        [1, 3, 4, 13],
        [1, 2, 5],
        [1, 2, 3, 9],
        [2, 3, 6, 11],
        [5, 7, 8],
        [6],
        [6],
        [4, 10, 13],
        [9],
        [5, 12],
        [11],
        [1, 2, 9],
      ],
      labels: [
        ["Living 1"],
        ["Living 2", "Kitchen", "Hall 1", "Hall 2", "Terrace"],
        ["Living 1", "Kitchen", "Hall 1", "Terrace"],
        ["Living 1", "Living 2", "Hall 2"],
        ["Living 1", "Living 2", "Kitchen", "Bedroom 1"],
        ["Living 2", "Kitchen", "Master Bedroom", "Bedroom 2"],
        ["Hall 2", "Master Bedroom", "Master Bathroom"],
        ["Bedroom Hall"],
        ["Bedroom Hall"],
        ["Hall 1", "Bathroom 1", "Terrace"],
        ["Bedroom 1"],
        ["Hall 2", "Bathroom 2"],
        ["Bedroom 2"],
        ["Living 1", "Living 2", "Bedroom 1"],
      ],
      locationpoints: [
        [0.54, 0.43],
        [0.44, 0.43],
        [0.39, 0.43],
        [0.42, 0.37],
        [0.47, 0.43],
        [0.38, 0.36],
        [0.36, 0.31],
        [0.33, 0.47],
        [0.33, 0.34],
        [0.49, 0.52],
        [0.55, 0.51],
        [0.42, 0.27],
        [0.47, 0.3],
        [0.44, 0.61],
      ],
    },
    "3BR_N1_A": {
      folder: "3_BR",
      image: "./FP/3BR_A.jpg",
      imageMap: "./FP/map/3BR_A_.png",
      title: "3 Bedroom Level 1 A",
      flips: [
        "LO.png",
        "LI_01.png",
        "LI_02.png",
        "KI.png",
        "PA_01.png",
        "PA_02.png",
        "BR_M_V.png",
        "BR_M.png",
        "BA_M.png",
        "BR_01.png",
        "BA_01.png",
        "BR_02.png",
        "BA_02.png",
        "T_01.png",
      ],
      spaces: [
        "Lobby",
        "Living 1",
        "Living 2",
        "Kitchen",
        "Hall 1",
        "Hall 2",
        "Bedroom Hall",
        "Master Bedroom",
        "Master Bathroom",
        "Bedroom 1",
        "Bathroom 1",
        "Bedroom 2",
        "Bathroom 2",
        "Terrace",
      ],
      hotspots: [
        [[3.4, 0, -8]],
        [
          [-3, 0, 8],
          [4.7, 0, 7.0],
          [8.6, 0, -1.6],
          [2.6, 0, 11.0],
          [-5.8, 0, -5.6],
        ],
        [
          [-2.2, 0, -7.2],
          [5.8, 0, -4.8],
          [0, 0, -9.8],
          [-9.4, 0, -2.2],
        ],
        [
          [2.2, 0, -8.4],
          [-3, 0, -8.5],
          [-7, 0, 0],
        ],
        [
          [5.4, 0, 5.8],
          [9.2, 0, 1.0],
          [5, 0, -6.8],
          [-8, 0, 1.2],
        ],
        [
          [12, 0, 2.4],
          [2, 0, 7.6],
          [-7.6, 0, -2.15],
          [-8.0, 0, -0.15],
        ],
        [
          [5.2, 0, -7.2],
          [-8.6, 0, 0.6],
          [-3.6, 0, 6.2],
        ],
        [[-2.6, 0, -8.4]],
        [[7.2, 0, 1.1]],
        [
          [6.8, 0, 1.4],
          [4.4, 0, -8],
          [-6, 0, -8.15],
        ],
        [[-7.2, 0, 3.6]],
        [
          [-10, 0, 0.5],
          [2.1, 0, -8.5],
        ],
        [[0.8, 0, 8.6]],
        [
          [-7.4, 0, 6.1],
          [-10, 0, 4.4],
          [5.1, 0, 5.4],
        ],
      ],
      hotspotIndexTargets: [
        [1],
        [2, 3, 4, 5, 13],
        [1, 3, 4, 13],
        [1, 2, 5],
        [1, 2, 3, 9],
        [2, 3, 6, 11],
        [5, 7, 8],
        [6],
        [6],
        [4, 10, 13],
        [9],
        [5, 12],
        [11],
        [1, 2, 9],
      ],
      labels: [
        ["Living 1"],
        ["Living 2", "Kitchen", "Hall 1", "Hall 2", "Terrace"],
        ["Living 1", "Kitchen", "Hall 1", "Terrace"],
        ["Living 1", "Living 2", "Hall 2"],
        ["Living 1", "Living 2", "Kitchen", "Bedroom 1"],
        ["Living 2", "Kitchen", "Master Bedroom", "Bedroom 2"],
        ["Hall 2", "Master Bedroom", "Master Bathroom"],
        ["Bedroom Hall"],
        ["Bedroom Hall"],
        ["Hall 1", "Bathroom 1", "Terrace"],
        ["Bedroom 1"],
        ["Hall 2", "Bathroom 2"],
        ["Bedroom 2"],
        ["Living 1", "Living 2", "Bedroom 1"],
      ],
      locationpoints: [
        [0.47, 0.43],
        [0.57, 0.43],
        [0.62, 0.43],
        [0.59, 0.37],
        [0.54, 0.43],
        [0.62, 0.36],
        [0.65, 0.31],
        [0.68, 0.47],
        [0.68, 0.34],
        [0.52, 0.52],
        [0.46, 0.51],
        [0.58, 0.27],
        [0.54, 0.3],
        [0.57, 0.61],
      ],
    },
    "3BR_N1_B": {
      folder: "3_BR",
      image: "./FP/3BR_B.jpg",
      imageMap: "./FP/map/3BR_B_.png",
      title: "3 Bedroom Level 1 B",
      flips: [
        "LO_F.png",
        "LI_01.png",
        "LI_02.png",
        "KI.png",
        "PA_01.png",
        "PA_02.png",
        "BR_M_V.png",
        "BR_M.png",
        "BA_M.png",
        "BR_01.png",
        "BA_01.png",
        "BR_02.png",
        "BA_02.png",
        "T_01_F.png",
      ],
      spaces: [
        "Lobby",
        "Living 1",
        "Living 2",
        "Kitchen",
        "Hall 1",
        "Hall 2",
        "Bedroom Hall",
        "Master Bedroom",
        "Master Bathroom",
        "Bedroom 1",
        "Bathroom 1",
        "Bedroom 2",
        "Bathroom 2",
        "Terrace",
      ],
      hotspots: [
        [[4.7, 0, -8]],
        [
          [-3, 0, -8],
          [4.7, 0, -7.0],
          [8.6, 0, 1.6],
          [2.6, 0, -11.0],
          [-5.8, 0, 5.6],
        ],
        [
          [-2.2, 0, 7.2],
          [5.8, 0, 4.8],
          [0, 0, 9.8],
          [-9.4, 0, 2.2],
        ],
        [
          [2.2, 0, 8.4],
          [-3, 0, 8.5],
          [-7, 0, 0],
        ],
        [
          [5.4, 0, -5.8],
          [9.2, 0, -1.0],
          [5, 0, 6.8],
          [-8, 0, -1.2],
        ],
        [
          [12, 0, -2.4],
          [2, 0, -7.6],
          [-7.6, 0, 2.15],
          [-8.0, 0, 0.15],
        ],
        [
          [5.2, 0, 7.2],
          [-8.6, 0, -0.6],
          [-3.6, 0, -6.2],
        ],
        [[-2.6, 0, 8.4]],
        [[7.2, 0, -1.1]],
        [
          [6.8, 0, -1.4],
          [4.4, 0, 8],
          [-6, 0, 8.15],
        ],
        [[-7.2, 0, -3.6]],
        [
          [-10, 0, -0.5],
          [2.1, 0, 8.5],
        ],
        [[0.8, 0, -8.6]],
        [
          [-9, 0, -1],
          [-7.6, 0, -2.6],
          [1.2, 0, -9.2],
        ],
      ],
      hotspotIndexTargets: [
        [1],
        [2, 3, 4, 5, 13],
        [1, 3, 4, 13],
        [1, 2, 5],
        [1, 2, 3, 9],
        [2, 3, 6, 11],
        [5, 7, 8],
        [6],
        [6],
        [4, 10, 13],
        [9],
        [5, 12],
        [11],
        [1, 2, 9],
      ],
      labels: [
        ["Living 1"],
        ["Living 2", "Kitchen", "Hall 1", "Hall 2", "Terrace"],
        ["Living 1", "Kitchen", "Hall 1", "Terrace"],
        ["Living 1", "Living 2", "Hall 2"],
        ["Living 1", "Living 2", "Kitchen", "Bedroom 1"],
        ["Living 2", "Kitchen", "Master Bedroom", "Bedroom 2"],
        ["Hall 2", "Master Bedroom", "Master Bathroom"],
        ["Bedroom Hall"],
        ["Bedroom Hall"],
        ["Hall 1", "Bathroom 1", "Terrace"],
        ["Bedroom 1"],
        ["Hall 2", "Bathroom 2"],
        ["Bedroom 2"],
        ["Living 1", "Living 2", "Bedroom 1"],
      ],
      locationpoints: [
        [0.54, 0.43],
        [0.44, 0.43],
        [0.39, 0.43],
        [0.42, 0.37],
        [0.47, 0.43],
        [0.38, 0.36],
        [0.36, 0.31],
        [0.33, 0.47],
        [0.33, 0.34],
        [0.49, 0.52],
        [0.55, 0.51],
        [0.42, 0.27],
        [0.47, 0.3],
        [0.44, 0.61],
      ],
    },
    "3BR_N2_A": {
      folder: "3_BR",
      image: "./FP/3BR_A.jpg",
      imageMap: "./FP/map/3BR_A_.png",
      title: "3 Bedroom Level 2 A",
      flips: [
        "LO.png",
        "LI_01.png",
        "LI_02.png",
        "KI.png",
        "PA_01.png",
        "PA_02.png",
        "BR_M_V.png",
        "BR_M.png",
        "BA_M.png",
        "BR_01.png",
        "BA_01.png",
        "BR_02.png",
        "BA_02.png",
        "T_02.png",
      ],
      spaces: [
        "Lobby",
        "Living 1",
        "Living 2",
        "Kitchen",
        "Hall 1",
        "Hall 2",
        "Bedroom Hall",
        "Master Bedroom",
        "Master Bathroom",
        "Bedroom 1",
        "Bathroom 1",
        "Bedroom 2",
        "Bathroom 2",
        "Terrace",
      ],
      hotspots: [
        [[3.4, 0, -8]],
        [
          [-3, 0, 8],
          [4.7, 0, 7.0],
          [8.6, 0, -1.6],
          [2.6, 0, 11.0],
          [-5.8, 0, -5.6],
        ],
        [
          [-2.2, 0, -7.2],
          [5.8, 0, -4.8],
          [0, 0, -9.8],
          [-9.4, 0, -2.2],
        ],
        [
          [2.2, 0, -8.4],
          [-3, 0, -8.5],
          [-7, 0, 0],
        ],
        [
          [5.4, 0, 5.8],
          [9.2, 0, 1.0],
          [5, 0, -6.8],
          [-8, 0, 1.2],
        ],
        [
          [12, 0, 2.4],
          [2, 0, 7.6],
          [-7.6, 0, -2.15],
          [-8.0, 0, -0.15],
        ],
        [
          [5.2, 0, -7.2],
          [-8.6, 0, 0.6],
          [-3.6, 0, 6.2],
        ],
        [[-2.6, 0, -8.4]],
        [[7.2, 0, 1.1]],
        [
          [6.8, 0, 1.4],
          [4.4, 0, -8],
          [-6, 0, -8.15],
        ],
        [[-7.2, 0, 3.6]],
        [
          [-10, 0, 0.5],
          [2.1, 0, -8.5],
        ],
        [[0.8, 0, 8.6]],
        [
          [-7.4, 0, 6.1],
          [-10, 0, 4.4],
          [5.1, 0, 5.4],
        ],
      ],
      hotspotIndexTargets: [
        [1],
        [2, 3, 4, 5, 13],
        [1, 3, 4, 13],
        [1, 2, 5],
        [1, 2, 3, 9],
        [2, 3, 6, 11],
        [5, 7, 8],
        [6],
        [6],
        [4, 10, 13],
        [9],
        [5, 12],
        [11],
        [1, 2, 9],
      ],
      labels: [
        ["Living 1"],
        ["Living 2", "Kitchen", "Hall 1", "Hall 2", "Terrace"],
        ["Living 1", "Kitchen", "Hall 1", "Terrace"],
        ["Living 1", "Living 2", "Hall 2"],
        ["Living 1", "Living 2", "Kitchen", "Bedroom 1"],
        ["Living 2", "Kitchen", "Master Bedroom", "Bedroom 2"],
        ["Hall 2", "Master Bedroom", "Master Bathroom"],
        ["Bedroom Hall"],
        ["Bedroom Hall"],
        ["Hall 1", "Bathroom 1", "Terrace"],
        ["Bedroom 1"],
        ["Hall 2", "Bathroom 2"],
        ["Bedroom 2"],
        ["Living 1", "Living 2", "Bedroom 1"],
      ],
      locationpoints: [
        [0.47, 0.43],
        [0.57, 0.43],
        [0.62, 0.43],
        [0.59, 0.37],
        [0.54, 0.43],
        [0.62, 0.36],
        [0.65, 0.31],
        [0.68, 0.47],
        [0.68, 0.34],
        [0.52, 0.52],
        [0.46, 0.51],
        [0.58, 0.27],
        [0.54, 0.3],
        [0.57, 0.61],
      ],
    },
    "3BR_N2_B": {
      folder: "3_BR",
      image: "./FP/3BR_B.jpg",
      imageMap: "./FP/map/3BR_B_.png",
      title: "3 Bedroom Level 2 B",
      flips: [
        "LO_F.png",
        "LI_01.png",
        "LI_02.png",
        "KI.png",
        "PA_01.png",
        "PA_02.png",
        "BR_M_V.png",
        "BR_M.png",
        "BA_M.png",
        "BR_01.png",
        "BA_01.png",
        "BR_02.png",
        "BA_02.png",
        "T_02_F.png",
      ],
      spaces: [
        "Lobby",
        "Living 1",
        "Living 2",
        "Kitchen",
        "Hall 1",
        "Hall 2",
        "Bedroom Hall",
        "Master Bedroom",
        "Master Bathroom",
        "Bedroom 1",
        "Bathroom 1",
        "Bedroom 2",
        "Bathroom 2",
        "Terrace",
      ],
      hotspots: [
        [[4.7, 0, -8]],
        [
          [-3, 0, -8],
          [4.7, 0, -7.0],
          [8.6, 0, 1.6],
          [2.6, 0, -11.0],
          [-5.8, 0, 5.6],
        ],
        [
          [-2.2, 0, 7.2],
          [5.8, 0, 4.8],
          [0, 0, 9.8],
          [-9.4, 0, 2.2],
        ],
        [
          [2.2, 0, 8.4],
          [-3, 0, 8.5],
          [-7, 0, 0],
        ],
        [
          [5.4, 0, -5.8],
          [9.2, 0, -1.0],
          [5, 0, 6.8],
          [-8, 0, -1.2],
        ],
        [
          [12, 0, -2.4],
          [2, 0, -7.6],
          [-7.6, 0, 2.15],
          [-8.0, 0, 0.15],
        ],
        [
          [5.2, 0, 7.2],
          [-8.6, 0, -0.6],
          [-3.6, 0, -6.2],
        ],
        [[-2.6, 0, 8.4]],
        [[7.2, 0, -1.1]],
        [
          [6.8, 0, -1.4],
          [4.4, 0, 8],
          [-6, 0, 8.15],
        ],
        [[-7.2, 0, -3.6]],
        [
          [-10, 0, -0.5],
          [2.1, 0, 8.5],
        ],
        [[0.8, 0, -8.6]],
        [
          [-9, 0, -1],
          [-7.6, 0, -2.6],
          [1.2, 0, -9.2],
        ],
      ],
      hotspotIndexTargets: [
        [1],
        [2, 3, 4, 5, 13],
        [1, 3, 4, 13],
        [1, 2, 5],
        [1, 2, 3, 9],
        [2, 3, 6, 11],
        [5, 7, 8],
        [6],
        [6],
        [4, 10, 13],
        [9],
        [5, 12],
        [11],
        [1, 2, 9],
      ],
      labels: [
        ["Living 1"],
        ["Living 2", "Kitchen", "Hall 1", "Hall 2", "Terrace"],
        ["Living 1", "Kitchen", "Hall 1", "Terrace"],
        ["Living 1", "Living 2", "Hall 2"],
        ["Living 1", "Living 2", "Kitchen", "Bedroom 1"],
        ["Living 2", "Kitchen", "Master Bedroom", "Bedroom 2"],
        ["Hall 2", "Master Bedroom", "Master Bathroom"],
        ["Bedroom Hall"],
        ["Bedroom Hall"],
        ["Hall 1", "Bathroom 1", "Terrace"],
        ["Bedroom 1"],
        ["Hall 2", "Bathroom 2"],
        ["Bedroom 2"],
        ["Living 1", "Living 2", "Bedroom 1"],
      ],
      locationpoints: [
        [0.54, 0.43],
        [0.44, 0.43],
        [0.39, 0.43],
        [0.42, 0.37],
        [0.47, 0.43],
        [0.38, 0.36],
        [0.36, 0.31],
        [0.33, 0.47],
        [0.33, 0.34],
        [0.49, 0.52],
        [0.55, 0.51],
        [0.42, 0.27],
        [0.47, 0.3],
        [0.44, 0.61],
      ],
    },
    "4BR_A": {
      folder: "4_BR",
      image: "./FP/4BR_A.jpg",
      imageMap: "./FP/map/4BR_A_.png",
      title: "4 Bedroom Apartment A",
      flips: [
        "LO.png",
        "LI.png",
        "KI.png",
        "T_01.png",
        "HA_01.png",
        "BR_M.png",
        "BR_M_V.png",
        "BA_M.png",
        "BR_02.png",
        "BA_02.png",
        "BR_02_V.png",
        "BR_03.png",
        "BA_03.png",
        "TV.png",
        "BR_04.png",
        "BA_04.png",
      ],
      spaces: [
        "Lobby",
        "Living",
        "Kitchen",
        "Terrace",
        "Hall",
        "Master Bedroom",
        "Walk-in closet",
        "Master Bathroom",
        "Bedroom 2",
        "Bathroom 2",
        "Walk-in closet",
        "Bedroom 3",
        "Bathroom 3",
        "Family room",
        "Bedroom 4",
        "Bathroom 4",
      ],
      hotspots: [
        [
          [-7.4, 0, -2.15],
          [4.2, 0, -10],
        ],
        [
          [9, 0, 0.75],
          [-11, 0, -0.8],
          [1.6, 0, -10.8],
        ],
        [
          [11, 0, 1.35],
          [6.8, 0, 0],
          [3.35, 0, -8.4],
        ],
        [
          [3.9, 0, 7.8],
          [-7, 0, 3.55],
        ],
        [
          [6.8, 0, -1],
          [-9.4, 0, 1.9],
          [-12, 0, 1.6],
          [-12, 0, -0.2],
          [-11, 0, -0.8],
          [-8, 0, -1.3],
        ],
        [
          [2.8, 0, -5.8],
          [4.2, 0, 5.2],
        ],
        [
          [3.2, 0, -6.2],
          [-5.4, 0, 5.4],
        ],
        [[1, 0, -7.2]],
        [
          [5, 0, -5],
          [-5.4, 0, -6.8],
        ],
        [[6.8, 0, -1.9]],
        [
          [0.4, 0, 7.8],
          [-8.2, 0, -0.7],
        ],
        [
          [6, 0, 4.6],
          [0.4, 0, 7],
        ],
        [[1.5, 0, 6.2]],
        [[8.2, 0, -0.6]],
        [
          [7.2, 0, -4],
          [5, 0, -6.2],
        ],
        [[0.6, 0, -6.6]],
      ],
      hotspotIndexTargets: [
        [1, 4],
        [0, 2, 3],
        [0, 1, 3],
        [1, 2],
        [0, 5, 8, 11, 13, 14],
        [4, 6],
        [5, 7],
        [6],
        [4, 10],
        [10],
        [8, 9],
        [4, 12],
        [11],
        [4],
        [4, 15],
        [14],
      ],
      labels: [
        ["Living", "Hall"],
        ["Lobby", "Kitchen", "Terrace"],
        ["Lobby", "Living", "Terrace"],
        ["Living", "Kitchen"],
        [
          "Lobby",
          "Master Bedroom",
          "Bedroom 2",
          "Bedroom 3",
          "Family room",
          "Bedroom 4",
        ],
        ["Hall", "Walk-in closet"],
        ["Master Bedroom", "Master Bathroom"],
        ["Walk-in closet"],
        ["Hall", "Walk-in closet"],
        ["Walk-in closet"],
        ["Bedroom 2", "Bathroom 2"],
        ["Hall", "Bathroom 3"],
        ["Bedroom 3"],
        ["Hall"],
        ["Hall", "Bathroom 4"],
        ["Bedroom 4"],
      ],
      locationpoints: [
        [0.46, 0.4],
        [0.53, 0.4],
        [0.65, 0.43],
        [0.57, 0.6],
        [0.41, 0.52],
        [0.34, 0.6],
        [0.39, 0.6],
        [0.42, 0.62],
        [0.29, 0.6],
        [0.25, 0.64],
        [0.25, 0.57],
        [0.28, 0.39],
        [0.27, 0.46],
        [0.34, 0.4],
        [0.4, 0.39],
        [0.41, 0.46],
      ],
    },
    "4BR_B": {
      folder: "4_BR",
      image: "./FP/4BR_B.jpg",
      imageMap: "./FP/map/4BR_B_.png",
      title: "4 Bedroom Apartment B",
      flips: [
        "LO_F.png",
        "LI.png",
        "KI.png",
        "T_01_F.png",
        "HA_01.png",
        "BR_M.png",
        "BR_M_V.png",
        "BA_M.png",
        "BR_02.png",
        "BA_02.png",
        "BR_02_V.png",
        "BR_03.png",
        "BA_03.png",
        "TV.png",
        "BR_04.png",
        "BA_04.png",
      ],
      spaces: [
        "Lobby",
        "Living",
        "Kitchen",
        "Terrace",
        "Hall",
        "Master Bedroom",
        "Walk-in closet",
        "Master Bathroom",
        "Bedroom 2",
        "Bathroom 2",
        "Walk-in closet",
        "Bedroom 3",
        "Bathroom 3",
        "Family room",
        "Bedroom 4",
        "Bathroom 4",
      ],
      hotspots: [
        [
          [6.4, 0, -0.65],
          [-2.2, 0, -10],
        ],
        [
          [9, 0, -0.75],
          [-11, 0, 0.8],
          [1.6, 0, 10.8],
        ],
        [
          [11, 0, -1.35],
          [6.8, 0, 0],
          [3.35, 0, 8.4],
        ],
        [
          [-5.3, 0, 6.4],
          [1.3, 0, 7.8],
        ],
        [
          [6.8, 0, 1],
          [-9.4, 0, -1.9],
          [-12, 0, -1.6],
          [-12, 0, 0.2],
          [-11, 0, 0.8],
          [-8, 0, 1.3],
        ],
        [
          [2.8, 0, 5.8],
          [4.2, 0, -5.2],
        ],
        [
          [3.2, 0, 6.2],
          [-5.4, 0, -5.4],
        ],
        [[1, 0, 7.2]],
        [
          [5, 0, 5],
          [-5.4, 0, 6.8],
        ],
        [[6.8, 0, 1.9]],
        [
          [0.4, 0, -7.8],
          [-8.2, 0, 0.7],
        ],
        [
          [6, 0, -4.6],
          [0.4, 0, -7],
        ],
        [[1.5, 0, -6.2]],
        [[8.2, 0, 0.6]],
        [
          [7.2, 0, 4],
          [5, 0, 6.2],
        ],
        [[0.6, 0, 6.6]],
      ],
      hotspotIndexTargets: [
        [1, 4],
        [0, 2, 3],
        [0, 1, 3],
        [1, 2],
        [0, 5, 8, 11, 13, 14],
        [4, 6],
        [5, 7],
        [6],
        [4, 10],
        [10],
        [8, 9],
        [4, 12],
        [11],
        [4],
        [4, 15],
        [14],
      ],
      labels: [
        ["Living", "Hall"],
        ["Lobby", "Kitchen", "Terrace"],
        ["Lobby", "Living", "Terrace"],
        ["Living", "Kitchen"],
        [
          "Lobby",
          "Master Bedroom",
          "Bedroom 2",
          "Bedroom 3",
          "Family room",
          "Bedroom 4",
        ],
        ["Hall", "Walk-in closet"],
        ["Master Bedroom", "Master Bathroom"],
        ["Walk-in closet"],
        ["Hall", "Walk-in closet"],
        ["Walk-in closet"],
        ["Bedroom 2", "Bathroom 2"],
        ["Hall", "Bathroom 3"],
        ["Bedroom 3"],
        ["Hall"],
        ["Hall", "Bathroom 4"],
        ["Bedroom 4"],
      ],
      locationpoints: [
        [0.56, 0.4],
        [0.49, 0.4],
        [0.37, 0.43],
        [0.45, 0.6],
        [0.61, 0.52],
        [0.68, 0.6],
        [0.63, 0.6],
        [0.6, 0.62],
        [0.73, 0.6],
        [0.77, 0.64],
        [0.77, 0.57],
        [0.74, 0.39],
        [0.75, 0.46],
        [0.68, 0.4],
        [0.62, 0.39],
        [0.61, 0.46],
      ],
    },
    CA_01: {
      folder: "C_01",
      image: "./FP/C_A2.jpg",
      imageMap: "./FP/map/C_A2_.png",
      title: "The Casita A2",
      flips: [
        "T_02.png",
        "T_01.png",
        "T_03.png",
        "LI.png",
        "KI.png",
        "T_04.png",
        "BR_02.png",
        "BR_02_V.png",
        "BA_02.png",
        "BR_01.png",
        "BA_01.png",
        "TV.png",
        "BR_M.png",
        "BA_M.png",
      ],
      spaces: [
        "Entrance",
        "Terrace 1",
        "Terrace 2",
        "Living",
        "Kitchen",
        "Terrace 3",
        "Bedroom 3",
        "Bedroom 3 Hall",
        "Bathroom 3",
        "Bedroom 2",
        "Bathroom 2",
        "Master Bedroom Salon",
        "Master Bedroom",
        "Master Bathroom",
      ],
      hotspots: [
        [
          [2.2, 0, -8.8],
          [7.4, 0, -4.4],
          [-4.8, 0, -6],
        ],
        [
          [6.6, 0, -6.6],
          [-9.4, 0, -6.2],
          [-2.7, 0, -7.2],
          [9.2, 0, -2.2],
        ],
        [
          [-5.8, 0, -8.2],
          [-7.6, 0, -4.45],
          [-6, 0, 4],
        ],
        [
          [-0.2, 0, -8.2],
          [7.6, 0, -2.4],
          [-2.2, 0, 8.4],
          [-9.6, 0, 3.6],
        ],
        [
          [10, 0, -6.2],
          [5.6, 0, 8.2],
          [5.4, 0, -5.4],
        ],
        [
          [-6.4, 0, 4.2],
          [3.4, 0, 6.2],
          [-8, 0, -4.4],
          [-2.2, 0, -8.2],
          [8.2, 0, -3.4],
        ],
        [
          [2.4, 0, -6.4],
          [-5.6, 0, -7],
        ],
        [
          [2.5, 0, 6.8],
          [-7, 0, 1.8],
        ],
        [[0, 0, 7.6]],
        [
          [-7.4, 0, 4.5],
          [-3.5, 0, 8.2],
        ],
        [[5.6, 0, 5.2]],
        [
          [-8.8, 0, -0.4],
          [6.4, 0, 2.8],
          [8.4, 0, -2.8],
        ],
        [[-5.6, 0, 6.0]],
        [[-2.2, 0, -7.8]],
      ],
      hotspotIndexTargets: [
        [1, 3, 5],
        [0, 2, 3, 5],
        [1, 3, 4],
        [0, 1, 2, 4],
        [1, 2, 3],
        [0, 1, 6, 9, 11],
        [5, 7],
        [6, 8],
        [7],
        [5, 10],
        [9],
        [5, 12, 13],
        [11],
        [11],
      ],
      labels: [
        ["Terrace 1", "Living", "Terrace 3"],
        ["Entrance", "Terrace 2", "Living", "Terrace 3"],
        ["Terrace 1", "Living", "Kitchen"],
        ["Entrance", "Terrace 1", "Terrace 2", "Kitchen"],
        ["Terrace 1", "Terrace 2", "Living"],
        ["Entrance", "Terrace 1", "Bedroom 3", "Bedroom 2", "Master Bedroom"],
        ["Terrace 3", "Bedroom 3 Hall"],
        ["Bedroom 3", "Bathroom 3"],
        ["Bedroom 3 Hall"],
        ["Terrace 3", "Bathroom 2"],
        ["Bedroom 2"],
        ["Terrace 3", "Master Bedroom", "Master Bathroom"],
        ["Master Bedroom Salon"],
        ["Master Bedroom Salon"],
      ],
      locationpoints: [
        [0.58, 0.34],
        [0.55, 0.49],
        [0.42, 0.49],
        [0.49, 0.37],
        [0.4, 0.37],
        [0.64, 0.44],
        [0.65, 0.27],
        [0.73, 0.31],
        [0.73, 0.24],
        [0.71, 0.43],
        [0.71, 0.51],
        [0.65, 0.62],
        [0.65, 0.74],
        [0.72, 0.72],
      ],
    },
  };

  return (
    <>
      <Leva hidden />
      {/* {!showRecorrido360 ? ( */}
      {!transitionHomepage ? (
        <>
          {/* <HomePage onTourClick={handleTourClick} /> */}
          <HomePage />
        </>
      ) : showRecorrido360 ? (
        <>
          <UI360
            onReturnClick={handleReturnFrom360}
            imageMap={
              returnToMesh && tourMappings[returnToMesh]
                ? tourMappings[returnToMesh].imageMap
                : undefined
            }
            locationpoints={
              returnToMesh && tourMappings[returnToMesh]
                ? tourMappings[returnToMesh].locationpoints
                : undefined
            }
            spaces={
              returnToMesh && tourMappings[returnToMesh]
                ? tourMappings[returnToMesh].spaces
                : undefined
            }
          />
          <div
            className="fixed inset-0 w-screen h-screen overflow-hidden"
            style={{ backgroundColor: "#2E3641" }}
          >
            <Recorrido360
              tourFlips={
                returnToMesh && tourMappings[returnToMesh]
                  ? tourMappings[returnToMesh].flips
                  : undefined
              }
              hotspots={
                returnToMesh && tourMappings[returnToMesh]
                  ? tourMappings[returnToMesh].hotspots
                  : undefined
              }
              hotspotIndexTargets={
                returnToMesh && tourMappings[returnToMesh]
                  ? tourMappings[returnToMesh].hotspotIndexTargets
                  : undefined
              }
              labels={
                returnToMesh && tourMappings[returnToMesh]
                  ? tourMappings[returnToMesh].labels
                  : undefined
              }
              folder={
                returnToMesh && tourMappings[returnToMesh]
                  ? tourMappings[returnToMesh].folder
                  : undefined
              }
              shouldFlipTextures={
                returnToMesh ? flippedTourIds.includes(returnToMesh) : false
              }
            />
          </div>
          <Overlay360
            panelImage={
              returnToMesh && tourMappings[returnToMesh]
                ? tourMappings[returnToMesh].image
                : undefined
            }
            panelTitle={
              returnToMesh && tourMappings[returnToMesh]
                ? tourMappings[returnToMesh].title
                : undefined
            }
          />
        </>
      ) : (
        <>
          {/* <LoadingScreen onLoadingChange={setIsLoading} /> */}

          {/* <UI
            currentScreen={currentScreen}
            onScreenChange={setTargetScreen}
            isAnimating={currentScreen !== targetScreen}
          /> */}
          <UI />
          <div
            className="fixed inset-0 w-screen h-screen overflow-hidden"
            style={{ backgroundColor: "#2E3641" }}
          >
            <Canvas
              dpr={[1, 2]}
              gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                outputColorSpace: THREE.SRGBColorSpace,
              }}
              camera={{
                fov: 45,
                near: 1,
                far: 1200,
                // position: [75, 75, 150],
                position: [
                  94.88715402309754, 111.6694578807425, 202.37511175736282,
                ],
                target: [
                  2.9744458895296013, -21.885757328439343, 12.500057387505853,
                ],
              }}
              shadows={{
                enabled: true,
                type: "VSMShadowMap",
              }}

              // camera={{ position: [5, 5, 10], fov: 30, near: 1 }}
              // gl={{
              //   preserveDrawingBuffer: true,
              // }}
              // shadows
            >
              {/* <color attach="background" args={[backgroundColor]} /> */}
              {/* <fog attach="fog" args={[backgroundColor, 5, 12]} /> */}

              <color attach="background" args={["#2E3641"]} />
              <LoadingGate />

              <ScreenTransition transition={transition} color="#2E3641" />

              {/* <OrbitControls /> */}
              {/* <CameraControls ref={controls} />
            <SoftShadows /> */}

              {/* <SheetProvider sheet={mainSheet}> */}
              {/* <e.fog theatreKey="Fog" attach="fog" args={["#cc7b32", 3, 5]} /> */}
              {/* <PerspectiveCamera
              position={[5, 5, 10]}
              fov={30}
              near={1}
              makeDefault
              theatreKey="Camera"
              lookAt={cameraTargetRef}
            /> */}
              {/* <e.mesh
                theatreKey="Camera Target"
                visible="editor"
                ref={cameraTargetRef}
              >
                <octahedronBufferGeometry args={[0.1, 0]} />
                <meshPhongMaterial color="yellow" />
              </e.mesh> */}

              <Suspense fallback={null}>
                <Experience />
              </Suspense>

              {/* </SheetProvider> */}
            </Canvas>

            {/* <Interface360 onReturnClick={handleReturnClick} /> */}

            {/* {!isLoading && (
            <>
              <Interface360 onReturnClick={handleReturnClick} />
            </>
          )} */}

            {/* <Canvas camera={{ position: [0, 1.8, 5], fov: 42 }}>
          <color attach="background" args={[backgroundColor]} />
          <fog attach="fog" args={[backgroundColor, 5, 12]} />
          <ScreenTransition transition={transition} color="#a5b4fc" />
          <Suspense>
            <Experience />
          </Suspense>
        </Canvas> */}
          </div>
          <Overlay />
        </>
      )}
    </>
  );
}

export default App;
