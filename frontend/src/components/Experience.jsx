import { Environment, OrbitControls, useEnvironment } from "@react-three/drei";
import { Avatar } from "./Avatar";

export const Experience = () => {
  const envMap = useEnvironment({
    files: "./textures/little_paris_under_tower_8k.hdr",
  });

  return (
    <>
      <OrbitControls enableZoom={false} target={[-15, -2, 0]} />
      <Avatar
        position={[-15, -12, 0]}
        scale={7}
        rotation={[0, Math.PI / 3.1, 0]}
      />
      <Environment preset="sunset" background map={envMap} />
    </>
  );
};
