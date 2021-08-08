// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - EU cookie compliance decide later button
// -----------------------------------------------------------------------------

// This adds an event handler to close the pop-up when clicking the "Decide
// later" button.

AmbientImpact.onGlobals([
  'Drupal.eu_cookie_compliance',
], function() {
AmbientImpact.on([
  'OmnipediaSiteThemeEuCookieComplianceElements',
], function(euCookieComplianceElements) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeEuCookieComplianceDecideLater',
function(
  euCookieComplianceDecideLater, $
) {

  'use strict';

  /**
   * The BEM class for the decide later button.
   *
   * @type {String}
   */
  var decideLaterButtonClass = 'eu-cookie-compliance-buttons__later';

  this.addBehaviour(
    'OmnipediaSiteThemeEuCookieComplianceDecideLater',
    'omnipedia-site-theme-eu-cookie-compliance-decide-later',
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

      // Event handler to close the pop-up when the "Decide later" button is
      // clicked.
      $popUp.find('.' + decideLaterButtonClass).on(
        'click.OmnipediaSiteThemeEuCookieComplianceDecideLater',
        Drupal.eu_cookie_compliance.toggleWithdrawBanner
      );

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

      $popUp.find('.' + decideLaterButtonClass).off(
        'click.OmnipediaSiteThemeEuCookieComplianceDecideLater'
      );

    }
  );

});
});
});
