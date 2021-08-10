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

AmbientImpact.onGlobals([
  'ally.query.tabbable',
  'ally.style.focusSource',
], function() {
AmbientImpact.on([
  'pointerFocusHide',
  'OmnipediaPrivacySettings',
  'OmnipediaSiteThemeEuCookieComplianceElements',
  'OmnipediaSiteThemeEuCookieComplianceState',
  'OmnipediaSiteThemeSidebarsState',
], function(
  aiPointerFocusHide,
  OmnipediaPrivacySettings,
  euCookieComplianceElements,
  euCookieComplianceState,
  sidebarsState
) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeEuCookieComplianceFocus',
function(
  euCookieComplianceFocus, $
) {

  'use strict';

  /**
   * The ally.js focus source global service object.
   *
   * This initializes ally.js' focus source service, which starts watching the
   * document and applies the data-focus-source attribute to the <html> element.
   *
   * @type {Object}
   *
   * @see https://allyjs.io/api/style/focus-source.html
   *   ally.js documentation.
   */
  var focusSourceHandle = ally.style.focusSource();

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
        'euCookieCompliancePopUpClose.OmnipediaSiteThemeEuCookieComplianceFocus',
      function(event) {

        aiPointerFocusHide.lock();

      })
      .on(
        'euCookieCompliancePopUpClosed.OmnipediaSiteThemeEuCookieComplianceFocus',
      function(event) {

        // Only focus the toggle if the focus source was not the pointer, or if
        // sidebars are not off-canvas. This is to prevent the sidebar menu
        // unexpectedly opening if the pop-up was open due to some other reason,
        // and not because it was invoked via the toggle in the sidebar. The
        // most likely reason for this would be when the user has not yet agreed
        // to anything in the pop-up, either on first navigating to the site or
        // because they clicked "Decide later" on a previous page.
        //
        // @todo We need a better way of handling this that allows focus to be
        //   moved into the sidebar for the purpose of maintaining tabbing order
        //   but without causing the sidebar menu to open. One way to do this
        //   could be to alter the CSS to only show on :focus-within if
        //   html:not([data-focus-source="pointer"])
        if (
          focusSourceHandle.current() !== 'pointer' ||
          !sidebarsState.isOffCanvas()
        ) {
          OmnipediaPrivacySettings.getToggle().focus();
        }

        aiPointerFocusHide.unlock();

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
        'euCookieCompliancePopUpOpened.OmnipediaSiteThemeEuCookieComplianceFocus',
        'euCookieCompliancePopUpClose.OmnipediaSiteThemeEuCookieComplianceFocus',
        'euCookieCompliancePopUpClosed.OmnipediaSiteThemeEuCookieComplianceFocus',
      ].join(' '));

    }
  );

});
});
});
