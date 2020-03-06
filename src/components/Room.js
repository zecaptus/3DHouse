import React from "react";
import { Shape, Color } from "three";
import Wall from "./Wall";
import Hole from "./Hole";
import { generator } from "../utils/wall";
import { useLibrary } from "../context/Library";
/**
 points
 */
const Room = ({ y = 0, data, ...props }) => {
  const { lib } = useLibrary();
  const floor = new Shape();
  floor.autoClose = true;
  floor.moveTo(data[0].x, data[0].y);

console.log(lib)
  const walls = generator(data, 0.035, (item, x, z, angle, width, index) => {
    floor.lineTo(item.x, item.y);

    //console.log(item.mask, item.x , item.y)
    //console.log(objects[2])
    return (
      <Wall
        key={`Wall_${index}`}
        x={x}
        y={0}
        z={z}
        height={2.5}
        width={width}
        angle={angle}
        ply={item.ply || 0.035}
      >
        {item.objects && item.objects.map(key => lib.get(key).component)}
        {item.mask && item.mask.map(key => {
          const { position, angle } = lib.get(key);
          console.log(lib.get(key))
          console.log(<Hole position />);
          return <Hole position={ position } />
        })}
      </Wall>
    );
  });

  return (
    <group name="Room" {...props}>
      {walls}
      <mesh
        rotation-x={-Math.PI / 2}
        receiveShadow
        castShadow
        name="floor"
        position={[0, y + 0.06, 0]}
      >
        <shapeBufferGeometry attach="geometry" args={[floor, { steps: 100 }]} />
        <meshPhysicalMaterial
          attach="material"
          color={props.color ? new Color(props.color) : 0xff0000}
          side={0}
        />
      </mesh>
    </group>
  );
};

export default Room;
