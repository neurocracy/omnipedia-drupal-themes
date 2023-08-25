<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Url;
use Drupal\omnipedia_core\Service\WikiNodeMainPageInterface;
use Drupal\omnipedia_date\Service\TimelineInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Omnipedia site branding main page link alterations.
 */
class SiteBrandingMainPageLinks implements ContainerInjectionInterface {

  use StringTranslationTrait;

  /**
   * Constructor; saves dependencies.
   *
   * @param \Drupal\Core\StringTranslation\TranslationInterface $stringTranslation
   *   The Drupal string translation service.
   *
   * @param \Drupal\omnipedia_date\Service\TimelineInterface $timeline
   *   The Omnipedia timeline service.
   *
   * @param \Drupal\omnipedia_core\Service\WikiNodeMainPageInterface $wikiNodeMainPage
   *   The Omnipedia wiki node main page service.
   */
  public function __construct(
    protected $stringTranslation,
    protected readonly TimelineInterface          $timeline,
    protected readonly WikiNodeMainPageInterface  $wikiNodeMainPage,
  ) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('string_translation'),
      $container->get('omnipedia.timeline'),
      $container->get('omnipedia.wiki_node_main_page'),
    );
  }

  /**
   * Alter site branding elements.
   *
   * If the current user has access to the current date's main, this does the
   * following:
   *
   * - Sets the 'front_page_url' to the current date's main page, so that the
   *   logo and site name links reflect the site's current state.
   *
   * - Changes the 'title' attribute on the links to 'Main Page'.
   *
   * @param array &$variables
   *   Variables from the 'system_branding_block' block template.
   *
   * @todo Would it make more sense to set the 'title' attribute to
   *   $currentMainPage->getTitle() so that we don't need to hard code 'Main
   *   Page' here?
   *
   * @see \Drupal\omnipedia_block\EventSubscriber\Block\SystemBrandingBlockDateCacheEventSubscriber
   *   Alters the block render array to add Omnipedia date and main pages cache
   *   contexts and cache tags as doing so here would not work because
   *   preprocess is only invoked once Drupal has decided that something needs
   *   to be rendered again, i.e. is not be used from cache.
   */
  public function alter(array &$variables): void {

    /** @var string */
    $currentDate = $this->timeline->getDateFormatted('current', 'storage');

    /** @var \Drupal\omnipedia_core\Entity\NodeInterface|null */
    $currentMainPage = $this->wikiNodeMainPage->getMainPage($currentDate);

    // Don't alter the URL if no main page was found for this date or the user
    // does not have access to said main page.
    if ($currentMainPage === null || !$currentMainPage->access('view')) {
      return;
    }

    $variables['front_page_url'] = Url::fromRoute(
      $this->wikiNodeMainPage->getMainPageRouteName(),
      $this->wikiNodeMainPage->getMainPageRouteParameters($currentDate),
    );

    foreach (['site_logo', 'site_name'] as $key) {
      $variables[$key . '_link_attributes']->setAttribute(
        'title', $this->t('Main Page'),
      );
    }

  }

}
