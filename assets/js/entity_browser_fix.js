/**
 * @file
 * Fixes entity browser modal closing issues with Bootstrap modals.
 */

(function ($, Drupal, drupalSettings) {
  'use strict';

  /**
   * Behavior to fix entity browser modal closing.
   */
  Drupal.behaviors.entityBrowserModalFix = {
    attach: function (context, settings) {

      // Override the entity browser modal selection JavaScript
      if (typeof drupalSettings !== 'undefined' && drupalSettings.entity_browser && drupalSettings.entity_browser.modal) {

        // Override the select_entities AJAX command
        Drupal.AjaxCommands.prototype.select_entities = function (ajax, response, status) {
          var uuid = drupalSettings.entity_browser.modal.uuid;

          $(':input[data-uuid="' + uuid + '"]').trigger('entities-selected', [uuid, response.entities])
            .removeClass('entity-browser-processed').unbind('entities-selected');

          // Only close the Bootstrap modal after selection if entities were actually selected
          if (response.entities && response.entities.length > 0) {
            var $modal = $('.modal.show');
            if ($modal.length) {
              $modal.modal('hide');
            }
          }
        };

        // Listen for entity browser selection completion - only close when entities are actually selected
        $(document).on('entities-selected', function (event, uuid, entities) {
          // Only close any open Bootstrap modals if entities were actually selected
          if (entities && entities.length > 0) {
            var $modal = $('.modal.show');
            if ($modal.length) {
              $modal.modal('hide');
            }
          }
        });

        // Override the modal selection script that runs in iframe - only close when entities are actually selected
        if (window.parent && window.parent !== window) {
          // This is running in an iframe
          if (typeof drupalSettings !== 'undefined' && drupalSettings.entity_browser && drupalSettings.entity_browser.modal) {
            var entities = drupalSettings.entity_browser.modal.entities;

            if (entities && entities.length > 0) {
              var $modal = window.parent.jQuery(window.parent.document).find('.modal.show');
              if ($modal.length) {
                $modal.modal('hide');
              }
            }
          }
        }
      }

      // Also handle the case where the modal selection script runs - only close when entities are actually selected
      $(document).ready(function() {
        // Override the original entity browser modal selection
        if (typeof drupalSettings !== 'undefined' && drupalSettings.entity_browser && drupalSettings.entity_browser.modal) {
          var uuid = drupalSettings.entity_browser.modal.uuid;
          var entities = drupalSettings.entity_browser.modal.entities;

          if (uuid && entities && entities.length > 0) {
            // Trigger the selection event
            $(':input[data-uuid*=' + uuid + ']').trigger('entities-selected', [uuid, entities])
              .unbind('entities-selected').show();

            // Close the Bootstrap modal only if entities were selected
            var $modal = $('.modal.show');
            if ($modal.length) {
              $modal.modal('hide');
            }
          }
        }
      });
    }
  };

  /**
   * Additional behavior to handle modal closing on escape key.
   */
  Drupal.behaviors.entityBrowserEscapeKey = {
    attach: function (context, settings) {
      $(document).on('keydown', function (event) {
        if (event.key === 'Escape') {
          var $modal = $('.modal.show');
          if ($modal.length) {
            $modal.modal('hide');
          }
        }
      });
    }
  };

})(jQuery, Drupal, drupalSettings); 