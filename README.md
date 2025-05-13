# Please note: This software is no longer actively maintained. See [CoreSlicer](https://coreslicer.com/) for the most recent version.

This repository showcases a web interface for morphomic analysis of computed tomography (CT) scan images. The software aims to bridge the gap between researchers and clinicians with an interest in analytic morphomics by providing a cross-platform, open-source interface for visualization of morphomic data and development of new morphomic markers.

The software lives in 2 main locations:

- A **public web interface**, which allows researchers and clinicians to perform morphomic measurements in the browser without installing any additional software
- An **open-source toolkit**, maintained here, which allows researchers and clinicians to rapidly prototype morphomic markers via a flexible JSON plugin API 

## Requirements

The software is designed for and optimized for Google Chrome. Other browsers are not supported. A minimum of 4GB of RAM is recommended for optimal user experience.

## Introduction

**Figure 1: Typical workflow for measurement of morphomic analytics**

![Typical workflow for measurement of morphomic analytics](https://user-images.githubusercontent.com/681636/38286639-68c3c4e0-3794-11e8-8e17-168d3239b2ff.png)

Analytic morphomics, or more simply, “morphomics,” refers to the measurement of specific biomarkers of body composition from medical imaging, most commonly computed tomography (CT) images. A typical measurement workflow consists in selecting a reference anatomical level (e.g. the level of the 4th lumbar vertebra) and performing morphometric measurements on the corresponding axial image (Figure 1).

## How to install

First, ensure that [NVM](https://github.com/creationix/nvm) and [Bower](https://bower.io/) are installed on your system:

``` bash
# install nvm
brew install nvm

# install latest node
nvm ls-remote
nvm install 6
npm install -g bower
bower install
```

Then, ensure the required dependencies are installed:

```bash

# install dependencies
cd web-ct-segmentation && npm install

```

## How to run

To serve the application with hot-reloading on localhost, run:

```bash

cd web-ct-segmentation && npm run dev

```

To build the application as a stand-alone HTML/JS package, run:

```bash
npm run build

```

## Plugin API

### API specification


The `files` field of the FormData object contains the list of files, while the slices object contains a string-encoded JSON, which has the following structure: 

```
{
	"slices": [ {
		“index”: 0,
		“filename”: “slice_0.png”,
		“options”: { } 
	}]
}
```

If the “point and click” option is set when creating the tool, the “options” dictionary will be filled with the x and y position of the cursor when the canvas was clicked, e.g. 

```
“options”: { x: 34, y: 352 } 
```

### Simple plugin example

The following demonstrates an example plugin in Python:

```python
from flask import Flask, request, send_file
import numpy as np, os, json
from scipy.misc import imsave
from read_dicom import read_dcm

app = Flask(__name__)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(APP_ROOT, '../tmp/web-ct-segmentation')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def import_slice_file(request, index, upload_folder):
  
  slices = json.loads(request.form['slices'])
  slice_name = slices[index]['filename']

  slices_data = request.files
  slice_data = slices_data[slice_name]
  
  slice_filename = os.path.join(upload_folder, slice_data.filename)
  slice_data.save(slice_filename)
  slice_data.stream.seek(0)
  
  return slice_filename
  
def export_slice_file(mask, upload_folder):
  
  image_filename = os.path.join(upload_folder, 'result.png')
  imsave(image_filename, mask)

  return image_filename

@app.route('/endpoint', methods = ['POST'])
  
def segmentation_function():
  
  slice_filename = import_slice_file(request, 0, app.config['UPLOAD_FOLDER'])
  
  image = read_dcm(slice_filename)

  hu = image['hounsfield']
  
  # Do the thresholding
  mask = np.zeros((hu.shape[0], hu.shape[1], 4))
  mask[hu > -30] = (1, 1, 1, 1)
  mask[hu > 150] = (0, 0, 0, 0)
  
  return send_file(
    export_slice_file(mask, app.config['UPLOAD_FOLDER']),
    attachment_filename='result.png', mimetype='image/png')

```

If you save this file as "server.py," you can run it using `gunicorn` (or any other process manager of your choice):


```
gunicorn filename:app
```

> To install `gunicorn`, run `pip install gunicorn`.

## User interface

On any screen, tap the "?" button at the bottom-left of the interface to display additional tools and information.

**Figure 2: Serie selection window**

![image](https://user-images.githubusercontent.com/681636/38292009-13ca1018-37b0-11e8-8f55-8ca88bcd22f8.png)

**Figure 3: Level selection window**

![image](https://user-images.githubusercontent.com/681636/38292018-266eee46-37b0-11e8-960c-060f6b5f12d8.png)

**Figure 4: Region editing window**

![image](https://user-images.githubusercontent.com/681636/38292032-3a339468-37b0-11e8-8a48-ad6fb9b37376.png)

## User agreement

This software is for research and educational use only. It may not be used for commercial or clinical applications. By using the software, you agree to our terms of use and privacy policy, which can be found [here](https://github.com/louismullie/web-ct-segmentation/blob/master/TERMS.md).

## License

This software is released under the MIT License. Contributions from the community are welcome.
