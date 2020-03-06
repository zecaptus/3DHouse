import React from "react";
import { createSquare } from "../utils/shape";
import useGui from "../hooks/Gui";

const Window = props => {
  const { debug, x, y, width, height, nbMirrors, ...restProps } = props;

  const { ouverture } = useGui(
    "Window",
    {
      ouverture: { value: 0, args: [0, 1, 0.01] }
    },
    debug
  );
  const shape = createSquare(x, y, width, height + 0.2);
  const volet = createSquare(
    x,
    y + height - height * ouverture,
    width,
    height * ouverture + 0.2
  );

  const mirrorWidth = (width - (2 * 0.08 + (nbMirrors - 1) * 0.06)) / nbMirrors;
  const mirrorHeight = height - 0.16;

  const mirrors = Array.from({ length: nbMirrors }, (_, i) =>
    createSquare(
      x + 0.08 + (mirrorWidth + 0.06) * i,
      y + 0.08,
      mirrorWidth,
      mirrorHeight
    )
  );

  shape.holes.push(...mirrors);

  return (
    <group {...restProps} name="Window">
      <mesh receiveShadow castShadow position={[0, 0, 0.1]}>
        <shapeBufferGeometry attach="geometry" args={[shape]} />
        <meshPhysicalMaterial
          attach="material"
          color={0x333346}
          side={0}
          metalness={1}
        />
      </mesh>
      <mesh receiveShadow castShadow position={[0, 0, 0.1]}>
        <shapeBufferGeometry attach="geometry" args={[shape]} />
        <meshPhysicalMaterial attach="material" color={0xffffff} side={1} />
      </mesh>

      <mesh receiveShadow castShadow position={[0, 0, 0.12]} name="volet">
        <shapeBufferGeometry attach="geometry" args={[volet]} />
        <meshPhysicalMaterial
          attach="material"
          color={0x333346}
          side={2}
          metalness={1}
        />
      </mesh>
      {mirrors.map((mirror, i) => (
        <mesh key={`mirror_${i}`} position={[0, 0, 0.1]} receiveShadow>
          <shapeGeometry attach="geometry" args={[mirror]} />
          <meshPhysicalMaterial
            attach="material"
            color={0xffffff}
            transparent
            transparency={0.8}
            metalness={0}
            roughness={0}
            side={2}
          />
        </mesh>
      ))}
    </group>
  );
};

Window.defaultProps = {
  x: 0,
  y: 0.9,
  width: 1.2,
  height: 1.25,
  nbMirrors: 2
};

export default Window;
