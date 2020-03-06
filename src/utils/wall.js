export const generator = (data, ply, cb, inset = false) =>
  data.reduce(
    (acc, a, index) => {
      const _ply = a.ply || ply;
      const b = data[(index + 1) % data.length];
      const width = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
      const angle =
        (360 + Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI)) % 360;
      let translateX = 0;
      let translateY = 0;
      let additionnalWidth = 0;


      // angle rentrant, on pousse les murs pour masquer les trous
      const isAngleInside = (360 + angle - acc.angle) % 360 > 180;
      if (isAngleInside || !inset) {
        additionnalWidth += _ply;
        translateX = _ply * Math.cos(angle * (Math.PI / 180));
        translateY = _ply * Math.sin(angle * (Math.PI / 180));
        if (!inset && isAngleInside) {
          translateX *= -1;
          translateY *= -1;
          additionnalWidth -= _ply;
        }
      }

      return {
        walls: [
          ...acc.walls,
          cb(
            a,
            a.x - translateX,
            (a.y - translateY) * -1,
            angle,
            width + additionnalWidth,
            index,
            translateX,
            translateY
          )
        ],
        angle
      };
    },
    { walls: [], angle: null }
  ).walls;
