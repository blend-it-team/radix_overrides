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

    if (messageMarkup === '') {
      const defaultMessage = Drupal.t('Loading...');
      return `<span class="ajax-progress ajax-progress-throbber">
        <span class="spinner-border spinner-border-sm mx-1" role="status">
          <span class="visually-hidden">${defaultMessage}</span>
        </span>
      </span>`;
    }

    return `<div class="ajax-progress ajax-progress-throbber">
      <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
      ${messageMarkup}
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
    '<div class="position-fixed top-50 start-50"><div class="spinner-border spinner-border-md"><span class="visually-hidden">' + Drupal.t('Loading') + '</span></div></div>';

})(jQuery, Drupal);