<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\omnipedia_site_theme\SiteBrandingInliner;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Omnipedia maintenance page customizations.
 *
 * @see \Drupal\Core\EventSubscriber\MaintenanceModeSubscriber
 *
 * @see \Drupal\Core\Site\MaintenanceModeEvents
 *
 * @see \Drupal\Core\Site\MaintenanceModeInterface
 *
 * @see \Drupal\Core\Site\MaintenanceMode
 *
 * @see maintenance-page.html.twig
 */
class MaintenancePage implements ContainerInjectionInterface {

  use StringTranslationTrait;

  /**
   * Constructor; saves dependencies.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $configFactory
   *   The Drupal configuration object factory service.
   *
   * @param \Drupal\Core\StringTranslation\TranslationInterface $stringTranslation
   *   The Drupal string translation service.
   */
  public function __construct(
    protected readonly ConfigFactoryInterface $configFactory,
    protected readonly SiteBrandingInliner    $siteBrandingInliner,
    protected $stringTranslation,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('class_resolver')->getInstanceFromDefinition(
        SiteBrandingInliner::class
      ),
      $container->get('string_translation'),
    );
  }

  /**
   * Remove the global styling library.
   *
   * @param array &$variables
   *   Page variables.
   *
   * @todo Refactor the global styling library to only attach what's needed for
   *   specific elements so this becomes unnecessary.
   */
  protected function removeGlobalStyling(array &$variables): void {

    $libraries = &$variables['#attached']['library'];

    $globalStyling = \array_search(
      'omnipedia_site_theme/global-styling',
      $libraries,
    );

    if (\is_int($globalStyling)) {
      unset($libraries[$globalStyling]);
    }

  }

  /**
   * \template_preprocess_html() method.
   *
   * @param array &$variables
   *   Variables from \omnipedia_site_theme_preprocess_html().
   */
  public function preprocessHtml(array &$variables): void {

    /** @var bool */
    $variables['omnipedia_is_maintenance_page'] = false;

    if (
      !isset($variables['page']['#theme']) ||
      $variables['page']['#theme'] !== 'maintenance_page'
    ) {
      return;
    }

    $variables['omnipedia_is_maintenance_page'] = true;

    /** @var string */
    $siteName = $this->configFactory->get('system.site')->get('name');

    // @todo Make configurable.
    $variables['head_title']['title'] = $this->t(
      '@siteName will return',
      ['@siteName' => $siteName],
    );

    $this->removeGlobalStyling($variables['page']);

  }

  /**
   * \template_preprocess_maintenance_page() method.
   *
   * @param array &$variables
   *   Variables from \omnipedia_site_theme_preprocess_maintenance_page().
   *
   * @see \template_preprocess_maintenance_page()
   *
   * @see \Drupal\Core\EventSubscriber\MaintenanceModeSubscriber::onMaintenanceModeRequest()
   */
  public function preprocessMaintenancePage(array &$variables): void {

    /** @var string */
    $siteName = $this->configFactory->get('system.site')->get('name');

    // @todo Make configurable.
    $variables['title'] = 'Neurocracy 2.049';

    $this->alterBranding($variables);

  }

  /**
   * Alter site branding.
   *
   * @param array &$variables
   *   Page variables.
   *
   * @todo Either add the branding back in or remove the site branding inliner
   *   from this class. If adding branding, make sure to output the logo alt
   *   text and other properties.
   */
  protected function alterBranding(array &$variables): void {

    // Just remove all the branding elements.
    //
    // @todo Make configurable?
    unset($variables['logo']);
    unset($variables['site_name']);
    unset($variables['site_slogan']);

    // $variables['#attached']['library'][] = 'omnipedia_site_theme/site_branding';

    // $this->siteBrandingInliner->alter($variables);

  }

}
