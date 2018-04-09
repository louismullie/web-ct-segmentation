# CoreSlicer: A Web Toolkit for Analytic Morphomics

CoreSlicer is a web interface for morphomic analysis of computed tomography (CT) scan images. CoreSlicer aims to bridge the gap between researchers and clinicians with an interest in analytic morphomics by providing a cross-platform, open-source interface for visualization of morphomic data and development of new morphomic markers.

CoreSlicer lives in 2 main locations:

- A **public web interface**, located at https://www.coreslicer.com, which allows researchers and clinicians to perform morphomic measurements in the browser without installing any additional software
- An **open-source toolkit**, maintained here, which allows researchers and clinicians to rapidly prototype morphomic markers via a flexible JSON plugin API 

## Requirements

CoreSlicer is designed for and optimized for Google Chrome. Other browsers are not supported. A minimum of 4GB of RAM is recommended for optimal user experience.

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
cd coreslicer && npm install

```

## How to run

To serve the application with hot-reloading on localhost, run:

```bash

cd coreslicer && npm run dev

```

To build the application as a stand-alone HTML/JS package, run:

```bash

# build for production with minification
npm run build

```

## Building plugins

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

## User interface

On any screen, tap the "?" button at the bottom-left of the interface to display additional tools and information.

**Figure 2: Serie selection window**

![image](https://user-images.githubusercontent.com/681636/38292009-13ca1018-37b0-11e8-8f55-8ca88bcd22f8.png)

**Figure 3: Level selection window**

![image](https://user-images.githubusercontent.com/681636/38292018-266eee46-37b0-11e8-960c-060f6b5f12d8.png)

**Figure 4: Region editing window**

![image](https://user-images.githubusercontent.com/681636/38292032-3a339468-37b0-11e8-8a48-ad6fb9b37376.png)

## User agreement

CoreSlicer is freely available for academic research. It may not be used for commercial or clinical applications.

## License

This software is released under the MIT License. 
