// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Off-canvas panel history
// -----------------------------------------------------------------------------

// This adds a history state when the off-canvas panel opens so that the back
// button closes the pop-up. This is especially important on mobile where
// hitting back is very intuitive and having the back button work for other
// modal panels (sidebar menu and header compact search) but not this would be
// pretty counter-intuitive.
//
// @see https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API

AmbientImpact.addComponent('OmnipediaSiteThemeOffcanvasHistory', function(
  offcanvasHistory, $
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  this.addBehaviour(
    'OmnipediaSiteThemeOffcanvasHistory',
    'omnipedia-site-theme-offcanvas-history',
    'body',
    function(context, settings) {

      $(this).on(`openOffcanvas.${eventNamespace}`, function(event) {

        /**
         * The off-canvas panel element.
         *
         * @type {HTMLElement}
         */
        const panel = event.target;

        history.pushState({offcanvasPanel: 'pushed'}, document.title);

        $(window).one(`popstate.${eventNamespace}`, function(event) {

          /**
           * Copy of the history state we're popping to or null if no data.
           *
           * Since we're using history.replaceState(), we need to make sure we
           * don't accidentally delete any existing history state data that may
           * have been added by something else. Deleting existing data can be
           * especially bad when using something like Hotwire Turbo, in which
           * case we would end up with back and forward navigation only changing
           * the URL but no page changes.
           *
           * @type {Object|null}
           */
          let state = event.originalEvent.state;

          if (typeof state !== 'object') {
            state = {};
          }

          state.offcanvasPanel = 'popped';

          history.replaceState(state, document.title);

          // There's no API to open or close the panel yet, so we have to
          // trigger a click on the close button.
          panel.aiOffcanvas.elements.close.trigger('click');

        });

      }).on(`closeOffcanvas.${eventNamespace}`, function(event) {

        // Move back one entry in the browser history if the history state does
        // not indicate an off-canvas popstate has just occurred. This check is
        // necessary so that we don't accidentally navigate to another page if
        // the pop-up was closed by means other than hitting back.
        if (
          typeof history.state === 'object' &&
          'offcanvasPanel' in history.state &&
          history.state.offcanvasPanel !== 'popped'
        ) {
          history.back();
        }

      });

    },
    function(context, settings, trigger) {

      $(window).off(`popstate.${eventNamespace}`);

      $(this).off([
        `openOffcanvas.${eventNamespace}`,
        `closeOffcanvas.${eventNamespace}`,
      ].join(' '));

    }
  );

});
