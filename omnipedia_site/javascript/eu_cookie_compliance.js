// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - EU cookie compliance customizations
// -----------------------------------------------------------------------------

// This does the following:
//
// - Adds a 'eu-cookie-compliance-popup' to the pop-up container.
//
// - Adds a BEM modifier class to the pop-up if the in-page toggle is found, so
//   that the persistent toggle button can be hidden. This is preferred as it
//   can get in the way on smaller screens.
//
// - Marks the pop-up as having opened and closed for the
//   'OmnipediaSiteThemeOverlayScroll' component.
//
// - Fixes the 'eu_cookie_compliance_popup_close' event not being triggered when
//   closing the pop-up via the accept buttons.

AmbientImpact.onGlobals([
  'Drupal.eu_cookie_compliance',
  'drupalSettings.eu_cookie_compliance',
], function() {
AmbientImpact.on([
  'OmnipediaPrivacySettings',
  'OmnipediaSiteThemeOverlayScroll',
], function(OmnipediaPrivacySettings, overlayScroll) {
AmbientImpact.addComponent('OmnipediaSiteThemeEuCookieCompliance', function(
  euCookieCompliance, $
) {

  'use strict';

  /**
   * The base BEM class for the cookie compliance pop-up.
   *
   * @type {String}
   */
  var baseClass = 'eu-cookie-compliance-popup';

  /**
   * BEM class for when the panel is associated with an in-page toggle.
   *
   * @type {String}
   */
  var panelHasInPageToggleClass = baseClass + '--has-in-page-toggle';

  /**
   * The transition duration for the cookie compliance pop-up.
   *
   * @type {Number}
   */
  var transitionDuration = drupalSettings.eu_cookie_compliance.popup_delay;

  // Force this to zero to prevent jQuery animations, as we handle those using
  // CSS transforms and transitions.
  // drupalSettings.eu_cookie_compliance.popup_delay = 0;

  this.addBehaviour(
    'OmnipediaSiteThemeEuCookieCompliance',
    'omnipedia-site-theme-eu-cookie-compliance',
    '#sliding-popup',
    function(context, settings) {

      /**
       * The cookie compliance pop-up, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $popup = $(this);

      // Bail if we can't find the pop-up.
      if ($popup.length === 0) {
        return;
      }

      $popup.addClass(baseClass);

      // $popup.prop('style').setProperty(
      //   '--eu-cookie-compliance-transition-duration',
      //   transitionDuration + 'ms'
      // );

      // If the pop-up is open when we attach, mark it as such to the overlay
      // scroll component.
      if ($('body').is('.eu-cookie-compliance-popup-open')) {
        overlayScroll.overlayOpened($popup);
      }

      $popup.on(
        'eu_cookie_compliance_popup_open.OmnipediaSiteThemeEuCookieCompliance',
      function(event) {

        overlayScroll.overlayOpened($popup);

      })
      .on(
        'eu_cookie_compliance_popup_close.OmnipediaSiteThemeEuCookieCompliance',
      function(event) {

        overlayScroll.overlayClosed($popup);

      })
      .on('click.OmnipediaSiteThemeEuCookieCompliance', function(event) {

        // Hacky way of triggering the close event because the module's
        // JavaScript annoyingly does not trigger it when closed by these.
        // Without this, the viewport would remain unscrollable when the pop-up
        // closes on a user clicking one of the accept buttons.
        if (
          $(event.target).is('button') &&
          $popup.find('.eu-cookie-compliance-buttons')
            .find(event.target).length > 0
        ) {
          $popup.trigger('eu_cookie_compliance_popup_close');
        }

      });

      if (OmnipediaPrivacySettings.getToggle().length > 0) {
        $popup.addClass(panelHasInPageToggleClass);
      }

    },
    function(context, settings, trigger) {

      /**
       * The cookie compliance pop-up, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $popup = $(this);

      $popup.off([
        'eu_cookie_compliance_popup_open.OmnipediaSiteThemeEuCookieCompliance',
        'eu_cookie_compliance_popup_close.OmnipediaSiteThemeEuCookieCompliance',
        'click.OmnipediaSiteThemeEuCookieCompliance',
      ].join(' '));

      // Make sure this is marked as closed in case it was open during detach.
      overlayScroll.overlayClosed($popup);

      $popup.removeClass(panelHasInPageToggleClass);

    }
  );

});
});
});
