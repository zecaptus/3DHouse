import { Shape } from "three";

const createSquare = (startX, startY, width, height) =>
  new Shape()
    .moveTo(startX, startY)
    .lineTo(startX + width, startY)
    .lineTo(startX + width, startY + height)
    .lineTo(startX, startY + height)
    .lineTo(startX, startY);

const createRoundedSquare = (startX, startY, width, height) =>
  new Shape()
    .moveTo(startX, startY)
    .lineTo(startX + width, startY)
    .lineTo(startX + width, startY + height)
    .bezierCurveTo(
      startX + width,
      startY + height,
      startX + width / 2,
      startY + height + 0.2,
      startX,
      startY + height
    )
    .lineTo(startX, startY);

export { createSquare, createRoundedSquare };
