import React, { useCallback, useRef, useEffect } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import { AnimationMixer, LoopOnce, Color } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Door = props => {
  const doorState = useRef({
    opened: false,
    opening: false,
    closing: false,
    animating: false,
    timer: 0
  });
  const { x, y, width, height, reverse, ...restProps } = props;

  const gltf = useLoader(
    GLTFLoader,
    "./assets/Room-Door/Door_Component_BI3.glb"
  );

  useEffect(() => {
    gltf.scene.traverse(function(object) {
      // hide some mesh
      if (~["Plane", "Plane004"].indexOf(object.name)) object.visible = false;

      // apply shadow
      if (object.isMesh) {
        object.receiveShadow = true;
        object.castShadow = true;

        if (object.material.name === "Glossy") object.material.metalness = 0.34;
        if (object.material.name === "Door") {
          object.material.metalness = 1;
          object.material.color = new Color(0x333346);
        }
      }
    });
  }, [gltf]);

  const mixer = useRef(new AnimationMixer(gltf.scene));
  const actions = useRef(
    gltf.animations.map(anim => {
      const action = mixer.current.clipAction(anim);
      action.loop = LoopOnce;
      return action;
    })
  );

  useFrame((state, delta) => {
    const finalDelta = delta * (doorState.current.closing ? -1 : 1);
    mixer.current.update(finalDelta);

    if (doorState.current.animating) {
      doorState.current.timer += finalDelta;
      // door is now opened
      if (doorState.current.timer > 2.5) {
        pause();
        doorState.current.timer = 2.5;
      }

      // door is now closed
      if (doorState.current.timer < 0) {
        pause();
        doorState.current.timer = 0;
      }
    }
  });

  const pause = useCallback(() => {
    doorState.current.opened = doorState.current.opening;
    doorState.current.opening = false;
    doorState.current.animating = false;
    doorState.current.closing = false;
    actions.current.forEach(a => {
      a.paused = true;
    });
  }, [actions]);

  const toggleDoor = useCallback(() => {
    if (doorState.current.animating) {
      doorState.current.closing = !doorState.current.closing;
      doorState.current.opening = !doorState.current.opening;
    } else {
      doorState.current.closing = doorState.current.opened;
      doorState.current.opening = !doorState.current.opened;
    }
    doorState.current.animating = true;
    actions.current.forEach(a => {
      a.play();
      a.paused = false;
      a.enabled = true;
    });

    //opened = false;
  }, [actions]);

  console.log('position', x + width / 2, y, 0.09);
  console.log('rotatopn',[0, Math.PI, 0]);
  console.log(restProps)

  return (
    <group name="Door" {...restProps}>
      <primitive
        object={gltf.scene}
        position={[x + width / 2, y, 0.09]}
        rotation={[0, Math.PI, 0]}
        scale={[reverse ? -1 : 1, 1, 1]}
        onClick={toggleDoor}
      />
      <mesh receiveShadow castShadow position={[x + width / 2, y + 2.15, 0.18]}>
        <planeBufferGeometry attach="geometry" args={[width, 0.2]} />
        <meshPhysicalMaterial
          attach="material"
          color={0x333346}
          side={0}
          metalness={1}
        />
      </mesh>
    </group>
  );
};

Door.defaultProps = {
  x: 0,
  y: 0,
  width: 0.9,
  height: 2.15
};

export default Door;
