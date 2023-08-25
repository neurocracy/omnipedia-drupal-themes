<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme;

use Drupal\ambientimpact_core\Utility\Html;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Render\Element;
use Drupal\Core\Render\RendererInterface;
use Drupal\Core\Template\Attribute;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\DomCrawler\Crawler;

/**
 * Omnipedia region placeholder theme definitions and preprocess class.
 */
class OmnipediaRegionPlaceholder implements ContainerInjectionInterface {

  /**
   * Constructor; saves dependencies.
   *
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   The Drupal renderer service.
   */
  public function __construct(protected readonly RendererInterface $renderer) {}

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('renderer'),
    );
  }

  /**
   * \hook_theme() callback.
   *
   * @param array $existing
   *   An array of existing theme implementations.
   *
   * @param string $type
   *   The extension type being processed, such as a module, theme, or profile.
   *
   * @param string $theme
   *   The machine name of the extension being processed.
   *
   * @param string $path
   *   The path to the extension being processed.
   *
   * @return array
   *   An associative array of theme implementations to add.
   *
   * @see \hook_theme()
   */
  public function theme(
    array $existing, string $type, string $theme, string $path,
  ): array {

    return ['omnipedia_region_placeholder' => [
      'template'        => 'layout/omnipedia-region-placeholder',
      'render element'  => 'elements',
    ]];

  }

  /**
   * Remove all 'id' attributes.
   *
   * This is to avoid duplicate identifiers. The 'id' attribute is generally
   * not needed for styling purposes, and these placeholders will not be
   * interactive or part of the accessibility tree.
   *
   * @param \Symfony\Component\DomCrawler\Crawler $crawler
   *   The Symfony DomCrawler instance to alter.
   */
  protected function removeIds(Crawler $crawler): void {

    /** @var \Symfony\Component\DomCrawler\Crawler */
    $idCrawler = $crawler->filter(
      '#omnipedia-region-placeholder-root [id]',
    );

    foreach ($idCrawler as $element) {
      $element->removeAttribute('id');
    }

  }

  /**
   * Remove all contextual links and related data/attributes.
   *
   * @param \Symfony\Component\DomCrawler\Crawler $crawler
   *   The Symfony DomCrawler instance to alter.
   */
  protected function removeContextualLinks(Crawler $crawler): void {

    /** @var \Symfony\Component\DomCrawler\Crawler */
    $placeholdersCrawler = $crawler->filter('[data-contextual-id]');

    // Remove all contextual placeholder elements.
    foreach ($placeholdersCrawler as $element) {
      $element->parentNode->removeChild($element);
    }

    /** @var \Symfony\Component\DomCrawler\Crawler */
    $contextualClassCrawler = $crawler->filter('.contextual-region');

    // Remove the 'contextual-region' class from any elements that have it.
    foreach ($contextualClassCrawler as $element) {

      Html::setElementClassAttribute(
        $element,
        Html::getElementClassAttribute($element)
          ->removeClass('contextual-region'),
      );

    }

  }

  /**
   * \template_preprocess_omnipedia_region_placeholder() callback.
   *
   * @param array &$variables
   *   Variables for the template.
   */
  public function preprocess(array &$variables): void {

    if (isset($variables['elements']['#attributes'])) {

      $variables['attributes'] = new Attribute(
        $variables['elements']['#attributes'],
      );

    } else {

      $variables['attributes'] = new Attribute([]);

    }

    $variables['region_from'] = $variables['elements']['#region_from'];
    $variables['region_to']   = $variables['elements']['#region_to'];

    $variables['attributes']
      // Hidden visually and from the accessibility tree by default.
      ->setAttribute('hidden', true)
      ->setAttribute(
        'data-region-from', Html::cleanCssIdentifier($variables['region_from']),
      )
      ->setAttribute(
        'data-region-to', Html::cleanCssIdentifier($variables['region_to']),
      );

    /** @var \Symfony\Component\DomCrawler\Crawler */
    $contentCrawler = new Crawler(
      '<div id="omnipedia-region-placeholder-root">' .
        (string) $variables['elements']['#children'] .
      '</div>'
    );

    $this->removeIds($contentCrawler);

    $this->removeContextualLinks($contentCrawler);

    /** @var array */
    $contentRenderArray = [
      '#type'     => 'inline_template',
      '#template' => $contentCrawler->filter(
        '#omnipedia-region-placeholder-root',
      )->html(),
    ];

    // Render the inline template into an object implementing
    // \Drupal\Component\Render\MarkupInterface. Note that since we started with
    // an already rendered string of HTML, this shouldn't result in new
    // attachments or cache metadata so we just render as plain.
    $variables['elements']['#children'] = $this->renderer->renderPlain(
      $contentRenderArray,
    );

    $variables['content'] = $variables['elements']['#children'];

  }

}
