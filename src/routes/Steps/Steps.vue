<template lang="jade">
#progress-bar.ui.top.attached.blue.progress( v-bind:style = "{ width: progress + '%' }" )
  .bar

#container
  header
    #brand.header-section
      a( href = '#' @click.prevent = "discardWork" style = 'outline: none' )
        img( src = 'https://coreslicer.com/static/logo-text-only.5ed932e.svg' height = '25' )

    #steps-navigation
      #steps-previous.header-section
        button#cs-step-previous.ui.icon.button(
          :disabled = 'stepIndex == 0 || singleSliceMode',
          @click = 'previousStep'
        )
          i.left.chevron.icon

      #steps-breadcrumbs
        .ui.five.top.attached.steps
          .step(
            v-for='step in steps'
            v-bind:class='{ active: $index === stepIndex, disabled: $index < stepIndex }'
          )
            i.icon {{ $index + 1 }}
            .content
              .title {{ step.title }}
              .description {{ step.description }}

      #steps-next.header-section
        template( v-if='stepIndex === 2' )
          button#save-button.ui.right.labeled.icon.green.button(
          data-intro="Click here to save your regions"
          data-position='left'
            @click='save'
          )
            i.save.icon
            | Save

        template( v-else )
          button#cs-step-next.ui.right.labeled.icon.button.chardinjs-show-element.chardinjs-relative-position(
            v-else
            data-intro="Click here when you're done",
            data-position='left',
            @click = 'nextStep'
          )
            i.right.chevron.icon

            template( v-if='isDecompressing')
              .ui.active.mini.inverted.inline.loader

            template( v-else )
              | Next


  main
    router-view

#discard-modal.ui.small.basic.modal.transition
  .ui.icon.header
    i.trash.outline.icon
    | Are you sure?

  .content
    p( style = 'text-align: center' )
      | Going back to the home page will discard all changes.

  .actions( style = 'text-align: center' )
    .ui.green.basic.cancel.inverted.button( style = 'margin: 0' )
      i.remove.icon
      | Cancel

    .ui.red.ok.inverted.button
      i.checkmark.icon
      | Discard

</template>

<script>

export default {

  name: 'Steps',

  data: function () {
    return {

      stepIndex: 0,
      progress: 0,
      isDecompressing: false,
      singleSliceMode: false,

      steps: [
        {
          title: 'Series',
          description: 'Select axial series to import'
        },
        {
          title: 'Level',
          description: 'Choose level for measurements'
        },
        {
          title: 'Regions',
          description: 'Measure regions of interest'
        }
      ]

    }
  },

  methods: {

    nextStep () {

      if (this.isDecompressing) return false

      let $child = this.$children[0];
      if ($child.next) $child.next();

    },

    previousStep () {

      // If less than 10 slices in current serie
      let currentSerie = this.$root.series.filter(
        s => s.UID == this.$root.selectedSerieUID)[0];
			
			// If in regions, show approve modal first
	    if (this.$children[0].constructor.name == 'Regions') {
				if (currentSerie.slices.length < 10) {
					this.discardDrawing(() => { this.$root.$router.go('/steps/select'); })
				} else {
					this.discardDrawing(() => { this.$root.$router.go('/steps/level'); })
				}
				return
	    }
			
      let $child = this.$children[0];
      if ($child.previous) $child.previous();

    },
		
    discardDrawing (callback) {

      let $vm = this;

      $('#discard-regions-modal').modal({
        closable: true,
        onApprove: callback
      }).modal('show');

    },

    discardWork () {

      let $vm = this;

      $('#discard-modal').modal({
        closable: true,
        onApprove: () => window.location = '/'
      }).modal('show');

    },

    save () {

      let $child = this.$children[0];
      if ($child.save) $child.save();

    }

  }

}

</script>

<style lang="less">

@headerHeight: 80px;

html, body {
  height: 100%;
  min-width: 1000px;
}

.chardinjs-top .chardinjs-tooltiptext, .chardinjs-bottom .chardinjs-tooltiptext {
  text-align: center;
}

#progress-bar {
  overflow: visible;
  z-index: 2;

  .bar {
    box-shadow: -3px -1px 6px 3px rgba(255, 255, 255, 0.59);
  }
}

#brand {
  margin-left: 1rem;

  img {
    position: relative;
    top: 2px;
  }
}

#steps-previous {
  margin-right: 1rem;
}

#steps-next {
  min-width: 220px;
  margin: 0 1rem;
}

#container {
  position: relative;

  header {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: @headerHeight;
    z-index: 0;
    background: #393F44;

    .header-section {
      padding: 0 1rem;

      display:flex;
      flex-direction:column;
      justify-content:space-around;
    }

    #steps-navigation {
      display: flex;
      flex-grow: 1;

      #steps-previous, #steps-next {
        border-bottom: 1px solid rgba(34, 36, 38, 0.14902);
      }

      #steps-breadcrumbs {
        flex-grow: 1;
        border-left: 1px solid #5c6873;
        border-right: 1px solid #5c6873;

        .steps {
          position: relative;
          top: -2px;
          border-left: 0;
          border-right: 0;
          border-bottom: 1px solid #393F44;
          text-align: left;

          .step {
            height: @headerHeight;
            background: transparent;
            border-color: #5c6873;

            .title, .description, .icon {
              color: rgb(218, 218, 218);
            }

            i.icon {
              font-family: Roboto;
            }

            &::after {
              background: #393F44;
              border-color: #778694;
            }

            &.active::after {
              background: #778694;
            }

            &.active {
              background: #778694;

              .title, .description, .icon {
                color: white;
              }
            }
          }
        }
      }
    }
  }

  main {
    position: fixed;
    top: @headerHeight;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background: #5c6873;
  }
}

#cs-step-text {
  line-height: 36px;
  font-size: 20px;
}
</style>
