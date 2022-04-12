// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header state
// -----------------------------------------------------------------------------

// This provides a centralized API and events for the site header state. Note
// that this assumes there is only once instance of the header on the page, and
// in the edge case that more than one is present, only the first will be used.

AmbientImpact.on([
  'hashMatcher',
  'OmnipediaSiteThemeHeaderElements',
], function(aiHashMatcher, headerElements, $) {
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
    return headerElements.getSearchAnchor().prop('hashMatcher').matches();
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
   * Show the search form.
   */
  this.showSearch = function() {
    headerElements.getSearchAnchor().prop('hashMatcher').setActive();
  };

  /**
   * Hide the search form.
   */
  this.hideSearch = function() {
    headerElements.getSearchAnchor().prop('hashMatcher').setInactive();
  };

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderState',
    'omnipedia-site-theme-header-state',
    headerElements.getHeaderBehaviourSelector(),
    function(context, settings) {

      if (behaviourAttached === true) {
        return;
      }

      behaviourAttached = true;

      let searchAnchorHash = headerElements.getSearchAnchor().prop('hash');

      /**
       * Hash matcher instance.
       *
       * @type {hashMatcher}
       */
      let hashMatcher = aiHashMatcher.create(searchAnchorHash);

      headerElements.getSearchAnchor().prop('hashMatcher', hashMatcher);

      $(document).on('hashMatchChange.' + eventNamespace, function(
        event, hash, matches
      ) {

        if (hash !== searchAnchorHash) {
          return;
        }

        if (matches === true) {
          headerElements.getSearchForm().trigger('omnipediaSearchActive');

        } else {
          headerElements.getSearchForm().trigger('omnipediaSearchInactive');
        }

      });

    },
    function(context, settings, trigger) {

      if (behaviourAttached === false) {
        return;
      }

      $(document).off('hashMatchChange.' + eventNamespace);

      /**
       * The search anchor jQuery collection.
       *
       * @type {jQuery}
       */
      let searchAnchor = headerElements.getSearchAnchor();

      searchAnchor.prop('hashMatcher').destroy();

      searchAnchor.removeProp('hashMatcher');

      behaviourAttached = false;

    }
  );

});
});
