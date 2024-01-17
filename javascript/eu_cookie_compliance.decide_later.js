// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - EU Cookie Compliance decide later button component
// -----------------------------------------------------------------------------

// This adds an event handler to close the pop-up when clicking the "Decide
// later" button.

AmbientImpact.onGlobals([
  'Drupal.eu_cookie_compliance',
], function() {
AmbientImpact.on([
  'OmnipediaSiteThemeEuCookieCompliance',
], function(euCookieCompliance) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeEuCookieComplianceDecideLater',
function(
  euCookieComplianceDecideLater, $,
) {

  'use strict';

  /**
   * The BEM class for the decide later button.
   *
   * @type {String}
   */
  const decideLaterButtonClass = 'eu-cookie-compliance-buttons__later';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  this.addBehaviour(
    'OmnipediaSiteThemeEuCookieComplianceDecideLater',
    'omnipedia-site-theme-eu-cookie-compliance-decide-later',
    '#sliding-popup',
    function(context, settings) {

      $(this).on(
        `PrivacyPopupConstructed.${eventNamespace}`,
      function(event, popup) {

        popup.$popup.find(`.${decideLaterButtonClass}`).on(
          `click.${eventNamespace}`,
          Drupal.eu_cookie_compliance.toggleWithdrawBanner,
        );

      // Attach binds a one-off handler to the PrivacyPopupDestroyed event which
      // removes the click event handler.
      }).one(`PrivacyPopupDestroyed.${eventNamespace}`, function(event, popup) {

        popup.$popup.find(`.${decideLaterButtonClass}`).off(
          `click.${eventNamespace}`,
          Drupal.eu_cookie_compliance.toggleWithdrawBanner,
        );

      });

    },
    function(context, settings, trigger) {

      // Remove just the constructed event as the destroyed event needs to run
      // and will be invoked and then removed as it's a one-off event.
      $(this).off(`PrivacyPopupConstructed.${eventNamespace}`);

    }
  );

});
});
});
