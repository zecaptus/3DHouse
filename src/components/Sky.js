import React, { useRef, useEffect } from "react";
import { Sky as SkyObject } from "three/examples/jsm/objects/Sky";
import useGui from "../hooks/Gui";
import { Vector3 } from "three";

const Sky = props => {
  const {
    turbidity,
    rayleigh,
    mieCoefficient,
    mieDirectionalG,
    luminance,
    inclination,
    azimuth
  } = useGui("Sky", {
    turbidity: { value: 3, args: [1, 20, 0.1] },
    rayleigh: { value: 2, args: [0.0, 4, 0.001] },
    mieCoefficient: { value: 0.005, args: [0.0, 0.1, 0.001] },
    mieDirectionalG: { value: 0.985, args: [0.0, 1, 0.001] },
    luminance: { value: 1, args: [0.0, 2] },
    inclination: { value: 0.6883, args: [0, 1, 0.0001] },
    azimuth: { value: 0.6993, args: [0, 1, 0.0001] }
  });

  const distance = 400000;
  const sky = new SkyObject();
  sky.scale.setScalar(450000);
  const light = useRef();

  var uniforms = sky.material.uniforms;
  uniforms["turbidity"].value = turbidity;
  uniforms["rayleigh"].value = rayleigh;
  uniforms["mieCoefficient"].value = mieCoefficient;
  uniforms["mieDirectionalG"].value = mieDirectionalG;
  uniforms["luminance"].value = luminance;

  useEffect(() => {
    light.current.intensity = luminance;
  }, [light, luminance]);

  var theta = Math.PI * (inclination - 0.5);
  var phi = 2 * Math.PI * (azimuth - 0.5);

  const sunPos = [
    distance * Math.cos(phi),
    distance * Math.sin(phi) * Math.sin(theta),
    distance * Math.sin(phi) * Math.cos(theta)
  ];

  uniforms["sunPosition"].value.copy(new Vector3(...sunPos));

  return (
    <>
      <primitive object={sky} />

      <directionalLight
        ref={light}
        position={sunPos}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-camera-near={distance - 200}
        shadow-camera-far={distance + 1000}
        shadow-bias={-1e-10}
        shadow-mapSize-width={8192}
        shadow-mapSize-height={8192}
        castShadow
      />
      {light.current && (
        <>
          <directionalLightHelper args={[light.current]} />
          <cameraHelper args={[light.current.shadow.camera]} />
        </>
      )}
    </>
  );
};

export default Sky;
