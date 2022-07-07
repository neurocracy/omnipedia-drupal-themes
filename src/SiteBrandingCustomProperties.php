<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme;

use Drupal\ambientimpact_core\Utility\AttributeHelper;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Extension\ThemeHandlerInterface;
use Drupal\Core\Theme\ThemeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Omnipedia site branding CSS custom properties output.
 */
class SiteBrandingCustomProperties implements ContainerInjectionInterface {

  /**
   * Branding maximum width custom property name.
   *
   * This is the width of the widest branding element, for use when stacked
   * vertically.
   *
   * @var string
   */
  protected const MAX_WIDTH_PROPERTY_NAME = '--branding-max-width';

  /**
   * Branding total height custom property name.
   *
   * This is the combined height of all three branding elements when stacked
   * vertically.
   *
   * @var string
   */
  protected const TOTAL_HEIGHT_PROPERTY_NAME = '--branding-total-height';

  /**
   * A map of theme info keys to CSS custom property names.
   *
   * @var string[]
   */
  protected array $propertyMap = [
    'logo_width'          => '--branding-logo-width',
    'logo_height'         => '--branding-logo-height',
    'site_name_width'     => '--branding-site-name-width',
    'site_name_height'    => '--branding-site-name-height',
    'site_slogan_width'   => '--branding-site-slogan-width',
    'site_slogan_height'  => '--branding-site-slogan-height',
  ];

  /**
   * The Drupal theme handler service.
   *
   * @var \Drupal\Core\Extension\ThemeHandlerInterface
   */
  protected ThemeHandlerInterface $themeHandler;

  /**
   * The Drupal theme manager.
   *
   * @var \Drupal\Core\Theme\ThemeManagerInterface
   */
  protected ThemeManagerInterface $themeManager;

  /**
   * Constructor; saves dependencies.
   *
   * @param \Drupal\Core\Extension\ThemeHandlerInterface $themeHandler
   *   The Drupal theme handler service.
   *
   * @param \Drupal\Core\Theme\ThemeManagerInterface $themeManager
   *   The Drupal theme manager.
   */
  public function __construct(
    ThemeHandlerInterface $themeHandler,
    ThemeManagerInterface $themeManager
  ) {
    $this->themeHandler = $themeHandler;
    $this->themeManager = $themeManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('theme_handler'),
      $container->get('theme.manager')
    );
  }

  /**
   * Get the active theme branding custom properties.
   *
   * @return array
   */
  protected function getActiveThemeBrandingProperties(): array {

    /** @var int[] */
    $properties = [];

    // This contains all of the key/value pairs in the theme's .info.yml file.
    /** @var array */
    $activeThemeInfo = $this->themeHandler->listInfo()[
      $this->themeManager->getActiveTheme()->getName()
    ]->info;

    // Copy all dimensions to their custom properties.
    foreach ($this->propertyMap as $themeKey => $propertyName) {
      $properties[$propertyName] = $activeThemeInfo[$themeKey];
    }

    // Determine the widest element and output that width.
    $properties[self::MAX_WIDTH_PROPERTY_NAME] = \max(
      $activeThemeInfo['logo_width'],
      $activeThemeInfo['site_name_width'],
      $activeThemeInfo['site_slogan_width'],
    );

    // Determine the total height of the three branding elements when stacked
    // vertically.
    $properties[self::TOTAL_HEIGHT_PROPERTY_NAME] =
      $activeThemeInfo['logo_height'] +
      $activeThemeInfo['site_name_height'] +
      $activeThemeInfo['site_slogan_height'];

    return $properties;

  }

  /**
   * \template_preprocess_html() method.
   *
   * @param array &$variables
   *   Variables from \omnipedia_site_theme_preprocess_html().
   */
  public function preprocessHtml(array &$variables): void {

    /** @var int[] */
    $properties = $this->getActiveThemeBrandingProperties();

    /** @var \Drupal\Core\Template\Attribute Attribute object for the <html> element. */
    $attributes = $variables['html_attributes'];

    // If an existing 'style' attribute exists, parse it so we can merge our
    // properties into it rather than overwriting it.
    if ($attributes->offsetExists('style')) {
      $styleArray = AttributeHelper::parseStyleAttribute(
        $attributes->offsetGet('style')
      );

      $styleArray = \array_merge($styleArray, $properties);

    // If a 'style' attribute does not exist, just set it to our properties.
    } else {
      $styleArray = $properties;
    }

    $attributes->offsetSet('style', AttributeHelper::serializeStyleArray(
      $styleArray
    ));

  }

}
