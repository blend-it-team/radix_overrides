/**
 * @file
 * Replaced Drupal cores ajax throbber(s), see: https://www.drupal.org/node/2974681
 */
(function ($, Drupal) {

  /**
   * An animated progress throbber and container element for AJAX operations.
   *
   * @param {string} [message]
   *   (optional) The message shown on the UI.
   * @return {string}
   *   The HTML markup for the throbber.
   */
  Drupal.theme.ajaxProgressThrobber = (message) => {
    // Build markup without adding extra white space since it affects rendering.
    const messageMarkup =
      typeof message === 'string'
        ? Drupal.theme('ajaxProgressMessage', message)
        : '';

    return `<div class="ajax-progress ajax-progress-throbber">
      <span class="visually-hidden">${messageMarkup}</span>
      <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
    </div>`;
  };

  /**
   * Sets the throbber progress indicator.
   */
  Drupal.Ajax.prototype.setProgressIndicatorThrobber = function () {
    var $element = $(this.element);

    this.progress.element = $(
      Drupal.theme('ajaxProgressThrobber', this.progress.message),
    );

    // If element is an input DOM element type (not :input), append after.
    if ($element.is('input')) {
      $element.after(this.progress.element);
    }
    // Otherwise append the throbber inside the element.
    else {
      $element.append(this.progress.element);
    }
  };


  /**
   * Theme override of the ajax progress indicator for full screen.
   *
   * @return {string}
   *   The HTML markup for the throbber.
   */
  Drupal.theme.ajaxProgressIndicatorFullscreen = () =>
    '<div class="position-fixed top-50 start-50"><div class="shadow p-3 bg-body rounded-circle"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">' + Drupal.t('Loading') + '</span></div></div></div>';

})(jQuery, Drupal);