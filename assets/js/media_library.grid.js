(function($, Drupal) {

  'user strict';

  Drupal.behaviors.mediaLibraryGrid = {
    attach: function (context) {
      // Group all the .views-row into a same wrapper.
      $(once('mediaLibraryGrid', '.view-media-library', context)).each(function() {
        var $this = $(this);
        if ($this.find('.views-row').length) {
          $this.find('.views-row').wrapAll('<div class="media-library-views-form__grid"></div>');
        }
      });
    }
  }

})(jQuery, window.Drupal);
