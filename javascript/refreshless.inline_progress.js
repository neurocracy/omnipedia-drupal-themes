// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - RefreshLess inline progress
// -----------------------------------------------------------------------------

AmbientImpact.on(['fastdom'], (aiFastDom) => {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeRefreshLessInlineProgress',
(component, $) => {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = component.getName();

  /**
   * FastDom instance.
   *
   * @type {FastDom}
   */
  const fastdom = aiFastDom.getInstance();

  /**
   * Class added to links when clicked and a progress bar will be displayed.
   *
   * @type {String}
   */
  const progressClass = 'refreshless-inline-progress-bar';

  /**
   * Modifier class added to links when their progress bar is active/visible.
   *
   * @type {String}
   */
  const progressActiveClass = `${progressClass}--active`;

  /**
   * Modifier class added to links when their progress bar is complete.
   *
   * @type {String}
   */
  const progressCompleteClass = `${progressClass}--complete`;

  component.addBehaviour(
    'OmnipediaSiteThemeRefreshLessInlineProgress',
    'omnipedia-site-theme-inline-progress',
    '.layout-container',
    (context, settings) => {

      const $html = $('html');

      $html.on(`turbo:click.${eventNamespace}`, async (event) => {

        const $link = $(event.target);

        $html
        .one(`refreshless:progress-bar-before-show.${eventNamespace}`, async (
          event,
        ) => {

          await fastdom.mutate(() => {
            $link.addClass([progressClass, progressActiveClass]);
          });

        })
        .one(`refreshless:progress-bar-before-hide.${eventNamespace}`, async (
          event,
        ) => {

          await fastdom.mutate(() => {
            $link.removeClass([
              progressClass, progressActiveClass, progressCompleteClass,
            ]);
          });

        })
        .one(`refreshless:before-render.${eventNamespace}`, async (
          event,
        ) => {

          await fastdom.mutate(() => {
            $link
            .addClass(progressCompleteClass)
            .removeClass(progressActiveClass);
          });

        })
        // This removes the progress bar event handlers in case they weren't
        // triggered after a click, i.e. if the page loaded too quickly for the
        // progress bar to be displayed at all.
        .one(`refreshless:attach.${eventNamespace}`, async (event) => {

          $html.off([
            `refreshless:progress-bar-before-show.${eventNamespace}`,
            `refreshless:progress-bar-before-hide.${eventNamespace}`,
          ].join(' '));

        });

      });

    },
    (context, settings, trigger) => {

      // We're only removing the click event handler because if it was
      // triggered, it will have attached a one-off refreshless:attach event
      // handler to remove the other handlers if they're bound.
      $('html').off(`turbo:click.${eventNamespace}`);

    }
  );

});
});
