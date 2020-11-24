import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ReactDOM from 'react-dom';
import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import {
  Canvas,
  useFrame,
  extend,
  useThree,
  useUpdate,
  useLoader,
} from 'react-three-fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import {
  sRGBEncoding,
  Shape,
  RepeatWrapping,
  ACESFilmicToneMapping,
  VSMShadowMap,
} from 'three';

import './index.css';

import Ground from './components/Ground';
import Roof from './components/Roof';
import Sky from './components/Sky';
import Rdc from './containers/Rdc';

extend({ OrbitControls });

const Controls = props => {
  const { camera, gl } = useThree();
  const controls = useRef();
  useFrame(() => controls.current.update());
  return (
    <orbitControls ref={controls} args={[camera, gl.domElement]} {...props} />
  );
};

const Rooms = props => {
  const texture = useLoader(TextureLoader, './assets/textures/22_clay.jpg');

  useEffect(() => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(10, 10);
    texture.anisotropy = 16;
  }, [texture]);

  const shapes = useMemo(() => {
    return new Shape()
      .moveTo(0, 0)
      .lineTo(13.4, 0)
      .lineTo(13.4, 10)
      .lineTo(0, 10)
      .lineTo(0, 0);
  }, []);

  return (
    <group position={[-6.52, 0.01, 5]} name="House">
      <Rdc />

      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <extrudeBufferGeometry
          attach="geometry"
          args={[shapes, { steps: 100, depth: 0.05, bevelEnabled: false }]}
        />
        <meshPhysicalMaterial attach="material" />
      </mesh>

      <Roof
        x={0}
        y={2.5}
        width={13.8}
        height={10.4}
        topEdge={2.5}
        position={[-0.2, 0, -10.2]}
        texture={texture}
      />
      <pointLight args={[0xffffff, 0.7, 5]} position={[11, 2.4, -3]} castShadow>
        <mesh name="light salon">
          <sphereBufferGeometry attach="geometry" args={[0.05, 16, 8]} />
          <meshPhysicalMaterial attach="material" color={0xffffff} />
        </mesh>
      </pointLight>

      <pointLight args={[0xffffff, 0.7, 5]} position={[11, 2.4, -8]} castShadow>
        <mesh name="light salle a manger">
          <sphereBufferGeometry attach="geometry" args={[0.05, 16, 8]} />
          <meshPhysicalMaterial attach="material" color={0xffffff} />
        </mesh>
      </pointLight>

      <pointLight args={[0xffffff, 0.7, 5]} position={[9, 2.4, -3]} castShadow>
        <mesh name="light couloir">
          <sphereBufferGeometry attach="geometry" args={[0.05, 16, 8]} />
          <meshPhysicalMaterial attach="material" color={0xffffff} />
        </mesh>
      </pointLight>
    </group>
  );
};

window.searchRoot = ReactDOM.render(
  <Canvas
    shadowMap
    //camera={[60, window.innerWidth / window.innerHeight, 100, 2000000]}
    camera={{
      position: [10, 10, 40],
      fov: 25,
      aspect: window.innerWidth / window.innerHeight,
    }}
    pixelRatio={window.pixelRatio}
    onCreated={({ scene, gl }) => {
      //scene.fog = new Fog(0xcce0ff, 50, 100);
      scene.name = 'Main';
      gl.outputEncoding = sRGBEncoding;
      gl.antialias = true;
      //gl.shadowType = VSMShadowMap;
      //gl.toneMapping = ACESFilmicToneMapping;
    }}
  >
    {/* <ambientLight color={0xffffff} intensity={0.6} /> 
    
    hemiLight.color.setHSV( 0.6, 0.75, 0.5 );
            hemiLight.groundColor.setHSV( 0.095, 0.5, 0.5 );
            hemiLight.position.set( 0, 500, 0 );
    */}

    <hemisphereLight
      args={[0xffffff, 0xffffff, 0.6]}
      color-hsv={[0.6, 0.75, 0.5]}
      groundColor-hsv={[0.095, 0.5, 0.5]}
      position={[0, 500, 0]}
    />
    <Sky />

    <Suspense fallback={'Chargement ...'}>
      <Rooms />
      <Controls enableDamping rotateSpeed={0.3} dampingFactor={0.1} />
      <Ground />
    </Suspense>
  </Canvas>,
  document.getElementById('root'),
);
