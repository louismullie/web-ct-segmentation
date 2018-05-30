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
    data-intro="Undo and redo",
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

    //a.popup.icon.item(
    //  href='#',
    //  @click.prevent='magicSegmentation'
    //)
    //  i.lightning.icon

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
      li.LayerGroupName(
        v-bind:class='[layerTypes.length == 0 ? "hidden" : "visible"]',
              
      ) Saved Regions
    
      li(
        v-for='layerType in layerTypes',
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
                (layerType.endpointToolType == '1'
                  ? setToolToPicker(layerType, $index)
                  : applySegmentationPreset(layerType, $index) )
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
              @click.prevent='deleteLayer($index)'
            )
    
              i.trash.icon

    
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
          span.label Enter plugin callback URL
          input.add(
            type='text',
            placeholder='http://your-website.com/endpoint',
            v-model='newLayer.endpoint',
          )
          
        .LayerTypeSelect(v-show=`newLayer.name !== ''`)
          span.label(style='float: none') Select plugin trigger
          br
          input.add(
            type='radio',
            id='radioWholeSlice',
            name='toolType',
            value='0',
            style='width: auto',
            v-model='newLayer.endpointToolType',
          )
          label.add(
            for='radioWholeSlice'
          )
            | &nbsp; Whole slice &nbsp; &nbsp;
            
          
          input.add(
            type='radio',
            id='radioPointAndClick',
            name='toolType',
            value='1',
            style='width: auto',
            v-model='newLayer.endpointToolType',
          )
          
          label.add(
            for='radioPointAndClick'
          )
            | &nbsp; Point and click
          
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

        // here
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
    const viewH = Math.min(viewW * sliceImg.height / sliceImg.width, viewW * 3/4);
    // max out at 4:3

    const scaleMin = viewW / imageW // if image is larger than viewport, don't resize
    const scaleMax = 2 // To ensure brush doesn't have to go > 128px
    const scaleStep = 0.1

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
      if (Tegaki.isWaitingForSegmentationPoint) {
        Tegaki.isWaitingForSegmentationPoint = false
				this.applyCursorPreset(tegakiCursorPos)
        return;
      }

      let canvas = Tegaki.layers[Tegaki.activeLayer].canvas

      let i, ctx, dest, data, len;

      ctx = canvas.getContext('2d')
      dest = ctx.getImageData(0, 0, canvas.width, canvas.height);
      data = dest.data,
      len = data.length;

      let totalPixels = 0
      let totalHU = 0
        
      for (i = 3; i < len; i += 4) {
        if (data[i] > 0) {
          totalPixels++
          totalHU += (Tegaki.selectedSlicePixelData[Math.floor(i/4)] + 
                     Tegaki.selectedSliceRescaleIntercept)
        }
      }
      
      let area = totalPixels * Tegaki.selectedSlicePixelSpacing / 100
      let meanHU = totalHU / totalPixels
      
      let layerType = this.layerTypes[this.currentLayerTypeIndex]
        
      layerType.area = area;
      layerType.meanHU = meanHU;

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
        let totalHU = 0

        for (i = 3; i < len; i += 4) {
          if (data[i] > 0) {
            totalPixels++;
            totalHU += (Tegaki.selectedSlicePixelData[Math.floor(i/4)] + 
                       Tegaki.selectedSliceRescaleIntercept)
          }
        }

        let area = totalPixels * Tegaki.selectedSlicePixelSpacing / 100;
        let meanHU = totalHU / totalPixels
            
        let layerType = _this.layerTypes.find(t => t.id == layer.name)
        layerType.area = area;
        layerType.meanHU = meanHU

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
      return [this.layerTypes, this.layerTypes]
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
  
    getCurrentSliceFile () {
      
      let imageId = $vm.$root.selectedSlice.imageId
      let cornerstoneImageIndex = imageId.split(':')[1]
        
      let file = cornerstoneWADOImageLoader.fileManager.get(cornerstoneImageIndex);
      
      return file
    
    },

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
      localStorage.setItem('layerTypes', JSON.stringify(this.layerTypes))

    },

    createLayer: function () {

      const name = this.newLayer.name
      const endpoint = this.newLayer.endpoint
      const endpointToolType = this.newLayer.endpointToolType
          
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
        endpoint,
        endpointToolType,
        area: 0.00,
        isSegmenting: false
      }

      newLayerType.tegakiLayerIndex = Tegaki.addLayer(newLayerType.id, 0.5)
      this.layerTypes.push(newLayerType)
        
      // Commit the new layer type to memory
      localStorage.setItem("layerTypes", JSON.stringify(this.layerTypes))

      // Reset new Layer
      this.newLayer.name = ''
      
      let newLayerTypeIndex = this.layerTypes.length - 1
          
      // Switch to layer
      this.setCurrentTool(0, newLayerType, newLayerTypeIndex)
      this.setActiveLayerType(newLayerType, newLayerTypeIndex)

    },

    setActiveLayerType: function (layerType, switchToIndex) {

      if (Number.isInteger(switchToIndex))
        this.currentLayerTypeIndex = switchToIndex
      
      if (this.layerTypes.length > 0) {
        Tegaki.setActiveLayer(layerType.tegakiLayerIndex)
        Tegaki.setToolColor(layerType.color)
        Tegaki.setToolThreshold(layerType.threshold)
      }
      
      Tegaki.isWaitingForSegmentationPoint = false
      
      console.info('Layer type set to', layerType.name)

    },

    setCurrentTool: function (toolI, layerTypeToSwitchTo, layerTypeToSwitchToIndex) {

      // Do not allow to switch to a tool that is in a layer that is segmenting
      if (layerTypeToSwitchTo.isSegmenting) return

      this.currentTool = toolI
      this.setActiveLayerType(layerTypeToSwitchTo, layerTypeToSwitchToIndex)

    },

    setToolToPicker: function (layerType, layerTypeIndex, endpoint) {
      
      // Do not trigger multiple picker watchers for the same layer type
      if (layerType.isSegmenting) return false

      // Switch to layer
      this.setActiveLayerType(layerType, layerTypeIndex)

      // Set tool to picker
      this.setCurrentTool(2, layerType, layerTypeIndex)

      // Set the flag that Tegaki.donePainting() will use to watch for the point click
      Tegaki.isWaitingForSegmentationPoint = true

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
      
      // Mark layerType as loading
      layerType.isSegmenting = true;

      // Get active canvas
      let canvas = Tegaki.layers[Tegaki.activeLayer].canvas,
          ctx = canvas.getContext('2d');

      // Create request
      let xhr = new XMLHttpRequest(),
          fd  = new FormData();

      // Add DICOM file
      let selectedSliceIndex = this.$root.selectedSliceIndex
      let sliceName = 'slice_' + selectedSliceIndex +  '.dcm'
      let file = this.getCurrentSliceFile()
      
      fd.append('slices', JSON.stringify([
        {
          filename: sliceName
        }
      ]));
      
      fd.append(sliceName, file, sliceName);

      // Add other options
			fd.append('x', cursorPos.x);
      fd.append('y', cursorPos.y)
      
      // Post to route
      let fullUrl = layerType.endpoint;

      xhr.open('POST', fullUrl , true);
      xhr.responseType = 'blob';

      // When POST succeeded
      xhr.onload = function(evt) {

        // Catch errors
        if (evt.currentTarget.status !== 200) {
          
          if (_this.currentLayerTypeIndex === currentLayerTypeIndex) {
            _this.setCurrentTool(0, layerType, currentLayerTypeIndex)
          }
					NProgress.done()
 
          layerType.isSegmenting = false
            
          alert('Error while using brush function.')
          console.log(evt)
          
        }
        
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
          Tegaki.isWaitingForSegmentationPoint = false
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


    applySegmentationPreset : function (layerTypeToSwitchTo, switchToIndex) {

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

      // Get active canvas
      let canvas = Tegaki.layers[Tegaki.activeLayer].canvas,
          ctx = canvas.getContext('2d');

      // Create request
      let xhr = new XMLHttpRequest()
      
      // Create form data
      let fd  = new FormData()
    
      // Get DICOM for the current slice
      let sliceIndex = this.$root.selectedSliceIndex
      let file = this.getCurrentSliceFile()
      
      let dcmFilename = 'slice_'+sliceIndex+'.dcm'

		  fd.append(dcmFilename, file, dcmFilename);

		  // Add other options
      fd.append('slices', JSON.stringify([{ index: 0, filename: dcmFilename }]))
      
      // Post to route
      let fullUrl = layerType.endpoint
      
      xhr.open('POST', fullUrl , true);
      xhr.responseType = 'blob';
      
      // When POST succeeded
      xhr.onload = function(evt) {
        
        if (evt.currentTarget.status !== 200) {
          
          if (_this.currentLayerTypeIndex === switchToIndex) {
            _this.setCurrentTool(0, layerTypeToSwitchTo, switchToIndex)
          }
          
					NProgress.done()
 
          layerType.isSegmenting = false
        
          alert('Error while using brush function.')
  
          console.log(evt)
    
        }
        
        // Get URL to PNG sent by server
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

  		let columnIndices = _.flatten(_.map(this.layerTypes, (layerType) => {
        return [layerType.id + '-area', layerType.id + '-hu']
  		 }));

      let rows = [];
      let row = Array(this.layerTypes.length*2).fill();

      let j = 0

      for (let layer of this.layerTypes) {
        row[j] = layer.area;
        row[j+1] = layer.meanHU;
        j += 2
      }

      // Pretend just one row, eventually there's more
      rows.push(row);

      let sliceIndex = this.$root.selectedSliceIndex
      let dcmFilename = 'slice_'+sliceIndex+'.dcm'
        
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
        let shortName = layer.id

        let currentLayer = Tegaki.layers.filter(l => l.name == shortName)
        let layerCanvas = currentLayer[0].canvas

        // Get data URL as base 64
        let imgBase64 = layerCanvas.toDataURL('image/png'),
            strippedBase64 = imgBase64.split('base64,').pop();

		    img.file(shortName + ".png", strippedBase64, { base64: true });

      }

      // Add DICOM file
      let file = this.getCurrentSliceFile()

			var reader = new window.FileReader();
		  reader.readAsArrayBuffer(file);

      // If less than 10 slices in current serie
      let currentSerie = this.$root.series.filter(
        s => s.UID == this.$root.selectedSerieUID)[0];

			let patientName = currentSerie.slices[0].data.string('x00100020');

		  reader.onloadend = function() {

		    var base64data = reader.result;
				zip.file(dcmFilename, base64data, { base64: true });

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
            animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
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


.sk-fading-circle {
  margin: 40px auto;
  width: 40px;
  height: 40px;
  position: relative; }
  .sk-fading-circle .sk-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0; }
  .sk-fading-circle .sk-circle:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: #333;
    border-radius: 100%;
    -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
            animation: sk-circleFadeDelay 1.2s infinite ease-in-out both; }
  .sk-fading-circle .sk-circle2 {
    -webkit-transform: rotate(30deg);
        -ms-transform: rotate(30deg);
            transform: rotate(30deg); }
  .sk-fading-circle .sk-circle3 {
    -webkit-transform: rotate(60deg);
        -ms-transform: rotate(60deg);
            transform: rotate(60deg); }
  .sk-fading-circle .sk-circle4 {
    -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
            transform: rotate(90deg); }
  .sk-fading-circle .sk-circle5 {
    -webkit-transform: rotate(120deg);
        -ms-transform: rotate(120deg);
            transform: rotate(120deg); }
  .sk-fading-circle .sk-circle6 {
    -webkit-transform: rotate(150deg);
        -ms-transform: rotate(150deg);
            transform: rotate(150deg); }
  .sk-fading-circle .sk-circle7 {
    -webkit-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
            transform: rotate(180deg); }
  .sk-fading-circle .sk-circle8 {
    -webkit-transform: rotate(210deg);
        -ms-transform: rotate(210deg);
            transform: rotate(210deg); }
  .sk-fading-circle .sk-circle9 {
    -webkit-transform: rotate(240deg);
        -ms-transform: rotate(240deg);
            transform: rotate(240deg); }
  .sk-fading-circle .sk-circle10 {
    -webkit-transform: rotate(270deg);
        -ms-transform: rotate(270deg);
            transform: rotate(270deg); }
  .sk-fading-circle .sk-circle11 {
    -webkit-transform: rotate(300deg);
        -ms-transform: rotate(300deg);
            transform: rotate(300deg); }
  .sk-fading-circle .sk-circle12 {
    -webkit-transform: rotate(330deg);
        -ms-transform: rotate(330deg);
            transform: rotate(330deg); }
  .sk-fading-circle .sk-circle2:before {
    -webkit-animation-delay: -1.1s;
            animation-delay: -1.1s; }
  .sk-fading-circle .sk-circle3:before {
    -webkit-animation-delay: -1s;
            animation-delay: -1s; }
  .sk-fading-circle .sk-circle4:before {
    -webkit-animation-delay: -0.9s;
            animation-delay: -0.9s; }
  .sk-fading-circle .sk-circle5:before {
    -webkit-animation-delay: -0.8s;
            animation-delay: -0.8s; }
  .sk-fading-circle .sk-circle6:before {
    -webkit-animation-delay: -0.7s;
            animation-delay: -0.7s; }
  .sk-fading-circle .sk-circle7:before {
    -webkit-animation-delay: -0.6s;
            animation-delay: -0.6s; }
  .sk-fading-circle .sk-circle8:before {
    -webkit-animation-delay: -0.5s;
            animation-delay: -0.5s; }
  .sk-fading-circle .sk-circle9:before {
    -webkit-animation-delay: -0.4s;
            animation-delay: -0.4s; }
  .sk-fading-circle .sk-circle10:before {
    -webkit-animation-delay: -0.3s;
            animation-delay: -0.3s; }
  .sk-fading-circle .sk-circle11:before {
    -webkit-animation-delay: -0.2s;
            animation-delay: -0.2s; }
  .sk-fading-circle .sk-circle12:before {
    -webkit-animation-delay: -0.1s;
            animation-delay: -0.1s; }

@-webkit-keyframes sk-circleFadeDelay {
  0%, 39%, 100% {
    opacity: 0; }
  40% {
    opacity: 1; } }

@keyframes sk-circleFadeDelay {
  0%, 39%, 100% {
    opacity: 0; }
  40% {
    opacity: 1; } }


</style>
