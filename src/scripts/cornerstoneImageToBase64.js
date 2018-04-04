export default function cornerstoneImageToBase64 (cornerstoneImage) {

  let element = document.createElement('div');

  element.style.width = `${cornerstoneImage.columns}px`;
  element.style.height = `${cornerstoneImage.rows}px`;
  element.style.visibility = 'hidden';
  element.style.zIndex = '-1';
  element.style.pointerEvents = 'none';

  document.querySelector('body').appendChild(element);

  cornerstone.enable(element);
  let viewport = cornerstone.getDefaultViewportForImage(element, cornerstoneImage);
  cornerstone.displayImage(element, cornerstoneImage, viewport);

  let dataUrl = element.querySelector('canvas').toDataURL();

  document.querySelector('body').removeChild(element);

  return dataUrl;


}
