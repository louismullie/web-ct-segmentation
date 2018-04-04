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
      h5 Select axial series to import

    .ui.padded.secondary.segment(
      data-intro='Select the axial series in order to import the scan into CoreSlicer',
      data-position='top'
    )
      .ui.form
        #series-container.ui.three.column.grid
          .column(
            v-for = "(i, serie) in series"
            @click = "selectSerie"
          )
            .ui.fluid.card(
              v-bind:class = "{ 'active': serie.UID == selectedSerieUID }"
            )
              .image
                img( v-bind:src = 'serie.thumbnail' )

                .ui.radio.checkbox
                  input.hidden(
                    type = 'radio',
                    name = 'scan',
                    tabindex = '0',
                    :value = 'serie.UID',
                    :checked = 'i == 0'
                  )
                  label

              .content
                .header {{ serie.description }}

</template>

<script>

import decompressDicomSerie from '../../../scripts/decompressDicomSerie.js'
import cornerstoneImageToBase64 from '../../../scripts/cornerstoneImageToBase64.js'

export default {

  name: 'Serie',

  data  () {
    return {
      series: this.$root.series,
      selectedSerieUID: this.$root.$data.selectedSerieUID || this.$root.series[0].UID
    }
  },

  ready () {

		this.$parent.stepIndex = 0;

		// Select axial series by default
    this.labelSerieOrientations()
    
    // Find axial series and select it by default
		let axialSeries = this.$root.series.find(s => s.orientation == 'AXIAL')
    
		if (axialSeries) {
      
      if (!axialSeries.description) {
        axialSeries.description = 'Axial';
      }
      
			let radioButton = $('input[type="radio"][value="' + axialSeries.UID + '"]')
			radioButton.prop('checked', 'checked')

			this.$data.selectedSerieUID = axialSeries.UID;

		}

  },

  methods: {

    showHelp () {
      setTimeout(() => {
        window.jQuery('body').chardinJs('start')
        window.jQuery('body').one('click', () => $('body').chardinJs('stop'))
      }, 500)
    },

    selectSerie (e) {

      // Toggle radios
      $('input[type="radio"]').removeProp('checked');
      let $currentSerieRadio = $(e.currentTarget).find('input[type="radio"]');
      $currentSerieRadio.prop('checked', 'checked');

      // Update selectedSerieUID, effectively enabling next button
      this.$data.selectedSerieUID = $currentSerieRadio.val();

    },
    
    labelSerieOrientations (e) {
      
      for (let serie of this.$root.series) {
        
        let firstSliceData
        
        // Skip cover slice in case its there
        if (serie.slices.length > 1)
          firstSliceData = serie.slices[1].data
        else
          firstSliceData = serie.slices[0].data
          
        let firstSliceOrientation = firstSliceData.string('x00200037').split('\\')
        
        firstSliceOrientation = firstSliceOrientation.map(e => parseFloat(e))
        let serieOrientation = this.getOrientation(firstSliceOrientation)
        
        serie.orientation = serieOrientation
      }
      
    },
    
    getMajorAxis: function(x, y, z) {
      
      let obliquityThresholdCosineValue = 0.001
      let orientationX = x < 0 ? "R" : "L"
      let orientationY = y < 0 ? "A" : "P"
      let orientationZ = z < 0 ? "F" : "H"

      let absX = Math.abs(x)
      let absY = Math.abs(y)
      let absZ = Math.abs(z)

      let axis = null
  
    	if (absX>obliquityThresholdCosineValue && absX>absY && absX>absZ) {
    		axis = orientationX
    	} else if (absY>obliquityThresholdCosineValue && absY>absX && absY>absZ) {
    		axis = orientationY
    	} else if (absZ>obliquityThresholdCosineValue && absZ>absX && absZ>absY) {
    		axis = orientationZ
    	}
  
      return axis
  
    },

    getOrientation: function (pos) {
  
      let rowAxis = this.getMajorAxis(pos[0], pos[1], pos[2])
      let colAxis = this.getMajorAxis(pos[3], pos[4], pos[5])
  
      let label
  
      if (rowAxis == null || colAxis == null)
        return "OBLIQUE"
  
    	if      ((rowAxis == "R" || rowAxis == "L") && (colAxis == "A" || colAxis == "P")) label="AXIAL";
    	else if ((colAxis == "R" || colAxis == "L") && (rowAxis == "A" || rowAxis == "P")) label="AXIAL";
    	else if ((rowAxis == "R" || rowAxis == "L") && (colAxis == "H" || colAxis == "F")) label="CORONAL";
    	else if ((colAxis == "R" || colAxis == "L") && (rowAxis == "H" || rowAxis == "F")) label="CORONAL";
    	else if ((rowAxis == "A" || rowAxis == "P") && (colAxis == "H" || colAxis == "F")) label="SAGITTAL";
    	else if ((colAxis == "A" || colAxis == "P") && (rowAxis == "H" || rowAxis == "F")) label="SAGITTAL";

      return label
  
    },

    next (e) {

      // Disable [next] button
      this.$parent.nextButtonState = 1;

      const currentSerie = this.$root.series.filter(s =>
        s.UID == this.$data.selectedSerieUID)[0];

      const transferSyntax = currentSerie.slices[0].data.string('x00020010');

      // If serie is uncompressed, resolve immediatly
      let processSerie = Promise.resolve()

      // If serie is JPEG2000, decompress it and override the slices'
      // getPixelData() to return the decompressed content
      if (transferSyntax == '1.2.840.10008.1.2.4.90') {

        const progressCb = p => NProgress.set(p)

        this.$parent.isDecompressing = true

				NProgress.start()

        processSerie = decompressDicomSerie(currentSerie, progressCb).then(decompressed => {

          for (let i = 0; i < currentSerie.slices.length; i++) {
            currentSerie.slices[i].isJpeg2000 = true
            currentSerie.slices[i].getPixelData = function () { return decompressed[i].items  };
          }

          let promise = Promise.resolve()

          if (currentSerie.slices.length < 10) {

            promise = Promise.all(currentSerie.slices.map(slice =>
              cornerstone.loadImage(slice.imageId, true)))

            promise.then(slices => {

              for (let i = 0; i < slices.length; i++) {
                currentSerie.slices[i].thumbnail = cornerstoneImageToBase64(slices[i])
              }

              return currentSerie.slices

            })

          }

          return promise

        });

      }

      // When everything is done, set serie as current serie and go to level step
      processSerie.then(() => {

        this.$root.$data.selectedSerieUID = this.$data.selectedSerieUID;

        if (currentSerie.slices.length > 1) {

          // Case 1: There [10..] slices
          // Go to the Level component, where user will select a slice on the WebGL viewer
          if (currentSerie.slices.length > 10) {
            NProgress.done()
            this.$parent.isDecompressing = false

            return this.$root.$router.go('/steps/level')

          // Case 2: There are [2..9] slices.
          // Go to the Select component, where user will select a slice thumbnail
          } else {

            // Generate thumbnails
            for (let i = 0; i < currentSerie.slices.length; i++) {
              if (currentSerie.slices[i].thumbnail) continue
              currentSerie.slices[i].thumbnail = cornerstoneImageToBase64(currentSerie.slices[i])
            }

           	NProgress.done()
            this.$parent.isDecompressing = false

            return this.$root.$router.go('/steps/select');

          }

        // Case 3 There is only one slice
        // Go to to the Region component with the only slice selected
        } else {

          let file = window.dicomFiles[currentSerie.slices[0].imageId];
          let imageId = cornerstoneWADOImageLoader.fileManager.add(file);

          cornerstone.loadImage(imageId, true).then(image => {

            // Load the DICOM pixel data
            var selectedSlice = this.$root.series.find(
              s => s.UID == this.$root.selectedSerieUID).slices[0];

            NProgress.done()
            this.$parent.isDecompressing = false

            this.$root.selectedSlice = selectedSlice;
            this.$root.$router.go('/steps/regions');

          })

        }

      })

    },

  }

}

</script>

<style lang="less" scoped>

#container {
  margin: 2rem 0;
}

#series-container {
  justify-content: center;
}

.card {
  cursor: pointer;

  &.active {
    box-shadow: 0px 0px 0px 1px #D4D4D5, 0px 4px 0px 0px #2185D0, 0px 1px 10px 0px #D4D4D5;
  }

  .checkbox {
    position: absolute;
    top: 5px; left: 5px;
  }

  .image {
    position: relative;
    padding-bottom: 100%; // ratio = (y / x * 100)%
    overflow: hidden;

    > img {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      bottom: 0;
      transform: translateY(-50%);
    }
  }
}

</style>
