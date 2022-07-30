// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Sidebars sticky
// -----------------------------------------------------------------------------

// This implements the Sticky Sidebar library for the Omnipedia sidebars to
// allow them to scroll with the viewport but also get pinned to the top or
// bottom depending on the scroll direction.
//
// @see https://abouolia.github.io/sticky-sidebar/

AmbientImpact.onGlobals(['StickySidebar'], function() {
AmbientImpact.on([
  'fastdom', 'layoutSizeChange', 'OmnipediaSiteThemeSidebarsElements',
  'propertyToPixelConverter',
  'responsiveStyleProperty',
], function(
  aiFastDom, aiLayoutSizeChange, sidebarsElements, aiPropertyToPixelConverter,
  aiResponsiveStyleProperty
) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeSidebarsSticky',
function(sidebarsSticky, $) {

  'use strict';

  /**
   * Class added to the layout container when JavaScript sticky is in use.
   *
   * @type {String}
   */
  const containerEnhancedStickyClass = 'layout-container--is-enhanced-sticky';

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
   * CSS custom property name indicating whether sidebars are to be sticky.
   *
   * This changes based on a media query breakpoint.
   *
   * @type {String}
   */
  const isStickyPropertyName = '--sidebars-are-sticky';

  /**
   * The property name that the responsive property instance is saved under.
   *
   * This should be unique so it doesn't potentially colide with another
   * instance saved to the same element.
   *
   * @type {String}
   */
  const responsivePropertyInstanceName = 'isStickyResponsiveStyleProperty';

  /**
   * The property name that the property converter instance is saved under.
   *
   * This should be unique so it doesn't potentially colide with another
   * instance saved to the same element.
   *
   * @type {String}
   */
  const propertyConverterInstanceName = 'stickyPropertiesConverter';

  /**
   * CSS custom property name defining the sticky bottom offset value.
   *
   * @type {String}
   */
  const bottomOffsetPropertyName = '--sticky-sidebar-bottom-offset';

  /**
   * CSS custom property name defining the sticky top offset value.
   *
   * @type {String}
   */
  const topOffsetPropertyName = '--sticky-sidebar-top-offset';

  /**
   * The property name that the sticky element instance is saved under.
   *
   * This should be unique so it doesn't potentially colide with another
   * instance saved to the same element.
   *
   * @type {String}
   */
  const stickyElementInstancePropertyName = 'stickyElementInstance';

  /**
   * Active sticky element instances
   *
   * @type {Object}
   *
   * @todo Convert this to a reusable instance manager that can trigger an event
   *   (so we know when to remove the .layout-container class for example) when
   *   all instances or values have been removed/destroyed.
   */
  let activeInstances = {};

  /**
   * Sticky element object.
   *
   * @param {jQuery} $element
   *   The element to be made sticky, wrapped in a jQuery object.
   *
   * @param {Object} stickySettings
   *   Options for the associated Sticky Sidebar instance.
   *
   * @constructor
   */
  function stickyElement($element, stickySettings) {

    /**
     * Reference to this instance for use in closures where 'this' is different.
     *
     * @type {this}
     */
    let thisInstance = this;

    /**
     * Sticky Sidebar instance.
     *
     * @type {StickySidebar}
     */
    let stickySidebarsInstance;

    /**
     * Property to pixel converter instance.
     *
     * @type {converter}
     */
    let propertyConverterInstance = aiPropertyToPixelConverter.create(
      $element, [bottomOffsetPropertyName, topOffsetPropertyName]
    );

    /**
     * A responsive style property instance; watches sticky state.
     *
     * @type {responsiveStyleProperty}
     */
    let responsiveStyleProperty = aiResponsiveStyleProperty.create(
      isStickyPropertyName, $element
    );

    /**
     * Responsive style property event handler.
     *
     * @param {jQuery.Event} event
     *   The event object.
     *
     * @param {responsiveStyleProperty} instance
     *   The responsive style property instance this event was triggered for.
     */
    function responsivePropertyHandler(event, instance) {

      // Ignore any other responsive properties that may be watched on this
      // or descendent elements.
      if (instance.getPropertyName() !== isStickyPropertyName) {
        return;
      }

      // Attempt to build an instance if one is not already active.
      if (instance.getValue() === 'true') {
        thisInstance.enable();

      // Attempt to destroy an instance if one is active.
      } else if (instance.getValue() === 'false') {
        thisInstance.disable();
      }

    };

    $element.on(
      'responsivePropertyChange.' + eventNamespace, responsivePropertyHandler
    );

    /**
     * Enable this instance.
     *
     * @return {Promise}
     *   A Promise object that resolves once the instance is enabled.
     */
    this.enable = function() {

      // If a Sticky Sidebar instance is already initialized, return an already
      // resolved Promise.
      if (typeof stickySidebarsInstance !== 'undefined') {
        return Promise.resolve();
      }

      return propertyConverterInstance.getValues().then(function(values) {

        /**
         * Sticky Sidebar instance.
         *
         * @type {StickySidebar}
         */
        stickySidebarsInstance = new StickySidebar(
          $element[0],
          $.extend({}, stickySettings, {
            bottomSpacing:  values[bottomOffsetPropertyName],
            topSpacing:     values[topOffsetPropertyName]
          })
        );

      });

    };

    /**
     * Disable this instance without destroying it.
     *
     * @return {Promise}
     *   A Promise object that resolves once the instance is disabled.
     */
    this.disable = function() {

      // If no Sticky Sidebar instance is currently initialized, return an
      // already resolved Promise.
      if (typeof stickySidebarsInstance === 'undefined') {
        return Promise.resolve();
      }

      // Destroy and unset the Sticky Sidebar instance.
      return fastdom.mutate(function() {

        stickySidebarsInstance.destroy();

        stickySidebarsInstance = undefined;

      });

    };

    /**
     * Destroy this instance.
     *
     * @return {Promise}
     *   A Promise object that resolves once the instance is destroyed.
     */
    this.destroy = function() {

      $element.off(
        'responsivePropertyChange.' + eventNamespace, responsivePropertyHandler
      );

      return this.disable();

    };

  };

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarSecondSticky',
    'omnipedia-site-theme-sidebar-second-sticky',
    '.region-sidebar-second',
    function(context, settings) {

      /**
       * The sidebar element jQuery collection.
       *
       * @type {jQuery}
       */
      let $element = $(this);

      /**
       * The sticky element instance.
       *
       * @type {stickyElement}
       */
      let instance = new stickyElement(
        $element.closest('.layout-sidebar-second'),
        {
          innerWrapperSelector: '.region-sidebar-second',
          containerSelector:    'main',
        }
      );

      $element.prop(stickyElementInstancePropertyName, instance);

      $element.closest('.layout-container').addClass(
        containerEnhancedStickyClass
      );

      // @todo Instance manager.
      activeInstances.sidebarSecond = instance;

    },
    function(context, settings, trigger) {

      delete activeInstances.sidebarSecond;

      /**
       * The sidebar element jQuery collection.
       *
       * @type {jQuery}
       */
      let $element = $(this);

      $element.prop(stickyElementInstancePropertyName).destroy();

      $element.removeProp(stickyElementInstancePropertyName);

      // @todo Instance manager.
      if (Object.values(activeInstances).length === 0) {

        $element.closest('.layout-container').removeClass(
          containerEnhancedStickyClass
        );

      }

    }
  );

});
});
});
