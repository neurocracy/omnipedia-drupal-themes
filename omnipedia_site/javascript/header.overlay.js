// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header overlay
// -----------------------------------------------------------------------------

// This creates and attaches a JavaScript-powered overlay to override the CSS-
// only overlay for consistency and to make use of various features like scroll
// blocking while the overlay is open.

AmbientImpact.on([
  'OmnipediaSiteThemeHeaderElements',
  'OmnipediaSiteThemeHeaderState',
  'overlay',
], function(headerElements, headerState, aiOverlay, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeHeaderOverlay', function(
  headerOverlay, $
) {
  'use strict';

  /**
   * Class applied to the <main> element when the JavaScript overlay is present.
   *
   * @type {String}
   */
  const hasOverlayClass = 'header-has-overlay';

  /**
   * Class applied to the overlay element for CSS.
   *
   * @type {String}
   */
  const overlayClass = 'header-overlay';

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderOverlay',
    'omnipedia-site-theme-header-overlay',
    headerElements.getHeaderBehaviourSelector(),
    function(context, settings) {

      /**
       * The site content <main> element, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      let $main = $('main[role="main"]', context);

      /**
       * The header overlay, wrapped in a jQuery object.
       *
       * @type {jQuery}
       */
      let $overlay = aiOverlay.create();

      /**
       * The overlay instance.
       *
       * @type {Object}
       */
      let overlay = $overlay.prop('aiOverlay');

      // Save overlay instance to a property for the detach handler.
      $main.prop('aiOverlay', overlay);

      $overlay.addClass(overlayClass).insertBefore($main);

      // Add class indicating JavaScript overlay is active.
      $main.addClass(hasOverlayClass);

      $overlay.on('click.OmnipediaSiteThemeHeaderOverlay', function(event) {
        headerState.hideSearch();
      });

      $(this).on(
        'omnipediaSearchActive.OmnipediaSiteThemeHeaderOverlay',
      function(event) {

        if (!headerState.isCompact()) {
          return;
        }

        overlay.show();

      }).on(
        'omnipediaSearchInactive.OmnipediaSiteThemeHeaderOverlay',
      function(event) {

        overlay.hide();

      });

      headerElements.getSearchForm()
        .on('focusin.OmnipediaSiteThemeHeaderOverlay', function(event) {

          if (!headerState.isCompact()) {
            return;
          }

          overlay.show();

        })
        .on('focusout.OmnipediaSiteThemeHeaderOverlay', function(event) {

          if (headerElements.getSearchForm().find(
            event.relatedTarget
          ).length > 0) {
            return;
          }

          overlay.hide();

        });

    },
    function(context, settings, trigger) {

      /**
       * The site content <main> element, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      let $main = $('main[role="main"]', context);

      headerElements.getSearchForm().off([
        'focusin.OmnipediaSiteThemeHeaderOverlay',
        'focusout.OmnipediaSiteThemeHeaderOverlay',
      ].join(' '));

      $(this).off([
        'omnipediaSearchActive.OmnipediaSiteThemeHeaderOverlay',
        'omnipediaSearchInactive.OmnipediaSiteThemeHeaderOverlay',
      ].join(' '));

      /**
       * The overlay instance.
       *
       * @type {Object}
       */
      let overlay = $main.prop('aiOverlay');

      // Attach a one-off event handler to remove the overlay element and
      // related properties/classes when the overlay has finished hiding.
      overlay.$overlay.one('overlayHidden', function(event) {

        overlay.$overlay.remove();

        $main.removeProp('aiOverlay')

        $main.removeClass(hasOverlayClass);

      });

      // Tell the overlay to hide itself, which will trigger the above handler
      // when complete.
      overlay.hide();

    }
  );

});
});
