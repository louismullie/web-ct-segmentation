<template lang="jade">
#app
  router-view
</template>

<script>

export default {

  name: 'Coreslicer',

  data () {
    return {
      series: [],
      selectedSerieUID: null,
      selectedSliceIndex: null,
      selectedSliceSizeInfo: null,
      selectedSliceRescaleIntercept: null
    }
  }

}

</script>

<style>

* {
     -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer */
   -khtml-user-select: none; /* KHTML browsers (e.g. Konqueror) */
  -webkit-user-select: none; /* Chrome, Safari, and Opera */
  -webkit-touch-callout: none; /* Disable Android and iOS callouts*/
}

.BottomLeftToolbar {
  position: fixed;
  z-index: 100;
  left: 10px;
  bottom: 10px;
  margin: 0 !important;
}

.ui.button {
  font-weight: 400;
}

.ui.progress {
  transition: width .1s linear;
}

.ui.progress .bar {
  min-width: 0 !important;
  width: 100%;
}

.hidden, [hidden] {
  display: none;
}

</style>
