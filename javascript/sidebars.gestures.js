// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Sidebars gestures
// -----------------------------------------------------------------------------

// Gesture support using Hammer.js.
//
// @see https://hammerjs.github.io/
//
// @see https://github.com/naver/hammer.js
//   We're using this fork of the original which is a bit more maintained.

AmbientImpact.onGlobals('Hammer', function() {
AmbientImpact.on([
  'fastdom',
  'OmnipediaSiteThemeSidebars',
], function(aiFastDom, sidebars) {
AmbientImpact.addComponent('OmnipediaSiteThemeSidebarsGestures', function(
  sidebarsGestures, $,
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * FastDom instance.
   *
   * @type {FastDom}
   */
  const fastdom = aiFastDom.getInstance();

  /**
   * Represents the sidebars gestures support.
   */
  class SidebarsGestures {

    /**
     * The Sidebars instance we're providing gesture support for.
     *
     * @type {Sidebars}
     */
    #sidebars;

    /**
     * Hammer instance watching the root (<html>) element.
     *
     * @type {Hammer}
     *
     * @see https://hammerjs.github.io/
     */
    #hammer;

    /**
     * Constructor.
     *
     * @param {Sidebars} sidebars
     *   A Sidebars instance.
     */
    constructor(sidebars) {

      this.#sidebars = sidebars;

      this.#hammer = new Hammer(document.documentElement, {cssProps: {
        // Ensure text is still selectable; by default, Hammer sets this
        // to 'none', which is terrible for our UX since we're very text-heavy
        // and content-oriented.
        //
        // @see https://developer.mozilla.org/en-US/docs/Web/CSS/user-select
        userSelect: 'auto',
      }});

      this.#bindEventHandlers();

    }

    /**
     * Destroy this instance.
     *
     * @return {Promise}
     *   A Promise that resolves when various DOM tasks are complete.
     */
    destroy() {

      this.#unbindEventHandlers();

      this.#hammer.destroy();

      return Promise.resolve();

    }

    /**
     * Bind all of our event handlers.
     *
     * @see this~#unbindEventHandlers()
     */
    async #bindEventHandlers() {

      /**
       * Reference to the current instance.
       *
       * @type {SidebarsGestures}
       */
      const that = this;

      await this.#sidebars.updateOffCanvas();

      if (this.#sidebars.isOpen() === true) {

        this.#bindOpenedHandlers();

      } else {

        this.#bindClosedHandlers();

      }

      this.#sidebars.$sidebars.on(
        `omnipediaSidebarsMenuOpen.${eventNamespace}`,
      async function(event, sidebars) {

        that.#bindOpenedHandlers();

      }).on(`omnipediaSidebarsMenuClose.${eventNamespace}`, async function(
        event, sidebars,
      ) {

        that.#bindClosedHandlers();

      }).one(`OmnipediaSidebarsDestroyed.${eventNamespace}`, function(
        event, sidebars,
      ) {
        that.destroy();
      });

    }

    /**
     * Unbind all of our event handlers.
     *
     * @see this~#bindEventHandlers()
     */
    #unbindEventHandlers() {

      this.#sidebars.$sidebars.off([
        `omnipediaSidebarsMenuOpen.${eventNamespace}`,
        `omnipediaSidebarsMenuClose.${eventNamespace}`,
        // Don't unbind the one-off OmnipediaSidebarsDestroyed event handler as
        // that auto destroys this instance.
      ].join(' '));

      // We call this.#hammer.destroy() so we probably don't need to unbind from
      // it at this point as it's supposed to do that for us.

    }

    /**
     * Get the sidebar gesture direction based on the document text direction.
     *
     * @param {Boolean} reverse
     *   Whether to reverse the direction.
     *
     * @return {String}
     */
    async #getGestureEventDirection(reverse) {

      const documentDirection = await fastdom.measure(function() {
        return $(document.documentElement).attr('dir');
      });

      if (documentDirection === 'ltr') {

        return reverse !== true ? 'left' : 'right';

      } else if (documentDirection === 'rtl') {

        return reverse !== true ? 'right' : 'left';

      }

    }

    /**
     * Bind event handlers when in an opened state.
     */
    async #bindOpenedHandlers() {

      /**
       * Reference to the current instance.
       *
       * @type {SidebarsGestures}
       */
      const that = this;

      this.#hammer.off(
        'swipeleft swiperight',
      );

      const direction = await this.#getGestureEventDirection(true);

      this.#hammer.on(
        `swipe${direction}`,
        function(event) {

          // Don't do anything if sidebars are not off-canvas.
          if (that.#sidebars.isOffCanvas() !== true) {
            return;
          }

          that.#sidebars.close();

        },
      );

    }

    /**
     * Bind event handlers when in an closed state.
     */
    async #bindClosedHandlers() {

      /**
       * Reference to the current instance.
       *
       * @type {SidebarsGestures}
       */
      const that = this;

      this.#hammer.off(
        'swipeleft swiperight',
      );

      const direction = await this.#getGestureEventDirection(false);

      this.#hammer.on(
        `swipe${direction}`,
        function(event) {

          // Don't do anything if sidebars are not off-canvas.
          if (that.#sidebars.isOffCanvas() !== true) {
            return;
          }

          that.#sidebars.open();

        },
      );

    }

  }

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarsGestures',
    'omnipedia-site-theme-sidebars-gestures',
    '.layout-container',
    function(context, settings) {

      $(this).prop('OmnipediaSidebarsGestures', new SidebarsGestures(
        $(this).prop('OmnipediaSidebars'),
      ));

    },
    function(context, settings, trigger) {

      // SidebarsGestures destroys itself on the OmnipediaSidebarsDestroyed
      // event so we just need to remove the property and let browser garbage
      // collection handle the rest.
      $(this).removeProp('OmnipediaSidebarsGestures');

    }
  );

});
});
});
