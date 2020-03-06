import React, { useMemo } from "react";
import { Vector3, Face3 } from "three";

/*
         5
       2   \
      /3\---4
     0----1/
  */

const faces = [
  // front
  new Face3(0, 1, 2),
  // right
  new Face3(1, 5, 2),
  new Face3(1, 4, 5),
  // back
  new Face3(3, 4, 5),
  // left
  new Face3(3, 5, 2),
  new Face3(3, 2, 0),
  // bottom
  new Face3(3, 1, 0),
  new Face3(3, 4, 1)
];

const Roof = props => {
  const { x, y, topEdge, width, height, texture, ...rest } = props;

  const vertices = useMemo(
    () => [
      new Vector3(x, y, x), // 0
      new Vector3(x, y, x + height), // 1
      new Vector3(x + width / 3, y + topEdge, (x + height) / 2), // 2
      new Vector3(x + width, y, x), // 3
      new Vector3(x + width, y, x + height), // 4
      new Vector3(x + width - width / 3, y + topEdge, (x + height) / 2) // 5
    ],
    [x, y, topEdge, width, height]
  );

  return (
    <mesh {...rest} receiveShadow castShadow name="Roof" visible={false}>
      <geometry
        attach="geometry"
        vertices={vertices}
        faces={faces}
        onUpdate={self => {
          self.computeFaceNormals();
        }}
      />
      <meshPhysicalMaterial
        attach="material"
        color={0x333346}
        side={2}
        metalness={1}
      />
    </mesh>
  );
};

export default Roof;
