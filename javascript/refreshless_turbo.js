// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - RefreshLess support when using Hotwire Turbo
// -----------------------------------------------------------------------------

// @see https://github.com/hotwired/turbo/issues/592#issuecomment-1137827028

AmbientImpact.addComponent('OmnipediaSiteThemeRefreshlessTurbo', function(
  refreshlessTurbo, $
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  function target(event) {

    // console.debug(
    //   location.hash,
    //   new URL(event.originalEvent.oldURL).hash,
    //   new URL(event.originalEvent.newURL).hash,
    // );
    // console.debug(location.hash, event);

    let hash;

    if (event.type === 'hashchange') {

      hash = new URL(event.originalEvent.newURL).hash;

    } else {

      hash = location.hash;

    }

    if (!hash) {

      return;

    }

    const a = document.createElement('a');
    a.href = `#${hash.slice(1)}`;
    a.click();

    console.debug('Blorp');

  };

  this.addBehaviour(
    'OmnipediaSiteThemeRefreshlessTurbo',
    'omnipedia-site-theme-refreshless-turbo',
    'body',
    function(context, settings) {

      $(window).on([
        `turbo:load.${eventNamespace}`,
        `hashchange.${eventNamespace}`,
      ].join(' '), target);

      // addEventListener('turbo:load', target);
      // addEventListener('hashchange', target); // for same-page navigations

    },
    function(context, settings, trigger) {

      $(document).off([
        `turbo:load.${eventNamespace}`,
        `hashchange.${eventNamespace}`,
      ].join(' '), target);

    }
  );

});
