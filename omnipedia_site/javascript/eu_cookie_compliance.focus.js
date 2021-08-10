// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - EU cookie compliance focus management
// -----------------------------------------------------------------------------

// This manages focus on the following events:
//
// - 'euCookieCompliancePopUpOpened': moves focus to the first tabbable element
//   in the pop-up.
//
// - 'euCookieCompliancePopUpClosed': moves focus to the privacy settings
//   toggle.

AmbientImpact.onGlobals('ally.query.tabbable', function() {
AmbientImpact.on([
  'pointerFocusHide',
  'OmnipediaPrivacySettings',
  'OmnipediaSiteThemeEuCookieComplianceElements',
  'OmnipediaSiteThemeEuCookieComplianceState',
], function(
  aiPointerFocusHide,
  OmnipediaPrivacySettings,
  euCookieComplianceElements,
  euCookieComplianceState
) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeEuCookieComplianceFocus',
function(
  euCookieComplianceFocus, $
) {

  'use strict';

  this.addBehaviour(
    'OmnipediaSiteThemeEuCookieComplianceFocus',
    'omnipedia-site-theme-eu-cookie-compliance-focus',
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

      $popUp.attr('tab-index', '-1');

      $popUp
      .on(
        'euCookieCompliancePopUpOpened.OmnipediaSiteThemeEuCookieComplianceFocus',
      function(event) {

        aiPointerFocusHide.lock();

        // We have to find the first tabbable element in the pop-up because the
        // pop-up itself does not seem to be focusable for some reason.
        $(ally.query.tabbable({
          context:        $popUp,
          includeContext: true
        })).first().focus();

        aiPointerFocusHide.unlock();

     })
      .on(
        'euCookieCompliancePopUpClosed.OmnipediaSiteThemeEuCookieComplianceFocus',
      function(event) {
        OmnipediaPrivacySettings.getToggle().focus();
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
        'euCookieCompliancePopUpOpen.OmnipediaSiteThemeEuCookieComplianceFocus',
                'euCookieCompliancePopUpClosed.OmnipediaSiteThemeEuCookieComplianceFocus',
      ].join(' '));

    }
  );

});
});
});
