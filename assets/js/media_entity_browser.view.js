/**
 * @file
 * Defines the behavior of the media entity browser view.
 */

(function ($) {

  "use strict";

  /**
   * Update the class of a row based on the status of a checkbox.
   *
   * @param {object} $row
   * @param {object} $input
   */
  function updateClasses($row, $input) {
    $row[$input.prop('checked') ? 'addClass' : 'removeClass']('checked');
  }

  /**
   * Attaches the behavior of the media entity browser view.
   */
  Drupal.behaviors.mediaEntityBrowserView = {
    attach: function (context, settings) {
      // Run through each row to add the default classes.
      $('.views-row', context).each(function() {
        var $row = $(this);
        var $input = $row.find('.views-field-entity-browser-select input');
        updateClasses($row, $input);
        $row.closest('form').find('.form-actions').hide();
      });

      // Add a checked class when clicked.
      $(once('media-entity-browser-checked', '.views-row', context)).click(function () {
        var $row = $(this);
        var $input = $row.find('.views-field-entity-browser-select input');
        $input.prop('checked', !$input.prop('checked'));
        updateClasses($row, $input);
        if($('.views-row .views-field-entity-browser-select input').is(':checked')) {
          $row.closest('form').find('.form-actions').show();
        }
        else {
          $row.closest('form').find('.form-actions').hide();
        }
      });
    }
  };

}(jQuery, Drupal));
