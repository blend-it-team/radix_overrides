/**
 * @file
 * Text behaviors.
 */

(($, Drupal, once) => {
  /**
   * Auto-hide summary textarea if empty and show hide and unhide links.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches auto-hide behavior on `text-summary` events.
   */
  Drupal.behaviors.textSummary = {
    attach(context) {
      once('text-summary', '.js-text-summary', context).forEach((summary) => {
        const $widget = $(summary).closest('.js-text-format-wrapper');

        const $summary = $widget.find('.js-text-summary-wrapper');
        const $summaryLabel = $summary.find('label').eq(0);
        const $full = $widget.children('.js-form-type-textarea');
        let $fullLabel = $full.find('label').eq(0);

        // Create a placeholder label when the field cardinality is greater
        // than 1.
        if ($fullLabel.length === 0) {
          $fullLabel = $('<label></label>').prependTo($full);
        }

        // To ensure the summary toggle is shown in case the label is hidden
        // (in multivalue fields in particular), show the label but hide
        // the original text of the label.
        if ($fullLabel.hasClass('visually-hidden')) {
          $fullLabel.html(
            (index, oldHtml) =>
              `<span class="visually-hidden">${oldHtml}</span>`,
          );
          $fullLabel.removeClass('visually-hidden');
        }

        // @todo use the pattern button directly if possible in JS.
        // Set up the edit/hide summary link.
        const $link = $(
          `<span class="field-edit-link"><button type="button" class="link link-edit-summary btn btn-outline-dark btn-sm float-end">${Drupal.t(
            'Hide summary',
          )}</button></span>`,
        );
        const $button = $link.find('button');
        let toggleClick = true;
        $link.on('click', (e) => {
          if (toggleClick) {
            $summary.hide();
            $button.html(Drupal.t('Edit summary'));
            $fullLabel.before($link);
          } else {
            $summary.show();
            $button.html(Drupal.t('Hide summary'));
            $summaryLabel.before($link);
          }
          e.preventDefault();
          toggleClick = !toggleClick;
        });
        $summaryLabel.before($link);

        // If no summary is set, hide the summary field.
        if (summary.value === '') {
          $link.trigger('click');
        }
      });
    },
  };
})(jQuery, Drupal, once);
