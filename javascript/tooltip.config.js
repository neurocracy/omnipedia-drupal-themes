// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - Tooltip configuration
// -----------------------------------------------------------------------------

AmbientImpact.onGlobals(['tippy.setDefaultProps'], function() {

  'use strict';

  // Set global default properties for all tooltips.
  //
  // @see https://atomiks.github.io/tippyjs/v6/all-props/
  tippy.setDefaultProps({

    // Note that we have to set 'material' in addition to 'material-dark' as
    // 'material' contains a lot of the common styles to both light and dark
    // variants. This accepts a space-separated list of themes.
    theme: 'material material-dark',

  });

});
