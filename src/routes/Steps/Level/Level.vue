<template lang="jade">
.BottomLeftToolbar.ui.menu.left(
  data-intro="Show help",
  data-position='right'
)
  a.popup.icon.item(
    href='#',
    @click.prevent='showHelp'
  )
    i.help.icon

#container.ui.container
  .ui.segments
    .ui.padded.center.aligned.segment
      h5 Choose level for measurements

    .ui.padded.center.aligned.secondary.segment
      #viewer(
        data-intro='Click and drag on the image to scroll through the series',
        data-position='left'
      )
        #canvas-container(
          data-intro='Click and drag on the scrollbar to select the desired level',
          data-position='right'
        )
          #level-bar

          canvas#gl-canvas( width='512', height='512' )

        .dragdealer
          .handle
            .value
              i.sidebar.icon

script#vertex-shader2( type='x-shader/x-vertex' ).
  attribute vec4 vPosition; attribute vec2 vTexCoord; uniform vec4 inColor; varying vec4 outColor; varying vec2 fTexCoord; uniform mat4 uMVMatrix; uniform mat4 uProjMatrix; void main() { fTexCoord = vTexCoord; gl_Position = uProjMatrix * uMVMatrix * vPosition;
  outColor = inColor; }

script#fragment-shader2(type='x-shader/x-fragment').
  precision mediump float; varying vec4 outColor; varying vec2 fTexCoord; uniform sampler2D texture; void main() { gl_FragColor = outColor * texture2D(texture, fTexCoord).rgba; }

</template>

<script>

import cornerstoneImageToBase64 from '../../../scripts/cornerstoneImageToBase64.js'

export default  {

  name: 'Level',

  data () {
    return {
      selectedSerie: this.$root.series.filter(s => s.UID == this.$root.selectedSerieUID)[0],
      selectedSliceIndex: null
    }
  },

  ready () {

    let $vm = this;

    // Update steps layout
    $vm.$parent.stepIndex = 1;

    // Get selected serie
    let serie = $vm.selectedSerie;

    let canvas = document.getElementById('gl-canvas');

    // Boot dicom viewer
    let webGlDicomViewer = new WebGlDicomViewer(
      serie.slices,
      canvas,
      document.getElementById('fragment-shader2'),
      document.getElementById('vertex-shader2')
    );

    // Draggable element
    let levelBar = document.getElementById('level-bar');
    let levelBarOffset = 20
    let availableHeight = canvas.height - levelBarOffset * 2;

    new Dragdealer(document.querySelector('.dragdealer'), {
      horizontal: false,
      vertical: true,
      slide: false,
      yPrecision: canvas.height,
      y: 0.5,
      animationCallback (x, y) {
        levelBar.style.top = (Math.round(y * availableHeight) + levelBarOffset) + 'px';
      },
      callback (x, y) {
        let realPercentage = ((y * availableHeight) + levelBarOffset) / canvas.height
        $vm.selectedSliceIndex = Math.round((serie.slices.length - 1) * realPercentage)
      }
    });

    $vm.selectedSliceIndex = Math.round((serie.slices.length - 1) * 0.5);
    $vm.$root.selectedSliceIndex = $vm.selectedSliceIndex;

  },

  methods: {

    showHelp () {
      setTimeout(() => {
        window.jQuery('body').chardinJs('start')
        window.jQuery('body').one('click', () => $('body').chardinJs('stop'))
      }, 500)
    },

    previous () {
      this.$root.$router.go('/steps/serie');
    },

    next () {

      let selectedSliceIndex = this.selectedSliceIndex,
          selectedImageId = this.selectedSerie.slices[selectedSliceIndex].imageId

      cornerstone.loadImage(selectedImageId, true).then(selectedSlice => {

        let cornerstoneSliceIndex = parseFloat(selectedImageId.split(':')[1])+1;

        this.$root.selectedSlice = selectedSlice;
        this.$root.selectedSliceIndex = cornerstoneSliceIndex;
        this.$root.$router.go('/steps/regions');

      });

    }

  }

}

</script>

<style lang="less" scoped>

#container {
  margin-top: 2rem;
}

#viewer {
  display: inline-block;

  #canvas-container {
    display: inline-block;
    position: relative;

    #level-bar {
      position: absolute;
      left: 0; top: 20px;
      width: 100%;
      height: 1px;
      background-color: rgba(81, 203, 238, 0.8);
    }

    #gl-canvas {
      cursor: ns-resize;
    }
  }

  .dragdealer {
    display: inline-block;
    width: 30px;
    height: 512px;

    .handle {
      width: 30px;
      height: 40px;
      line-height: 40px;
      background-color: rgba(0, 0, 0, 0.1);
      font-size: 12px;
      cursor: row-resize;
    }
  }
}
</style>
