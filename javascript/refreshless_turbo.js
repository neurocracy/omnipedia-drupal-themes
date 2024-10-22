// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - RefreshLess Turbo integration
// -----------------------------------------------------------------------------

AmbientImpact.addComponent('OmnipediaSiteThemeRefreshLess', function(
  refreshless, $
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * Class applied to the <html> element when page transition is in progress.
   *
   * This is applied as soon as the transition out starts, and is removed when
   * the transition in starts.
   *
   * @type {String}
   */
  const pageTransitionInProgressClass =
    'refreshless--page-transition-in-progress';

  /**
   * Class applied to the <html> element when transitioning out from a page.
   *
   * @type {String}
   */
  const pageTransitionOutClass = 'refreshless--page-transition-out';

  /**
   * The page transition animation name.
   *
   * @type {String}
   */
  const pageTransitionOutAnimationName = 'reveal-overlay';

  /**
   * The maximum amount of time in milliseconds the animation may take.
   *
   * This is the failsafe timeout to ensure rendering continues if this time
   * has passed without the animation finishing. Defensive programming and all
   * that.
   *
   * @type {Number}
   */
  const failsafeTimeout = 500;

  $('html')
  .on(`refreshless:before-render.${eventNamespace}`, async function(event) {

    const $this = $(this);

    $this.addClass(pageTransitionInProgressClass);

    /**
     * Flag indicating whether the delay has been resolved.
     *
     * This is used by the failsafe timeout to avoid doing anything if the
     * animation completed successfully.
     *
     * @type {Boolean}
     */
    let resolved = false;

    await event.detail.delay(async function(resolve, reject) {

      $this.find('.layout-container')
      .on(`animationend.${eventNamespace}`, function(event) {

        if (
          event.originalEvent.animationName !== pageTransitionOutAnimationName
        ) {
          return;
        }

        resolve();

        resolved = true;

      });

      // Ensure a new frame is rendered before adding the transition out class
      // so the initialized class removes the existing animation-name.
      //
      // Note that by the first requestAnimationFrame, a new frame has not been
      // rendered yet, but indicates that one is about to be rendered; the
      // second requestAnimationFrame is when a single frame has been rendered.
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);

      $this.addClass(pageTransitionOutClass);

      // This acts as a failsafe to resolve the delay if too much time has
      // passed if our animationend event handler does not resolve in a
      // reasonable amount of time (or at all), the next page still renders,
      // even if a bit less smoothly.
      setTimeout(function() {

        if (resolved === true) {
          return;
        }

        $this.find('.layout-container')
        .off(`animationend.${eventNamespace}`)
        .removeClass([pageTransitionOutClass, pageTransitionInProgressClass]);

        resolve();

      }, failsafeTimeout);

    });

  }).on(`refreshless:attach.${eventNamespace}`, function(event) {
    $(this).removeClass([pageTransitionOutClass, pageTransitionInProgressClass]);
  });

});
