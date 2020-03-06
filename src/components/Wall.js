import React, { useMemo, Children, cloneElement } from "react";
import { createSquare, createRoundedSquare } from "../utils/shape";
import { BackSide } from "three";
import Object3D from "../containers/Object";

const createHole = (child, childrenPosX, childrenPosY) =>
  child && child.type && ~["Window", "Door", "Hole"].indexOf(child.type.name)
    ? createRoundedSquare(
        child.props.x + childrenPosX,
        child.props.y + childrenPosY,
        child.props.width,
        child.props.height
      )
    : null;

const Wall = ({
  x,
  y,
  z,
  width,
  height,
  ply,
  angle,
  shape,
  children,
  childrenPosX = 0,
  childrenPosY = 0,
  inset,
  ...props
}) => {
  let _x = x;
  let _z = z;

  console.log(children)

  const wallShape = useMemo(() => {
    const s = shape || createSquare(0, 0, width, height);
    if (children)
      s.holes = []
        .concat(children)
        .map(child => createHole(child, childrenPosX, childrenPosY))
        .filter(Boolean);

    return s;
  }, [width, height, shape, children, childrenPosX, childrenPosY]);

  const radAngle = angle * (Math.PI / 180);

  // extrudedBuffer will extruded outside.
  // negate this here
  const translateX = ply * Math.sin(radAngle);
  const translateZ = ply * Math.cos(radAngle);

  if (inset) {
    _x -= translateX;
    _z -= translateZ;
  }

  return (
    <>
      <mesh
        castShadow
        receiveShadow
        position={[_x, y, _z]}
        rotation-y={radAngle}
        name="Wall"
        {...props}
      >
        <extrudeBufferGeometry
          attach="geometry"
          args={[
            wallShape,
            {
              steps: 1,
              curveSegments: 10,
              depth: ply,
              bevelEnabled: false
            }
          ]}
        />
        <meshPhysicalMaterial
          attach="material"
          color={0xfefee2}
          shadowSide={BackSide}
          roughness={1}
          metalness={0}
        />
      </mesh>
      {Children.map(children, child => child && (
        <Object3D>
          {cloneElement(child, {
            position: [
              x - translateX + childrenPosX,
              y,
              z - translateZ + childrenPosY
            ],
            "rotation-y": radAngle,
            ...props
          })}
        </Object3D>
      ))}
    </>
  );
};

Wall.defaultProps = {
  x: 0,
  y: 0,
  z: 0,
  angle: 0,
  width: 0,
  height: 2.5,
  ply: 0.1,
  inset: false
};

export default Wall;
