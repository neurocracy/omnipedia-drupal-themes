// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Tooltip nested theme switcher component
// -----------------------------------------------------------------------------

// This is a crude and dirty implementation of a contrast-aware tooltip theme
// switcher. The goal is to set a tooltip to a light theme if it's being
// displayed against a parent tooltip that uses a dark theme, or an off-canvas
// panel that uses a dark theme. This is crude and dirty because it's not
// actually contrast-aware (yet) but just checks that the parent is using a
// dark theme, and sets the tooltip to light if so - it works, but it's not
// particularly elegant.

AmbientImpact.onGlobals(['tippy.setDefaultProps'], function() {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeTooltipNestedThemeSwitcher',
function(component, $) {

  'use strict';

  /**
   * Event namespace name.
   *
   * @type {String}
   */
  const eventNamespace = this.getName();

  this.addBehaviour(
    'OmnipediaSiteThemeTooltipNestedThemeSwitch',
    'omnipedia-site-theme-tooltip-nested-theme-switch',
    'body',
    function(context, settings) {

      $(this).on(`tooltipShow.${eventNamespace}`, function(event) {

        const $ancestorTippy = $(
          event.instance.reference,
        ).closest('.tippy-box');

        const $ancestorOffcanvas = $(
          event.instance.reference,
        ).closest('.offcanvas-panel--theme-dark');

        if ($ancestorTippy.length === 0 && $ancestorOffcanvas.length === 0) {
          return;
        }

        const originalThemes = event.instance.props.theme.split(' ');

        event.instance.setProps({theme: originalThemes.map(function(value) {

          if (value !== 'material-dark') {
            return value;
          }

          return 'material-light';

        }).join(' ')});

      });

    },
    async function(context, settings, trigger) {

      $(this).off(`tooltipShow.${eventNamespace}`);

    }
  );

});
});
