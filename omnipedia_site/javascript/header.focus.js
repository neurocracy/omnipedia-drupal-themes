// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Header focus management
// -----------------------------------------------------------------------------

// This manages focus on the following events:
//
// - 'omnipediaSearchActive': focuses the search field.
//
// - 'omnipediaSearchInactive': if the header is in compact mode, will move
//   focus to the search anchor; if the header is not in compact mode, will
//   simply blur the search field.
//
// Additionally, a class is added for styling to the search target whenever the
// focus enters the search form and removed when focus has left it.

AmbientImpact.on([
  'OmnipediaSiteThemeHeaderElements',
  'OmnipediaSiteThemeHeaderState',
], function(headerElements, headerState, $) {
AmbientImpact.addComponent('OmnipediaSiteThemeHeaderFocus', function(
  headerFocus, $
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * Search target class applied when the search form has focus.
   *
   * @type {String}
   */
  const searchTargetFormFocusClass = 'search-target--form-has-focus';

  /**
   * Whether a focus event should be ignored.
   *
   * @param {HTMLElement} element
   *
   * @return {Boolean}
   *   True if the provided element is within the search form or the header is
   *   not in compact mode. False otherwise.
   */
  function shouldIgnoreFocusChange(element) {

    return (
      // Is the element within the search form?
      headerElements.getSearchForm().find(element).length > 0 ||
      // Is the header not in compact mode?
      !headerState.isCompact()
    );

  }

  this.addBehaviour(
    'OmnipediaSiteThemeHeaderFocus',
    'omnipedia-site-theme-header-focus',
    headerElements.getHeaderBehaviourSelector(),
    function(context, settings) {

      $(this).on('omnipediaSearchActive.' + eventNamespace, function(event) {

        headerElements.getSearchField().focus();

      }).on('omnipediaSearchInactive.' + eventNamespace, function(event) {

        // If the currently focused element is within the search form, focus the
        // search anchor. Note that the check for where focus is located is very
        // important, as otherwise we could steal focus from unrelated parts of
        // the page and confuse users.
        if (
          headerElements.getSearchForm().find(document.activeElement).length > 0
        ) {

          // If we're in compact mode, move focus to the search anchor.
          if (headerState.isCompact() === true) {

            headerElements.getSearchAnchor().focus();

          // Otherwise, if the search field currently has focus on a wider
          // screen, simply blur it. This should still keep the location of the
          // focus if the user is tabbing through the document.
          } else if (
            headerElements.getSearchField().is(document.activeElement)
          ) {

            headerElements.getSearchField().blur();

          }
        }

      });

      headerElements.getSearchForm()
        .on('focusin.' + eventNamespace, function(event) {

          if (shouldIgnoreFocusChange(event.relatedTarget)) {
            return;
          }

          headerElements.getSearchTarget()
            .addClass(searchTargetFormFocusClass);
        })
        .on('focusout.' + eventNamespace, function(event) {

          if (shouldIgnoreFocusChange(event.relatedTarget)) {
            return;
          }

          headerState.hideSearch();

          headerElements.getSearchTarget()
            .removeClass(searchTargetFormFocusClass);
        });

    },
    function(context, settings, trigger) {

      $(this).off([
        'omnipediaSearchActive.'    + eventNamespace,
        'omnipediaSearchInactive.'  + eventNamespace,
      ].join(' '));

      headerElements.getSearchForm().off([
        'focusin.'  + eventNamespace,
        'focusout.' + eventNamespace,
      ].join(' '));

      headerElements.getSearchTarget().removeClass(searchTargetFormFocusClass);

    }
  );

});
});
