/**
 * @file
 * Extends autocomplete based on jQuery UI.
 *
 * @todo Remove once jQuery UI is no longer used?
 */

(($, Drupal) => {
  // Ensure the input element has a "change" event triggered. This is important
  // so that summaries in vertical tabs can be updated properly.
  // @see Drupal.behaviors.formUpdated
  $(document).on('autocompleteselect', '.form-autocomplete', (e) => {
    $(e.target).trigger('change.formUpdated');
  });

  // Extend ui.autocomplete widget so it triggers the icon spin.
  $.widget('ui.autocomplete', $.ui.autocomplete, {
    _search(value) {
      this.pending += 1;
      Drupal.Ajax.prototype.iconStart(this.element);
      this.cancelSearch = false;
      this.source({ term: value }, this._response());
    },
    _response() {
      this.requestIndex += 1;
      const index = this.requestIndex;
      // eslint-disable-next-line func-names
      return function (content) {
        if (index === this.requestIndex) this.__response(content);
        this.pending -= 1;
        if (!this.pending) Drupal.Ajax.prototype.iconStop(this.element);
      }.bind(this);
    },
  });
})(jQuery, Drupal);
