// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Anchor scroll component
// -----------------------------------------------------------------------------


AmbientImpact.onGlobals(['ally.is.focusRelevant'], function() {
AmbientImpact.addComponent('OmnipediaSiteThemeAnchorScroll', function(
  anchorScroll, $,
) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  this.addBehaviour(
    'OmnipediaSiteThemeAnchorScroll',
    'omnipedia-site-theme-anchor-scroll',
    '.layout-container',
    function(context, settings) {

      $(this).on(`click.${eventNamespace}`, 'a[href]', function(event) {

        // console.debug(
        //   $(event.target).prop('anchor-scroll-bypass'),
        //   event.isDefaultPrevented(),
        // );

        if (
          typeof $(event.target).prop('anchor-scroll-bypass') !== 'undefined' ||
          event.isDefaultPrevented() === true ||
          typeof $(event.target).attr('href') === 'undefined' ||
          $(event.target).attr('href').length <= 2 ||
          $(event.target).attr('href').substring(0, 1) !== '#' ||
          $($(event.target).attr('href')).length === 0
        ) {
          return;
        }

        const clickTarget = event.target;

        const scrollTarget = $($(event.target).attr('href'))[0];

        console.debug(clickTarget, scrollTarget);

        // if (history.scrollRestoration) {
          history.scrollRestoration = 'auto';
        // }

        // history.pushState(null, document.title, '');
        history.pushState(null, document.title, new URL(clickTarget).hash);

          history.scrollRestoration = 'auto';

        // console.debug(new URL(clickTarget).hash);

        $(document).one(`scrollend.${eventNamespace}`, function(event) {

          $(clickTarget).prop('anchor-scroll-bypass', true);

          clickTarget.click();

          $(clickTarget).removeProp('anchor-scroll-bypass');

          // scrollTarget.focus();

        });

        scrollTarget.scrollIntoView();

        console.debug(event);

        event.preventDefault();

      });

    },
    function(context, settings, trigger) {

      $(this).off(`click.${eventNamespace}`, 'a[href]');

      $(document).off(`scrollend.${eventNamespace}`);

    }
  );

});
});
