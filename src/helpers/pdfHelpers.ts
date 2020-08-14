// @ts-ignore
import * as PdfJs from 'pdfjs-dist/build/pdf';
import { TextContentItem } from 'pdfjs-dist';
import { Rectangle } from 'tesseract.js';

export const calculateTextProperties = (
  textItem: TextContentItem,
  style: any,
  viewPort: any,
  context: CanvasRenderingContext2D
) => {
  const tx = PdfJs.Util.transform(viewPort.transform, textItem.transform);
  let angle = Math.atan2(tx[1], tx[0]);
  if (style.vertical) {
    angle += Math.PI / 2;
  }
  const fontSize = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
  let fontAscent = fontSize;
  if (style.ascent) {
    fontAscent *= style.ascent;
  } else if (style.descent) {
    fontAscent *= (1 + style.descent);
  }

  let left;
  let top;
  if (angle === 0) {
    // eslint-disable-next-line prefer-destructuring
    left = tx[4];
    top = tx[5] - fontAscent;
  } else {
    left = tx[4] + fontAscent * Math.sin(angle);
    top = tx[5] - fontAscent * Math.cos(angle);
  }

  let canvasWidth;
  let transform = 1;

  if (style.vertical) {
    canvasWidth = textItem.height * viewPort.scale;
  } else {
    canvasWidth = textItem.width * viewPort.scale;
  }

  if (canvasWidth) {
    context.font = `${fontSize}px ${style.fontFamily}`;

    const { width } = context.measureText(textItem.str);
    transform = canvasWidth / width;
  }

  return {
    left, top, fontSize, transform,
  };
};

export const calculateRectangleProperties = (boundingBox: any): Rectangle => {
  const { x0, x1, y0, y1 } = boundingBox;

  const width = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y0 - y0, 2));
  const height = Math.sqrt(Math.pow(x1 - x1, 2) + Math.pow(y1 - y0, 2));

  return { left: x0, top: y0, width, height };
};
