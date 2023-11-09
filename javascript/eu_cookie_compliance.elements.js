// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - EU cookie compliance elements
// -----------------------------------------------------------------------------

// In addition to providing a centralized API for getting the various pop-up
// elements, this does the following:
//
// - Adds a 'eu-cookie-compliance-popup' to the pop-up.
//
// - Adds a BEM modifier class to the pop-up if the in-page toggle is found, so
//   that the persistent toggle button can be hidden. This is preferred as it
//   can get in the way on smaller screens.

AmbientImpact.onGlobals([
  'drupalSettings.eu_cookie_compliance',
], function() {
AmbientImpact.on([
  'OmnipediaPrivacySettings',
], function(OmnipediaPrivacySettings) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeEuCookieComplianceElements',
function(
  euCookieComplianceElements, $
) {

  'use strict';

  /**
   * The pop-up element, if any, wrapped in a jQuery collection.
   *
   * @type {jQuery}
   */
  let $popUp = $();

  /**
   * The containing element, if any, wrapped in a jQuery collection.
   *
   * The containing element is configured in the EU Cookie Compliance module's
   * settings, and is the <body> element by default.
   *
   * @type {jQuery}
   */
  let $containingElement = $();

  /**
   * Get the pop-up element jQuery collection.
   *
   * @return {jQuery}
   */
  this.getPopUp = function() {
    return $popUp;
  };

  /**
   * Get the containing element jQuery collection.
   *
   * @return {jQuery}
   */
  this.getContainingElement = function() {
    return $containingElement;
  };

  /**
   * Get the selector to attach behaviours to.
   *
   * @return {String}
   */
  this.getBehaviourSelector = function() {
    return '#sliding-popup';
  };

  /**
   * The base BEM class for the pop-up.
   *
   * @return {String}
   */
  this.getPopUpBaseClass = function() {
    return 'eu-cookie-compliance-popup';
  };

  /**
   * Get the BEM class for when the pop-up is associated with an in-page toggle.
   *
   * @type {String}
   */
  this.getPopUpHasInPageToggleClass = function() {
    return this.getPopUpBaseClass() + '--has-in-page-toggle';
  };

  this.addBehaviour(
    'OmnipediaSiteThemeEuCookieComplianceElements',
    'omnipedia-site-theme-eu-cookie-compliance-elements',
    this.getBehaviourSelector(),
    function(context, settings) {

      $popUp = $(this);

      $popUp.addClass(euCookieComplianceElements.getPopUpBaseClass());

      if (OmnipediaPrivacySettings.getToggle().length > 0) {
        $popUp.addClass(
          euCookieComplianceElements.getPopUpHasInPageToggleClass()
        );
      }

      $containingElement = $(
        drupalSettings.eu_cookie_compliance.containing_element
      );

    },
    function(context, settings, trigger) {

      $popUp.removeClass(
        euCookieComplianceElements.getPopUpHasInPageToggleClass()
      );

      $popUp = $();

      $containingElement = $();

    }
  );

});
});
});
