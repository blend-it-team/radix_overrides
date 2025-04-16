/**
 * @file
 * Defines ajax throbber theme functions.
 */

(($, window, Drupal) => {
  /**
   * Attempts to find the closest icon progress indicator.
   *
   * @param {jQuery|Element} element
   *   A DOM element.
   *
   * @return {jQuery}
   *   A jQuery object.
   */
  // eslint-disable-next-line func-names
  Drupal.Ajax.prototype.findIcon = function (element) {
    return $(element)
      .closest('.form-item')
      .find('.ajax-progress .bi-arrow-repeat');
  };

  /**
   * Starts the spinning of the icon progress indicator.
   *
   * @param {jQuery|Element} element
   *   A DOM element.
   * @param {string} [message]
   *   An optional message to display (tooltip) for the progress.
   *
   * @return {jQuery}
   *   A jQuery object.
   */
  // eslint-disable-next-line func-names
  Drupal.Ajax.prototype.iconStart = function (element, message) {
    const $icon = this.findIcon(element);
    if ($icon[0]) {
      $icon.addClass('icon-spin');
      $icon.parent().addClass('text-primary');

      // Append a message for screen readers.
      if (message) {
        $icon
          .parent()
          .append(`<div class="visually-hidden message">${message}</div>`);
      }
    }
    return $icon;
  };

  /**
   * Stop the spinning of a icon progress indicator.
   *
   * @param {jQuery|Element} element
   *   A DOM element.
   */
  // eslint-disable-next-line func-names
  Drupal.Ajax.prototype.iconStop = function (element) {
    const $icon = this.findIcon(element);
    if ($icon[0]) {
      $icon.removeClass('icon-spin');
      $icon.parent().removeClass('text-primary');
    }
  };

  /**
   * Sets the throbber progress indicator.
   */
  // eslint-disable-next-line func-names
  Drupal.Ajax.prototype.setProgressIndicatorThrobber = function () {
    const $element = $(this.element);

    // Find an existing icon progress indicator.
    const $icon = this.iconStart($element, this.progress.message);
    if ($icon[0]) {
      this.progress.element = $icon.parent();
      this.progress.icon = true;
      return;
    }

    // Otherwise, add a throbber after the element.
    if (!this.progress.element) {
      this.progress.element = $(
        Drupal.theme('ajaxProgressThrobber', this.progress.message),
      );
    }
    if (this.progress.message) {
      this.progress.element.after(
        `<div class="message">${this.progress.message}</div>`,
      );
    }

    // If element is an input DOM element type (not :input), append after.
    if (this.element.tagName === 'INPUT') {
      $element.after(this.progress.element);
    }
    // Otherwise append the throbber inside the element.
    else {
      $element.append(this.progress.element);
    }
  };

  /**
   * Handler for the form redirection completion.
   *
   * @param {Array.<Drupal.AjaxCommands~commandDefinition>} response
   * @param {number} status
   */
  const success = Drupal.Ajax.prototype.success;
  // eslint-disable-next-line func-names
  Drupal.Ajax.prototype.success = function (response, status) {
    if (this.progress.element) {
      // Remove any message set.
      this.progress.element.parent().find('.message').remove();

      // Stop an icon throbber.
      if (this.progress.icon) {
        this.iconStop(this.progress.element);
        // If there is an icon, after cleaning the element, set it to false
        // to avoid the parent method to delete it.
        this.progress.element = false;
      }
      // Remove the progress element.
      else {
        this.progress.element.remove();
      }
    }

    // Invoke the original success handler.
    return success.apply(this, [response, status]);
  };

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
      return `<div class="ajax-progress ajax-progress-throbber">
        <div class="spinner-border spinner-border-sm" role="status">
          <span class="visually-hidden">${defaultMessage}</span>
        </div>
      </div>`;
    }

    return `<div class="ajax-progress ajax-progress-throbber">
      <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
      ${messageMarkup}
    </div>`;
  };

  /**
   * Formats text accompanying the AJAX progress throbber.
   *
   * @param {string} message
   *   The message shown on the UI.
   * @return {string}
   *   The HTML markup for the throbber.
   */
  Drupal.theme.ajaxProgressMessage = (message) => {
    return `<span role="status">${message}</span>`;
  };
})(jQuery, this, Drupal);
