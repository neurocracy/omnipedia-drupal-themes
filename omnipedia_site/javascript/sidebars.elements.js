// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Sidebars elements
// -----------------------------------------------------------------------------

AmbientImpact.on('OmnipediaSiteThemeHeaderElements', function(
  headerElements, $
) {
AmbientImpact.addComponent('OmnipediaSiteThemeSidebarsElements', function(
  sidebarsElements, $
) {

  'use strict';

  /**
   * The sidebars container, if any, wrapped in a jQuery collection.
   *
   * @type {jQuery}
   */
  let $container = $();

  /**
   * The sidebars close control, if any, wrapped in a jQuery collection.
   *
   * @type {jQuery}
   */
  let $menuClose = $();

  /**
   * The sidebars closed anchor, if any, wrapped in a jQuery collection.
   *
   * @type {jQuery}
   */
  let $menuClosedAnchor = $();

  /**
   * Whether we've attached the behaviour.
   *
   * @type {Boolean}
   */
  let behaviourAttached = false;

  /**
   * Get the sidebars container jQuery collection.
   *
   * @return {jQuery}
   */
  this.getSidebarsContainer = function() {
    return $container;
  };

  /**
   * Get the sidebars menu open control jQuery collection.
   *
   * @return {jQuery}
   */
  this.getSidebarsMenuOpen = function() {
    return headerElements.getMenuOpen();
  };

  /**
   * Get the sidebars menu close control jQuery collection.
   *
   * @return {jQuery}
   */
  this.getSidebarsMenuClose = function() {
    return $menuClose;
  };

  /**
   * Get the sidebars menu closed anchor jQuery collection.
   *
   * @return {jQuery}
   */
  this.getSidebarsMenuClosedAnchor = function() {
    return $menuClosedAnchor;
  };

  /**
   * Get the selector to attach sidebars behaviours to.
   *
   * @return {String}
   */
  this.getSidebarsBehaviourSelector = function() {
    return '.layout-container';
  };

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarsElements',
    'omnipedia-site-theme-sidebars-elements',
    this.getSidebarsBehaviourSelector(),
    function(context, settings) {

      if (behaviourAttached === true) {
        return;
      }

      $container = $('.layout-sidebars', context);

      $menuClose = $container.find('.layout-sidebars__close', context);

      $menuClosedAnchor = $('.layout-sidebars__closed-anchor', context);

      // Reset jQuery collections and bail if we can't find one of the required
      // elements.
      if (
        $container.length === 0 ||
        $menuClose.length === 0
      ) {
        console.error(
          'Could not find one of the required elements. Found:',
          $container, $menuClose, $menuClosedAnchor
        );

        $container = $();

        $menuClose = $();

        $menuClosedAnchor = $();

        return;
      }

      behaviourAttached = true;

    },
    function(context, settings, trigger) {

      if (behaviourAttached === false) {
        return;
      }

      $container = $();

      $menuClose = $();

      $menuClosedAnchor = $();

      behaviourAttached = false;

    }
  );

});
});
