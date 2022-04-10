// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header state
// -----------------------------------------------------------------------------

// This provides a centralized API and events for the site header state. Note
// that this assumes there is only once instance of the header on the page, and
// in the edge case that more than one is present, only the first will be used.

AmbientImpact.on('OmnipediaSiteThemeHeaderElements', function(
  headerElements, $
) {
AmbientImpact.addComponent('OmnipediaSiteThemeHeaderState', function(
  headerState, $
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
   * Whether a hide has been requested, to prevent race conditions.
   *
   * This acts as a failsafe to ensure only the first request to hide the search
   * does anything, as there are some situations where the location hash hasn't
   * changed yet and we can erroneously call history.back() twice.
   *
   * @type {Boolean}
   *
   * @see setActive()
   *   Resets this to false.
   *
   * @see setInactive()
   *   Sets this to true.
   */
  let hideRequested = false;

  /**
   * Whether the header is currently in compact mode, i.e. on a narrow screen.
   *
   * @return {Boolean}
   *
   * @todo Determine if window.getComputedStyle() or
   *   CSSStyleDeclaration.getPropertyValue() is causing layout reflow.
   */
  this.isCompact = function() {

    if (behaviourAttached === false) {
      return false;
    }

    /**
     * The current state of the search anchor.
     *
     * This should be a string of either:
     *
     * - 'visible': the layout is in compact mode with the anchor visible.
     *
     * - 'hidden': the layout has the sidebars beside the content column, so
     *   the anchor is hidden.
     *
     * This allows us to detect the current state of the search anchor, which
     * delegates the state to CSS, without having to hard code any media
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
    let anchorState = getComputedStyle(headerElements.getSearchAnchor()[0])
      .getPropertyValue('--omnipedia-search-anchor-state').trim();

    return anchorState === 'visible';

  };

  /**
   * Whether the header search is currently open.
   *
   * Note that this doesn't consider whether the header is in compact mode.
   * This method should be used in conjuction with this.isCompact() for that
   * purpose.
   *
   * @return {Boolean}
   *
   * @see this.isCompact()
   */
  this.isSearchOpen = function() {
    return location.hash === headerElements.getSearchAnchor().prop('hash');
  };

  /**
   * Whether the search field is currently focused.
   *
   * @return {Boolean}
   */
  this.isSearchFieldFocused = function() {
    return headerElements.getSearchField().is(document.activeElement);
  };

  /**
   * Set the search form as active.
   */
  function setActive() {

    hideRequested = false;

    headerElements.getSearchForm().trigger('omnipediaSearchActive');

  };

  /**
   * Show the search form.
   */
  this.showSearch = function() {

    if (this.isSearchOpen() === true) {
      return;
    }

    setActive();

  };

  /**
   * Set the search form as inactive.
   */
  function setInactive() {

    hideRequested = true;

    headerElements.getSearchForm().trigger('omnipediaSearchInactive');

  }

  /**
   * Hide the search form.
   */
  this.hideSearch = function() {

    if (this.isSearchOpen() === false || hideRequested === true) {
      return;
    }

    history.back();

    setInactive();

  };

  /**
   * hashchange event handler.
   *
   * @param {jQuery.Event} event
   *   The jQuery Event object.
   */
  function hashChangeHandler(event) {

    /**
     * The hash value stored in the search anchor's 'hash' property.
     *
     * @type {USVString}
     */
    let hash = headerElements.getSearchAnchor().prop('hash');

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
      setActive();
    } else if (oldHash === hash && newHash !== hash) {
      setInactive();
    }

  };

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderState',
    'omnipedia-site-theme-header-state',
    headerElements.getHeaderBehaviourSelector(),
    function(context, settings) {

      if (behaviourAttached === true) {
        return;
      }

      $(window).on('hashchange.' + eventNamespace, hashChangeHandler);

      behaviourAttached = true;

    },
    function(context, settings, trigger) {

      if (behaviourAttached === false) {
        return;
      }

      $(window).off('hashchange.' + eventNamespace, hashChangeHandler);

      behaviourAttached = false;

    }
  );

});
});
