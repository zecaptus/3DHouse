import React from "react";
import Window from "../components/Window";
import Door from "../components/Door";
import Wall from "../components/Wall";
import Hole from "../components/Hole";
import Floor from "../components/Floor";
import Room from "../components/Room";
import { createSquare } from "../utils/shape";
import house from "../datas/house.json";
import Library from "../context/Library";

const TYPES = {
  window: Window,
  door: Door
};

const objects = house.objects.map(({ type, ...props }, index) => {
  const Component = TYPES[type];
  return <Component key={index} {...props} />;
});

const Gallery = () => (
  <group name="gallery">
    <Wall width={1.13} x={13.4} angle={90} ply={0.24} inset>
      <Hole x={0.24} width={0.89} height={2.2} />
    </Wall>
    <Wall x={7.11} width={6.29} ply={0.24} inset>
      <Hole x={0} width={2.2} height={2.2} />
      <Hole x={2.44} width={3.61} height={2.2} />
    </Wall>

    <mesh name="debug" position={[7.11 + 0.455, 1, -1]}>
      <planeBufferGeometry attach="geometry" args={[0.91, 0.2]} />
      <meshPhysicalMaterial
        attach="material"
        color={0xff0000}
        side={0}
        metalness={1}
      />
    </mesh>

    <mesh
      rotation-x={-Math.PI / 2}
      receiveShadow
      castShadow
      name="ceil"
      position={[0, 2.5, 0]}
    >
      <shapeBufferGeometry
        attach="geometry"
        args={[createSquare(7.11, 0, 6.29, 1.13), { steps: 100 }]}
      />
      <meshPhysicalMaterial attach="material" color={0xffffff} side={1} />
    </mesh>
  </group>
);

const Rdc = props => {
  return (
    <Library data={house.objects}>
      {house.floors.map(floor => (
        <Floor
          key={floor.name}
          data={floor.geometry}
          ply={floor.ply}
          name={floor.name}
        >
          <Gallery />
          {floor.rooms.map(key => (
            <Room
              key={key}
              name={house.rooms[key].name}
              data={house.rooms[key].geometry}
              color={house.rooms[key].floorColor}
            />
          ))}
        </Floor>
      ))}
    </Library>
  );
};

export default Rdc;
