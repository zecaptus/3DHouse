import React from "react";
import { Shape } from "three";

import Wall from "./Wall";
import { generator } from "../utils/wall";
import { useLibrary } from "../context/Library";

const Floor = ({ data, objects, y, height, ply, children, props }) => {
  let ceil = new Shape();
  ceil.autoClose = true;
  ceil.moveTo(0, 0);

  const { lib } = useLibrary();

console.log(lib)
  const walls = generator(
    data,
    ply,
    (item, x, z, angle, width, index, translateX, translateY) => {
      ceil.lineTo(item.x, item.y);

      return (
        <Wall
          key={`Wall_${index}`}
          x={x}
          y={y}
          z={z}
          height={height}
          width={width}
          angle={angle}
          childrenPosX={translateX}
          childrenPosY={translateY}
          ply={ply}
          inset
        >
          {item.objects && item.objects.map(key => lib.get(key).component)}
        </Wall>
      );
    },
    true
  );

  return (
    <group name="Floor" {...props}>
      {walls}
      {children}
      <mesh
        rotation-x={-Math.PI / 2}
        receiveShadow
        castShadow
        name="ceil"
        position={[0, y + height, 0]}
      >
        <shapeBufferGeometry attach="geometry" args={[ceil, { steps: 100 }]} />
        <meshPhysicalMaterial attach="material" color={0xffffff} side={1} />
      </mesh>
    </group>
  );
};

Floor.defaultProps = {
  y: 0,
  ply: 0.3,
  height: 2.5
};

export default Floor;
