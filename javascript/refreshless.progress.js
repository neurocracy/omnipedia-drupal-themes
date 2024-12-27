// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - RefreshLess progress
// -----------------------------------------------------------------------------

AmbientImpact.addComponent(
  'OmnipediaSiteThemeRefreshLessProgress',
(component, $) => {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = component.getName();

  /**
   * The selector to find the header element by.
   *
   * @type {String}
   */
  const headerSelector = 'header[role="banner"]';

  component.addBehaviour(
    'OmnipediaSiteThemeRefreshLessProgress',
    'omnipedia-site-theme-refreshless-progress',
    'body',
    function(context, settings) {

      $(document.documentElement)
      // This forces the header to be shown when the RefreshLess progress bar is
      // active, both to draw attention to it and ensure the progress bar
      // doesn't get lost visually against potential visual noise of content
      // below it.
      .on(`refreshless:progress-bar-active.${eventNamespace}`, (event) => {

        const headroom = $(event.target).find(headerSelector).prop('headroom');

        headroom.pin();

        headroom.freeze();

      })
      .on(`refreshless:progress-bar-inactive.${eventNamespace}`, (event) => {

        const headroom = $(event.target).find(headerSelector).prop('headroom');

        headroom.unfreeze();

      });

    },
    function(context, settings, trigger) {

        $(document.documentElement).off([
          `refreshless:progress-bar-active.${eventNamespace}`,
          `refreshless:progress-bar-inactive.${eventNamespace}`,
        ].join(' '));

        const headroom = $(this, context).find(headerSelector).prop('headroom');

        headroom.unfreeze();

    },
  );

});
