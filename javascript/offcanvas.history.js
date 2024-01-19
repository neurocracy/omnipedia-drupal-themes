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

        let panel = event.target;

        history.pushState({offcanvasPanel: 'pushed'}, document.title);

        $(window).one(`popstate.${eventNamespace}`, function(event) {

          history.replaceState({offcanvasPanel: 'popped'}, document.title);

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
