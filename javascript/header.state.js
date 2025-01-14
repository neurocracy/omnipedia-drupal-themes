// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header state
// -----------------------------------------------------------------------------

// This provides a centralized API and events for the site header state. Note
// that this assumes there is only once instance of the header on the page, and
// in the edge case that more than one is present, only the first will be used.

AmbientImpact.on([
  'hashMatcher',
  'OmnipediaSiteThemeHeaderElements',
  'responsiveStyleProperty',
], function(aiHashMatcher, headerElements, aiResponsiveStyleProperty, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeHeaderState', function(
  headerState, $
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * The name that the responsive property instance is saved under.
   *
   * This should be unique so it doesn't potentially colide with another
   * instance saved to the same element.
   *
   * @type {String}
   */
  const responsivePropertyInstanceName = 'searchStateResponsiveStyleProperty';

  /**
   * The CSS custom property name that we watch for the search anchor state.
   *
   * The expected value should be a string of either:
   *
   * - 'visible': the layout is in compact mode with the anchor visible.
   *
   * - 'hidden': the layout has the sidebars beside the content column, so the
   *   anchor is hidden.
   *
   * This allows us to detect the current state of the search anchor, which
   * delegates the state to CSS, without having to hard code any media queries
   * in JavaScript.
   *
   * @type {String}
   */
  const searchStatePropertyName = '--omnipedia-search-anchor-state';

  /**
   * Whether the header is currently in compact mode, i.e. on a narrow screen.
   *
   * @return {Boolean}
   */
  this.isCompact = function() {

    return (
      headerElements.getSearchAnchor().prop(responsivePropertyInstanceName)
      .getValue() === 'visible'
    );

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

      /**
       * The search anchor jQuery collection.
       *
       * @type {jQuery}
       */
      let $searchAnchor = headerElements.getSearchAnchor();

      /**
       * The header search form jQuery collection.
       *
       * @type {jQuery}
       */
      let $searchForm = headerElements.getSearchForm();

      /**
       * The hash value stored in the search anchor's 'hash' property.
       *
       * @type {USVString}
       */
      const searchAnchorHash = $searchAnchor.prop('hash');

      /**
       * Hash matcher instance.
       *
       * @type {hashMatcher}
       */
      let hashMatcher = aiHashMatcher.create(searchAnchorHash);

      $searchAnchor.prop('hashMatcher', hashMatcher);

      $(document).on('hashMatchChange.' + eventNamespace, function(
        event, hash, matches
      ) {

        if (hash !== searchAnchorHash) {
          return;
        }

        if (matches === true) {
          $searchForm.trigger('omnipediaSearchActive');

        } else {
          $searchForm.trigger('omnipediaSearchInactive');
        }

      })
      // Click handler to close the search if compact and open as a partial
      // band-aid for:
      //
      // @see https://github.com/neurocracy/drupal-omnipedia-site-theme/issues/22
      .on(`click.${eventNamespace}`, function(event) {

        if (
          !headerState.isCompact() ||
          !headerState.isSearchOpen() ||
          // This ensures that any clicks on or inside of the search form or
          // search anchor do not close the search.
          $(event.target).closest($searchForm.add($searchAnchor)).length > 0
        ) {
          return;
        }

        headerState.hideSearch();

      });

      /**
       * A responsive style property instance; watches search state.
       *
       * @type {responsiveStyleProperty}
       */
      let responsiveStyleProperty = aiResponsiveStyleProperty.create(
        searchStatePropertyName, $searchAnchor
      );

      $searchAnchor.prop(
        responsivePropertyInstanceName, responsiveStyleProperty
      );

    },
    function(context, settings, trigger) {

      $(document).off([
        `click.${eventNamespace}`,
        `hashMatchChange.${eventNamespace}`,
      ].join(' '));

      /**
       * The search anchor jQuery collection.
       *
       * @type {jQuery}
       */
      let $searchAnchor = headerElements.getSearchAnchor();

      if ($searchAnchor.length > 0) {

        $searchAnchor.prop('hashMatcher').destroy();

        $searchAnchor.removeProp('hashMatcher');

        $searchAnchor.prop(responsivePropertyInstanceName).destroy();

        $searchAnchor.removeProp(responsivePropertyInstanceName);

      }

    }
  );

});
});
