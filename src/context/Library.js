import React, { createContext, useState, useContext, useMemo } from "react";
import Window from "../components/Window";
import Door from "../components/Door";
import Hole from "../components/Hole";

const TYPES = {
  window: Window,
  door: Door,
  hole: Hole
};

// const objects = house.objects.map(({ type, ...props }, index) => {
//   const Component = TYPES[type];
//   return <Component key={index} {...props} />;
// });

const Library = createContext({ lib: new Map(), useObject: () => {} });

const LibraryProvider = ({ data, children }) => {
  const objects = useMemo(
    () =>
      new Map(
        data.map(({ type, ...props }, index) => {
          const Component = TYPES[type];
          return [
            index,
            {
              component: <Component key={index} libraryKey={index} {...props} />,
              position: [],
              angle: null
            }
          ];
        })
      ),
    [data]
  );
  const [lib, setLib] = useState(objects);
  console.log(lib);
  const useObject = ({ props: {libraryKey, x, y, position:[x2, y2, z], 'rotation-y': angle }}) => {

    if(lib.has(libraryKey)) {
      //setLib(new Map([...lib, [libraryKey, { ...lib.get(libraryKey), angle, position}]]))
      lib.set(libraryKey, { ...lib.get(libraryKey), angle, position: [x + x2, y+y2, z]})
    }
    else console.warn(`Unable to find Object{${libraryKey}} from library`)
    //setLib(objectIndex);
  };

  return (
    <Library.Provider value={{ lib, useObject }}>{children}</Library.Provider>
  );
};

export const useLibrary = () => useContext(Library);

export default LibraryProvider;
