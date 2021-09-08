// -----------------------------------------------------------------------------
//   Omnipedia - Site theme - EU cookie compliance categories
// -----------------------------------------------------------------------------

// This works around an issue where checked by default categories that are
// unchecked get checked again when the pop-up is opened a second time.
//
// @see https://www.drupal.org/project/eu_cookie_compliance/issues/3231985

AmbientImpact.onGlobals([
  'Drupal.eu_cookie_compliance.setPreferenceCheckboxes',
], function() {
AmbientImpact.addComponent(
  'OmnipediaSiteThemeEuCookieComplianceCategories',
function(
  euCookieComplianceCategories, $
) {

  'use strict';

  Drupal.eu_cookie_compliance.setPreferenceCheckboxes = function (categories) {
    $('.eu-cookie-compliance-categories input:checkbox').prop('checked', false);

    for (var i in categories) {
      $('.eu-cookie-compliance-categories input:checkbox[value="' +
        categories[i] +
      '"]').prop('checked', true);
    }
  }

});
});
