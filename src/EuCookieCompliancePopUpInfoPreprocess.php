<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Template\Attribute;
use Drupal\Core\Url;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Prepares variables for the eu_cookie_compliance_popup_info.html.twig template.
 *
 * If the 'more_info_button' variable is found, this sets the following and
 * unsets 'more_info_button' so that a link can be output instead:
 *
 * - 'privacy_policy_link_url': A \Drupal\Core\Url object pointing to the
 *   configured privacy policy URL.
 *
 * - 'privacy_policy_link_title': The text content to use for the privacy policy
 *   link. This is taken from the value of 'more_info_button'.
 *
 * - 'privacy_policy_link_attributes': A \Drupal\Core\Template\Attribute object,
 *   optionally containing 'target' => '_blank' if the privacy policy is
 *   configured to open in a new window or tab.
 *
 * @see https://www.drupal.org/project/eu_cookie_compliance/issues/3222159
 *   Issue regarding the "More info" / privacy policy button being better suited
 *   as a link for accessibility.
 */
class EuCookieCompliancePopUpInfoPreprocess implements ContainerInjectionInterface {

  /**
   * Constructor; saves dependencies.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $configFactory
   *   The Drupal configuration factory service.
   */
  public function __construct(
    protected readonly ConfigFactoryInterface $configFactory,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
    );
  }

  /**
   * \template_preprocess_eu_cookie_compliance_popup_info() callback.
   *
   * @param array &$variables
   *   Variables for the template.
   */
  public function preprocess(array &$variables): void {

    // Bail if the more info button isn't present.
    if (empty($variables['more_info_button'])) {
      return;
    }

    /** @var \Drupal\Core\Config\ImmutableConfig The EU Cookie Compliance module config. */
    $config = $this->configFactory->get('eu_cookie_compliance.settings');

    /** @var \Drupal\Core\Template\Attribute */
    $variables['privacy_policy_link_attributes'] = new Attribute();

    if ($config->get('popup_link_new_window') === true) {
      $variables['privacy_policy_link_attributes']
        ->setAttribute('target', '_blank');
    }

    /** @var string */
    $variables['privacy_policy_link_title'] = $variables['more_info_button'];

    /** @var \Drupal\Core\Url */
    $variables['privacy_policy_link_url'] = Url::fromUserInput(
      $config->get('popup_link'),
    );

    unset($variables['more_info_button']);

  }

}
