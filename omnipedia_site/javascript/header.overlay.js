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
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

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

      $overlay.on('click.' + eventNamespace, function(event) {
        headerState.hideSearch();
      });

      $(this).on('omnipediaSearchActive.' + eventNamespace, function(event) {

        if (!headerState.isCompact()) {
          return;
        }

        overlay.show();

      }).on('omnipediaSearchInactive.' + eventNamespace, function(event) {

        overlay.hide();

      });

      headerElements.getSearchForm()
        .on('focusin.' + eventNamespace, function(event) {

          if (!headerState.isCompact()) {
            return;
          }

          overlay.show();

        })
        .on('focusout.' + eventNamespace, function(event) {

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
        'focusin.'  + eventNamespace,
        'focusout.' + eventNamespace,
      ].join(' '));

      $(this).off([
        'omnipediaSearchActive.'    + eventNamespace,
        'omnipediaSearchInactive.'  + eventNamespace,
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
