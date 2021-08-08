// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - EU cookie compliance overlay
// -----------------------------------------------------------------------------

// This marks the pop-up as having opened and closed for the
// 'OmnipediaSiteThemeOverlayScroll' component.

AmbientImpact.on([
  'OmnipediaSiteThemeEuCookieComplianceElements',
  'OmnipediaSiteThemeEuCookieComplianceState',
  'OmnipediaSiteThemeOverlayScroll',
], function(
  euCookieComplianceElements,
  euCookieComplianceState,
  overlayScroll
) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeEuCookieComplianceOverlay',
function(
  euCookieComplianceOverlay, $
) {

  'use strict';

  this.addBehaviour(
    'OmnipediaSiteThemeEuCookieComplianceOverlay',
    'omnipedia-site-theme-eu-cookie-compliance-overlay',
    euCookieComplianceElements.getBehaviourSelector(),
    function(context, settings) {

      /**
       * The cookie compliance pop-up, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $popUp = euCookieComplianceElements.getPopUp();

      // Bail if we can't find the pop-up.
      if ($popUp.length === 0) {
        return;
      }

      // If the pop-up is open when we attach, mark it as such to the overlay
      // scroll component.
      if (euCookieComplianceState.isPopUpOpen()) {
        overlayScroll.overlayOpened($popUp);
      }

      $popUp
      .on(
        'euCookieCompliancePopUpOpen.OmnipediaSiteThemeEuCookieComplianceOverlay',
      function(event) {
        overlayScroll.overlayOpened($popUp);
      })
      .on(
        'euCookieCompliancePopUpClose.OmnipediaSiteThemeEuCookieComplianceOverlay',
      function(event) {
        overlayScroll.overlayClosed($popUp);
      });

    },
    function(context, settings, trigger) {

      /**
       * The cookie compliance pop-up, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      var $popUp = euCookieComplianceElements.getPopUp();

      // Bail if we can't find the pop-up.
      if ($popUp.length === 0) {
        return;
      }

      $popUp.off([
        'euCookieCompliancePopUpOpen.OmnipediaSiteThemeEuCookieComplianceOverlay',
        'euCookieCompliancePopUpClose.OmnipediaSiteThemeEuCookieComplianceOverlay',
      ].join(' '));

      // Make sure to mark the pop-up as closed in case it's current open.
      overlayScroll.overlayClosed($popUp);

    }
  );

});
});
