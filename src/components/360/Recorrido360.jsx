import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  useTexture,
  useProgress,
} from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useTourCustomization } from "../../contexts/CustomizationContextTour.jsx";

import { useAtom } from "jotai";
import {
  transitionAtom,
  currentTourSceneIndexAtom,
  tourGotoSceneIndexAtom,
} from "../UI.jsx";
import { ScreenTransition } from "../ScreenTransition.jsx";

function LoadingGate360() {
  const [, setTransition] = useAtom(transitionAtom);
  const { active, progress } = useProgress();
  const last = useRef(null);

  useEffect(() => {
    const shouldBeOn = active || progress < 100;

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

// function Panorama({ textureUrl, opacity }) {
function Panorama({ textureUrl, opacity, shouldFlipTextures }) {
  const texture = useTexture(textureUrl);

  // Asegurar que las texturas JPG se traten como sRGB
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  useEffect(() => {
    if (!texture) {
      return;
    }

    if (shouldFlipTextures) {
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = -1;
      texture.offset.x = 1;
    } else {
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.repeat.x = 1;
      texture.offset.x = 0;
    }

    texture.needsUpdate = true;
  }, [texture, shouldFlipTextures]);

  return (
    <a.mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <a.meshBasicMaterial
        map={texture}
        side={2}
        transparent
        opacity={opacity}
      />
    </a.mesh>
  );
}

function Hotspot({ position, label, onClick }) {
  const [hovered, setHovered] = useState(false);

  const groupRef = useRef();
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
  });

  return (
    <>
      <group position={position} ref={groupRef}>
        {/* <mesh onClick={onClick}>
        <sphereGeometry args={[3, 16, 16]} />
        <meshBasicMaterial color="orange" />
      </mesh> */}

        <Html transform position={[0, 0, 0]}>
          <button
            // className={isInViewMode ? "circle-button-views" : "circle-button"}

            className="circle-button-360"
            onClick={onClick}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
          />
        </Html>
      </group>

      {hovered && (
        <Html
          transform={false}
          position={[position[0] + 0.05, position[1] + 0.1, position[2]]}
        >
          <div className="tooltip-3d">{label}</div>
        </Html>
      )}
    </>
  );
}

// 🔍 Este componente anima el zoom real del lente (FOV)
// function AnimatedCamera({ isTransitioning }) {

function AnimatedCamera({ isTransitioning, zoomOffset = 0 }) {
  /////

  const { camera } = useThree();
  const { fov } = useSpring({
    // from: { fov: 75 },
    from: { fov: 50 },
    // to: { fov: isTransitioning ? 60 : 75 },
    to: { fov: isTransitioning ? 40 : 50 },
    config: { tension: 80, friction: 20 },
  });

  useFrame(() => {
    // camera.fov = fov.get();

    camera.fov = fov.get() + zoomOffset; ////////

    camera.updateProjectionMatrix();
  });

  return null;
}

function ZoomLinkedFov({
  controlsRef,
  minDistance,
  maxDistance,
  onOffsetChange,
}) {
  ///////
  const lastOffset = useRef(0);

  useFrame(() => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    const distance = controls.object.position.distanceTo(controls.target);
    const normalized = THREE.MathUtils.clamp(
      (distance - minDistance) / (maxDistance - minDistance),
      0,
      1,
    );

    // const offset = normalized * 20 - 10; // Map zoom range to [-10, 10]
    const offset = normalized * 10; // Map zoom range to [0, 10]

    if (Math.abs(offset - lastOffset.current) > 0.05) {
      lastOffset.current = offset;
      onOffsetChange(offset);
    }
  });

  return null;
} ////////////

// Construye escenas dinámicas a partir de la lista de flips y la configuración de hotspots / targets / labels / folder
function buildScenesFromConfig(
  flips,
  hotspotsConfig,
  hotspotIndexTargets,
  labelsConfig,
  folder,
) {
  if (!Array.isArray(flips) || flips.length === 0) return null;

  const sceneNames = flips.map((flip) => flip.replace(/\.jpg$/i, ""));
  const scenes = {};

  const total = sceneNames.length;

  sceneNames.forEach((name, index) => {
    const textureFile = flips[index]; // p.ej. "B2_FLIP.jpg"

    // const nextIndex1 = (index + 1) % sceneNames.length;
    // const nextIndex2 = (index + 2) % sceneNames.length;

    // Lista de posiciones para esta escena (una por hotspot)
    const positionsForScene =
      Array.isArray(hotspotsConfig) && Array.isArray(hotspotsConfig[index])
        ? hotspotsConfig[index]
        : [
            [50, 0, -100],
            [250, 0, -100],
          ];

    // Lista de índices de destino para esta escena (uno por hotspot)
    const indexTargetsForScene =
      Array.isArray(hotspotIndexTargets) &&
      Array.isArray(hotspotIndexTargets[index])
        ? hotspotIndexTargets[index]
        : positionsForScene.map((_, i) => (index + i + 1) % total);

    // Lista de labels para esta escena (uno por hotspot)
    const labelsForScene =
      Array.isArray(labelsConfig) && Array.isArray(labelsConfig[index])
        ? labelsConfig[index]
        : positionsForScene.map(() => "next room");

    const hotspots = positionsForScene.map((pos, i) => {
      const rawIndexTarget = indexTargetsForScene[i];
      // Usamos directamente el índice tal como viene en hotspotIndexTargets
      const targetIdx =
        typeof rawIndexTarget === "number" ? rawIndexTarget : index + i + 1;

      return {
        position: pos || [50, 0, -100],
        label: labelsForScene[i] || "next room",
        target: sceneNames[targetIdx],
      };
    });

    scenes[name] = {
      texture: folder
        ? `./360/${folder}/${textureFile}`
        : `./360/${textureFile}`,

      hotspots,
    };
  });

  return { scenes, initialScene: sceneNames[0] };
}

// export default function Recorrido360() {

//   const [scene, setScene] = useState("lobby")
//   const [nextScene, setNextScene] = useState(null)
//   const [isTransitioning, setIsTransitioning] = useState(false)

// export default function Recorrido360({ tourFlips }) {

// export default function Recorrido360({ tourFlips, hotspots, hotspotIndexTargets, labels, folder }) {

export default function Recorrido360({
  tourFlips,
  hotspots,
  hotspotIndexTargets,
  labels,
  folder,
  shouldFlipTextures = false,
}) {
  const { isModalPanelActive } = useTourCustomization();
  const [transition] = useAtom(transitionAtom);
  const [, setCurrentTourSceneIndex] = useAtom(currentTourSceneIndexAtom);
  const [tourGotoSceneIndex, setTourGotoSceneIndex] = useAtom(
    tourGotoSceneIndexAtom,
  );

  const controlsRef = useRef(null); ///////
  const [zoomFovOffset, setZoomFovOffset] = useState(0);
  const minZoomDistance = 0.05;
  const maxZoomDistance = 0.3; //////

  // const scenes = {

  // Escenas fijas de ejemplo (fallback si no se reciben flips por props)
  const staticScenes = {
    lobby: {
      texture: "./360/PANO1_L1.png",
      hotspots: [
        { position: [50, 0, -100], label: "Ir a Room 1", target: "room1" },
        { position: [250, 0, -100], label: "Ir a Room 2", target: "room2" },
      ],
    },
    room1: {
      texture: "./360/PANO2_L1.png",
      hotspots: [
        { position: [-60, 10, 80], label: "Volver al Lobby", target: "lobby" },
        { position: [-260, 10, 80], label: "Ir a Room 2", target: "room2" },
      ],
    },
    room2: {
      texture: "./360/PANO3_L1.png",
      hotspots: [
        { position: [-60, 10, 80], label: "Volver al Lobby", target: "lobby" },
        { position: [-260, 10, 80], label: "Ir a Room 1", target: "room1" },
      ],
    },
  };

  //////

  const dynamicConfig = useMemo(
    // () => buildScenesFromFlips(tourFlips),
    // [tourFlips]

    () =>
      buildScenesFromConfig(
        tourFlips,
        hotspots,
        hotspotIndexTargets,
        labels,
        folder,
      ),
    [tourFlips, hotspots, hotspotIndexTargets, labels, folder],
  );

  const useDynamicScenes = !!dynamicConfig;

  const [scene, setScene] = useState(
    useDynamicScenes ? dynamicConfig.initialScene : "lobby",
  );
  const [nextScene, setNextScene] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const scenes = useDynamicScenes ? dynamicConfig.scenes : staticScenes;

  ////////

  const current = scenes[scene];
  const next = nextScene ? scenes[nextScene] : null;

  // 🌫️ animación de opacidad (fade)
  const { opacity } = useSpring({
    from: { opacity: 1 },
    to: { opacity: isTransitioning ? 0.6 : 1 },
    config: { duration: 800 },
    onRest: () => {
      if (isTransitioning && nextScene) {
        setScene(nextScene);
        setNextScene(null);
        setIsTransitioning(false);
      }
    },
  });

  const handleSceneChange = (target) => {
    if (target !== scene && !isTransitioning) {
      setNextScene(target);
      setIsTransitioning(true);
    }
  };

  // Al cambiar de vista (escena), volver la cámara a la posición inicial
  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.reset();
    setZoomFovOffset(0);
  }, [scene]);

  // Exponer el índice de la escena actual (flip) para el mapa en UI360
  useEffect(() => {
    const sceneNames = Object.keys(scenes);
    const index = sceneNames.indexOf(scene);
    setCurrentTourSceneIndex(index >= 0 ? index : null);
    return () => setCurrentTourSceneIndex(null);
  }, [scene, scenes, setCurrentTourSceneIndex]);

  // Navegar a un índice de flip cuando se hace click en un locationpoint del mapa (igual que hotspots)
  useEffect(() => {
    if (tourGotoSceneIndex == null || isTransitioning) return;
    const sceneNames = Object.keys(scenes);
    const targetName = sceneNames[tourGotoSceneIndex];
    if (targetName != null && targetName !== scene)
      handleSceneChange(targetName);
    setTourGotoSceneIndex(null);
  }, [
    tourGotoSceneIndex,
    scenes,
    scene,
    isTransitioning,
    setTourGotoSceneIndex,
    handleSceneChange,
  ]);

  // const handleAnnotationClick = (imageName, annotationName) => {
  //   //Dispatch custom event with image and annotation information
  //   window.dispatchEvent(new CustomEvent('annotation-click', {
  //     detail: {
  //       image: imageName,
  //       annotation: annotationName
  //     }
  //   }));
  // }

  return (
    <>
      <Canvas
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        // camera={{ fov: 75, position: [0, 0, 0.1] }}
        camera={{ fov: 45, position: [0, 0, 0.1] }}
      >
        <color attach="background" args={["#2E3641"]} />
        <LoadingGate360 />

        <Suspense fallback={null}>
          {/* Panorama actual */}
          {/* <Panorama textureUrl={current.texture} opacity={opacity} /> */}
          <Panorama
            textureUrl={current.texture}
            opacity={opacity}
            shouldFlipTextures={shouldFlipTextures}
          />

          {/* Hotspots (ocultos si el modal del 360 está activo o si hay transición de vuelta al 3d) */}
          {!isTransitioning &&
            !isModalPanelActive &&
            !transition &&
            current.hotspots.map((h, i) => (
              <Hotspot
                key={i}
                position={h.position}
                label={h.label}
                onClick={() => handleSceneChange(h.target)}
              />
            ))}

          {/* 🔍 Zoom animado */}
          {/* <AnimatedCamera isTransitioning={isTransitioning} /> */}

          <AnimatedCamera
            isTransitioning={isTransitioning}
            zoomOffset={zoomFovOffset}
          />
        </Suspense>

        <ZoomLinkedFov
          controlsRef={controlsRef}
          minDistance={minZoomDistance}
          maxDistance={maxZoomDistance}
          onOffsetChange={setZoomFovOffset}
        />

        <OrbitControls
          ref={controlsRef}
          enableZoom
          zoomSpeed={0.8}
          // minDistance={0.05}
          // maxDistance={0.3}

          minDistance={minZoomDistance}
          maxDistance={maxZoomDistance}
          enablePan={false}
          rotateSpeed={-0.2}
        />
        <ScreenTransition transition={transition} color="#2E3641" />
      </Canvas>
    </>
  );
}
