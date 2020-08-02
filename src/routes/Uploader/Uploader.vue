<template lang="jade">
#cs-container.ui.inverted.vertical.center.aligned.segment
  #cs-hero.ui.text.container
    a( v-link = "{ path: '/' }" ).Logo
      img( src = 'https://coreslicer.com/static/logo-with-brand.4a2e415.svg' height = '50' )

    br
    p(style="font-size:1rem")  CoreSlicer is for research and educational purposes only. <br> By using this website, you agree to our <u><a href="https://github.com/louismullie/coreslicer/blob/master/TERMS.md" />terms of use.</a></u>
          
    #cs-dropzone(
      v-if='isChrome',
      v-on:dragover = "dragEnter"
      v-on:dragleave = "dragLeave"
      v-on:drop.prevent.stop = "drop"
      v-bind:class="{ 'hover': isHovered }"
    )
      .ui.segments
        .ui.secondary.segment
          p.action
            i.cloud.upload.icon
            | Drag &amp; drop DICOM folder or <br>files to get started

        .ui.segment
          .ui.top.attached.blue.progress( v-bind:style = "{ width: progress + '%' }" )
            .bar

          a.ui.right.labeled.icon.blue.button(
            href = '#'
            @click.prevent = 'openFileDialog'
          )
            i.folder.open.icon
            |or, <b>Select manually</b>

    .ChromeNotice(v-else)
      .ChromeNoticeIcon
        i.warning.sign.icon
      | CoreSlicer is designed for Google Chrome. Other browsers are not supported.<br> If you wish use CoreSlicer, please follow this #[a(href='https://www.google.com/chrome/' target='_blank') link] to install Chrome.

    .ui.text.container( v-if='isChrome' )
     
      a( href = 'https://github.com/louismullie/coreslicer' ).ui.right.labeled.icon.small.grey.button
        i.cloud.download.icon
        |Download source code
          
      a( href = 'https://coreslicer.com/static/video.html' ).ui.right.labeled.icon.small.grey.button
        i.play.circle.icon
        |Watch a video tutorial
        
  #cs-footer-divider.ui.divider.inverted

  #cs-footer.ui.text.container
    
    p &copy; Jonathan Afilalo and Louis Mullie, 2014-2019

modal(name='hello-world') Testing
    

//- Hidden file dialog

input#fileDialog(
  type = 'file'
  multiple
  webkitdirectory
  style = 'display: none'
  @change = 'loadFromFileDialog'
)

</template>
 
<script>

import loadDataTransferItems from './loadDataTransferItems.js'
import loadDicomSeries from './loadDicomSeries.js'
import cornerstoneImageToBase64 from '../../scripts/cornerstoneImageToBase64.js'
import decompressDicomSerie from '../../scripts/decompressDicomSerie.js'

export default {

  name: 'Uploader',

  data () {
    return {
      isHovered: false,
      isUploading: false,
      progress: 0
    }
  },

  computed: {
    isChrome () {
      return /chrome/i.test(navigator.userAgent)
    }
  },

  methods: {

    /* File processing function */

    processFilePromise (filePromise) {

      filePromise
        .then(files => loadDicomSeries(files, f => {

          this.$set('progress', Math.round(f * 100));

        }))
        .then(series => {

          // If no valid DICOM files have been uploaded,
          // unlock uploader and cancel everything
          if (series.length == 0) {
            this.isUploading = false;
            this.isHovered = false;
            return alert('No DICOM files uploaded.');
          }

          this.$root.series = series;


          if (series.length == 1 && series[0].slices.length == 1) {

            this.$root.selectedSerieUID = series[0].UID;
            this.$root.selectedSlice = series[0].slices[0];
            this.$root.selectedSliceIndex = 0;

            const currentSerie = this.$root.series[0]
            const currentSlice = currentSerie.slices[0]

			      const transferSyntax = currentSlice.data.string('x00020010');

						// It's a JPEG2000 --> decompress
						if (transferSyntax == '1.2.840.10008.1.2.4.90') {

							NProgress.start()

							let progressCb = function (progress) {
								NProgress.set(progress);
							}

							let processSerie = decompressDicomSerie(currentSerie, progressCb).then(decompressed => {

								let currentSliceId = currentSerie.slices[0].imageId;

								currentSerie.slices[0].isJpeg2000 = true
								currentSerie.slices[0].getPixelData = function () { return decompressed[0].items  };

								cornerstone.loadImage(currentSliceId, true)
									.then(image => {

			              currentSlice.thumbnail = cornerstoneImageToBase64(image);
										NProgress.done()
			              this.$root.$router.go('/steps/regions');

									})

							});

						} else {

	            cornerstone.loadImage(currentSlice.imageId, true)
	            .then(image => {
	              currentSlice.thumbnail = cornerstoneImageToBase64(image);
	              this.$root.$router.go('/steps/regions');

	            });

						}

          } else {
            this.$router.go('/steps/serie');
          }


        });

    },

    /* File dialog events */

    openFileDialog () {
      document.querySelector('#fileDialog').click();
    },

    loadFromFileDialog (e) {

      let files = e.target.files;
      if (files.length == 0) return;

      // Lock in uploading state
      if (this.$parent.isUploading) return;
      this.$parent.isUploading = true;

      this.processFilePromise(Promise.resolve(files))

    },

    /* Drag and drop events */

    dragEnter (e) {
      this.isHovered = true;
    },

    dragLeave (e) {
      this.isHovered = false;
    },

    drop (e) {

      // Lock in uploading state
      if (this.isUploading) return;
      this.isUploading = true;

      // Remove hover style
      this.isHovered = false;

      // Use webkitGetAsEntry() if available
      let filePromise = e.dataTransfer.items
        ? loadDataTransferItems(e.dataTransfer.items)
        : Promise.resolve(e.dataTransfer.files);

      this.processFilePromise(filePromise)

    },
    
    //
    
    openTermsModal () {
      this.$modal.show('hello-world', { foo: 'bar' })
    },
    
    openPrivacyModal () {
      this.$modal.show('hello-world', { foo: 'bar' })
    }

  }
}

</script>

<style lang="less" scoped>

.ChromeNotice {
  margin: 12rem 0 12rem 0;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 3px;
}

.ChromeNoticeIcon {
  font-size: 2rem;
  display: inline-block;
  float: left;
}

#cs-container {
  min-height: 100vh;
  padding: 3.5rem 0 !important;
}

.Logo {
  position: relative;
  display: block;
}

.BetaNotice {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #f95858;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 2px;
  font-size: 11px;
  padding: 2px 8px;
  color: #ffffff;
  border-radius: 2px;
  box-shadow: 1px 1px 0 0px rgba(255, 255, 255, 0.33);
  text-shadow: 1px 1px black;
}

#cs-footer-divider {
  margin: 2rem 0 !important;
}

#cs-footer {
  font-size: 14px !important;

  .menu.center {
    display: inline-flex;
    margin-top: 0;
  }
}

#cs-dropzone {
  margin: 3.75rem auto;
  max-width: 400px;

  &.hover .ui.secondary {
    background: #C4D5FF;

    i.icon {
      color: white !important;
    }
  }

  p.action {
    padding: 2rem 0;
    font-size: 20px;
    line-height: 1.4;
    font-family: 'Roboto', 'Helvetica Neue', Arial, Helvetica, sans-serif;

    i.cloud.upload.icon {
      display: block;
      margin: 0 auto 2rem auto;
      font-size: 4em;
      color: #CCD2D8;
    }
  }

  a#choose-file {
    font-weight: 400;
  }
}
</style>
