import { useFBX, useAnimations } from "@react-three/drei";
import { MutableRefObject } from "react";

type AnimationData = {
  filePath: string;
  name: string;
};

export function useAnimationsLoader(
  animationsData: AnimationData[],
  groupRef: MutableRefObject<any>
) {
  const animations = animationsData.map((data) => {
    const { animations: loadedAnimations } = useFBX(data.filePath);
    loadedAnimations[0].name = data.name;
    return loadedAnimations[0];
  });

  const { actions } = useAnimations(animations, groupRef);

  return { animations, actions };
}
