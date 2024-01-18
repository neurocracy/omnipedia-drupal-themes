// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - EU Cookie Compliance focus management component
// -----------------------------------------------------------------------------

// This moves focus to the first tabble element inside the pop-up when opened
// and moves focus back to the privacy toggle when the pop-up is closed. It also
// locks the pointer focus source during pop-up opening and closing so that it
// remains set to keyboard or pointer, depending on which was used, and doesn't
// change to script focus source.

AmbientImpact.onGlobals([
  'ally.query.tabbable',
  'ally.style.focusSource',
], function() {
AmbientImpact.on([
  'pointerFocusHide',
  'OmnipediaPrivacySettings',
  'OmnipediaSiteThemeEuCookieCompliance',
], function(
  aiPointerFocusHide,
  OmnipediaPrivacySettings,
  euCookieCompliance,
) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeEuCookieComplianceFocus',
function(
  euCookieComplianceFocus, $,
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * Represents privacy pop-up focus management.
   */
  class PrivacyPopupFocus {

    /**
     * ally.js focus source global service object.
     *
     * @type {Object}
     *
     * @see https://allyjs.io/api/style/focus-source.html
     */
    #focusSourceHandle;

    /**
     * The PrivacyPopup instance we're providing an overlay for.
     *
     * @type {PrivacyPopup}
     */
    #popup;

    /**
     * The pop-up element wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$popup;

    #sidebarsOffcanvasOpened = false;

    /**
     * Constructor.
     *
     * @param {PrivacyPopup} popup
     *   A PrivacyPopup instance.
     */
    constructor(popup) {

      this.#popup = popup;

      this.#$popup = popup.$popup;

      this.#focusSourceHandle = ally.style.focusSource();

      this.#bindEventHandlers();

    }

    /**
     * Destroy this instance.
     *
     * @return {Promise}
     *   A Promise that resolves when various DOM tasks are complete.
     */
    destroy() {

      this.#focusSourceHandle.disengage();

      this.#unbindEventHandlers();

      return Promise.resolve();

    }

    /**
     * Bind all of our event handlers.
     *
     * @see this~#unbindEventHandlers()
     */
    #bindEventHandlers() {

      /**
       * Reference to the current instance.
       *
       * @type {PrivacyPopupFocus}
       */
      const that = this;

      this.#$popup.on(`PrivacyPopupBeforeOpen.${eventNamespace}`, function(
        event, popup,
      ) {

        aiPointerFocusHide.lock();

      }).on(`PrivacyPopupOpened.${eventNamespace}`, function(event, popup) {

        // We have to find the first tabbable element in the pop-up because the
        // pop-up itself does not seem to be focusable for some reason.
        $(ally.query.tabbable({
          context:        that.#$popup,
          includeContext: true,
        })).first().focus();

        aiPointerFocusHide.unlock();

      }).on(`PrivacyPopupBeforeClose.${eventNamespace}`, function(
        event, popup,
      ) {

        aiPointerFocusHide.lock();

      }).on(`PrivacyPopupClosed.${eventNamespace}`, function(event, popup) {

        // Only focus the toggle if it looks like the sidebars were opened and
        // off-canvas. This is to prevent the pop-up opening the sidebars if
        // the pop-up was not opened via the toggle in the sidebars, such as on
        // a page load where the user has not yet agreed and the pop-up shows
        // itself on page load.
        if (that.#sidebarsOffcanvasOpened === true) {
          OmnipediaPrivacySettings.getToggle().focus();
        }

        aiPointerFocusHide.unlock();

      // Bind a one-off handler to the PrivacyPopupDestroyed event which
      // disengages and removes the focus source handle.
      }).one(`PrivacyPopupDestroyed.${eventNamespace}`, function(event, popup) {

        that.destroy();

      });

      $(document).on(`omnipediaSidebarsMenuOpen.${eventNamespace}`, function(
        event, sidebars,
      ) {

        // @todo This kind of a hack and doesn't give us context as to when the
        //   sidebars were opened, i.e. were they opened right before opening
        //   the privacy pop-up or was it unrelated and/or a while ago?
        if (sidebars.isOffCanvas() === true) {
          that.#sidebarsOffcanvasOpened = true;
        }

      });

    }

    /**
     * Unbind all of our event handlers.
     *
     * @see this~#bindEventHandlers()
     */
    #unbindEventHandlers() {

      this.#$popup.off([
        `PrivacyPopupBeforeOpen.${eventNamespace}`,
        `PrivacyPopupOpened.${eventNamespace}`,
        `PrivacyPopupBeforeClose.${eventNamespace}`,
        `PrivacyPopupClosed.${eventNamespace}`,
        // Don't remove the PrivacyPopupDestroyed handler as it's a one-off and
        // must be triggered to destroy; removing it here will likely prevent it
        // triggering.
      ].join(' '));

      $(document).off(`omnipediaSidebarsMenuOpen.${eventNamespace}`);

    }

  }

  this.addBehaviour(
    'OmnipediaSiteThemeEuCookieComplianceFocus',
    'omnipedia-site-theme-eu-cookie-compliance-focus',
    '#sliding-popup',
    function(context, settings) {

      $(this).prop('PrivacyPopupFocus', new PrivacyPopupFocus(
        $(this).prop('PrivacyPopup'),
      ));

    },
    function(context, settings, trigger) {

      // PrivacyPopupFocus destroys itself on the PrivacyPopupDestroyed event so
      // we just need to remove the property and let browser garbage collection
      // handle the rest.
      $(this).removeProp('PrivacyPopupFocus');

    }
  );

});
});
});
