// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Tooltip title attribute override
// -----------------------------------------------------------------------------

AmbientImpact.onGlobals([
  'drupalSettings.omnipedia.attachedData.isWikimediaLinkAttributeName',
  'drupalSettings.omnipedia.attachedData.titleAttributeName',
  'drupalSettings.omnipedia.attachedData.contentAttributeName',
], function() {
AmbientImpact.on(['fastdom', 'tooltip'], function(aiFastDom, aiTooltip) {
AmbientImpact.addComponent('OmnipediaSiteThemeTooltipTitleAttribute', function(
  component, $,
) {

  'use strict';

  /**
   * Attached data link selector to exclude from title attribute tooltips.
   *
   * @type {String}
   */
  const attachedDataLinkSelector = `a[${
    drupalSettings.omnipedia.attachedData.isWikimediaLinkAttributeName
  }][${
    drupalSettings.omnipedia.attachedData.titleAttributeName
  }][${
    drupalSettings.omnipedia.attachedData.contentAttributeName
  }]`;

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  /**
   * FastDom instance.
   *
   * @type {FastDom}
   */
  const fastdom = aiFastDom.getInstance();

  /**
   * Property name the tooltips are saved to on the behaviour target.
   *
   * @type {String}
   */
  const propertyName = 'OmnipediaSiteThemeTooltipTitleAttribute';

  this.addBehaviour(
    'OmnipediaSiteThemeTooltipTitleAttribute',
    'omnipedia-site-theme-tooltip-title-attribute',
    '.layout-container',
    function(context, settings) {

      $(this).prop(
        propertyName,
        new aiTooltip.Tooltips(this, {
          target: `[title]:not(${attachedDataLinkSelector})`,
        }),
      );

    },
    function(context, settings, trigger) {

      $(this).prop(propertyName).destroy();

      $(this).removeProp(propertyName);

    },
  );

  this.addBehaviour(
    'OmnipediaSiteThemeTooltipTitleAttributeOffcanvas',
    'omnipedia-site-theme-tooltip-title-attribute-offcanvas',
    'body',
    function(context, settings) {

      $(this)
      .on(`openOffcanvas.${eventNamespace}`, function(event) {

        // In the case of references/citations, the content will likely have
        // already been altered by the title attribute tooltips, but the
        // elements will have been cloned so they no longer have Tippy attached.
        // To fix this, we have to revert the title attribute to its original
        // state before trying to initialize new tooltips.
        $(this).find('[data-original-title]').each(async function() {

          const $this = $(this);

          await fastdom.mutate(function() {

            $this.attr(
              'title', $this.attr('data-original-title'),
            ).removeAttr('data-original-title');

          });

        })

        $(this).prop(
          propertyName,
          new aiTooltip.Tooltips(this, {
            // Note that this assumes we don't have to filter out attached data
            // links because the back-end does not currently allow those to be
            // nested.
            target: '[title]',
          }),
        );

      })
      .on(`closeOffcanvas.${eventNamespace}`, function(event) {

        $(this).prop(propertyName).destroy();
        $(this).removeProp(propertyName);

      });

    },
    function(context, settings, trigger) {

      $(this).off([
        `openOffcanvas.${eventNamespace}`,
        `closeOffcanvas.${eventNamespace}`,
      ].join(' '))

      // @todo Off-canvas doesn't currently have a destroy event, so add a
      //   handler when that gets added.

    },
  );

});
});
});
