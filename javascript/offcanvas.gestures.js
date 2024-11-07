// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Off-canvas panel gestures
// -----------------------------------------------------------------------------

// Gesture support using Hammer.js. Panel can be closed via swipe down gesture.
//
// @see https://hammerjs.github.io/
//
// @see https://github.com/naver/hammer.js
//   We're using this fork of the original which is a bit more maintained.

AmbientImpact.onGlobals('Hammer', function() {
AmbientImpact.addComponent('OmnipediaSiteThemeOffcanvasGestures', function(
  offcanvasGestures, $,
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  const hammerProp = 'offcanvasHammer';

  this.addBehaviour(
    'OmnipediaSiteThemeOffcanvasGestures',
    'omnipedia-site-theme-offcanvas-gestures',
    'body',
    function(context, settings) {

      /**
       * Reference to the behaviour target element.
       *
       * @type {HTMLElement}
       */
      const behaviourTarget = this;

      $(this).on(`openOffcanvas.${eventNamespace}`, function(event) {

        /**
         * The off-canvas panel element.
         *
         * @type {HTMLElement}
         */
        const panel = event.target;

        $(behaviourTarget).prop(hammerProp, new Hammer(
          // Note that we're specifically targetting the panel content element
          // because for whatever reason, Chrome does not register the swipe if
          // we set this to the root panel element, nor if we set this to the
          // <html> element.
          $(panel).find('.offcanvas-panel__content')[0],
          {
            cssProps: {
              // Ensure text is still selectable; by default, Hammer sets this
              // to 'none', which is terrible for our UX since we're very
              // text-heavy and content-oriented.
              //
              // @see https://developer.mozilla.org/en-US/docs/Web/CSS/user-select
              userSelect: 'auto',
            },
            recognizers: [
              // By default, Hammer does not handle vertical swipe/pan to avoid
              // interfering with scrolling; however, scrolling is blocked when
              // the off-canvas panel opens, so this is not an issue for us.
              //
              // @see https://hammerjs.github.io/recognizer-swipe/
              [Hammer.Swipe, {direction: Hammer.DIRECTION_DOWN}],
            ],
          }
        ));

        $(behaviourTarget).prop(hammerProp).on('swipedown', function(event) {

          // There's no API to open or close the panel yet, so we have to
          // trigger a click on the close button.
          $(panel).prop('aiOffcanvas').elements.close.trigger('click');

        });

      })
      .on(`closeOffcanvas.${eventNamespace}`, function(event) {

        $(behaviourTarget).prop(hammerProp).destroy();

        // Hammer doesn't remove this when destroyed.
        //
        // @see https://github.com/hammerjs/hammer.js/pull/965
        $(
          $(behaviourTarget).prop(hammerProp).input.element,
        ).css('touch-action', '');

      });

    },
    function(context, settings, trigger) {

      /**
       * Reference to the behaviour target element.
       *
       * @type {HTMLElement}
       */
      const behaviourTarget = this;

      $(this).off([
        `openOffcanvas.${eventNamespace}`,
        `closeOffcanvas.${eventNamespace}`,
      ].join(' '));

      if (typeof $(this).prop(hammerProp) !== 'undefined') {

        // Hammer doesn't remove this when destroyed.
        //
        // @see https://github.com/hammerjs/hammer.js/pull/965
        $(
          $(behaviourTarget).prop(hammerProp).input.element,
        ).css('touch-action', '');

        $(this).prop(hammerProp).destroy();

      }

    }
  );

});
});

