// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Sidebars state
// -----------------------------------------------------------------------------

// This provides a centralized API and events for the sidebars state. Note that
// this assumes there is only once instance of the sidebars container on the
// page, and in the edge case that more than one is present, only the first will
// be used.

AmbientImpact.on('OmnipediaSiteThemeSidebarsElements', function(
  sidebarsElements, $
) {
AmbientImpact.addComponent('OmnipediaSiteThemeSidebarsState', function(
  sidebarsState, $
) {

  'use strict';

  /**
   * Whether we've attached the behaviour.
   *
   * @type {Boolean}
   */
  let behaviourAttached = false;

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * Whether the sidebars are currently off-canvas, i.e. on a narrow screen.
   *
   * @return {Boolean}
   *
   * @todo Determine if window.getComputedStyle() or
   *   CSSStyleDeclaration.getPropertyValue() is causing layout reflow.
   */
  this.isOffCanvas = function() {

    if (behaviourAttached === false) {
      return false;
    }

    /**
     * The current off-canvas state of the sidebars.
     *
     * This should be a string of either:
     *
     * - 'true': the layout is in compact mode with the anchor visible.
     *
     * - 'false': the layout has the sidebars beside the content column, so
     * the anchor is hidden.
     *
     * This allows us to detect the current state of the sidebars, which
     * delegates the state to CSS without having to hard code any media
     * queries in JavaScript.
     *
     * Note that we have to use the .trim() method to remove white-space that
     * may be present because browsers will preserve the exact characters
     * after the colon (:), and this would then never match. This behaviour
     * seems to be cross-browser and likely part of the custom properties
     * specification.
     *
     * @type {String}
     */
    let offCanvasState = getComputedStyle(
      sidebarsElements.getSidebarsContainer()[0]
    ).getPropertyValue('--omnipedia-sidebars-off-canvas').trim();

    return offCanvasState === 'true';

  };

  /**
   * Whether the off-canvas sidebars menu is currently open.
   *
   * Note that this doesn't consider whether the sidebars are actually in
   * off-canvas mode. This method should be used in conjuction with
   * this.isOffCanvas() for that purpose.
   *
   * @return {Boolean}
   *
   * @see this.isOffCanvas()
   */
  this.isMenuOpen = function() {
    return (
      location.hash === sidebarsElements.getSidebarsMenuOpen().prop('hash')
    );
  };

  /**
   * Set the menu as open.
   */
  function setOpen() {
    sidebarsElements.getSidebarsContainer()
      .trigger('omnipediaSidebarsMenuOpen');
  };

  /**
   * Open the menu.
   */
  this.openMenu = function() {
    if (this.isMenuOpen() === true) {
      return;
    }

    setOpen();
  };

  /**
   * Set the menu as closed.
   */
  function setClosed() {
    sidebarsElements.getSidebarsContainer()
      .trigger('omnipediaSidebarsMenuClose');
  };

  /**
   * Close the menu.
   */
  this.closeMenu = function() {

    if (this.isMenuOpen() === false) {
      return;
    }

    history.back();

    setClosed();

  };

  /**
   * Menu close control click event handler.
   *
   * @param {jQuery.Event} event
   *   The jQuery Event object.
   */
  function menuCloseClickHandler(event) {

    if (sidebarsState.isOffCanvas() === true) {
      sidebarsState.closeMenu();
    }

    event.preventDefault();

  };

  /**
   * hashchange event handler.
   *
   * @param {jQuery.Event} event
   *   The jQuery Event object.
   */
  function hashChangeHandler(event) {

    /**
     * The hash value stored in the open link's 'hash' property.
     *
     * @type {USVString}
     */
    let hash = sidebarsElements.getSidebarsMenuOpen().prop('hash');

    /**
     * The hash value for the old URL the window navigated from.
     *
     * @type {USVString}
     */
    let oldHash = new URL(event.originalEvent.oldURL).hash;

    /**
     * The hash value for the new URL the window is navigating to.
     *
     * @type {USVString}
     */
    let newHash = new URL(event.originalEvent.newURL).hash;

    if (newHash === hash && oldHash !== hash) {
      setOpen();
    } else if (oldHash === hash && newHash !== hash) {
      setClosed();
    }

  };

  this.addBehaviour(
    'OmnipediaSiteThemeSidebarsState',
    'omnipedia-site-theme-sidebars-state',
    sidebarsElements.getSidebarsBehaviourSelector(),
    function(context, settings) {

      if (behaviourAttached === true) {
        return;
      }

      $(window).on('hashchange.' + eventNamespace, hashChangeHandler);

      sidebarsElements.getSidebarsMenuClose().on(
        'click.' + eventNamespace, menuCloseClickHandler
      );

      behaviourAttached = true;

    },
    function(context, settings, trigger) {

      if (behaviourAttached === false) {
        return;
      }

      sidebarsElements.getSidebarsMenuClose().off(
        'click.' + eventNamespace, menuCloseClickHandler
      );

      $(window).off('hashchange.' + eventNamespace, hashChangeHandler);

      behaviourAttached = false;

    }
  );

});
});
