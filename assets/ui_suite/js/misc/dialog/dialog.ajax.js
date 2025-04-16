/**
 * @file
 * Extends the Drupal AJAX functionality to integrate the dialog API.
 */

(($, Drupal) => {
  /**
   * Initialize dialogs for Ajax purposes.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attaches the behaviors for dialog ajax functionality.
   */
  Drupal.behaviors.dialog = {
    attach: function attach(context, settings) {
      const $context = $(context);

      if (!$('#drupal-modal').length) {
        $(`<div id="drupal-modal"></div>`).appendTo('body');
      }

      const $dialog = $context.closest('#drupal-modal');
      if ($dialog.length) {
        const drupalAutoButtons = $dialog.data('drupal-auto-buttons');
        if (drupalAutoButtons) {
          $dialog.trigger('dialogButtonsChange');
        }
      }

      const originalClose = settings.dialog.close;

      settings.dialog.close = (event) => {
        for (
          // eslint-disable-next-line
          var _len = arguments.length,
            args = Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          // eslint-disable-next-line
          args[_key - 1] = arguments[_key];
        }

        // eslint-disable-next-line
        originalClose.apply(settings.dialog, [event].concat(args));
        $(event.target).remove();
      };
    },
    prepareDialogButtons: function prepareDialogButtons($dialog) {
      const buttons = [];
      const $buttons = $dialog.find(
        '.form-actions input[type=submit], .form-actions a.button, .form-actions a.action-link, .form-actions button[type=submit]',
      );
      // eslint-disable-next-line func-names
      $buttons.each(function () {
        const $originalButton = $(this);
        this.style.display = 'none';
        buttons.push({
          text: $originalButton.html() || $originalButton.attr('value'),
          class: $originalButton.attr('class'),
          click: function click(e) {
            if ($originalButton[0].tagName === 'A') {
              $originalButton[0].click();
            } else {
              $originalButton
                .trigger('mousedown')
                .trigger('mouseup')
                .trigger('click');
              e.preventDefault();
            }
          },
        });
      });
      return buttons;
    },
  };

  // eslint-disable-next-line
  Drupal.AjaxCommands.prototype.openDialogByUrl = (ajax, response, status) => {
    const settings = $.extend(response.settings, {});

    const elementSettings = {
      progress: {
        type: 'throbber',
      },
      dialogType: '_modal',
      dialog: response.dialogOptions,
      url: settings.url,
    };

    const dialogUrlAjax = Drupal.ajax(elementSettings);
    dialogUrlAjax.execute();
  };

  function openOffCanvasDialog(ajax, response, status) {
    if (!response.selector) {
      return false;
    }
    let $dialog = $(response.selector);
    if (!$dialog.length) {
      // Add 'ui-front' jQuery UI class so jQuery UI widgets like autocomplete
      // sit on top of dialogs. For more information see
      // http://api.jqueryui.com/theming/stacking-elements/.
      $dialog = $(
        `<div id="${response.selector.replace(
          /^#/,
          '',
        )}" class="offcanvas ui-front" tabindex="-1" role="dialog"></div>`,
      ).appendTo('body');
    }

    // Set up the wrapper, if there isn't one.
    if (!ajax.wrapper) {
      ajax.wrapper = $dialog.attr('id');
    }

    // Use the ajax.js insert command to populate the dialog contents.
    response.command = 'insert';
    response.method = 'html';
    if (
      response.dialogOptions.modalDialogWrapBody === undefined ||
      response.dialogOptions.modalDialogWrapBody === true ||
      response.dialogOptions.modalDialogWrapBody === 'true'
    ) {
      response.data = `<div class="offcanvas-body">${response.data}</div>`;
    }
    ajax.commands.insert(ajax, response, status);

    // Open the dialog itself.
    response.dialogOptions = response.dialogOptions || {};
    const dialog = Drupal.uiSuiteOffCanvas(
      $dialog.get(0),
      response.dialogOptions,
    );
    if (response.dialogOptions.modal) {
      dialog.showModal();
    } else {
      dialog.show();
    }

    // Add the standard Drupal class for buttons for style consistency.
    $dialog.parent().find('.ui-dialog-buttonset').addClass('form-actions');
  }

  Drupal.AjaxCommands.prototype.coreOpenDialog =
    Drupal.AjaxCommands.prototype.openDialog;

  Drupal.AjaxCommands.prototype.openDialog = (ajax, response, status) => {
    if (ajax.dialogRenderer === 'off_canvas') {
      return openOffCanvasDialog(ajax, response, status);
    }
    if (!response.selector) {
      return false;
    }
    let $dialog = $(response.selector);
    if (!$dialog.length) {
      $dialog = $(
        `<div id="${response.selector.replace(/^#/, '')}"></div>`,
      ).appendTo('body');
    }

    response.command = 'insert';
    response.method = 'html';
    response.dialogOptions = response.dialogOptions || {};

    // Do some extra things here, set Drupal.autocomplete options to render
    // autocomplete box inside the modal.
    if (
      Drupal.autocomplete !== undefined &&
      Drupal.autocomplete.options !== undefined
    ) {
      Drupal.autocomplete.options.appendTo = response.selector;
    }
    ajax.commands.insert(ajax, response, status);

    // Move the buttons to the Bootstrap dialog buttons area.
    if (typeof response.dialogOptions.drupalAutoButtons === 'undefined') {
      response.dialogOptions.drupalAutoButtons = true;
    } else if (response.dialogOptions.drupalAutoButtons === 'false') {
      response.dialogOptions.drupalAutoButtons = false;
    } else {
      response.dialogOptions.drupalAutoButtons =
        !!response.dialogOptions.drupalAutoButtons;
    }

    if (
      !response.dialogOptions.buttons &&
      response.dialogOptions.drupalAutoButtons
    ) {
      response.dialogOptions.buttons =
        Drupal.behaviors.dialog.prepareDialogButtons($dialog);
    }
    $dialog.data(
      'drupal-auto-buttons',
      response.dialogOptions.drupalAutoButtons,
    );
    // Bind dialogButtonsChange.
    $dialog.on('dialogButtonsChange', () => {
      const buttons = Drupal.behaviors.dialog.prepareDialogButtons($dialog);
      const dialog = Drupal.dialog($dialog.get(0));
      dialog.updateButtons(buttons);
    });

    // Open the dialog itself.
    response.dialogOptions = response.dialogOptions || {};
    const dialog = Drupal.dialog($dialog.get(0), response.dialogOptions);
    if (response.dialogOptions.modal) {
      dialog.showModal();
    } else {
      dialog.show();
    }

    // Add the standard Drupal class for buttons for style consistency.
    $dialog.parent().find('.ui-dialog-buttonset').addClass('form-actions');
  };

  // eslint-disable-next-line
  Drupal.AjaxCommands.prototype.closeDialog = (ajax, response, status) => {
    const $dialog = $(response.selector);
    if ($dialog.length) {
      if ($dialog.hasClass('offcanvas')) {
        Drupal.uiSuiteOffCanvas($dialog.get(0)).close();
      } else {
        Drupal.dialog($dialog.get(0)).close();
      }
    }

    $dialog.off('dialogButtonsChange');
  };

  // eslint-disable-next-line
  Drupal.AjaxCommands.prototype.setDialogOption = (ajax, response, status) => {
    const $dialog = $(response.selector);
    if ($dialog.length) {
      $dialog.dialog('option', response.optionName, response.optionValue);
    }
  };

  window.addEventListener('dialog:aftercreate', (event) => {
    const $element = $(event.target);
    const dialog = event.dialog;
    $element.on('click.dialog', '.dialog-cancel', (e) => {
      dialog.close('cancel');
      e.preventDefault();
      e.stopPropagation();
    });
  });

  window.addEventListener('dialog:beforeclose', (e) => {
    const $element = $(e.target);
    $element.off('.dialog');

    // Do some extra things here, set Drupal.autocomplete options to render
    // autocomplete box inside the modal.
    if (
      Drupal.autocomplete !== undefined &&
      Drupal.autocomplete.options !== undefined
    ) {
      if (Drupal.autocomplete.options.appendTo !== undefined) {
        delete Drupal.autocomplete.options.appendTo;
      }
    }
  });
})(jQuery, Drupal);
