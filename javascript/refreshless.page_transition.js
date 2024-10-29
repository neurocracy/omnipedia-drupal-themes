// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - RefreshLess page transition
// -----------------------------------------------------------------------------

AmbientImpact.on(['fastdom'], function(aiFastDom) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeRefreshLessPageTransition',
function(component, $) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * Base class for the overlay.
   *
   * @type {String}
   */
  const overlayClass = 'refreshless-page-transition-overlay';

  /**
   * Class added to the overlay when it's visible.
   *
   * @type {String}
   */
  const overlayActiveClass = `${overlayClass}--active`;

  /**
   * Class applied to the <html> element when RefreshLess handling transitions.
   *
   * This is intended to disable the CSS reveal animation that otherwise plays
   * both on a full page load and would also play when the <body> contents are
   * replaced.
   *
   * @type {String}
   */
  const pageTransitionHandledClass = 'refreshless--page-transition-handled';

  /**
   * The maximum amount of time in milliseconds the transition may take.
   *
   * This is the failsafe timeout to ensure rendering continues if this time
   * has passed without the transition finishing. Defensive programming and all
   * that.
   *
   * @type {Number}
   */
  const failsafeTimeout = 500;

  /**
   * Represents the RefreshLess page transition overlay.
   */
  class TransitionOverlay {

    /**
     * The overlay element wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$overlay;

    /**
     * The root (<html>) element wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$root;

    constructor($root) {

      this.#$root = $root;

      this.#$overlay = $(`<div class="${overlayClass}"></div>`);

      this.#bindEventHandlers();

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
       * @type {TransitionOverlay}
       */
      const that = this;

      this.#unbindEventHandlers();

      return fastdom.mutate(function() {
        that.#$overlay.remove();
        that.#$root.removeClass(pageTransitionHandledClass);
      });

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
       * @type {TransitionOverlay}
       */
      const that = this;

      this.#$root
      .on(`refreshless:before-render.${eventNamespace}`, async function(event) {
        await that.#beforeRenderHandler(event);
      })
      .on(`refreshless:attach.${eventNamespace}`, async function(event) {
        await that.#attachHandler(event);
      });

    }

    /**
     * Unbind all of our event handlers.
     *
     * @see this~#bindEventHandlers()
     */
    #unbindEventHandlers() {

      this.#$root.off([
        `refreshless:before-render.${eventNamespace}`,
        `refreshless:attach.${eventNamespace}`,
      ].join(' '));

    }

    /**
     * RefreshLess before render event handler.
     *
     * @param {jQuery.Event} event
     */
    async #beforeRenderHandler(event) {

      /**
       * Reference to the current instance.
       *
       * @type {TransitionOverlay}
       */
      const that = this;

      /**
       * Flag indicating whether the delay has been resolved.
       *
       * This is used by the failsafe timeout to avoid doing anything if the
       * transition completed successfully.
       *
       * @type {Boolean}
       */
      let resolved = false;

      // Cancel any existing transition in handler.
      this.#$overlay.off(`transitionend.${eventNamespace}-in`);

      await event.detail.delay(async function(resolve, reject) {

        // This acts as a failsafe to resolve the delay if too much time has
        // passed if our transitionend event handler does not resolve in a
        // reasonable amount of time (or at all), the next page still renders,
        // even if a bit less smoothly.
        setTimeout(async function() {

          if (resolved === true) {
            return;
          }

          // Remove the event handler so it doesn't trigger erroneously later.
          that.#$overlay.off(`transitionend.${eventNamespace}-out`);

          await fastdom.mutate(function() {

            that.#$overlay.removeClass(overlayActiveClass);

          });

          // console.log('Failsafe');

          resolve();

        }, failsafeTimeout);

        that.#$overlay.on(`transitionend.${eventNamespace}-out`, function(
          event,
        ) {

          resolve();

          resolved = true;

          // console.log('Out done');

        });

        // Insert the overlay and indicate it's active only at this point, so
        // that we don't do it too early and risk it removing the full page load
        // fade in.
        await fastdom.mutate(function() {

          that.#$overlay.insertBefore(that.#$root.find('body'));

          that.#$root.addClass(pageTransitionHandledClass);

        });

        // Ensure a new frame is rendered before adding the transition out class
        // so the initialized class removes the existing animation-name.
        //
        // Note that by the first requestAnimationFrame, a new frame has not
        // been rendered yet, but indicates that one is about to be rendered;
        // the second requestAnimationFrame is when a single frame has been
        // rendered.
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);

        await fastdom.mutate(function() {

          // console.log('Out start');

          that.#$overlay.addClass(overlayActiveClass);
        });

      });

    }

    /**
     * RefreshLess attach event handler.
     *
     * @param {jQuery.Event} event
     */
    async #attachHandler(event) {

      /**
       * Reference to the current instance.
       *
       * @type {TransitionOverlay}
       */
      const that = this;

      // console.log('In start');

      this.#$overlay
      .off(`transitionend.${eventNamespace}-out`)
      .on(`transitionend.${eventNamespace}-in`, async function(event) {

        // console.log('In done');

      });

      await fastdom.mutate(function() {

        that.#$overlay.removeClass(overlayActiveClass);

      });

    }

    /**
     * Get the overlay element jQuery collection.
     *
     * @return {jQuery}
     */
    get $overlay() {
      return this.#$overlay;
    }

  }

  $(once('omnipedia-refreshless-page-transition', 'html')).prop(
    'OmnipediaRefreshlessPageTransition', new TransitionOverlay(
      $('html'),
    ),
  );

});
});
