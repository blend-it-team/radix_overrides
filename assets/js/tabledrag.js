/**
 * @file
 * Extends methods from core/misc/tabledrag.js.
 */

((Drupal) => {
  /**
   * The button for toggling table row weight visibility.
   *
   * @return {string}
   *   HTML markup for the weight toggle button and its container.
   */
  Drupal.theme.tableDragToggle = () => {
    // @todo use the pattern button directly if possible in JS.
    return (
      `<div class="tabledrag-toggle-weight-wrapper float-end" data-drupal-selector="tabledrag-toggle-weight-wrapper">` +
      `<button type="button" class="link tabledrag-toggle-weight btn btn-outline-dark btn-sm ms-2" data-drupal-selector="tabledrag-toggle-weight"></button>` +
      `</div>`
    );
  };

  /**
   * @return {string}
   *   Markup for the warning.
   */
  Drupal.theme.tableDragChangedWarning = () => {
    // @todo use the pattern alert directly if possible in JS.
    return `<div class="tabledrag-changed-warning messages messages--warning alert alert-warning p-1 ps-2 m-0 overflow-hidden" role="alert">${Drupal.theme(
      'tableDragChangedMarker',
    )} ${Drupal.t('You have unsaved changes.')}</div>`;
  };
})(Drupal);
