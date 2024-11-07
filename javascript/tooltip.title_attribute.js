// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Tooltip title attribute override
// -----------------------------------------------------------------------------

AmbientImpact.onGlobals([
  'drupalSettings.omnipedia.attachedData.isWikimediaLinkAttributeName',
  'drupalSettings.omnipedia.attachedData.titleAttributeName',
  'drupalSettings.omnipedia.attachedData.contentAttributeName',
], function() {
AmbientImpact.on(['tooltip'], function(aiTooltip) {
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

});
});
});
