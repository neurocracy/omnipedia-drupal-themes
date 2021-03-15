// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header elements
// -----------------------------------------------------------------------------

AmbientImpact.addComponent('OmnipediaSiteThemeHeaderElements', function(
  headerElements, $
) {
  'use strict';

  /**
   * The search anchor, if any, wrapped in a jQuery collection.
   *
   * @type {jQuery}
   */
  var $searchAnchor = $();

  /**
   * The search target element, if any, wrapped in a jQuery collection.
   *
   * @type {jQuery}
   */
  var $searchTarget = $();

  /**
   * The header search form, if any, wrapped in a jQuery collection.
   *
   * @type {jQuery}
   */
  var $searchForm = $();

  /**
   * The header search field, if any, wrapped in a jQuery collection.
   *
   * @type {jQuery}
   */
  var $searchField = $();

  /**
   * Whether we've attached the behaviour.
   *
   * @type {Boolean}
   */
  var behaviourAttached = false;

  /**
   * Get the search anchor jQuery collection.
   *
   * @return {jQuery}
   */
  this.getSearchAnchor = function() {
    return $searchAnchor;
  };

  /**
   * Get the search target jQuery collection.
   *
   * @return {jQuery}
   */
  this.getSearchTarget = function() {
    return $searchTarget;
  };

  /**
   * Get the search form jQuery collection.
   *
   * @return {jQuery}
   */
  this.getSearchForm = function() {
    return $searchForm;
  };

  /**
   * Get the search field jQuery collection.
   *
   * @return {jQuery}
   */
  this.getSearchField = function() {
    return $searchField;
  };

  /**
   * Get the selector to attach header behaviours to.
   *
   * @return {String}
   */
  this.getHeaderBehaviourSelector = function() {
    return '.layout-container';
  };

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderElements',
    'omnipedia-site-theme-header-elements',
    this.getHeaderBehaviourSelector(),
    function(context, settings) {

      if (behaviourAttached === true) {
        return;
      }

      $searchAnchor = $('.search-anchor', context);

      $searchTarget = $('.search-target', context);

      $searchForm = $('.omnipedia-header__search-form', context);

      $searchField = $searchForm.find('.form-item-terms input', context);

      // Reset jQuery collections and bail if we can't find one of the required
      // elements.
      if (
        $searchAnchor.length === 0 ||
        $searchTarget.length === 0 ||
        $searchForm.length === 0 ||
        $searchField.length === 0
      ) {
        console.error(
          'Could not find one of the required elements. Found:',
          $searchAnchor, $searchTarget, $searchForm, $searchField
        );

        $searchAnchor = $();

        $searchTarget = $();

        $searchForm = $();

        $searchField = $();

        return;
      }

      behaviourAttached = true;

    },
    function(context, settings, trigger) {

      if (behaviourAttached === false) {
        return;
      }

      $searchAnchor = $();

      $searchTarget = $();

      $searchForm = $();

      $searchField = $();

      behaviourAttached = false;

    }
  );
});
