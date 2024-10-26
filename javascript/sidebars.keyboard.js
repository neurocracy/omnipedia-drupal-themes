// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Sidebars keyboard enhancements
// -----------------------------------------------------------------------------

// This adds support for the escape key so that it can close the off-canvas
// sidebars menu on narrow screens.
//
// @see https://allyjs.io/api/when/key.html

AmbientImpact.onGlobals('ally.when.key', function() {
AmbientImpact.on('OmnipediaSiteThemeSidebars', function(sidebars) {
AmbientImpact.addComponent('OmnipediaSiteThemeSidebarsKeyboard', function(
  sidebarsKeyboard, $,
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * Represents the sidebars keyboard enhancements.
   */
  class SidebarsKeyboard {

    /**
     * The Sidebars instance we're attaching to.
     *
     * @type {Sidebars}
     */
    #sidebars;

    /**
     * ally.when.key() instance; watches for escape key press.
     *
     * @type {Object}
     *
     * @see https://allyjs.io/api/when/key.html
     */
    #whenKeyHandle;

    /**
     * Constructor.
     *
     * @param {Sidebars} sidebars
     *   A Sidebars instance.
     */
    constructor(sidebars) {

      this.#sidebars = sidebars;

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

      this.unwatch();

      return Promise.resolve();

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
       * @type {SidebarsKeyboard}
       */
      const that = this;

      this.#sidebars.$sidebars.on(
        `omnipediaSidebarsMenuOpen.${eventNamespace}`,
      function(event, sidebars) {

        that.watch();

      }).on(`omnipediaSidebarsMenuClose.${eventNamespace}`, function(
        event, sidebars,
      ) {

        that.unwatch();

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
        // Don't remove the OmnipediaSidebarsDestroyed handler as it's a one-off
        // and must be triggered to destroy; removing it here will likely
        // prevent it triggering.
      ].join(' '));

    }

    /**
     * Start watching for an escape key press if not already watching.
     */
    watch() {

      if (typeof this.#whenKeyHandle !== 'undefined') {
        return;
      }

      /**
       * Reference to the current instance.
       *
       * @type {SidebarsKeyboard}
       */
      const that = this;

      this.#whenKeyHandle = ally.when.key({

        escape: function(event, disengage) {

          that.#sidebars.close();

          disengage();

        },

      });

    }

    /**
     * Stop watching for an escape key press if currently watching.
     */
    unwatch() {

      if (typeof this.#whenKeyHandle === 'undefined') {
        return;
      }

      this.#whenKeyHandle.disengage();

      this.#whenKeyHandle = undefined;

    }

  }

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarsKeyboard',
    'omnipedia-site-theme-sidebars-keyboard',
    '.layout-container',
    function(context, settings) {

      $(this).prop('OmnipediaSidebarsKeyboard', new SidebarsKeyboard(
        $(this).prop('OmnipediaSidebars'),
      ));

    },
    function(context, settings, trigger) {

      // SidebarsKeyboard destroys itself on the OmnipediaSidebarsDestroyed
      // event so we just need to remove the property and let browser garbage
      // collection handle the rest.
      $(this).removeProp('OmnipediaSidebarsKeyboard');

    }
  );

});
});
});
