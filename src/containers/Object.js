//import React from 'react';
import { useLibrary } from "../context/Library";

const Object3D = props => {
  const { useObject } = useLibrary();
  useObject(props.children);

  return props.children;
};

export default Object3D;
