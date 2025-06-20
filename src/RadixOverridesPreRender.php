<?php

namespace Drupal\radix_overrides;

use Drupal\Core\Security\TrustedCallbackInterface;

/**
 * Implements trusted prerender callbacks for the Radix Overrides theme.
 *
 * @internal
 */
class RadixOverridesPreRender implements TrustedCallbackInterface {

  /**
   * Prerender callback for text_format elements.
   */
  public static function textFormat($element) {


    // Move format in first place
    $element['format']['format']['#weight'] = -10;
    $element['format']['format']['#wrapper_attributes']['class'][] = 'form-floating';
    $element['format']['format']['#wrapper_attributes']['class'][] = 'mb-1';

    $element['format']['format']['#title_display'] = 'after';

    $element['format']['guidelines']['#weight'] = -9;
    //$element['format']['guidelines']['#attributes']['class'][] = 'alert alert-light mb-0 pb-O';

    $element['format']['help']['#attributes']['class'][] = 'text-end';
    return $element;
  }

  /**
   * Prerender callback for status_messages placeholder.
   *
   * @param array $element
   *   A renderable array.
   *
   * @return array
   *   The updated renderable array containing the placeholder.
   */
  public static function messagePlaceholder(array $element) {
    if (isset($element['fallback']['#markup'])) {
      $element['fallback']['#markup'] = '<div data-drupal-messages-fallback class="hidden messages-list"></div>';
    }
    return $element;
  }


  /**
   * {@inheritdoc}
   */
  public static function trustedCallbacks() {
    return [
      'textFormat',
      'messagePlaceholder',
    ];
  }
}