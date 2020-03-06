import React from "react";
import { RepeatWrapping, sRGBEncoding } from "three";
import { useLoader } from "react-three-fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

const Ground = props => {
  const groundTexture = useLoader(
    TextureLoader,
    "./assets/textures/grasslight-big.jpg"
  );

  groundTexture.wrapS = groundTexture.wrapT = RepeatWrapping;
  groundTexture.repeat.set(40, 40);
  groundTexture.anisotropy = 16;
  groundTexture.encoding = sRGBEncoding;

  return (
    <mesh
      position={[0, 0, 0]}
      rotation-x={-Math.PI / 2}
      name="Ground"
      receiveShadow
    >
      <planeBufferGeometry attach="geometry" args={[200, 200]} />
      <meshPhysicalMaterial attach="material" map={groundTexture} />
    </mesh>
  );
};

export default Ground;
