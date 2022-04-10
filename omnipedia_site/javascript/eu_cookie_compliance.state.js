// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - EU cookie compliance events
// -----------------------------------------------------------------------------

// This provides custom events on various pop-up state changes. It also does the
// following:
//
// - Fixes the 'eu_cookie_compliance_popup_close' event not being triggered when
//   closing the pop-up via the accept buttons.
//
// - Fixes the container (usually body) agreement status classes not updating
//   after the module JavaScript has attached.

AmbientImpact.onGlobals([
  'Drupal.eu_cookie_compliance',
  'drupalSettings.eu_cookie_compliance',
], function() {
AmbientImpact.on([
  'OmnipediaSiteThemeEuCookieComplianceElements',
], function(euCookieComplianceElements) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeEuCookieComplianceState',
function(
  euCookieComplianceState, $
) {

  'use strict';

  /**
   * Class applied to the containing element when the pop-up is open.
   *
   * @type {String}
   */
  const containingElementOpenClass = 'eu-cookie-compliance-popup-open';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * The transition duration for the cookie compliance pop-up.
   *
   * @type {Number}
   */
  let transitionDuration = drupalSettings.eu_cookie_compliance.popup_delay;

  /**
   * Whether the pop-up is currently open.
   *
   * @return {Boolean}
   */
  this.isPopUpOpen = function() {
    return euCookieComplianceElements.getContainingElement().is(
      '.' + containingElementOpenClass
    );
  };

  this.addBehaviour(
    'OmnipediaSiteThemeEuCookieComplianceState',
    'omnipedia-site-theme-eu-cookie-compliance-state',
    euCookieComplianceElements.getBehaviourSelector(),
    function(context, settings) {

      /**
       * The cookie compliance pop-up, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      let $popUp = euCookieComplianceElements.getPopUp();

      // Bail if we can't find the pop-up.
      if ($popUp.length === 0) {
        return;
      }

      // Save the transition duration as a custom property on the pop-up so that
      // it can be used in CSS.
      $popUp.prop('style').setProperty(
        '--eu-cookie-compliance-transition-duration',
        transitionDuration + 'ms'
      );

      $popUp.on(
        'eu_cookie_compliance_popup_open.' + eventNamespace,
      function(event) {

        $(this).trigger('euCookieCompliancePopUpOpen');

        // The module's JavaScript does not provide an event for when the pop-up
        // has finished opening, so this does that in a roundabout way. Note
        // that since this is using the configured delay value, it waits in
        // parallel with the value, but may be triggered a frame before or after
        // the pop-up's jQuery animation has actually completed.
        setTimeout(function() {

          $popUp.trigger('euCookieCompliancePopUpOpened');

        }, drupalSettings.eu_cookie_compliance.popup_delay);

      })
      .on(
        'eu_cookie_compliance_popup_close.' + eventNamespace,
      function(event) {

        $(this).trigger('euCookieCompliancePopUpClose');

        // The module JavaScript annoyingly does not remove this class when the
        // pop-up is closed via clicking the accept buttons so make sure this is
        // removed on close.
        euCookieComplianceElements.getContainingElement().removeClass(
          containingElementOpenClass
        );

        // The module's JavaScript does not provide an event for when the pop-up
        // has finished closing, so this does that in a roundabout way. Note
        // that since this is using the configured delay value, it waits in
        // parallel with the value, but may be triggered a frame before or after
        // the pop-up's jQuery animation has actually completed.
        setTimeout(function() {

          // The module's JavaScript only updates the container (usually body)
          // classes when first attached. Unfortunately, this means that CSS
          // cannot depend on these updating when a user agrees to some or all
          // categories, so we have to do that ourselves. Note that this must
          // delay until the pop-up is expected to be closed to avoid causing
          // issues with hiding the pop-up smoothly.
          euCookieComplianceElements.getContainingElement()
          .removeClass([
            'eu-cookie-compliance-status-null',
            'eu-cookie-compliance-status-1',
            'eu-cookie-compliance-status-2',
          ])
          .addClass(
            'eu-cookie-compliance-status-' +
            Drupal.eu_cookie_compliance.getCurrentStatus()
          );

          $popUp.trigger('euCookieCompliancePopUpClosed');

        }, drupalSettings.eu_cookie_compliance.popup_delay);

      })
      .on('click.' + eventNamespace, function(event) {

        // Hacky way of triggering the close event because the module's
        // JavaScript annoyingly does not trigger it when closed by the accept/
        // agree buttons.
        if (
          $(event.target).is('.eu-cookie-compliance-save-preferences-button') ||
          $(event.target).is('.agree-button')
        ) {

          $popUp.trigger('eu_cookie_compliance_popup_close');

        }

      });

    },
    function(context, settings, trigger) {

      /**
       * The cookie compliance pop-up, if any, wrapped in a jQuery collection.
       *
       * @type {jQuery}
       */
      let $popUp = euCookieComplianceElements.getPopUp();

      // Bail if we can't find the pop-up.
      if ($popUp.length === 0) {
        return;
      }

      $popUp.off([
        'eu_cookie_compliance_popup_open.'  + eventNamespace,
        'eu_cookie_compliance_popup_close.' + eventNamespace,
        'click.' + eventNamespace,
      ].join(' '))
      .prop('style').removeProperty(
        '--eu-cookie-compliance-transition-duration'
      );

    }
  );

});
});
});
