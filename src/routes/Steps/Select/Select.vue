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

    #slices-container.ui.padded.center.aligned.secondary.segment(
      data-intro='Choose level for measurements',
      data-position='top'
    )
      .ui.form
        .ui.three.column.grid

          .column(
            v-for = "(i, slice) in selectedSerie.slices"
            @click = "selectedSliceIndex = i"
          )
            .ui.fluid.card(
              :class = "{ active: i === selectedSliceIndex }"
            )
              .image
                img( :src = 'slice.thumbnail' )

                .ui.radio.checkbox
                  input.hidden(
                    type = 'radio',
                    name = 'scan',
                    tabindex = '0',
                    :checked = 'i === selectedSliceIndex'
                  )
                  label

</template>

<script>

export default  {

  name: 'Level',

  data () {
    return {
      selectedSerie: this.$root.series.find(s => s.UID == this.$root.selectedSerieUID),
      selectedSliceIndex: 0
    }
  },

  ready () {

    // Update steps layout
    this.$parent.stepIndex = 1

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

      this.$root.selectedSlice = this.selectedSerie.slices[this.selectedSliceIndex]
      this.$root.selectedSliceIndex = this.selectedSliceIndex
      let cornerstoneSliceIndex = parseFloat(this.$root.selectedSlice.imageId.split(':')[1])+1;
      this.$root.$router.go('/steps/regions');

    }

  }

}

</script>

<style lang="less" scoped>

#container {
  margin: 2rem 0;
}

#slices-container {
  justify-content: center;
}

.card {
  cursor: pointer;

  .checkbox {
    position: absolute;
    top: 5px; left: 5px;
  }

  opacity: .85;
  &.active {
    opacity: 1;
    box-shadow: 0px 4px 0px 0px #2185D0;
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
