// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - EU Cookie Compliance overlay component
// -----------------------------------------------------------------------------

AmbientImpact.on([
  'fastdom',
  'OmnipediaPrivacySettings',
  'OmnipediaSiteThemeEuCookieCompliance',
  'overlay',
], function(
  aiFastDom,
  OmnipediaPrivacySettings,
  euCookieCompliance,
  aiOverlay,
) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeEuCookieComplianceOverlay',
function(
  euCookieComplianceOverlay, $,
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * FastDom instance.
   *
   * @type {FastDom}
   */
  const fastdom = aiFastDom.getInstance();

  /**
   * Class applied to the overlay element for CSS.
   *
   * @type {String}
   */
  const overlayClass = 'overlay--eu-cookie-compliance-popup';

  /**
   * Represents a privacy pop-up overlay.
   */
  class PrivacyPopupOverlay {

    /**
     * The overlay instance.
     *
     * @type {Object}
     */
    #overlay;

    /**
     * The overlay element wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$overlay;

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

    /**
     * Constructor.
     *
     * @param {PrivacyPopup} popup
     *   A PrivacyPopup instance.
     */
    constructor(popup) {

      this.#popup = popup;

      this.#$popup = popup.$popup;

      this.#$overlay = aiOverlay.create({
        modal:        true,
        modalFilter:  this.#$popup,
      });

      this.#$overlay.addClass(overlayClass);

      this.#overlay = this.#$overlay.prop('aiOverlay');

      this.#bindEventHandlers();

      /**
       * Reference to the current instance.
       *
       * @type {PrivacyPopupOverlay}
       */
      const that = this;

      fastdom.mutate(function() {

        that.#$overlay.insertBefore(that.#$popup);

      }).then(function() {

        if (that.#popup.isOpen() === false) {
          return;
        }

        // If the pop-up is open when we attach, show the overlay.
        that.show();

      });

    }

    /**
     * Destroy this instance.
     *
     * @return {Promise}
     *   A Promise that resolves when various DOM tasks are complete.
     */
    destroy() {

      this.#unbindEventHandlers();

      /**
       * Reference to the current instance.
       *
       * @type {PrivacyPopupOverlay}
       */
      const that = this;

      return fastdom.mutate(function() {
        // This also removes scroll blocking and disengages focus blocking so we
        // don't need to call #overlay.hide().
        that.#overlay.destroy();
      });

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
       * @type {PrivacyPopupOverlay}
       */
      const that = this;

      this.#$popup.on(`PrivacyPopupBeforeOpen.${eventNamespace}`, function(
        event,
      ) {

        that.show();

      }).on(`PrivacyPopupBeforeClose.${eventNamespace}`, function(event) {

        that.hide();

      }).on(`PrivacyPopupClosed.${eventNamespace}`, function(event) {

        that.#$popup.trigger('immerseExit');

      }).one(`PrivacyPopupDestroyed.${eventNamespace}`, function(event) {

        that.destroy();

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
        `PrivacyPopupBeforeClose.${eventNamespace}`,
        `PrivacyPopupClosed.${eventNamespace}`,
        // Don't unbind the one-off PrivacyPopupDestroyed event handler as that
        // auto destroys this instance.
      ].join(' '));

    }

    /**
     * Show the overlay and perform related tasks.
     *
     * @return {Promise}
     *   A Promise that resolves when various DOM tasks are complete.
     */
    show() {

      this.#overlay.show();

      /**
       * Reference to the current instance.
       *
       * @type {PrivacyPopupOverlay}
       */
      const that = this;

      // Failsafe to prevent disabling scroll if the pop-up is not visible or
      // has been removed for any reason, such as an add-on, e.g. uBlock
      // Origin, or some other software.
      return fastdom.measure(function() {
        return (
          that.#$popup.is(':hidden') ||
          that.#$popup.width() < 10 ||
          that.#$popup.height() < 10 ||
          that.#$popup.css('visibility') === 'hidden'
        );

      }).then(function(popupBlocked) {

        if (popupBlocked === true) {
          return;
        }

        that.#$popup.trigger('immerseEnter');

      });

    }

    /**
     * Hide the overlay and perform related tasks.
     *
     * @return {Promise}
     *   A Promise that resolves when various DOM tasks are complete.
     */
    hide() {

      this.#overlay.hide();

      // @todo A real FastDom Promise when the overlay component has been
      //   refactored to return one.
      return Promise.resolve();

    }

  };

  this.addBehaviour(
    'OmnipediaSiteThemeEuCookieComplianceOverlay',
    'omnipedia-site-theme-eu-cookie-compliance-overlay',
    '#sliding-popup',
    function(context, settings) {

      $(this).prop('PrivacyPopupOverlay', new PrivacyPopupOverlay(
        $(this).prop('PrivacyPopup'),
      ));

    },
    function(context, settings, trigger) {

      // PrivacyPopupOverlay destroys itself on the PrivacyPopupDestroyed event
      // so we just need to remove the property and let browser garbage
      // collection handle the rest.
      $(this).removeProp('PrivacyPopupOverlay');

    }
  );

});
});
