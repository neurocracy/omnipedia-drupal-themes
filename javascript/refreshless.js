// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - RefreshLess support
// -----------------------------------------------------------------------------

// This works around a limitation of RefreshLess as it currently exists:
// attributes on the <body> element that change between pages loaded
// traditionally are not updated by RefreshLess between its dynamic page loads,
// which is a problem for Omnipedia because we set classes on the <body> for
// layout purposes when a page is or isn't a main page.
//
// If/when RefreshLess begins to support changing attributes on the <body>, this
// workaround will be removed.

AmbientImpact.addComponent('OmnipediaSiteThemeRefreshLess', function(
  refreshless, $
) {

  'use strict';

  /**
   * <body> class when displaying a main page.
   *
   * @type {String}
   */
  const isMainPageClass = 'omnipedia--is-main-page';

  /**
   * <body> class when not displaying a main page.
   *
   * @type {String}
   */
  const isNotMainPageClass = 'omnipedia--is-not-main-page';

  $(window).on('refreshless:load', function(event) {

    // This uses the presence or lack thereof the .omnipedia-main-page element
    // as an indicator for whether we're on a main page.
    if ($('.node--type-wiki-page .omnipedia-main-page').length > 0) {
      $('body')
        .addClass(isMainPageClass)
        .removeClass(isNotMainPageClass);

    } else {
      $('body')
        .removeClass(isMainPageClass)
        .addClass(isNotMainPageClass);

    }

  });

});
