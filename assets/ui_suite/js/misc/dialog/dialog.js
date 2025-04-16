/**
 * @file
 * Dialog API inspired by HTML5 dialog element.
 *
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/commands.html#the-dialog-element
 */

(($, Drupal, drupalSettings) => {
  /**
   * Default dialog options.
   *
   * @type {object}
   *
   * @prop {bool} [autoOpen=true]
   * @prop {bool} [backdrop=undefined]
   * @prop {string} [buttonClass='btn']
   * @prop {string} [buttonPrimaryClass='btn-primary']
   * @prop {function} close
   * @prop {string} [dialogClasses='']
   * @prop {string} [dialogHeadingLevel=5]
   * @prop {string} [dialogShowHeader=true]
   * @prop {string} [dialogShowHeaderTitle=true]
   * @prop {string} [dialogStatic=false]
   * @prop {bool} [drupalAutoButtons=undefined]
   * @prop {string} [title=undefined]
   * @prop {string} [width=undefined]
   */
  drupalSettings.dialog = {
    autoOpen: true,
    backdrop: undefined,
    buttonClass: 'btn',
    buttonPrimaryClass: 'btn-primary',
    close: function close(event) {
      Drupal.dialog(event.target).close();
      Drupal.detachBehaviors(event.target, null, 'unload');
    },
    dialogClasses: '',
    dialogHeadingLevel: 5,
    dialogShowHeader: true,
    dialogShowHeaderTitle: true,
    dialogStatic: false,
    drupalAutoButtons: undefined,
    title: undefined,
    width: undefined,
  };

  /**
   * @typedef {object} Drupal.dialog~dialogDefinition
   *
   * @prop {boolean} open
   *   Is the dialog open or not.
   * @prop {*} returnValue
   *   Return value of the dialog.
   * @prop {function} show
   *   Method to display the dialog on the page.
   * @prop {function} showModal
   *   Method to display the dialog as a modal on the page.
   * @prop {function} close
   *   Method to hide the dialog from the page.
   */

  /**
   * Polyfill HTML5 dialog element with jQueryUI.
   *
   * @param {HTMLElement} element
   *   The element that holds the dialog.
   * @param {object} options
   *   jQuery UI options to be passed to the dialog.
   *
   * @return {Drupal.dialog~dialogDefinition}
   *   The dialog instance.
   */
  Drupal.dialog = (element, options) => {
    let undef;

    let $element = $(element);
    if ($element.parents('.modal').length === 1) {
      $element = $element.parents('.modal');
    } else if (!$element.hasClass('modal')) {
      // Add 'ui-front' jQuery UI class so jQuery UI widgets like autocomplete
      // sit on top of dialogs. For more information see
      // http://api.jqueryui.com/theming/stacking-elements/.
      $element = $(
        `<div class="modal fade" tabindex="-1" role="dialog">
          <div class="modal-dialog ui-front" role="document">
            <div class="modal-content">
              <div class="modal-body"></div>
            </div>
          </div>
        </div>`,
      ).appendTo('body');
      $('.modal-body', $element).append(element);
    }

    const domElement = $element.get(0);

    const dialog = {
      open: false,
      returnValue: undef,
    };

    options = $.extend({}, drupalSettings.dialog, options);

    function settingIsTrue(setting) {
      return setting !== undefined && (setting === true || setting === 'true');
    }

    function updateButtons(buttons) {
      const modalFooter = $(
        '<div class="modal-footer"><div class="ui-dialog-buttonpane"></div><div class="ui-dialog-buttonset d-flex justify-content-end flex-grow-1"></div>',
      );
      const $footer = $('.modal-dialog .modal-content .modal-footer', $element);
      if ($footer.length > 0) {
        $($footer).find('.ui-dialog-buttonset').empty();
      }

      // eslint-disable-next-line func-names
      $.each(buttons, function () {
        const buttonObject = this;
        const classes = [options.buttonClass, options.buttonPrimaryClass];

        const button = $('<button type="button">');
        if (buttonObject.attributes !== undefined) {
          $(button).attr(buttonObject.attributes);
        }
        $(button)
          .addClass(buttonObject.class)
          .click((e) => {
            if (buttonObject.click !== undefined) {
              buttonObject.click(e);
            }
          })
          .html(buttonObject.text);

        if (
          !$(button).attr('class') ||
          !$(button)
            .attr('class')
            .match(/\bbtn-.*/)
        ) {
          $(button).addClass(classes.join(' '));
        }
        if ($footer.length > 0) {
          $($footer).find('.ui-dialog-buttonset').append(button);
        } else {
          $(modalFooter).find('.ui-dialog-buttonset').append(button);
        }
      });
      if ($(modalFooter).html().length > 0 && $footer.length === 0) {
        $(modalFooter).appendTo($('.modal-dialog .modal-content', $element));
      }
    }

    function openDialog(settings) {
      settings = $.extend({}, options, settings);

      // eslint-disable-next-line no-undef
      const event = new DrupalDialogEvent('beforecreate', dialog, settings);
      domElement.dispatchEvent(event);
      dialog.open = true;
      settings = event.settings;

      if (settings.dialogClasses !== undefined) {
        // Add 'ui-front' jQuery UI class so jQuery UI widgets like autocomplete
        // sit on top of dialogs. For more information see
        // http://api.jqueryui.com/theming/stacking-elements/.
        $('.modal-dialog', $element)
          .removeAttr('class')
          .addClass('modal-dialog')
          .addClass('ui-front')
          .addClass(settings.dialogClasses);
      }

      // For Media library widget.
      if (
        settings.classes !== undefined &&
        settings.classes['ui-dialog'] !== undefined
      ) {
        $('.modal-dialog', $element).addClass(settings.classes['ui-dialog']);
      }
      if (
        settings.classes !== undefined &&
        settings.classes['ui-dialog-content'] !== undefined
      ) {
        $element.addClass(settings.classes['ui-dialog-content']);
      }

      // The modal dialog header.
      const $header = $element.find('.modal-header');
      if ($header.length === 1) {
        // Clear previous header.
        $header.remove();
      }
      if (settingIsTrue(settings.dialogShowHeader)) {
        let modalHeader = '<div class="modal-header">';
        const heading = settings.dialogHeadingLevel;

        if (settingIsTrue(settings.dialogShowHeaderTitle)) {
          modalHeader += `<h${heading} class="modal-title">${settings.title}</h${heading}>`;
        }

        // @todo use the pattern button_close directly if possible in JS.
        modalHeader += `<button type="button" class="close btn-close" data-bs-dismiss="modal" data-dismiss="modal" aria-label="${Drupal.t(
          'Close',
        )}"></button></div>`;

        $(modalHeader).prependTo($('.modal-dialog .modal-content', $element));
      }

      if (settingIsTrue(settings.dialogStatic)) {
        $element.attr('data-bs-backdrop', 'static');
        $element.attr('data-bs-keyboard', 'false');
      }

      // The modal dialog footer.
      const $footer = $element.find('.modal-footer');
      if ($footer.length === 1) {
        // Clear previous footer.
        $footer.remove();
      }
      if (settings.buttons?.length > 0) {
        updateButtons(settings.buttons);
      }

      if ($element.modal !== undefined) {
        $element.modal(settings);
        $element.modal('show');
        // Be sure modal is last, it will be on top of all other modals and
        // backdrops.
        // Thanks to that, no more need different z-index for modals and
        // backdrops.
        $element.appendTo('body');
      }

      if (settings.width) {
        const $dialog = $('.modal-dialog', $element);
        $dialog[0].style.maxWidth = settings.width;
      }

      domElement.dispatchEvent(
        // eslint-disable-next-line no-undef
        new DrupalDialogEvent('aftercreate', dialog, settings),
      );
    }

    function closeDialog(value) {
      // eslint-disable-next-line no-undef
      domElement.dispatchEvent(new DrupalDialogEvent('beforeclose', dialog));
      if ($element.modal !== undefined) {
        $element.modal('hide');
      }
      dialog.returnValue = value;
      dialog.open = false;
      // eslint-disable-next-line no-undef
      domElement.dispatchEvent(new DrupalDialogEvent('afterclose', dialog));
    }

    dialog.updateButtons = (buttons) => {
      updateButtons(buttons);
    };

    dialog.show = () => {
      openDialog({ backdrop: false });
    };
    dialog.showModal = () => {
      openDialog({ backdrop: true });
    };
    dialog.close = () => {
      closeDialog({});
    };

    $element.on('hide.bs.modal', () => {
      // eslint-disable-next-line no-undef
      domElement.dispatchEvent(new DrupalDialogEvent('beforeclose', dialog));
    });

    $element.on('hidden.bs.modal', () => {
      // eslint-disable-next-line no-undef
      domElement.dispatchEvent(new DrupalDialogEvent('afterclose', dialog));
    });

    return dialog;
  };
})(jQuery, Drupal, drupalSettings);
