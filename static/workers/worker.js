importScripts('/static/dicom/util.js');
importScripts('/static/dicom/arithmetic_decoder.js');
importScripts('/static/dicom/jpx.min.js');

var jpxImage = new JpxImage();

self.onmessage = function (message) {
  
  var id = message.data.id,
      byteArray = message.data.bytes;
  
	jpxImage.parse(byteArray);

  buffer = jpxImage.tiles[0];
  
  postMessage({ id: id, bytes: buffer });
  
};