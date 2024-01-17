// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - EU Cookie Compliance component
// -----------------------------------------------------------------------------

AmbientImpact.onGlobals([
  'Drupal.eu_cookie_compliance',
  'drupalSettings.eu_cookie_compliance',
], function() {
AmbientImpact.on([
  'fastdom', 'OmnipediaPrivacySettings',
], function(aiFastDom, OmnipediaPrivacySettings) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeEuCookieCompliance',
function(euCookieCompliance, $) {

  'use strict';

  /**
   * FastDom instance.
   *
   * @type {FastDom}
   */
  const fastdom = aiFastDom.getInstance();

  /**
   * Base BEM class for the pop-up.
   *
   * @type {String}
   */
  const baseClass = 'eu-cookie-compliance-popup';

  /**
   * The BEM class for when the pop-up is associated with an in-page toggle.
   *
   * @type {String}
   */
  const hasInPageToggleClass = `${baseClass}--has-in-page-toggle`;

  /**
   * Class applied to the containing element when the pop-up is open.
   *
   * @type {String}
   */
  const containingElementWhenOpenClass = 'eu-cookie-compliance-popup-open';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * The transition duration for the privacy pop-up open and close.
   *
   * @type {Number}
   */
  const transitionDuration = drupalSettings.eu_cookie_compliance.popup_delay;

  /**
   * Represents a privacy pop-up.
   */
  class PrivacyPopup {

    /**
     * The pop-up element wrapped in a jQuery collection.
     *
     * @type {jQuery}
     */
    #$popup;

    /**
     * The containing element wrapped in a jQuery collection.
     *
     * The containing element is configured in the EU Cookie Compliance module's
     * settings, and is the <body> element by default.
     *
     * @type {jQuery}
     */
    #$containingElement;

    /**
     * Constructor.
     *
     * @param {jQuery|HTMLElement} $popup
     *   The pop-up element wrapped in a jQuery collection or as an HTMLElement.
     */
    constructor($popup) {

      this.#$popup = $($popup);

      this.#$containingElement = $(
        drupalSettings.eu_cookie_compliance.containing_element,
      );

      const beforeConstructEvent = new $.Event('PrivacyPopupBeforeConstruct');

      this.#$popup.trigger(beforeConstructEvent, [this]);

      /**
       * Reference to the current instance.
       *
       * @type {PrivacyPopup}
       */
      const that = this;

      fastdom.mutate(function() {

        that.#$popup.addClass(baseClass);

        if (OmnipediaPrivacySettings.getToggle().length > 0) {
          that.#$popup.addClass(hasInPageToggleClass);
        }

        // Save the transition duration as a custom property on the pop-up so
        // that it can be used in CSS.
        that.#$popup.prop('style').setProperty(
          '--eu-cookie-compliance-transition-duration',
          `${transitionDuration}ms`,
        );

        that.#bindEventHandlers();

      }).then(function() {

        const constructedEvent = new $.Event('PrivacyPopupConstructed');

        that.#$popup.trigger(constructedEvent, [that]);

      });

    }

    /**
     * Destroy this instance.
     *
     * @return {Promise}
     *   A Promise that resolves when various DOM tasks are complete.
     */
    destroy() {

      /**
       * Reference to the current instance.
       *
       * @type {PrivacyPopup}
       */
      const that = this;

      const beforeDestroyEvent = new $.Event('PrivacyPopupBeforeDestroy');

      this.#$popup.trigger(beforeDestroyEvent, [this]);

      this.#unbindEventHandlers();

      return fastdom.mutate(function() {

        that.#$popup.removeClass([
          baseClass, hasInPageToggleClass,
        ]).prop('style').removeProperty(
          '--eu-cookie-compliance-transition-duration',
        );

      }).then(function() {

        const destroyedEvent = new $.Event('PrivacyPopupDestroyed');

        that.#$popup.trigger(destroyedEvent, [that]);

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
       * @type {PrivacyPopup}
       */
      const that = this;

      this.#$popup.on(
        `eu_cookie_compliance_popup_open.${eventNamespace}`,
      function(event) {

        const beforeOpenEvent = new $.Event('PrivacyPopupBeforeOpen');

        that.#$popup.trigger(beforeOpenEvent, [that]);

        // The module's JavaScript does not provide an event for when the pop-up
        // has finished opening, so this does that in a roundabout way. Note
        // that since this is using the configured delay value, it waits in
        // parallel with the value, but likely will not trigger on the exact
        // frame the the pop-up's jQuery animation has actually completed.
        setTimeout(function() {

          const openedEvent = new $.Event('PrivacyPopupOpened');

          that.#$popup.trigger(openedEvent, [that]);

        }, transitionDuration);

      }).on(
        `eu_cookie_compliance_popup_close.${eventNamespace}`,
      function(event) {

        const beforeCloseEvent = new $.Event('PrivacyPopupBeforeClose');

        that.#$popup.trigger(beforeCloseEvent, [that]);

        // The module's JavaScript does not provide an event for when the pop-up
        // has finished closing, so this does that in a roundabout way. Note
        // that since this is using the configured delay value, it waits in
        // parallel with the value, but likely will not trigger on the exact
        // frame the the pop-up's jQuery animation has actually completed.
        setTimeout(function() {fastdom.mutate(function() {

          const currentStatus = Drupal.eu_cookie_compliance.getCurrentStatus();

          // The module's JavaScript only updates the container (usually <body>)
          // classes when first attached. Unfortunately, this means that CSS
          // cannot depend on these updating when a user agrees to some or all
          // categories, so we have to do that ourselves. Note that this must
          // delay until the pop-up is expected to be closed to avoid causing
          // issues with hiding the pop-up smoothly.
          that.#$containingElement.removeClass([
            'eu-cookie-compliance-status-null',
            'eu-cookie-compliance-status-1',
            'eu-cookie-compliance-status-2',
          ]).addClass(`eu-cookie-compliance-status-${currentStatus}`);

        }).then(function() {

          const closedEvent = new $.Event('PrivacyPopupClosed');

          that.#$popup.trigger(closedEvent, [that]);

        })}, transitionDuration);

        fastdom.mutate(function() {

          // The module JavaScript annoyingly does not remove this class when
          // the pop-up is closed via clicking the accept buttons so make sure
          // this is removed on close.
          that.#$containingElement.removeClass(containingElementWhenOpenClass);

        });

      }).on(`click.${eventNamespace}`, function(event) {

        // Slightly hacky and indirect way of triggering the close event because
        // the module's JavaScript annoyingly does not trigger it when closed
        // by the accept/ agree buttons.

        if (
          !$(event.target).is(
            '.eu-cookie-compliance-save-preferences-button'
          ) &&
          !$(event.target).is('.agree-button')
        ) {
          return;
        }

        that.#$popup.trigger('eu_cookie_compliance_popup_close');

      });

    }

    /**
     * Unbind all of our event handlers.
     *
     * @see this~#bindEventHandlers()
     */
    #unbindEventHandlers() {

      this.#$popup.off([
        `eu_cookie_compliance_popup_open.${eventNamespace}`,
        `eu_cookie_compliance_popup_close.${eventNamespace}`,
        `click.${eventNamespace}`,
      ].join(' '));

    }

    /**
     * Get the pop-up element jQuery collection.
     *
     * @return {jQuery}
     */
    get $popup() {
      return this.#$popup;
    }

    /**
     * Get the containing element jQuery collection.
     *
     * @return {jQuery}
     */
    get $containingElement() {
      return this.#$containingElement;
    }

    /**
     * Whether the pop-up is currently marked as open.
     *
     * @return {Boolean}
     */
    isOpen() {
      return this.#$containingElement.is(`.${containingElementWhenOpenClass}`);
    }

  };

  this.addBehaviour(
    'OmnipediaSiteThemeEuCookieCompliance',
    'omnipedia-site-theme-eu-cookie-compliance',
    '#sliding-popup',
    function(context, settings) {

      $(this).prop('PrivacyPopup', new PrivacyPopup(this));

    },
    function(context, settings, trigger) {

      /**
       * Reference to the HTML element being detached from.
       *
       * @type {HTMLElement}
       */
      const that = this;

      $(this).prop('PrivacyPopup').destroy().then(function() {

        $(that).removeProp('PrivacyPopup');

      });

    }
  );

});
});
});
