export default function decompressDicomSerie (serie, progressCb) {

  return new Promise(res => {

    let workers = [];
    let slices = serie.slices;
    let numSlices = slices.length;
    let globalCounter = slices.length;
    let decompressedSlices = [];

    // Callback for decompression
    let countdown = function (id, data) {
      
      globalCounter--;
      
      progressCb(1.0-(globalCounter / numSlices));
      
      decompressedSlices[id] = data;
      
      if (globalCounter == 0) {
        res(decompressedSlices);
      }
      
    }
    
    // Create the webworkers
    let numWebWorkers = 8;
  
    for (let i = 0; i < numWebWorkers; i++) {
      let myWorker = new Worker('/static/workers/worker.js');
  
      myWorker.onmessage = function (message) {
        countdown(message.data.id, message.data.bytes);
      };
    
      workers.push(myWorker);
    }
    
    // Start decompression
    let j = 0;
    let i = 0;
    
    slices.forEach(slice => {
      
      let pixelData = slice.getPixelData();
      let byteArray = new Int16Array(pixelData);
      
      workers[j].postMessage({ id: i, bytes: byteArray });
      
      j = (j == numWebWorkers - 1) ? 0 : j + 1; i++;
      
    });
    
  });
  
}