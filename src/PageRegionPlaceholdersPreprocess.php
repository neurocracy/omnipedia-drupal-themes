<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Render\Element;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Page region placeholders preprocess class.
 */
class PageRegionPlaceholdersPreprocess implements ContainerInjectionInterface {

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static();
  }

  /**
   * \template_preprocess_page() callback.
   *
   * This builds the header and first sidebar region placeholders, duplicating
   * content between the two.
   *
   * @param array &$variables
   *   Variables for the template.
   */
  public function preprocess(array &$variables): void {

    /** @var string[] Header child element keys. */
    $headerKeys = Element::children($variables['page']['header']);

    /** @var string[] First sidebar child element keys. */
    $sidebarFirstKeys = Element::children($variables['page']['sidebar_first']);

    $variables['page']['header']['sidebar_first_placeholder'] = [
      '#theme_wrappers' => ['omnipedia_region_placeholder'],
      '#region_to'      => 'header',
      '#region_from'    => 'sidebar_first',
    ];

    $variables['page']['sidebar_first']['header_placeholder'] = [
      '#theme_wrappers' => ['omnipedia_region_placeholder'],
      '#region_to'      => 'sidebar_first',
      '#region_from'    => 'header',
    ];

    // Copy first sidebar children into the placeholder in the header.
    foreach ($sidebarFirstKeys as $key) {
      $variables['page']['header']['sidebar_first_placeholder'][$key] =
        $variables['page']['sidebar_first'][$key];
    }

    // Copy header children into the placeholder in the first sidebar.
    foreach ($headerKeys as $key) {
      $variables['page']['sidebar_first']['header_placeholder'][$key] =
        $variables['page']['header'][$key];
    }

  }

}
