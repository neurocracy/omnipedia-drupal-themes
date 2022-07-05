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
  'responsiveStyleProperty',
], function(
  aiFastDom, aiLayoutSizeChange, sidebarsElements, aiResponsiveStyleProperty
) {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeSidebarsSticky',
function(sidebarsSticky, $) {

  'use strict';

  const containerEnhancedStickyClass = 'layout-sidebars--is-enhanced-sticky';

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

  const bottomOffsetPropertyName = '--sticky-sidebar-bottom-offset';

  const topOffsetPropertyName = '--sticky-sidebar-top-offset';

  function getSpacingValues($container) {

    return fastdom.measure(function() {

      let computedStyle = getComputedStyle($container[0]);

      return {
        topSpacing:     computedStyle.getPropertyValue(topOffsetPropertyName),
        bottomSpacing:  computedStyle.getPropertyValue(
          bottomOffsetPropertyName
        )
      }

    }).then(function(values) { return fastdom.mutate(function() {

      // console.log(values);

      return {
        bottom: $('<div></div>').attr('aria-hidden', true).css({
          position: 'absolute',
          // Placed just out of view. Note that a negative top value shouldn't
          // cause any scrolling upwards on any platforms/browsers.
          top:      '-110vh',
          width:    '1px',
          height:   values.bottomSpacing
        }).appendTo($container),
        top: $('<div></div>').attr('aria-hidden', true).css({
          position: 'absolute',
          // Placed just out of view. Note that a negative top value shouldn't
          // cause any scrolling upwards on any platforms/browsers.
          top:      '-110vh',
          width:    '1px',
          height:   values.topSpacing
        }).appendTo($container),

      };

    }); }).then(function(elements) { return fastdom.measure(function() {
      return {
        elements: elements,
        values:   {
          bottomSpacing:  elements.bottom.height(),
          topSpacing:     elements.top.height()
        }
      }
    }); }).then(function(data) { return fastdom.mutate(function() {

      data.elements.top.remove();
      data.elements.bottom.remove();

      return data.values;

    }); });

  };

  function build($container) {

    // console.log('build()', typeof $container.prop('stickySidebar'));

    if (typeof $container.prop('stickySidebar') !== 'undefined') {
      return Promise.resolve();
    }

    return getSpacingValues($container).then(function(values) {

      let sidebarSecond = $container.find('.layout-sidebar-second')[0];

      let stickySidebar = new StickySidebar(sidebarSecond, {
        innerWrapperSelector: '.region-sidebar-second',
        containerSelector:    'main',
        bottomSpacing:        values.bottomSpacing,
        topSpacing:           values.topSpacing
      });

      $container.addClass(containerEnhancedStickyClass);

      $container.prop('stickySidebar', stickySidebar);

      // console.log('Sticky Sidebar built.');

    });

  };

  function destroy($container) {

    // console.log('destroy()', typeof $container.prop('stickySidebar'));

    if (typeof $container.prop('stickySidebar') === 'undefined') {
      return Promise.resolve();
    }

    return fastdom.mutate(function() {

      $container.prop('stickySidebar').destroy();

      $container
      .removeProp('stickySidebar')
      .removeClass(containerEnhancedStickyClass);

      // console.log('Sticky Sidebar destroyed.');

    });

  };

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarsSticky',
    'omnipedia-site-theme-sidebars-sticky',
    sidebarsElements.getSidebarsBehaviourSelector(),
    function(context, settings) {

      /**
       * The sidebars container jQuery collection.
       *
       * @type {jQuery}
       */
      let $sidebarsContainer = sidebarsElements.getSidebarsContainer();

      $sidebarsContainer
      .on('responsivePropertyChange.' + eventNamespace, function(
        event, instance
      ) {

        if (instance.getPropertyName() !== isStickyPropertyName) {
          return;
        }

        if (instance.getValue() === 'true') {
          build($sidebarsContainer);

        } else if (instance.getValue() === 'false') {
          destroy($sidebarsContainer);
        }

      });

      /**
       * A responsive style property instance; watches sticky state.
       *
       * @type {responsiveStyleProperty}
       */
      let responsiveStyleProperty = aiResponsiveStyleProperty.create(
        isStickyPropertyName, $sidebarsContainer
      );

      $sidebarsContainer.prop(
        responsivePropertyInstanceName, responsiveStyleProperty
      );

    },
    function(context, settings, trigger) {

      /**
       * The sidebars container jQuery collection.
       *
       * @type {jQuery}
       */
      let $sidebarsContainer = sidebarsElements.getSidebarsContainer();

      $sidebarsContainer.off('responsivePropertyChange.' + eventNamespace);

      $sidebarsContainer.prop(responsivePropertyInstanceName).destroy();

      $sidebarsContainer.removeProp(responsivePropertyInstanceName);

    }
  );

});
});
});
