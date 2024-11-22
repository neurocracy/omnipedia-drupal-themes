// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - RefreshLess inline progress
// -----------------------------------------------------------------------------

AmbientImpact.onGlobals(['Turbo.config.drive.progressBarDelay'], () => {
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

  const progressDelayCustomProp = '--refreshless-progress-bar-delay';

  const progressClass = 'refreshless-inline-progress-bar';

  const progressActiveClass = `${progressClass}--active`;

  const progressCompleteClass = `${progressClass}--complete`;

  component.addBehaviour(
    'OmnipediaSiteThemeRefreshLessInlineProgress',
    'omnipedia-site-theme-inline-progress',
    '.layout-container',
    (context, settings) => {

      const $html = $('html');

      $html
      .css(progressDelayCustomProp, `${Turbo.config.drive.progressBarDelay}ms`)
      .on(`turbo:click.${eventNamespace}`, async (event) => {

        const $link = $(event.target);

        await fastdom.mutate(() => {
          $link.addClass([progressClass, progressActiveClass]);
        });

        $html
        .one(`refreshless:before-render.${eventNamespace}`, async (event) => {

          await fastdom.mutate(() => {
            $link
            .addClass(progressCompleteClass)
            .removeClass(progressActiveClass);
          });

        });

      });

    },
    (context, settings, trigger) => {

      $('html').off(`turbo:click.${eventNamespace}`);

    }
  );

});
});
});
