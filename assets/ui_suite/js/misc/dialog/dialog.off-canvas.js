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
   * @prop {bool} [autoResize=undefined]
   * @prop {bool} [backdrop=undefined]
   * @prop {object} [classes=undefined] TODO
   * @prop {function} close
   * @prop {string} [dialogClasses='']
   * @prop {string} [dialogHeadingLevel=5]
   * @prop {string} [dialogShowHeader=true]
   * @prop {string} [dialogShowHeaderTitle=true]
   * @prop {string} [dialogStatic=false]
   * @prop {bool} [drupalAutoButtons=undefined]
   * @prop {bool} [drupalOffCanvasPosition='side']
   * @prop {bool} [resizable=undefined]
   * @prop {string} [title=undefined]
   * @prop {string} [width=undefined]
   */
  drupalSettings.offCanvas = {
    autoOpen: true,
    autoResize: undefined,
    backdrop: undefined,
    classes: undefined,
    close: function close(event) {
      Drupal.uiSuiteDialog(event.target).close();
      Drupal.detachBehaviors(event.target, null, 'unload');
    },
    dialogHeadingLevel: 5,
    dialogShowHeader: true,
    dialogShowHeaderTitle: true,
    dialogStatic: false,
    drupalAutoButtons: undefined,
    drupalOffCanvasPosition: 'side',
    resizable: undefined,
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
  Drupal.uiSuiteOffCanvas = (element, options) => {
    let undef;

    const $element = $(element);
    const domElement = $element.get(0);

    const dialog = {
      open: false,
      returnValue: undef,
    };

    options = $.extend({}, drupalSettings.offCanvas, options);

    function settingIsTrue(setting) {
      return setting !== undefined && (setting === true || setting === 'true');
    }

    function openDialog(settings) {
      settings = $.extend({}, options, settings);

      // eslint-disable-next-line no-undef
      const event = new DrupalDialogEvent('beforecreate', dialog, settings);
      domElement.dispatchEvent(event);
      dialog.open = true;
      settings = event.settings;

      // Position
      if (settings.drupalOffCanvasPosition === 'side') {
        $element.addClass('offcanvas-end');
      } else if (settings.drupalOffCanvasPosition === 'top') {
        $element.addClass('offcanvas-top');
      } else if (settings.drupalOffCanvasPosition === 'bottom') {
        $element.addClass('offcanvas-bottom');
      }

      // Classes
      if (settings.classes) {
        if (settings.classes['ui-dialog']) {
          $element.addClass(settings.classes['ui-dialog']);
        }
        if (settings.classes['ui-dialog-content']) {
          $('.offcanvas-body', $element).addClass(
            settings.classes['ui-dialog-content'],
          );
        }
      }

      // The offcanvas dialog header.
      if (settingIsTrue(settings.dialogShowHeader)) {
        let offCanvasHeader = '<div class="offcanvas-header">';
        const heading = settings.dialogHeadingLevel;

        if (settingIsTrue(settings.dialogShowHeaderTitle)) {
          offCanvasHeader += `<h${heading} class="offcanvas-title" id="offcanvasLabel">${settings.title}</h${heading}>`;
        }

        offCanvasHeader += `<button type="button" class="close btn-close" data-bs-dismiss="offcanvas" aria-label="${Drupal.t(
          'Close',
        )}"></button></div>`;

        $(offCanvasHeader).prependTo($element);
      }

      if (settingIsTrue(settings.dialogStatic)) {
        $element.attr('data-bs-backdrop', 'static');
      }

      if (!settingIsTrue(settings.backdrop)) {
        $element.attr('data-bs-scroll', 'true');
      }

      if ($element.offcanvas !== undefined) {
        $element.offcanvas(settings);
        $element.offcanvas('show');
      }

      if (settings.width) {
        $element[0].style.setProperty(
          '--bs-offcanvas-width',
          typeof settings.width === 'number'
            ? `${settings.width}px`
            : settings.width,
        );
      }

      if ($element.resizable !== undefined && settings.resizable) {
        $element.resizable({
          handles: 'w',
        });
      }

      domElement.dispatchEvent(
        // eslint-disable-next-line no-undef
        new DrupalDialogEvent('aftercreate', dialog, settings),
      );
    }

    function closeDialog(value) {
      if ($element.modal !== undefined) {
        $element.offcanvas('hide');
      }
      dialog.returnValue = value;
      dialog.open = false;
    }

    dialog.show = () => {
      openDialog({ backdrop: false });
    };
    dialog.showModal = () => {
      openDialog({ backdrop: true });
    };
    dialog.close = () => {
      closeDialog({});
    };

    $element.on('hide.bs.offcanvas', () => {
      // eslint-disable-next-line no-undef
      domElement.dispatchEvent(new DrupalDialogEvent('beforeclose', dialog));
    });

    $element.on('hidden.bs.offcanvas', () => {
      // eslint-disable-next-line no-undef
      domElement.dispatchEvent(new DrupalDialogEvent('afterclose', dialog));
    });

    return dialog;
  };

  Drupal.behaviors.offCanvasEvents = {};
})(jQuery, Drupal, drupalSettings);
