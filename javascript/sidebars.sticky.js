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
   * The name that the responsive property instance is saved under.
   *
   * This should be unique so it doesn't potentially colide with another
   * instance saved to the same element.
   *
   * @type {String}
   */
  const responsivePropertyInstanceName = 'isStickyResponsiveStyleProperty';

  /**
   * The name that the property converter instance is saved under.
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

  function stickyElement($element, stickySettings) {

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

    this.enable = function() {

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

    this.disable = function() {

      if (typeof stickySidebarsInstance === 'undefined') {
        return Promise.resolve();
      }

      return fastdom.mutate(function() {

        stickySidebarsInstance.destroy();

        stickySidebarsInstance = undefined;

      });

    };

    this.destroy = function() {

      $element.off(
        'responsivePropertyChange.' + eventNamespace, responsivePropertyHandler
      );

      return this.disable();

    };

  };

  /**
   * Build a Sticky Sidebar instance for the provided sidebars container.
   *
   * @param {jQuery} $container
   *   The sidebars container, wrapped in a jQuery object, to build a Sticky
   *   Sidebars instance for.
   *
   * @return {Promise}
   *   A Promise object that resolves when the Sticky Sidebars instance is
   *   initialized. If one is already active, this will be an already resolved
   *   Promise object.
   */
  // function build($container) {

    // if (typeof $container.prop('stickySidebar') !== 'undefined') {
    //   return Promise.resolve();
    // }

    // return $container.prop(propertyConverterInstanceName).getValues()
    // .then(function(values) {

      /**
       * Second sidebar.
       *
       * @type {HTMLElement}
       */
    //   let sidebarSecond = $container.find('.layout-sidebar-second')[0];

      /**
       * Sticky Sidebar instance.
       *
       * @type {StickySidebar}
       */
  //     let stickySidebar = new StickySidebar(sidebarSecond, {
  //       innerWrapperSelector: '.region-sidebar-second',
  //       containerSelector:    'main',
  //       bottomSpacing:        values[bottomOffsetPropertyName],
  //       topSpacing:           values[topOffsetPropertyName]
  //     });

  //     $container.addClass(containerEnhancedStickyClass);

  //     $container.prop('stickySidebar', stickySidebar);

  //   });

  // };

  /**
   * Destroy a Sticky Sidebar instance for the provided sidebars container.
   *
   * @param {jQuery} $container
   *   The sidebars container, wrapped in a jQuery object, to destroy a Sticky
   *   Sidebars instance for.
   *
   * @return {Promise}
   *   A Promise object that resolves when the Sticky Sidebars instance is
   *   destroyed. If one isn't active, this will be an already resolved Promise
   *   object.
   */
  // function destroy($container) {

  //   if (typeof $container.prop('stickySidebar') === 'undefined') {
  //     return Promise.resolve();
  //   }

  //   return fastdom.mutate(function() {

  //     $container.prop('stickySidebar').destroy();

  //     $container
  //     .removeProp('stickySidebar')
  //     .removeClass(containerEnhancedStickyClass);

  //   });

  // };

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarSecondSticky',
    'omnipedia-site-theme-sidebar-second-sticky',
    '.region-sidebar-second',
    function(context, settings) {

      let $element = $(this);

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

  // this.addBehaviour(
  //   'OmnipediaSiteThemeSidebarsSticky',
  //   'omnipedia-site-theme-sidebars-sticky',
  //   sidebarsElements.getSidebarsBehaviourSelector(),
  //   function(context, settings) {

      /**
       * The sidebars container jQuery collection.
       *
       * @type {jQuery}
       */
      // let $sidebarsContainer = sidebarsElements.getSidebarsContainer();

      // $sidebarsContainer
      // .on('responsivePropertyChange.' + eventNamespace, function(
      //   event, instance
      // ) {

      //   // Ignore any other responsive properties that may be watched on this
      //   // or descendent elements.
      //   if (instance.getPropertyName() !== isStickyPropertyName) {
      //     return;
      //   }

      //   // Attempt to build an instance if one is not already active.
      //   if (instance.getValue() === 'true') {
      //     build($sidebarsContainer);

      //   // Attempt to destroy an instance if one is active.
      //   } else if (instance.getValue() === 'false') {
      //     destroy($sidebarsContainer);
      //   }

      // });

      /**
       * Property to pixel converter instance.
       *
       * @type {converter}
       */
      // let propertyConverter = aiPropertyToPixelConverter.create(
      //   $sidebarsContainer, [bottomOffsetPropertyName, topOffsetPropertyName]
      // );

      // $sidebarsContainer.prop(
      //   propertyConverterInstanceName, propertyConverter
      // );

      /**
       * A responsive style property instance; watches sticky state.
       *
       * @type {responsiveStyleProperty}
       */
      // let responsiveStyleProperty = aiResponsiveStyleProperty.create(
      //   isStickyPropertyName, $sidebarsContainer
      // );

      // // Save the responsiveStyleProperty to the container for detach.
      // $sidebarsContainer.prop(
      //   responsivePropertyInstanceName, responsiveStyleProperty
      // );

    // },
    // function(context, settings, trigger) {

      /**
       * The sidebars container jQuery collection.
       *
       * @type {jQuery}
       */
      // let $sidebarsContainer = sidebarsElements.getSidebarsContainer();

      // $sidebarsContainer.off('responsivePropertyChange.' + eventNamespace);

      // $sidebarsContainer.prop(responsivePropertyInstanceName).destroy();

      // $sidebarsContainer
      // .removeProp(responsivePropertyInstanceName)
      // .removeProp(propertyConverterInstanceName);

  //   }
  // );

});
});
});
