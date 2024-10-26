// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Sidebars overlay
// -----------------------------------------------------------------------------

// This progressively enhances the CSS-based overlay with the JavaScript-powered
// overlay that prevents viewport scrolling when open for better UX.

AmbientImpact.on([
  'fastdom',
  'OmnipediaSiteThemeSidebars',
  'overlay',
], function(aiFastDom, sidebars, aiOverlay) {
AmbientImpact.addComponent('OmnipediaSiteThemeSidebarsOverlay', function(
  sidebarsOverlay, $,
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
   * Class applied to the sidebars menu closed anchor when disabled.
   *
   * @type {String}
   *
   * @todo This shouldn't be hard-coded here.
   */
  const menuClosedAnchorDisabledClass =
    'layout-sidebars__closed-anchor--disabled';

  /**
   * Class applied to the close element when the JavaScript overlay is present.
   *
   * @type {String}
   */
  const hasOverlayClass = 'layout-sidebars__closed-target--has-overlay';

  /**
   * Class applied to the overlay element for CSS.
   *
   * @type {String}
   */
  const overlayClass = 'overlay--layout-sidebars';

  /**
   * Represents the sidebars overlay.
   */
  class SidebarsOverlay {

    /**
     * The overlay instance.
     *
     * @type {Object}
     */
    #overlay;

    /**
     * The overlay element wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$overlay;

    /**
     * The Sidebars instance we're providing an overlay for.
     *
     * @type {Sidebars}
     */
    #sidebars;

    /**
     * Constructor.
     *
     * @param {Sidebars} sidebars
     *   A Sidebars instance.
     */
    constructor(sidebars) {

      this.#sidebars = sidebars;

      this.#$overlay = aiOverlay.create();

      this.#$overlay.addClass(overlayClass);

      this.#overlay = this.#$overlay.prop('aiOverlay');

      this.#bindEventHandlers();

      /**
       * Reference to the current instance.
       *
       * @type {SidebarsOverlay}
       */
      const that = this;

      fastdom.mutate(function() {

        that.#sidebars.$menuClosedTarget
        .before(that.#$overlay)
        .addClass(hasOverlayClass);

        that.#sidebars.$menuClosedAnchor.addClass(
          menuClosedAnchorDisabledClass,
        );

      }).then(async function() {

        await that.#sidebars.updateOffCanvas();

        // If the sidebars are off-canvas and are open when we construct, show
        // the overlay as the non-JavaScript overlay will now be hidden.

        if (!(
          that.#sidebars.isOffCanvas() === true &&
          that.#sidebars.isOpen() === true
        )) {
          return;
        }

        that.#overlay.show();

      });

    }

    /**
     * Destroy this instance.
     *
     * @return {Promise}
     *   A Promise that resolves when various DOM tasks are complete.
     */
    destroy() {

      /**
       * Reference to the current instance.
       *
       * @type {SidebarsOverlay}
       */
      const that = this;

      this.#unbindEventHandlers();

      return fastdom.measure(function() {

        return that.#overlay.isActive();

      }).then(function(isOverlayActive) {return fastdom.mutate(function() {

        that.#sidebars.$menuClosedTarget.removeClass(hasOverlayClass);

        that.#sidebars.$menuClosedAnchor.removeClass(
          menuClosedAnchorDisabledClass,
        );

        if (isOverlayActive === false) {

          that.#$overlay.detach();

          return;

        }

        // Attach a one-off event handler to remove the overlay element and
        // related properties/classes when the overlay has finished hiding.
        that.#$overlay.one('overlayHidden', function(event) {

          that.#$overlay.detach();

        });

        // Tell the overlay to hide itself, which will trigger the above handler
        // when complete.
        that.#overlay.hide();

      })});

    }

    /**
     * Bind all of our event handlers.
     *
     * @see this~#unbindEventHandlers()
     */
    #bindEventHandlers() {

      /**
       * Reference to the current instance.
       *
       * @type {SidebarsOverlay}
       */
      const that = this;

      this.#$overlay.on(`click.${eventNamespace}`, function(event) {
        that.#sidebars.close();
      });

      this.#sidebars.$sidebars.on(
        `omnipediaSidebarsMenuOpen.${eventNamespace}`,
      function(event, sidebars) {

        if (sidebars.isOffCanvas() !== true) {
          return;
        }

        that.#overlay.show();

      }).on(`omnipediaSidebarsMenuClose.${eventNamespace}`, function(
        event, sidebars,
      ) {

        that.#overlay.hide();

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

      this.#$overlay.off(`click.${eventNamespace}`);

      this.#sidebars.$sidebars.off([
        `omnipediaSidebarsMenuOpen.${eventNamespace}`,
        `omnipediaSidebarsMenuClose.${eventNamespace}`,
        // Don't unbind the one-off OmnipediaSidebarsDestroyed event handler as
        // that auto destroys this instance.
      ].join(' '));

    }

  }

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarsOverlay',
    'omnipedia-site-theme-sidebars-overlay',
    '.layout-container',
    function(context, settings) {

      $(this).prop('OmnipediaSidebarsOverlay', new SidebarsOverlay(
        $(this).prop('OmnipediaSidebars'),
      ));

    },
    function(context, settings, trigger) {

      // SidebarsOverlay destroys itself on the OmnipediaSidebarsDestroyed event
      // so we just need to remove the property and let browser garbage
      // collection handle the rest.
      $(this).removeProp('OmnipediaSidebarsOverlay');

    }
  );

});
});
