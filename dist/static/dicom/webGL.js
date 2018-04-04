"use strict";

function WebGlDicomViewer (cornerstoneImages, canvas, fragmentShaderEl, vertexShaderEl) {

	// global stuff
	var gl=null;

	// shaders
	var program2;	// advanced (texture and color)

	var currentlyPressedKeys = {};	// array of key perssed by the user
	var projMatrix;	// projection matrix
	var mouseLeftDown = false;
	var mouseMidDown = false;
	var lastMouseX = 0;
	var lastMouseY = 0;
	var texID = -1;
	var loaded = false;
	var volume = [];
	var slice = 0;
	var volumeSize = [0,0,0];
	var volumeSizeP2 = [0,0,0];
	var minVoxel = 0;
	var maxVoxel = 0;
	var axisNumber = [0,0,0];
	var bitPerVoxel = 0;
	var viewAxis = 'x';
	var sliceXY = null;
	var sliceXZ = null;
	var sliceYZ = null;
	var vertexBufferXY = null;
	var vertexBufferXZ = null;
	var vertexBufferYZ = null;
	var indexBuffer = null;
	var coordBufferXY = null;
	var coordBufferYZ = null;
	var coordBufferXZ = null;
	var loaded = false;
	var windowCenter= 128;
	var windowWidth = 127;
	var slope = 1;
	var intercept = -1024;

	/* BEGIN SINGLETON ADDONS */

	initWebGL()

	volumeSize[2] = cornerstoneImages.length;
	volume = cornerstoneImages.map(image => image.getPixelData());
  
	let sampleImage = cornerstoneImages[0];

	volumeSize[0] = sampleImage.columns;
	volumeSize[1] = sampleImage.rows;
	bitPerVoxel = 8 * sampleImage.__proto__.BYTES_PER_ELEMENT;
	intercept = sampleImage.intercept;
	slope = sampleImage.slope;
	windowCenter = sampleImage.windowCenter;
	windowWidth = sampleImage.windowWidth;
	minVoxel = sampleImage.minPixelValue;
	maxVoxel = sampleImage.maxPixelValue;

	onLoadDatased();

	this.setViewAxis = function (axis) {
		viewAxis = axis;
		setTexture();
	}

	/* END SINGLETON ADDONS */

	function createGeometry()
	{
	/*
		var verticesXY =
		[
			0.0, 0.0, 0.0,
			volumeSize[0], 0.0, 0.0,
			volumeSize[0], volumeSize[1], 0.0,
			0.0, volumeSize[1], 0.0
		];
		var verticesXZ =
		[
			0.0, 0.0, 0.0,
			volumeSize[0], 0.0, 0.0,
			volumeSize[0], volumeSize[2], 0.0,
			0.0, volumeSize[2], 0.0
		];

		var verticesYZ =
		[
			0.0, 0.0, 0.0,
			volumeSize[1], 0.0, 0.0,
			volumeSize[1], volumeSize[2], 0.0,
			0.0, volumeSize[2], 0.0
		];
	*/
		var ax = volumeSize[1]/volumeSize[0];
		var verticesXY =
		[
			-ax, 1, 0.0, 1,
			 ax, 1, 0.0, 1,

			 ax,-1, 0.0, 1,
			-ax,-1, 0.0, 1
		];

		ax = volumeSize[2]/volumeSize[1];
		var verticesYZ =
		[
			-ax, 1, 0.0, 1,
			 ax, 1, 0.0, 1,

			 ax,-1, 0.0, 1,
			-ax,-1, 0.0, 1
		];

		ax = volumeSize[2]/volumeSize[0];
		var verticesXZ =
		[
			-ax, 1, 0.0, 1,
			 ax, 1, 0.0, 1,

			 ax,-1, 0.0, 1,
			-ax,-1, 0.0, 1
		];


		var indices  =
		[
			0,  1,  2,
			0,  2,  3
		];

		var textCoordsXY =
		[
			0,0,
			0,volumeSize[1]/volumeSizeP2[1],
			volumeSize[0]/volumeSizeP2[0],volumeSize[1]/volumeSizeP2[1],
			volumeSize[0]/volumeSizeP2[0],0
		];

		var textCoordsXZ =
		[
			0,0,
			0,volumeSize[0]/volumeSizeP2[0],
			volumeSize[2]/volumeSizeP2[2],volumeSize[0]/volumeSizeP2[0],
			volumeSize[2]/volumeSizeP2[2],0
		];

		var textCoordsYZ =
		[
			0,0,
			0,volumeSize[1]/volumeSizeP2[1],
			volumeSize[2]/volumeSizeP2[2],volumeSize[1]/volumeSizeP2[1],
			volumeSize[2]/volumeSizeP2[2],0
		];

		if (vertexBufferXY != null)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.deleteBuffer(vertexBufferXY);
		}
		vertexBufferXY = gl.createBuffer();
		vertexBufferXY.itemSize = 4;	// x,y,z,w
		vertexBufferXY.numItems = 4;
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferXY);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesXY), gl.STATIC_DRAW);

		if (vertexBufferXZ != null)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.deleteBuffer(vertexBufferXZ);
		}
		vertexBufferXZ = gl.createBuffer();
		vertexBufferXZ.itemSize = 4;	// x,y,z,w
		vertexBufferXZ.numItems = 4;
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferXZ);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesXZ), gl.STATIC_DRAW);

		if (vertexBufferYZ != null)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.deleteBuffer(vertexBufferYZ);
		}
		vertexBufferYZ = gl.createBuffer();
		vertexBufferYZ.itemSize = 4;	// x,y,z,w
		vertexBufferYZ.numItems = 4;
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferYZ);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesYZ), gl.STATIC_DRAW);

		if (indexBuffer != null)
		{
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
			gl.deleteBuffer(indexBuffer);
		}
		indexBuffer = gl.createBuffer();
		indexBuffer.itemSize = 3; // a,b,c
		indexBuffer.numItems = 2;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

		if (coordBufferXY != null)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.deleteBuffer(coordBufferXY);
		}
		coordBufferXY = gl.createBuffer();
		coordBufferXY.itemSize = 2;
		coordBufferXY.numItems = 4;
		gl.bindBuffer(gl.ARRAY_BUFFER, coordBufferXY);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoordsXY), gl.STATIC_DRAW/*DYNAMIC_DRAW*/);

		if (coordBufferXZ != null)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.deleteBuffer(coordBufferXZ);
		}
		coordBufferXZ = gl.createBuffer();
		coordBufferXZ.itemSize = 2;
		coordBufferXZ.numItems = 4;
		gl.bindBuffer(gl.ARRAY_BUFFER, coordBufferXZ);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoordsXZ), gl.STATIC_DRAW/*DYNAMIC_DRAW*/);

		if (coordBufferYZ != null)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
			gl.deleteBuffer(coordBufferYZ);
		}
		coordBufferYZ = gl.createBuffer();
		coordBufferYZ.itemSize = 2;
		coordBufferYZ.numItems = 4;
		gl.bindBuffer(gl.ARRAY_BUFFER, coordBufferYZ);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoordsYZ), gl.STATIC_DRAW/*DYNAMIC_DRAW*/);

	}


	function toClient(x,y)
	{
		var rect = canvas.getBoundingClientRect();
		x = x - rect.left;
			y = rect.bottom - 1 - y;
		return [x,y];
	}

	function createTexture()
	{/*
		minVoxel = volume[0][0];
		maxVoxel = volume[0][0];
		for (var z=0; z<volumeSize[2]; z++)
		{
			var i = 0;
			for (var y=0; y<volumeSize[1]; y++)
				for (var x=0; x<volumeSize[0]; x++)
				{
					if (volume[z][i] > maxVoxel)
						maxVoxel = volume[z][i];
					if (volume[z][i] < minVoxel)
						minVoxel = volume[z][i];
					i++;
				}
		}*/
		if (texID != -1)
		{
			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.deleteTexture(texID);
		}
		texID = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texID);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		sliceXY = new Uint8Array(volumeSizeP2[0] * volumeSizeP2[1]);
		sliceXZ = new Uint8Array(volumeSizeP2[0] * volumeSizeP2[2]);
		sliceYZ = new Uint8Array(volumeSizeP2[1] * volumeSizeP2[2]);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		gl.bindTexture(gl.TEXTURE_2D, null);

		//var ctx = canvas.getContext('2d');
	}

	function isPoweOf2(n)
	{
		return (n & (n - 1)) == 0;
	}

	function pow2ceil(v)
	{
			v--;
			var p = 2;
			while (v >>= 1)
		{
			p <<= 1;
		}
			return p;
	}

	function transform(value)
	{
		value = value * slope + intercept;
		if (value > windowCenter + windowWidth/2)
			value = 255;
		else if (value < windowCenter - windowWidth/2)
			value = 0;
		else
			value = Math.floor(  ((value - windowCenter)/windowWidth + 0.5) * 255.0   )	;
		return value;
	}

	function setTexture()
	{
		if (volumeSize[0] == 0)
			return;
		var w, h, buffer, i=0;

		if (viewAxis == 'x')
		{
			w = volumeSizeP2[2];
			h = volumeSizeP2[1];
			//console.log("Showing x-slice = " + axisNumber[0]);
			buffer = sliceYZ;
			if (bitPerVoxel==8)
				for (var y=0; y<volumeSize[1]; y++)
				{
					for (var z=0; z<volumeSize[2]; z++,i++)
						buffer[i] = transform(volume[z][y*volumeSize[0] +axisNumber[0]])
					for (var z=volumeSize[2]; z<volumeSizeP2[2]; z++,i++)
						buffer[i] = 0;
				}
			else
				for (var y=0; y<volumeSize[1]; y++)
				{
					for (var z=0; z<volumeSize[2]; z++,i++)
						buffer[i] = transform(volume[z][y*volumeSize[0] +axisNumber[0]]);
					for (var z=volumeSize[2]; z<volumeSizeP2[2]; z++,i++)
						buffer[i] = 0;
				}

		}
		else if (viewAxis == 'y')
		{
			w = volumeSizeP2[2];
			h = volumeSizeP2[0];
			//console.log("Showing y-slice = " + axisNumber[1]);
			buffer = sliceXZ;
			if (bitPerVoxel==8)
				for (var x=0; x<volumeSize[0]; x++)
				{
					for (var z=0; z<volumeSize[2]; z++,i++)
						buffer[i] = transform(volume[z][axisNumber[1]*volumeSize[0] +x]);
					for (var z=volumeSize[2]; z<volumeSizeP2[2]; z++,i++)
						buffer[i] = 0;
				}
			else
				for (var x=0; x<volumeSize[0]; x++)
				{
					for (var z=0; z<volumeSize[2]; z++,i++)
						buffer[i] = transform(volume[z][axisNumber[1]*volumeSize[0] +x]);
					for (var z=volumeSize[2]; z<volumeSizeP2[2]; z++,i++)
						buffer[i] = 0;
				}
		}
		else
		{
			w = volumeSizeP2[1];
			h = volumeSizeP2[0];
			//console.log("Showing z-slice = " + axisNumber[2]);
			buffer = sliceXY;
			if (bitPerVoxel==8)
				for (var x=0; x<volumeSize[0]; x++)
				{
					for (var y=0; y<volumeSize[1]; y++,i++)
						buffer[i] = transform(volume[axisNumber[2]][y*volumeSize[0] + x]);
					for (var y=volumeSize[1]; y<volumeSizeP2[1]; y++,i++)
						buffer[i] = 0;
				}
			else
				for (var x=0; x<volumeSize[0]; x++)
				{
					////console.log("x = " + x);
					for (var y=0; y<volumeSize[1]; y++,i++)
						buffer[i] = transform(volume[axisNumber[2]][y*volumeSize[0] + x]);
					for (var y=volumeSize[1]; y<volumeSizeP2[1]; y++,i++)
						buffer[i] = 0;
				}

		}
		gl.bindTexture(gl.TEXTURE_2D, texID);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, w, h, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, buffer);
	}



	function myRender()
	{
		if (volumeSize[0] == 0 || vertexBufferYZ==null)
			return;

		var viewMatrix = lookAt([0,0,0], [0,0,-1], [0,1,0]);

		gl.useProgram(program2);
		gl.enableVertexAttribArray(program2.vertexCoordAttribute);
		gl.uniformMatrix4fv(program2.pMatrixUniform, false, flatten(transpose(projMatrix)));
		gl.uniformMatrix4fv(program2.mvMatrixUniform, false, flatten(viewMatrix));
		gl.uniform1i(program2.samplerUniform, 0);
		gl.uniform4fv(program2.inColor, flatten([1,1,1,1]));
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texID);

		if (viewAxis=='x')
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferYZ);
			gl.vertexAttribPointer(program2.vertexPositionAttribute, vertexBufferYZ.itemSize, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, coordBufferYZ);
			gl.vertexAttribPointer(program2.vertexCoordAttribute, coordBufferYZ.itemSize, gl.FLOAT, false, 0, 0);
		}
		else if (viewAxis=='y')
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferXZ);
			gl.vertexAttribPointer(program2.vertexPositionAttribute, vertexBufferXZ.itemSize, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, coordBufferXZ);
			gl.vertexAttribPointer(program2.vertexCoordAttribute, coordBufferXZ.itemSize, gl.FLOAT, false, 0, 0);
		}
		else //if (viewAxis=='z')
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferXY);
			gl.vertexAttribPointer(program2.vertexPositionAttribute, vertexBufferXY.itemSize, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, coordBufferXY);
			gl.vertexAttribPointer(program2.vertexCoordAttribute, coordBufferXY.itemSize, gl.FLOAT, false, 0, 0);
		}



		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLES, indexBuffer.numItems*indexBuffer.itemSize, gl.UNSIGNED_SHORT, 0);

		gl.disableVertexAttribArray(program2.vertexCoordAttribute);

	}


	function handleMouseDown(event)
	{
		lastMouseX = event.clientX;
		lastMouseY = event.clientY;
		var res = toClient(lastMouseX, lastMouseY);
		lastMouseX = res[0];
		lastMouseY = res[1];
		if (event.button == 0)
		{
			mouseLeftDown = true;
		}
		else if (event.button == 1)
		{
			mouseMidDown = true;
		}
		////console.log("mouse down:", lastMouseX, ",",lastMouseY);

		if(event.preventDefault)
			event.preventDefault();
		else if(event.returnValue)
			event.returnValue = false;

		return false;
	}

	function handleMouseUp(event)
	{
		if (event.button == 0)
			mouseLeftDown = false;
		else if (event.button == 1)
			mouseMidDown = false;
		////console.log("mouse up");
	}


	function handleMouseMove(event)
	{
		var newX = event.clientX;
		var newY = event.clientY;
		var res  = toClient(newX, newY);
		newX = res[0];
		newY = res[1];

		var deltaX = newX - lastMouseX;
		var deltaY = lastMouseY - newY;

		// do something with delta
		if (mouseLeftDown) 	//if (event.button === 0)
		{
			if (volumeSize[0] > 0)
			{
				var i =0;
				if (viewAxis == 'x')
					i=0;
				else if (viewAxis == 'y')
					i=1;
				else
					i=2;
				axisNumber[i] += deltaY;
				if (axisNumber[i] < 0)
					axisNumber[i] = 0;
				else if (axisNumber[i] >= volumeSize[i])
					axisNumber[i] = volumeSize[i]-1;
				setTexture();
			}
		}
		else if (mouseMidDown)
		{

		}
		lastMouseX = newX
		lastMouseY = newY;
	}

	function onWindowResize()
	{
		//console.log("resize");
		canvas.width = 512;
		canvas.height = 512;
			gl.viewport( 0, 0, 512, 512 );
		projMatrix = ortho(-1, 1, -1, 1, -1, 1);
	}


	// initializing webGL
	function initGL()
	{

		try
		{
			gl = canvas.getContext("experimental-webgl", {alpha: true});
		} catch (e)
		{
		}
			if ( !gl )
		{
			alert( "WebGL isn't available!" );
			return;
		}
		onWindowResize();

			gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
			gl.enable(gl.DEPTH_TEST);
		gl.disable(gl.CULL_FACE);

		// looking to the back
		window.addEventListener('resize',    onWindowResize,    false);
		canvas.addEventListener("mousedown", handleMouseDown,         false);
		canvas.addEventListener("mouseup",   handleMouseUp,     false);
		canvas.addEventListener("mousemove", handleMouseMove,   false);
	}

	// Compiles shader, and returns the shader object
	function getShader(gl, shaderElement)
	{
		var shaderScript = shaderElement;
		if (!shaderScript)
			return null;
		var str = "";
		var k = shaderScript.firstChild;
		while (k)
		{
			if (k.nodeType == 3)
				str += k.textContent;
			k = k.nextSibling;
		}
		var shader;
		if (shaderScript.type == "x-shader/x-fragment")
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		else if (shaderScript.type == "x-shader/x-vertex")
			shader = gl.createShader(gl.VERTEX_SHADER);
		else
			return null;
		gl.shaderSource(shader, str);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
		{
			alert(gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}

	// load the vertex and fragment shaders
	function initShaders()
	{

		var fragmentShader = getShader(gl, fragmentShaderEl);
		var vertexShader   = getShader(gl, vertexShaderEl);

		// create a program to hold both main shaders
		program2 = gl.createProgram();

		// attach the shaders  into a program
		gl.attachShader(program2, vertexShader);
		gl.attachShader(program2, fragmentShader);

		// linking
		gl.linkProgram(program2);

		if (!gl.getProgramParameter(program2, gl.LINK_STATUS))
			alert("Could not initialise shaders");

		// set this program as default!
		gl.useProgram(program2);

		// getting the location of attributes (vertex position, color and model view matrix)
		program2.vertexPositionAttribute = gl.getAttribLocation(program2, "vPosition");
			program2.mvMatrixUniform = gl.getUniformLocation(program2, "uMVMatrix");
			program2.pMatrixUniform = gl.getUniformLocation(program2, "uProjMatrix");
			program2.inColor = gl.getUniformLocation(program2, "inColor");
		program2.samplerUniform = gl.getUniformLocation(program2, "texture");
		program2.vertexCoordAttribute = gl.getAttribLocation(program2, "vTexCoord");

		gl.enableVertexAttribArray(program2.vertexPositionAttribute);

		gl.useProgram(null);
	}

	// called when the user press a key
	function handleKeyDown(event)
	{
		currentlyPressedKeys[event.keyCode] = true;
	}

	// called when the user release a key
	function handleKeyUp(event)
	{
		currentlyPressedKeys[event.keyCode] = false;
	}

	function onLoadDatased()
	{
		volumeSizeP2[0] = pow2ceil(volumeSize[0]);
		volumeSizeP2[1] = pow2ceil(volumeSize[1]);
		volumeSizeP2[2] = pow2ceil(volumeSize[2]);

		axisNumber[0] = Math.floor(volumeSize[0]/2);
		axisNumber[1] = Math.floor(volumeSize[1]/2);
		axisNumber[2] = Math.floor(volumeSize[2]/2);

		createGeometry();
		createTexture();
		setTexture();
	}

	// render one frame, and do a request for animation
	function render () {
		// clear the frame buffer and z buffer
			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// here ...
		myRender();

			requestAnimationFrame(render);
	}

	// initializing all
	function initWebGL()
	{
		initGL();
		initShaders();
		/*
		if (gl.getExtension(gl.WEBGL_depth_texture)==null)
		{
			//console.log("Unsupported WEBGL_depth_texture!");
		}
		if (gl.getExtension(gl.OES_texture_float)==null)
		{
			//console.log("Unsupported OES_texture_float!");
		}
		if (gl.getExtension(gl.OES_texture_float_linear)==null)
		{
			//console.log("Unsupported OES_texture_float_linear!");
		}*/
		// definying key down/up handlers
			window.onkeydown = handleKeyDown;
			window.onkeyup   = handleKeyUp;

		// render the scene the first time... it will create a set of call via animation
			render();
	}


};
