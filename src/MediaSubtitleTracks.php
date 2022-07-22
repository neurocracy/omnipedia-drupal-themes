<?php

declare(strict_types=1);

namespace Drupal\omnipedia_site_theme;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Render\Element;
use Drupal\Core\Template\Attribute;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Media entity subtitle builder.
 *
 * This builds <track> elements for media entities that have the
 * 'field_media_video_file' field and a non-empty 'field_subtitles' field.
 *
 * @see https://www.drupal.org/project/drupal/issues/3002770
 *   Drupal core issue to this functionality which will hopefully make this
 *   class unnecessary when implemented.
 */
class MediaSubtitleTracks implements ContainerInjectionInterface {

  /**
   * The name of the media entity subtitles field.
   *
   * @var string
   */
  protected const SUBTITLES_FIELD = 'field_subtitles';

  /**
   * The name of the media entity video field.
   *
   * @var string
   */
  protected const VIDEO_FIELD = 'field_media_video_file';

  /**
   * The Drupal configuration factory service.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected LanguageManagerInterface $languageManager;

  /**
   * Constructor; saves dependencies.
   *
   * @param \Drupal\Core\Language\LanguageManagerInterface $languageManager
   *   The Drupal configuration factory service.
   */
  public function __construct(LanguageManagerInterface $languageManager) {
    $this->languageManager = $languageManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('language_manager')
    );
  }

  /**
   * \template_preprocess_media() callback.
   *
   * @param array &$variables
   *   Variables for the template.
   */
  public function preprocess(array &$variables): void {

    if (
      !$variables['media']->hasField(self::VIDEO_FIELD) ||
      !$variables['media']->hasField(self::SUBTITLES_FIELD) ||
      $variables['media']->get(self::SUBTITLES_FIELD)->isEmpty() ||
      $variables['media']->get(self::SUBTITLES_FIELD)->get(0)->isEmpty()
    ) {
      return;
    }

    /** @var string */
    $langCode = $variables['media']->get(self::SUBTITLES_FIELD)->getLangcode();

    /** @var string */
    $languageName = $this->languageManager->getLanguageName($langCode);

    /** @var \Drupal\file\FileInterface[] */
    $subtitleFileEntities = $variables['media']->get(self::SUBTITLES_FIELD)
      ->referencedEntities();

    /** @var array[] */
    $tracks = [];

    foreach ($subtitleFileEntities as $delta => $fileEntity) {
      $tracks[] = [
        '#theme'      => 'track',
        '#attributes' => new Attribute([
          'kind'    => 'subtitles',
          'src'     => $fileEntity->createFileUrl(),
          'srclang' => $langCode,
          'label'   => $languageName,
        ]),
      ];
    }

    // Add any available tracks to the video field.
    if (!empty($tracks)) {

      foreach (Element::children(
        $variables['content'][self::VIDEO_FIELD]
      ) as $key) {
        $variables['content'][self::VIDEO_FIELD][$key]['#tracks'] = $tracks;
      }

    }

  }

}
