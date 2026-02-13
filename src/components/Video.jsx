import {
  ContactShadows,
  Environment,
  Hud,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  useTexture,
  useVideoTexture,
} from "@react-three/drei";

import { useThree } from "@react-three/fiber";

export const VideoIntro = ({ color }) => {
  const { viewport } = useThree(); // respeta el tamaño del <View />

  const videoIntro = useVideoTexture("./videos/01.mp4");
  const textureIntro = useTexture("./Images/01.png");

  return (
    <>
      {/* <OrbitControls /> */}
      {/* <PerspectiveCamera position={[0, 0, 1.5]} fov={30} makeDefault /> */}
      {/* <Hud> */}
      <OrthographicCamera
        makeDefault
        position={[0, 0, 1]}
        left={-viewport.width / 2}
        right={viewport.width / 2}
        top={viewport.height / 2}
        bottom={-viewport.height / 2}
        near={0.1}
        far={10}
      />

      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        {/* <meshBasicMaterial color={color} /> */}
        <meshBasicMaterial map={textureIntro} />
      </mesh>
      {/* </Hud> */}

      {/* <color attach="background" args={["#ffffff"]} />
      <fog attach="fog" args={["#ffffff", 5, 25]} />
      <Environment preset="sunset" />
      <ContactShadows position-y={-0.1} /> */}
    </>
  );
};
