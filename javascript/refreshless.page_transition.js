// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - RefreshLess page transition
// -----------------------------------------------------------------------------

AmbientImpact.on(['fastdom'], (aiFastDom) => {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeRefreshLessPageTransition',
(component, $) => {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = component.getName();

  /**
   * FastDom instance.
   *
   * @type {FastDom}
   */
  const fastdom = aiFastDom.getInstance();

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
   * Name of the property on the <html> element we save the instance to.
   *
   * @type {String}
   */
  const overlayPropertyName = 'OmnipediaRefreshlessPageTransition';

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

      this.#unbindEventHandlers();

      return fastdom.mutate(() => {
        this.#$overlay.remove();
        this.#$root.removeClass(pageTransitionHandledClass);
      });

    }

    /**
     * Bind all of our event handlers.
     *
     * @see this~#unbindEventHandlers()
     */
    #bindEventHandlers() {

      this.#$root
      .on(`refreshless:before-render.${eventNamespace}`, async (event) => {
        await this.#beforeRenderHandler(event);
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
        `refreshless:load.${eventNamespace}`,
      ].join(' '));

    }

    /**
     * RefreshLess before render event handler.
     *
     * @param {jQuery.Event} event
     */
    async #beforeRenderHandler(event) {

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

      await event.detail.delay(async (resolve, reject) => {

        // This acts as a failsafe to resolve the delay if too much time has
        // passed if our transitionend event handler does not resolve in a
        // reasonable amount of time (or at all), the next page still renders,
        // even if a bit less smoothly.
        setTimeout(async () => {

          if (resolved === true) {
            return;
          }

          // Remove the event handler so it doesn't trigger erroneously later.
          this.#$overlay.off(`transitionend.${eventNamespace}-out`);

          await fastdom.mutate(() => {

            this.#$overlay.removeClass(overlayActiveClass);

          });

          console.warn('Omnipedia transition failsafe triggered.');

          resolve();

        }, failsafeTimeout);

        this.#$overlay.one(`transitionend.${eventNamespace}-out`, (event) => {

          resolve();

          resolved = true;

        });

        // Insert the overlay and indicate it's active only at this point, so
        // that we don't do it too early and risk it removing the full page load
        // fade in.
        await fastdom.mutate(() => {

          this.#$overlay.insertBefore(this.#$root.find('body'));

          this.#$root.addClass(pageTransitionHandledClass);

        });

        // Ensure a new frame is rendered before adding the transition out class
        // so the initialized class removes the existing transition.
        //
        // Note that by the first requestAnimationFrame, a new frame has not
        // been rendered yet, but indicates that one is about to be rendered;
        // the second requestAnimationFrame is when a single frame has been
        // rendered.
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);

        await fastdom.mutate(() => {
          this.#$overlay.addClass(overlayActiveClass);
        });

      });

      // Attach a one-off load handler here rather than on attach as it can
      // sometimes not trigger if set there. This tries to remove the overlay
      // as late as possible to avoid any visible jank or layout jumps for a
      // frame or two, which can still occasionally happen when loading some
      // of the longer pages.
      this.#$root.one(`refreshless:load.${eventNamespace}`, async (event) => {

        // Let any rendering/layout/etc. settle for a frame before proceeding.
        await new Promise(requestAnimationFrame);
        await new Promise(requestAnimationFrame);

        this.#loadHandler(event);

      });

    }

    /**
     * Turbo load handler; removes overlay active class.
     *
     * @param {jQuery.Event} event
     */
    async #loadHandler(event) {

      await fastdom.mutate(() => {

        this.#$overlay.removeClass(overlayActiveClass);

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

  // Note that this must be wrapped in this closure to ensure it only gets
  // instantiated if once() actually returns an element, otherwise this could
  // get instantiated more than once even if once() doesn't return an element.
  // This can occur due to RefreshLess' additive aggregation still requiring
  // more work because it can sometimes still include a library more than once
  // in different aggregates.
  $(once('omnipedia-refreshless-page-transition', 'html')).each((i, html) => {
    $(html).prop(overlayPropertyName, new TransitionOverlay($(html)));
  });

});
});
