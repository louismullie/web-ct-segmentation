<template lang="jade">
.BottomLeftToolbar.ui.menu.left(
  data-intro="Show keyboard shortcuts",
  data-position='right'
)
  a.popup.icon.item(
    href='#',
    @click.prevent='showHelp'
  )
    i.help.icon

  a.popup.icon.item(
    href='#',
    @click.prevent='showKeyboardShortcuts'
  )
    i.keyboard.icon

#toolbar
  .ui.menu.right.floated(
    data-intro="Undo, redo, and apply smart segmentation",
    data-position='bottom'
  )
    a.popup.icon.item(
      href='#',
      @click.prevent='undo'
    )
      i.undo.icon

    a.popup.icon.item(
      href='#',
      @click.prevent='redo'
    )
      i.repeat.icon

    a.popup.icon.item(
      href='#',
      @click.prevent='magicSegmentation'
    )
      i.lightning.icon

  .BrushSize.ui.menu.right.floated(
    data-intro="Change your brush size",
    data-position='bottom'
  )
    span.BrushSizeLabel Brush Size
    input.BrushSizeRange(
      type='range',
      v-model.lazy='brushSizeScaled'
    )

  .ui.menu.left.floated(
    data-intro="Zoom in, zoom out",
    data-position='bottom'
  )
    a.popup.icon.item(
      href='#',
      @click.prevent='zoomIn'
    )
      i.zoom.icon

    a.popup.icon.item(
      href='#',
      @click.prevent='zoomOut'
    )
      i.zoom.out.icon

    //a.popup.icon.item(
    //  href='#',
    //  @click.prevent='fitToView'
    //)
    //  i.maximize.icon

#editor
  #tegaki-container

#layers
  ul#layer-list
    .LayerGroup
      li.LayerGroupName Saved Regions
    
      li(
        v-for='layerType in layerTypes.slice(0, 5)',
        v-bind:class='[$index === currentLayerTypeIndex ? "active" : ""]',
        :data-intro=`$index === 4 ? 'Smart regions can be automatically measured using the magic wand button' : null`,
        data-position='left'
      )
        span.color( v-bind:style="{ backgroundColor: layerType.color }" )
        span.area(
          :data-intro=`$index === 4 ? 'Cross-sectional area of the layer' : null`,
          data-position='top'
        ) {{ layerType.area.toFixed(2) }} cm&sup2;
    
        .LayerActions.ui.menu(
          :data-intro=`$index === 4 ? 'Use the brush, erase and magic wand tool to draw a region' : null`,
          data-position='bottom'
        )
          a.popup.icon.item(
            href='#',
            @click.prevent='setCurrentTool(0, layerType, $index)',
            :class='{ active: currentTool === 0 && $index === currentLayerTypeIndex }'
          )
            i.paint.brush.icon
    
          a.popup.icon.item(
            href='#',
            @click.prevent='setCurrentTool(1, layerType, $index)',
            :class='{ active: currentTool === 1 && $index === currentLayerTypeIndex }'
          )
            i.erase.icon
    
          span.scaler(
            :class=`{ 'is-segmenting': layerType.isSegmenting }`
          )
            a.popup.icon.item(
              href='#',
              @click.prevent=`
                ($index === 0 || $index === 1)
                  ? setToolToPicker(layerType, $index)
                  : applySegmentationPreset(layerType, $index)
              `,
              :class=`{
                'is-segmenting': layerType.isSegmenting,
                'active': currentTool === 2 && currentLayerTypeIndex === $index && !layerType.isSegmenting
              }`,
              :style=`{ background: layerType.isSegmenting ? layerType.color + ' !important' : null }`
            )
              i.wizard.icon
    
    
        span.LayerName {{ layerType.name }}
    
    .LayerGroup
      li.LayerGroupName Test New Regions

      li.NewLayer(
        :class=`{ active: newLayer.name !== '' }`
        data-intro="You can create custom regions for manual measurements here",
        data-position='left'
      )
        span.add +
        input.add(
          type='text',
          placeholder='Enter a name here to create a region',
          v-model='newLayer.name',
          @keyup.enter='createLayer'
        )
        
        .LayerTypeSelect(v-show=`newLayer.name !== ''`)
          span.label API endpoint URL
          input.add(
            type='text',
            placeholder='http://your-website.com/endpoint',
            v-model='newLayer.endpoint',
          )
          
        .LayerTypeSelect(v-show=`newLayer.name !== ''`)
          span.label Segmentation type
          input.add(
            type='radio',
            id='radioWholeSlice',
            name='toolType',
            value='0',
            v-model='newLayer.endpointToolType',
          )
          label.add(
            for='radioWholeSlice'
          )
            | Whole slice
            
          
          input.add(
            type='radio',
            id='radioPointAndClick',
            name='toolType',
            value='1',
            v-model='newLayer.endpointToolType',
          )
          
          label.add(
            for='radioPointAndClick'
          )
            | Point and click
          
        .LayerTypeSelect(v-show=`newLayer.name !== ''`)
          span.label Threshold Type
          select(
            v-model='newLayer.baseLayerTypeIndex'
          )
            option(
              v-for='layerType in baseLayerTypes',
              :value='$index'
            ) {{ layerType.name }}

          a.NewLayerButton(
            href='#',
            @click.prevent='createLayer'
          ) Create region

      li(
        v-for='layerType in layerTypes.slice(5)',
        v-bind:class='[$index === currentLayerTypeIndex + 4 ? "active" : ""]',
        :data-intro=`$index === 4 ? 'Smart regions can be automatically measured using the magic wand button' : null`,
        data-position='left'
      )
        span.color( v-bind:style="{ backgroundColor: layerType.color }" )
        span.area(
          :data-intro=`$index === 4 ? 'Cross-sectional area of the layer' : null`,
          data-position='top'
        ) {{ layerType.area.toFixed(2) }} cm&sup2;

        .LayerActions.ui.menu(
          :data-intro=`$index === 4 ? 'Use the brush, erase and magic wand tool to draw a region' : null`,
          data-position='bottom'
        )
          a.popup.icon.item(
            href='#',
            @click.prevent='setCurrentTool(0, layerType, $index + 5)',
            :class='{ active: currentTool === 0 && $index === currentLayerTypeIndex - 5 }'
          )
            i.paint.brush.icon

          a.popup.icon.item(
            href='#',
            @click.prevent='setCurrentTool(1, layerType, $index + 5)',
            :class='{ active: currentTool === 1 && $index === currentLayerTypeIndex - 5 }'
          )
            i.erase.icon
          
          span.scaler(
            :class=`{ 'is-segmenting': layerType.isSegmenting }`
          )
            a.popup.icon.item(
              href='#',
              @click.prevent=`
                (newLayer.toolType == '1')
                  ? setToolToPicker(layerType, $index, newLayer.endpoint)
                  : applySegmentationPreset(layerType, $index, newLayer.endpoint)
              `,
              :class=`{
                'is-segmenting': layerType.isSegmenting,
                'active': currentTool === 2 && currentLayerTypeIndex === $index && !layerType.isSegmenting
              }`,
              :style=`{ background: layerType.isSegmenting ? layerType.color + ' !important' : null }`
            )
              i.wizard.icon

          a.popup.icon.item(
            href='#',
            @click.prevent='deleteLayer($index + 5)'
          )
          
            i.trash.icon

        span.LayerName {{ layerType.name }}

#keyboard-shortcuts-modal.ui.modal.small
  .shortcuts-container
    //i.close.icon

    .header Keyboard shortcuts

    table
      tr
        td Brush/Eraser
        td <kbd>q</kbd> / <kbd>w</kbd>
      tr
        td Smaller/Larger brush
        td <kbd>1</kbd> / <kbd>2</kbd>
      tr
        td Zoom out/in
        td <kbd>-</kbd> / <kbd>+</kbd>
      tr
        td Fit to view
        td <kbd>0</kbd>
      tr
        td Next/Previous layer
        td <kbd>a</kbd> / <kbd>s</kbd>
      tr
        td Hide all layers
        td <kbd>&#8679;</kbd>
      tr
        td Undo
        td <kbd>&#8984;</kbd> + <kbd>z</kbd>
      tr
        td Redo
        td <kbd>&#8984;</kbd> + <kbd>&#8679;</kbd> + <kbd>z</kbd>

    .actions
      .ui.green.basic.cancel.inverted.button( style = 'margin: 0' )
        i.remove.icon
        | Close

#discard-regions-modal.ui.small.basic.modal.transition
  .ui.icon.header
    i.trash.outline.icon
    | Are you sure?

  .content
    p( style = 'text-align: center' )
      | Going back to the previous step will discard all changes.

  .actions( style = 'text-align: center' )
    .ui.green.basic.cancel.inverted.button( style = 'margin: 0' )
      i.remove.icon
      | Cancel

    .ui.red.ok.inverted.button
      i.checkmark.icon
      | Discard

</template>

<script>

import FlatColors from 'flat-colors'

import cornerstoneImageToBase64 from '../../../scripts/cornerstoneImageToBase64.js'
import Tegaki from './tegaki.js';

// DEV
window.T = Tegaki;

const colors = [
  '#00FFFF',
  '#00FF15',
  '#FF0000',
  '#4800FF',
  '#FFFF00',
  '#ff00d6',
  '#4800FF',
  '#4bc6fb',
  '#FF8000',
]

const [brushMin, brushMax] = [10, 64];
const brushDefault = 32;
const brushStep = 6;

export default  {

  name: 'Regions',

  data () {
    return {

      currentLayerTypeIndex: 0,
      currentTool: 0,
      brushSize: 0,
      currentColorIndex: 4,
      isWaitingForSegmentationPoint: false,

      newLayer: {
        name: '',
        baseLayerTypeIndex: 0,
      },

      colors,

      baseLayerTypes: [
        {
          name: 'Muscle',
          threshold: [-29.0, 150.0]
        },
        {
          name: 'Fat',
          threshold: [-190.0, -30.0]
        },
        {
          name: 'Bone',
          threshold: [200.0, 1000.0]
        },
        {
          name: 'Organ',
          threshold: [-60.0, 100.0]
        },
      ],

      layerTypes: JSON.parse(localStorage.getItem('layerTypes'))

    }
  },

  async ready () {

    let $vm = this;

    // Load the DICOM pixel data
    var selectedSlice = this.$root.selectedSlice;
    var pixelData = selectedSlice.getPixelData();
    var sizeInfo = {columns: selectedSlice.columns, rows: selectedSlice.rows};

    if (this.$root.series.length === 1 && this.$root.series[0].slices.length === 1)
      this.$parent.singleSliceMode = true

    this.$root.selectedSliceSizeInfo = sizeInfo;
    this.$root.selectedSlicePixelData = pixelData;
    this.$root.selectedSliceRescaleIntercept = selectedSlice.intercept;

    Tegaki.selectedSlicePixelSpacing = selectedSlice.columnPixelSpacing * selectedSlice.rowPixelSpacing;
    Tegaki.selectedSlicePixelData = this.$root.selectedSlicePixelData;
    Tegaki.selectedSliceSizeInfo = this.$root.selectedSliceSizeInfo;
    Tegaki.selectedSliceRescaleIntercept = this.$root.selectedSliceRescaleIntercept;

    // Create image with pixel data

    let sliceImg = new Image;

    // BUG CHROME 57: Wait for image to load
    await new Promise(resolve => {
      sliceImg.onload = resolve

      if (selectedSlice.thumbnail) {
        sliceImg.src = selectedSlice.thumbnail
      } else {
        sliceImg.src = cornerstoneImageToBase64(selectedSlice)
      }
    })

    // Update steps layout
    $vm.$parent.stepIndex = 2;

    // Drawing canvas settings
    const [imageW, imageH] = [sliceImg.width, sliceImg.height];
    const viewW = 800;
    const viewH = Math.min(viewW * sliceImg.height / sliceImg.width, viewW * 3/4); // max out at 4:3

    const scaleMin = viewW / imageW // if image is larger than viewport, don't resize
    const scaleMax = 2; // To ensure brush doesn't have to go > 128px
    const scaleStep = 0.1;

    // Initialize Tegaki
    Tegaki.container = document.querySelector('#tegaki-container');
    Tegaki.scaleFactor = scaleMin;

    Tegaki.open({ width: imageW, height: imageH });

    // Get background layer canvas and draw on it
    let background = Tegaki.layers.filter(l => l.name == 'background')[0];
    background.ctx.drawImage(sliceImg, 0, 0);

    // Create a layer for every layer type and add their index to every type
    for (let layerType of this.layerTypes) {
      layerType.tegakiLayerIndex = Tegaki.addLayer(layerType.id, 0.5)
    }

    // Get elements
    const scaler = document.querySelector('#tegaki-cnt');
    const zoomer = document.querySelector('#tegaki-layers');

    // Set overflower size
    const overflower = document.querySelector('#tegaki');
    // overflower.style.width = viewW + 'px';
    // overflower.style.height = viewH + 'px';

    // Keep track of cursor pos relative to the overflow container
    let cursorPos = { x: 0, y: 0 }
    $('#tegaki-container').on('mousemove', function (e) {
      let offset = $(this).offset()
      cursorPos.x = Math.abs(e.pageX - offset.left)
      cursorPos.y = Math.abs(e.pageY - offset.top)
    })

    let tegakiCursorPos = { x: 0, y: 0 }
    $('#tegaki-cnt').on('mousemove', function (e) {
      let offset = $(this).offset()
      tegakiCursorPos.x = Math.abs(e.pageX - offset.left)
      tegakiCursorPos.y = Math.abs(e.pageY - offset.top)
    })

    // Handle events
    this.brushSize = brushDefault;

    Tegaki.updateScaleAndBrushSize = function () {

      // Round to the second decimal and constrain in range
      // NOTE: in the special case that picture is to small to be scaled at all
      // zoom will seem to be disabled
      Tegaki.scaleFactor = Math.min(Math.max(Tegaki.scaleFactor, scaleMin), scaleMax);

      // Update scaler size. The scaler's purpose is to take the "physical" space
      // that the "virtual" scale transform has to take in order to be scrollable.
      scaler.style.width = imageW * Tegaki.scaleFactor + 'px';
      scaler.style.height = imageH * Tegaki.scaleFactor + 'px';

      // Set scale transform with every vendor
      ['webkitTransform', 'MozTransform', 'msTransform', 'OTransform', 'transform']
        .forEach(v => zoomer.style[v] = 'scale(' + Tegaki.scaleFactor + ')');

      // Redraw the brush cursor, taking the scale into account
      $vm.brushSize = Math.floor(Math.min(Math.max($vm.brushSize, brushMin), brushMax));
      Tegaki.setToolSize($vm.brushSize);

    }

		window.$vm = this;
		window.Tegaki = Tegaki;

    var _this = this;

		Tegaki.magicSegmentation = function () {

				NProgress.start()
			  // Get active canvas
			  let canvas = Tegaki.layers[Tegaki.activeLayer].canvas,
			      ctx = canvas.getContext('2d');

			  // Create request
			  let xhr = new XMLHttpRequest(),
			      fd  = new FormData();

			  // Add DICOM file
			  let file = cornerstoneWADOImageLoader.fileManager.get($vm.$root.selectedSliceIndex);
			  fd.append('file', file, 'file.dcm');

			  // Add other options
				fd.append('x', cursorPos.x)
			  fd.append('y', cursorPos.y)

			  // Post to route
			  let baseUrl = '/pipeline',
			      fullUrl = baseUrl + '/segment_fullslice';

			  xhr.open('POST', fullUrl , true);
			  xhr.responseType = 'blob';

				let layerColors = [[255, 0, 0], [0, 255, 0], [0,0,255]];

			  // When POST succeeded
			  xhr.onload = function(evt) {

			    // Get URL to PNG sent by server
			    var url = window.URL.createObjectURL(evt.target.response);

			    var img = new Image();

			    // Draw received image on canvas
			    img.onload = function () {

			      // Create in memory canvas for color replacement
			      var imgCanvas = document.createElement("canvas");

						imgCanvas.width = this.width;
			      imgCanvas.height = this.height;

						let imgWidth = parseInt(this.width / 3)
						let imgHeight = this.height

            let layers = [
              Tegaki.layers.find(l =>   l.name == 'wall-muscle'),
              Tegaki.layers.find(l =>   l.name == 'subcutaneous-fat'),
              Tegaki.layers.find(l =>   l.name == 'visceral-fat')
            ]

            let j = 0;

						for (let layer of layers) {

              let layerColor = _this.layerTypes.find(l => l.id == layer.name).color
              layerColor = _this.hex2rgb(layerColor)
              //let layerIndex = layer.tegakiLayerIndex

						  let canvas = layer.canvas,
						      ctx = canvas.getContext('2d');

				      // Copy the image contents to the canvas
				      var imgCtx = imgCanvas.getContext("2d");
							imgCtx.drawImage(this, 0, 0);

				      let imageData = imgCtx.getImageData(imgWidth * j, 0, imgWidth, imgHeight),
				          imagePixelArray = imageData.data;

				      let targetData = ctx.getImageData(0, 0, imgWidth, imgHeight),
				          targetPixelArray = targetData.data;

				      // 4 components - red, green, blue and alpha
				      var length = targetPixelArray.length;

				      // Iterate and apply layer color
				      for (var i = 3; i < length; i+= 4) {

				        if (imagePixelArray[i] > 0) {
				          targetPixelArray[i-3] = layerColor[0];
				          targetPixelArray[i-2] = layerColor[1];
				          targetPixelArray[i-1] = layerColor[2]
				          targetPixelArray[i] = 255;
				        }

				      }

				      ctx.putImageData(targetData, 0, 0);

              j++

						}

			      // Trigger refresh measurements
			      Tegaki.refreshMeasurements();

						NProgress.done()
						// FINISH NPROGRESS
			      //layerType.isSegmenting = false;

			    };

			    // Set URL on image
			    img.src = url;


			  };

			  // Send request with form data
			  xhr.send(fd);

		}

    Tegaki.fitToView = function () {
      Tegaki.scaleFactor = scaleMin
      Tegaki.updateScaleAndBrushSize()
    }

    Mousetrap.bind('0', Tegaki.fitToView)

    Tegaki.zoomOut = function () {

      Tegaki.scaleFactor -= scaleStep
      Tegaki.updateScaleAndBrushSize()

      // Scroll overflower to zoom position relative to viewport
      overflower.scrollTop = (imageH * Tegaki.scaleFactor) *
        (overflower.scrollTop / scaler.offsetHeight)

      overflower.scrollLeft = (imageW * Tegaki.scaleFactor) *
        (overflower.scrollLeft / scaler.offsetWidth)

    }

    Tegaki.zoomIn = function () {

      if (Tegaki.scaleFactor === scaleMax) return

      Tegaki.scaleFactor += scaleStep
      Tegaki.updateScaleAndBrushSize()

      // Scroll overflower to cursor position relative to viewport
      overflower.scrollTop = (imageH * Tegaki.scaleFactor - viewH) * (cursorPos.y / viewH)
      overflower.scrollLeft = (imageW * Tegaki.scaleFactor - viewW) * (cursorPos.x / viewH)

    }

    Mousetrap.bind('-', Tegaki.zoomOut)
    Mousetrap.bind('=', Tegaki.zoomIn)

    Mousetrap.bind('1', e => this.brushSize -= brushStep)
    Mousetrap.bind('2', e => this.brushSize += brushStep)

    Mousetrap.bind('q', e => this.currentTool = 0)
    Mousetrap.bind('w', e => this.currentTool = 1)

    Mousetrap.bind('shift', () =>
      overflower.classList.add('hide-layers'), 'keydown')
    Mousetrap.bind('shift', () =>
      overflower.classList.remove('hide-layers'), 'keyup')

    Mousetrap.bind('mod+z', this.undo);
    Mousetrap.bind('mod+shift+z', this.redo)

    // Cycle to next or first layer
    Mousetrap.bind('a', e => {

      let previous = this.currentLayerTypeIndex - 1
      if (previous < 0) previous = this.layerTypes.length - 1

      if (this.layerTypes[previous].isSegmenting) return
      this.currentLayerTypeIndex = previous

      this.setActiveLayerType(this.layerTypes[this.currentLayerTypeIndex])

    });

    // Cycle to previous or last layer
    Mousetrap.bind('s', e => {

      let next = this.currentLayerTypeIndex + 1
      if (next === this.layerTypes.length) next = 0

      if (this.layerTypes[next].isSegmenting) return
      this.currentLayerTypeIndex = next

      this.setActiveLayerType(this.layerTypes[this.currentLayerTypeIndex])

    });

    // Intial scale and brush size setting on page load
    Tegaki.updateScaleAndBrushSize();

    // Set the first layer type to active
    this.setActiveLayerType(this.layerTypes[this.currentLayerTypeIndex])

    Tegaki.donePainting = () => {

      // If we are in picker mode, shortcircuit and segment the layer
      // with the current cursor position
      if (this.isWaitingForSegmentationPoint) {
        this.isWaitingForSegmentationPoint = false
				this.applyCursorPreset(tegakiCursorPos)
        return;
      }

      let canvas = Tegaki.layers[Tegaki.activeLayer].canvas

      let i, ctx, dest, data, len;

      ctx = canvas.getContext('2d')
      dest = ctx.getImageData(0, 0, canvas.width, canvas.height);
      data = dest.data,
      len = data.length;

      let totalPixels = 0;

      for (i = 3; i < len; i += 4) {
        if (data[i] > 0) totalPixels++;
      }

      let area = totalPixels * Tegaki.selectedSlicePixelSpacing / 100;
      this.layerTypes[this.currentLayerTypeIndex].area = area;

    }

    Tegaki.refreshMeasurements = () => {

      for (let layer of Tegaki.layers) {

        if (layer.name == 'background') continue;

        let canvas = layer.canvas

        let i, ctx, dest, data, len;

        ctx = canvas.getContext('2d')
        dest = ctx.getImageData(0, 0, canvas.width, canvas.height);
        data = dest.data,
        len = data.length;

        let totalPixels = 0;

        for (i = 3; i < len; i += 4) {
          if (data[i] > 0) totalPixels++;
        }

        let area = totalPixels * Tegaki.selectedSlicePixelSpacing / 100;
        _this.layerTypes.find(t => t.id == layer.name).area = area;

      }

    }

  },

  watch: {

    currentTool (i) {
      Tegaki.changeTool(['thresholdpencil', 'eraser', 'picker'][i])
      Tegaki.updateScaleAndBrushSize()
    },

    brushSize () {
      Tegaki.updateScaleAndBrushSize()
    }

  },

  computed: {
    layerTypesGroups () {
      return [this.layerTypes.slice(0, 5), this.layerTypes.slice(5)]
    },
    brushSizeScaled: {
      get () {
        return Math.round((this.brushSize - brushMin) / (brushMax - brushMin) * 100)
      },

      set (scaledValue) {
        this.brushSize = brushMin + scaledValue / 100 * (brushMax - brushMin)
      }
    }
  },

  methods: {

    showHelp () {
      setTimeout(() => {
        window.jQuery('body').chardinJs('start')
        window.jQuery('body').one('click', () => $('body').chardinJs('stop'))
      }, 500)
    },

    undo: function () {
      Tegaki.onUndoClick()
      Tegaki.donePainting()
    },

    redo: function () {
      Tegaki.onRedoClick()
      Tegaki.donePainting()
    },

    fitToView: () => Tegaki.fitToView(),
		magicSegmentation: () => Tegaki.magicSegmentation(),
    zoomIn: () => Tegaki.zoomIn(),
    zoomOut: () => Tegaki.zoomOut(),

    deleteLayer: function (layerTypeIndex) {

      if (!window.confirm('Are you sure you want to delete this region?')) return

      const tegakiLayerIndex = this.layerTypes[layerTypeIndex].tegakiLayerIndex
      Tegaki.deleteLayers([tegakiLayerIndex])

      this.setActiveLayerType(this.layerTypes[0], 0)
      this.layerTypes.splice(layerTypeIndex, 1)

    },

    createLayer: function () {

      const name = this.newLayer.name
      const threshold = this.baseLayerTypes[this.newLayer.baseLayerTypeIndex].threshold

      const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z\-]/g, '').trim()

      if (id === '') {
        return alert('The name cannot be empty.')
      }

      if (this.layerTypes.find(layerType => layerType.id === id)) {
        return alert('This name is already taken. Please choose another one.')
      }

      this.currentColorIndex = (this.currentColorIndex + 1) % colors.length
      const color = colors[this.currentColorIndex]

      const newLayerType = {
        id,
        name,
        color,
        threshold,
        area: 0.00,
        isSegmenting: false
      }

      newLayerType.tegakiLayerIndex = Tegaki.addLayer(newLayerType.id, 0.5)
      this.layerTypes.push(newLayerType)

      // Reset new Layer
      this.newLayer.name = ''

      // Switch to layer
      this.setActiveLayerType(newLayerType, this.layerTypes.length - 1)

    },

    setActiveLayerType: function (layerType, switchToIndex) {

      if (Number.isInteger(switchToIndex))
        this.currentLayerTypeIndex = switchToIndex

      Tegaki.setActiveLayer(layerType.tegakiLayerIndex)
      Tegaki.setToolColor(layerType.color)
      Tegaki.setToolThreshold(layerType.threshold)

      console.info('Layer type set to', layerType.name)

    },

    setCurrentTool: function (toolI, layerTypeToSwitchTo, layerTypeToSwitchToIndex) {

      // Do not allow to switch to a tool that is in a layer that is segmenting
      if (layerTypeToSwitchTo.isSegmenting) return

      this.currentTool = toolI
      this.setActiveLayerType(layerTypeToSwitchTo, layerTypeToSwitchToIndex)

    },

    setToolToPicker: function (layerType, layerTypeIndex, endpoint) {

      console.log('picker', endpoint)
      
      // Do not trigger multiple picker watchers for the same layer type
      if (layerType.isSegmenting) return false

      // Switch to layer
      this.setActiveLayerType(layerType, layerTypeIndex)

      // Set tool to picker
      this.setCurrentTool(2, layerType, layerTypeIndex)

      // Set the flag that Tegaki.donePainting() will use to watch for the point click
      this.isWaitingForSegmentationPoint = true

    },

		applyCursorPreset: function (cursorPos) {

			NProgress.start()
			let _this = this;

      // Get text name of current layer
      let currentLayerTypeIndex = this.currentLayerTypeIndex
      let layerType = this.layerTypes[currentLayerTypeIndex]
      let layerColor = this.hex2rgb(this.layerTypes[this.currentLayerTypeIndex].color)
      let lowerCaseLayerName = layerType.name.toLowerCase();

      if (layerType.isSegmenting) return

			let scaleFactor = Tegaki.scaleFactor;
			cursorPos.x = parseInt(cursorPos.x / scaleFactor);
			cursorPos.y = parseInt(cursorPos.y / scaleFactor);

      // Map layer name (lower case) to script
      let scriptMap = {
        'left psoas': 'region_grow_psoas',
        'right psoas': 'region_grow_psoas'
      };

      // Get layer script
      let layerScript = scriptMap[lowerCaseLayerName];

      // Mark layerType as loading
      layerType.isSegmenting = true;

      // Get active canvas
      let canvas = Tegaki.layers[Tegaki.activeLayer].canvas,
          ctx = canvas.getContext('2d');

      // Create request
      let xhr = new XMLHttpRequest(),
          fd  = new FormData();

      // Add DICOM file
      let file = cornerstoneWADOImageLoader.fileManager.get(this.$root.selectedSliceIndex);
      fd.append('file', file, 'file.dcm');

      // Add other options
			fd.append('x', cursorPos.x);
      fd.append('y', cursorPos.y)

      // Post to route
      let baseUrl = '/pipeline',
          fullUrl = baseUrl + '/' + layerScript;

      xhr.open('POST', fullUrl , true);
      xhr.responseType = 'blob';

      // When POST succeeded
      xhr.onload = function(evt) {

        // Get URL to PNG sent by server
        var url = window.URL.createObjectURL(evt.target.response);
        var img = new Image();

        // Draw received image on canvas
        img.onload = function () {

          // Create in memory canvas for color replacement
          var imgCanvas = document.createElement("canvas");
              imgCanvas.width = this.width;
              imgCanvas.height = this.height;

          // Copy the image contents to the canvas
          var imgCtx = canvas.getContext("2d");
              imgCtx.drawImage(this, 0, 0);

          let imageData = imgCtx.getImageData(0, 0, this.width, this.height),
              imagePixelArray = imageData.data;

          let targetData = ctx.getImageData(0, 0, this.width, this.height),
              targetPixelArray = targetData.data;

          // 4 components - red, green, blue and alpha
          var length = targetPixelArray.length;

          // Iterate and apply layer color
          for (var i = 3; i < length; i+= 4) {

            if (imagePixelArray[i] > 0) {
              targetPixelArray[i-3] = layerColor[0];
              targetPixelArray[i-2] = layerColor[1];
              targetPixelArray[i-1] = layerColor[2]
              targetPixelArray[i] = 255;
            }

          }

          ctx.putImageData(targetData, 0, 0);

          // Trigger refresh measurements
          Tegaki.donePainting();

          // If user waited on the layer while segmenting, change tool to brush
          if (_this.currentLayerTypeIndex === currentLayerTypeIndex) {
            _this.setCurrentTool(0, layerType, currentLayerTypeIndex)
          }

					NProgress.done()

          layerType.isSegmenting = false;

        };

        // Set URL on image
        img.src = url;

      };

      // Send request with form data
      xhr.send(fd);

		},

    // Utility function for hex to rgb
    hex2rgb: function(hex) {
      if (hex.lastIndexOf('#') > -1) {
        hex = hex.replace(/#/, '0x');
      } else {
        hex = '0x' + hex;
      }
      var r = hex >> 16;
      var g = (hex & 0x00FF00) >> 8;
      var b = hex & 0x0000FF;
      return [r, g, b];
    },


    applySegmentationPreset : function (layerTypeToSwitchTo, switchToIndex, endpoint) {

			let _this = this;

			NProgress.start()
      
      // Do not switch or process a segmenting layer
      if (layerTypeToSwitchTo.isSegmenting) return
      this.setActiveLayerType(layerTypeToSwitchTo, switchToIndex)

      // Set tool to picker
      this.setCurrentTool(2, layerTypeToSwitchTo, switchToIndex)
      layerTypeToSwitchTo.isSegmenting = true

      // Get text name of current layer
      let layerType = this.layerTypes[this.currentLayerTypeIndex]
      let layerColor = this.hex2rgb(this.layerTypes[this.currentLayerTypeIndex].color)
      let lowerCaseLayerName = layerType.name.toLowerCase();

      // Map layer name (lower case) to script
      let scriptMap = {
        'left psoas': null,
        'right psoas': null,
        'wall muscle': 'segment_lumbar_muscle',
        'subcutaneous fat': 'segment_subq_fat',
        'visceral fat': 'segment_visceral_fat'
      };

      // Get layer script
      let layerScript = scriptMap[lowerCaseLayerName];

      // http://localhost:8080/endpoint
      
      // Get active canvas
      let canvas = Tegaki.layers[Tegaki.activeLayer].canvas,
          ctx = canvas.getContext('2d');

      // Create request
      let xhr = new XMLHttpRequest()
      
      // Create form data
      let fd  = new FormData()
    
      // Get DICOM for the current slice
      let file = cornerstoneWADOImageLoader.fileManager.get(this.$root.selectedSliceIndex);

      // Add DICOM file
      fd.append('file', file, 'file.dcm');
      fd.append('x', '0');
      fd.append('y', '0');
			//fd.append('slices', JSON.stringify([
      //  
      //  {
      //    index: 0,
      //    filename: 'slice_0.png',
      //    options: { }
      //  }
      //
      //]))
      
      // Post to route
      let fullUrl = endpoint
      
      xhr.open('POST', fullUrl , true);
      xhr.responseType = 'blob';
      
      // When POST succeeded
      xhr.onload = function(evt) {

        console.log(evt.target.response)
        
        // Get URL to PNG sent by server
        var url = window.URL.createObjectURL(evt.target.response);
        var img = new Image();

        // Draw received image on canvas
        img.onload = function () {

          // Create in memory canvas for color replacement
          let imgCanvas = document.createElement("canvas")
          imgCanvas.width = this.width,
          imgCanvas.height = this.height

          // Copy the image contents to the canvas
          let imgCtx = canvas.getContext("2d")
          imgCtx.drawImage(this, 0, 0)

          let imageData = imgCtx.getImageData(0, 0, this.width, this.height)
          let imagePixelArray = imageData.data

          let targetData = ctx.getImageData(0, 0, this.width, this.height)
          let targetPixelArray = targetData.data

          // 4 components - red, green, blue and alpha
          let length = targetPixelArray.length

          // Iterate and apply layer color
          for (var i = 3; i < length; i+= 4) {

            if (imagePixelArray[i] > 0) {
              targetPixelArray[i-3] = layerColor[0];
              targetPixelArray[i-2] = layerColor[1];
              targetPixelArray[i-1] = layerColor[2]
              targetPixelArray[i] = 255;
            }

          }

          ctx.putImageData(targetData, 0, 0);

          // Trigger refresh measurements
          Tegaki.donePainting();

          // If user waited on the layer while segmenting, change tool to brush
          if (_this.currentLayerTypeIndex === switchToIndex) {
            _this.setCurrentTool(0, layerTypeToSwitchTo, switchToIndex)
          }

					NProgress.done()

          layerType.isSegmenting = false

        };

        // Set URL on image
        img.src = url;


      };

      
      xhr.send(fd)
      
    },

    save: function () {

      let zip = new JSZip();

  		let longToShortName = {
  		  'Left Psoas': 'left-psoas',
        'Right Psoas': 'right-psoas',
        'Wall Muscle': 'wall-muscle',
        'Subcutaneous Fat': 'subcutaneous-fat',
        'Visceral Fat': 'visceral-fat'
  		};

  		let columnIndices = ['left-psoas', 'right-psoas', 'wall-muscle',
                          'subcutaneous-fat', 'visceral-fat'];


      // Highly dangerous magic numbers here
      for (let layer of this.layerTypes.slice(5)) {
        columnIndices.push(layer.name)
      }

      let rows = [];   // Just one for now, more later

      // Eventually loop over levels here ...
      let row = Array(this.layerTypes.length).fill();

      let j = 0

      // Iterate twice to get the right order
      for (let longName of Object.keys(longToShortName)) {

        let shortName = longToShortName[longName]
        let columnIndex = columnIndices.indexOf(shortName);

        for (let layer of this.layerTypes) {
          if (layer.name == longName)
            row[columnIndex] = layer.area;
        }

        j += 1

      }

      // Highly dangerous magic numbers here
      for (let layer of this.layerTypes.slice(5)) {
        row[j] = layer.area;
        j += 1
      }

      // ... to here

      // Pretend just one row, eventually there's more
      rows.push(row);

      let colText = columnIndices.join(','),
          rowText = rows.map( row => row.join(',') ).join("\n"),
          fullText = colText + "\n" + rowText;

      // Create measurements file
      zip.file("measurements.csv", fullText);

      // Create folder for layer images
      let img = zip; //zip.folder('layers');

      // Create individual
      for (let layer of this.layerTypes) {

        let layerName = layer.name
        let shortName = longToShortName[layerName]

        if (!shortName) {
          let id = layerName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z\-]/g, '').trim()
          shortName = id
        }

        let currentLayer = Tegaki.layers.filter(l => l.name == shortName)
        let layerCanvas = currentLayer[0].canvas

        // Get data URL as base 64
        let imgBase64 = layerCanvas.toDataURL('image/png'),
            strippedBase64 = imgBase64.split('base64,').pop();

		    img.file(shortName + ".png", strippedBase64, { base64: true });

      }


      // Add DICOM file
      let file = cornerstoneWADOImageLoader.fileManager.get(this.$root.selectedSliceIndex);

			var reader = new window.FileReader();
		  reader.readAsArrayBuffer(file);


      // If less than 10 slices in current serie
      let currentSerie = this.$root.series.filter(
        s => s.UID == this.$root.selectedSerieUID)[0];

			let patientName = currentSerie.slices[0].data.string('x00100020');


		  reader.onloadend = function() {

		    var base64data = reader.result;
				zip.file('slice_dicom.dcm', base64data, { base64: true });

		    var content = zip.generate({ type:"blob" });
		    saveAs(content, patientName + '.zip' );

		  }

    },

    showKeyboardShortcuts () {

      let $vm = this;

      $('#keyboard-shortcuts-modal').modal({
        closable: true
      }).modal('show');

    },

    previous () {
      Tegaki.destroy();
      this.$root.$router.go('/steps/level');
    },

    next () {

    }

  }

}
</script>

<style lang="less">

main {
  overflow: auto !important;
}

@panel-width: 420px;

.BrushSize {
  background: transparent !important;
  border-color: transparent !important;
}

.BrushSizeLabel {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
  padding: 0.85rem 1rem;
  color: white;
  font-size: 0.8em;
  white-space: nowrap;
}

.BrushSizeRange {
  margin-top: 1.2rem !important;
  margin-right: 1rem;
}

#toolbar {
  position: absolute;
  top: 10px;
  left: 10px;
  right: @panel-width;
  margin-right: 10px;
  z-index: 1;

  .item {
    padding: 0px 14px !important;
  }
}

.NewLayer {
  background-color: rgb(238, 238, 238);

  &.active {
    background-color: rgb(238, 238, 238) !important;
    input {
      background-color: rgb(238, 238, 238) !important;
    }
  }

  .LayerTypeSelect {
    margin-top: 1rem;

    .label {
      margin-top: 3px;
      float: left;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: bold;
      margin-right: 1rem;
    }

    select {
      width: ~"calc(100% - 160px)";
    }
  }
}

.NewLayerButton {
  display: block;
  background-color: rgb(243, 244, 245);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
  padding: .7em;
  text-align: center;
  margin-top: 1rem;
  border-radius: 2px;
  transition: background-color .2s;

  &, &:hover {
    color: black;
  }

  &:hover {
    background-color: white;
  }
}

#layers-controls {
  padding: 0.5rem 1rem 1rem 1rem;
  background: white;
  border-top: 1px solid rgba(34, 36, 38, 0.14902);

  span.label {
    margin-top: 7px;
    display: inline-block;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: bold;
  }

  input {
    float: right;
    width: ~"calc(100% - 110px)";
  }
}

#layers {
  position: absolute;
  top: 0;
  right: 0;
  width: @panel-width;
  bottom: 0;
  overflow: scroll;
  background: black;

  ul#layer-list {
    position: relative;
    margin: 0;
    list-style: none;
    padding: 0;
    background: white;

    li {
      position: relative;
      font-size: 14px;
      border-bottom: 1px solid rgba(34, 36, 38, 0.14902);
      padding: 1.5rem 1rem 1.5rem 4.5rem;

      &.active {
        background-color: rgb(243, 244, 245);
      }

      .scaler {
        display: flex;

        &.is-segmenting {
          transform: scale(0.6);
          opacity: .8;

        }
      }

      .LayerName {
        max-width: 134px;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: top;
      }

      span.color, span.add {
        display: inline-block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        position: absolute;
        top: 15px;
        left: 15px;

        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      }

      span.add {
        font-size: 18px;
        text-align: center;
        font-weight: 200;
        line-height: 30px;
        background-color: white;
      }

      input.add {
        width: 344px;
        border: none;
        height: 22px;
        margin-top: -2px;
        outline: none;
        background-color: rgb(238, 238, 238);
      }

      span.area {
        float: right;
      }

      .LayerActions {
        margin: 0 !important;
        min-height: 35px !important;
        position: absolute;
        top: 50%;
        right: 100px;
        transform: translateY(-50%);
        right: 100px;
        box-shadow: none !important;
        border: none !important;
        background: transparent !important;

        .item {
          width: 35px !important;
          padding: 0 !important;
          border: none !important;
          border-radius: 50% !important;

          &.active {
            background-color: rgb(92, 104, 115);
            color: white;
          }

          &:not(:first-child) {
            margin-left: .2rem
          }

          &::before {
            display: none;
          }

          &.is-segmenting {
            border-radius: 0 !important;
            animation: sk-rotateplane 1.2s infinite ease-in-out;
            i {
              visibility: hidden;
            }
          }
        }
      }
    }
  }
}

.LayerGroupName {
  text-transform: uppercase;
  letter-spacing: 4px;
  font-weight: bold;
  padding: .5rem 1.5rem !important;
  background: #393f44;
  color: white;
  font-size: 0.9em !important;
  border-top: 10px solid black;
}

#editor {
  overflow: scroll;
  position: absolute;
  top: 0;
  left: 0;
  right: @panel-width;
  bottom: 0;

  #tegaki-container {
    max-width: 100%;
    background: black;

    display: table;
    width: 100%;
    height: 100%;

    #tegaki {
      display: table-cell;
      vertical-align: middle;
      max-width: 100%;

      box-sizing: border-box;
      font-size: 0;
      text-align: center;

      image-rendering: optimizeSpeed;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: pixelated;
      image-rendering: -moz-crisp-edges;

      &.hide-layers {
        canvas.tegaki-layer:not([data-name="background"]) {
          display: none !important;
        }
      }

      // &.flex {
      //   display: flex;
      //   align-items: center;
      //   justify-content: center;
      // }

      #tegaki-cnt {
        position: relative;
        display: inline-block;

        #tegaki-layers {
          display: block;
          position: absolute;
          top: 0; left: 0;

          transform-origin: left top;

          #tegaki-ghost-layer, .tegaki-layer {
            position: absolute;
            left: 0;
          }

          #tegaki-ghost-layer {
            opacity: 0.5
          }

          canvas.tegaki-layer:not([data-name="background"]) {
            opacity: 0.5;
          }

        }
      }

      #tegaki-ctrl { display: none; }
    }
  }
}

#keyboard-shortcuts-modal {

  background: none;

  .shortcuts-container {

    background: rgba(78, 78, 78, 0.77);
    border: 1px solid white;
    padding: 15px;

    .header {
      background: none;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      padding: 10px 0 10px 0;
    }

    table {

      margin: 1rem auto;

      td {
        padding: .5rem;
        color: #fff;

        kbd {
          display: inline-block;
          margin: 0 6px;
          padding: 4px 0;
          font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 22px;
          color: #242729;
          text-shadow: 0 1px 0 #FFF;
          background-color: #f3f3f3;
          border: 1px solid #bac4cc;
          border-radius: 3px;
          box-shadow: 0px 2px 0 rgba(12, 13, 14, 0.31);
          white-space: nowrap;
          min-width: 35px;
          width: 40px;
          text-align: center;
        }
      }
    }


    .actions {
      background: none;
      text-align: center;
      padding: 10px 0 10px 0;
    }


  }


}

input[type="range"] {
  width: 100%;
  appearance: none;
  border: 1px solid #ddd;
  padding: 0;
  height: 0;
  margin-top: 1rem;
  margin-bottom: 1rem;

  &:focus {
    border-color: #ccc;
    outline: none !important;
  }

  &::-moz-range-track {
    background: none;
    border: 0;
  }

  &::-moz-focus-outer {
    border: 0;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    //border: 1px solid #ddd;
    height: 1.5rem;
    width: 1.5rem;
    background: #fff;
    background: #fff linear-gradient(transparent, rgba(0, 0, 0, 0.05));
    border-radius: 100%;
    box-shadow: 0 1px 2px 0 rgba(34, 36, 38, .15), 0 0 0 1px rgba(34, 36, 38, .15) inset;
  }

  &::-moz-range-thumb {
    //border: 1px solid #ddd;
    height: 1.5rem;
    width: 1.5rem;
    background: #fff;
    background: #fff linear-gradient(transparent, rgba(0, 0, 0, 0.05));
    border-radius: 100%;
    box-shadow: 0 1px 2px 0 rgba(34, 36, 38, .15), 0 0 0 1px rgba(34, 36, 38, .15) inset;
  }
}


@keyframes sk-rotateplane {
  0% {
    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)
  } 50% {
    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)
  } 100% {
    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
  }
}

</style>
