// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - EU cookie compliance overlay
// -----------------------------------------------------------------------------

// This marks the pop-up as having opened and closed for the scroll blocker
// component.

AmbientImpact.on([
  'OmnipediaPrivacySettings',
  'OmnipediaSiteThemeEuCookieComplianceElements',
  'OmnipediaSiteThemeEuCookieComplianceState',
  'OmnipediaSiteThemeSidebarsState',
  'overlay',
], function(
  OmnipediaPrivacySettings,
  euCookieComplianceElements,
  euCookieComplianceState,
  sidebarsState,
  aiOverlay
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

      /**
       * The primary menu region's overlay, wrapped in a jQuery object.
       *
       * @type {jQuery}
       */
      var $overlay = aiOverlay.create({
        modal:        true,
        modalFilter:  $popUp
      });

      $popUp.prop('aiOverlay', $overlay.prop('aiOverlay'));

      $overlay.insertBefore($popUp);

      /**
       * Open the overlay and related tasks.
       */
      function openOverlay() {

        // Only show the overlay if the sidebars are not off-canvas, as the
        // the sidebars create their own overlay and this would result in two
        // overlays.
        //
        // @todo Find a way to show an overlay over everything, including the
        //   sidebars?
        if (!sidebarsState.isOffCanvas() || !sidebarsState.isMenuOpen()) {
          $overlay.prop('aiOverlay').show();
        }

        // Failsafe to prevent disabling scroll if the pop-up is not visible or
        // has been removed for any reason, such as an add-on, e.g. uBlock
        // Origin, or some other software.
        if (
          $popUp.is(':hidden') ||
          $popUp.width() < 10 ||
          $popUp.height() < 10 ||
          $popUp.css('visibility') === 'hidden'
        ) {
          return;
        }

        // We trigger immerse events to pause any animations on the page while
        // the overlay/pop-up are open for both performance reasons and so as to
        // not distract users.
        $popUp.trigger('immerseEnter');

      };

      // If the pop-up is open when we attach, mark it as such to the overlay
      // scroll component.
      if (euCookieComplianceState.isPopUpOpen()) {
        openOverlay();
      }

      $popUp
      .on(
        'euCookieCompliancePopUpOpen.OmnipediaSiteThemeEuCookieComplianceOverlay',
        openOverlay
      )
      .on(
        'euCookieCompliancePopUpClose.OmnipediaSiteThemeEuCookieComplianceOverlay',
      function(event) {

        $overlay.prop('aiOverlay').hide();

      })
      .on(
        'euCookieCompliancePopUpClosed.OmnipediaSiteThemeEuCookieComplianceOverlay',
      function(event) {
        $popUp.trigger('immerseExit');
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
        'euCookieCompliancePopUpClosed.OmnipediaSiteThemeEuCookieComplianceOverlay',
      ].join(' '));

      // Destroy the overlay instance if found. Note that the destroy method
      // also deletes the aiOverlay property so we don't have to.
      if (!(typeof $popUp.prop('aiOverlay') === 'undefined')) {
        $popUp.prop('aiOverlay').destroy();
      }

    }
  );

});
});
