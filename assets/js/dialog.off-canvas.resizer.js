/**
 * @file
 * Offcanvas resizer helper
 */

(function ($, Drupal) {
  /**
   * Handle drag and drop resizing of offcanvas.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *
   */
  Drupal.behaviors.offcanvasResizer = {
    attach(context, settings) {
      once('offcanvas-resizer', '.offcanvas-resizer', context).forEach((resizer) => {

        let position;
        let offcanvasClassList;

        function initDrag(e) {
          e.preventDefault();
          if (position === 'bottom' || position === 'top') {
            document.addEventListener("pointermove", doDragHeight);
          } else {
            document.addEventListener("pointermove", doDragWidth);
          }

          document.addEventListener("pointerup", stopDrag, { once: true });
        }

        function doDragWidth(e) {
          e.preventDefault();

          let width = document.documentElement.scrollWidth - e.pageX;
          if (position === 'left') {
            width = e.pageX;
          }

          let sidebarWidth = Math.round(width) + "px";
          resizer.parentElement.style.setProperty('--bs-offcanvas-width', sidebarWidth);
        }

        function doDragHeight(e) {
          e.preventDefault();
          let height = e.clientY;
          if (position === 'bottom') {
            height = window.innerHeight - e.clientY;
          }
          const sidebarHeight = Math.round(height) + "px";
          resizer.parentElement.style.setProperty('--bs-offcanvas-height', sidebarHeight);
        }

        function stopDrag(e) {
          document.removeEventListener("pointermove", doDragWidth);
          document.removeEventListener("pointermove", doDragHeight);
        }

        resizer.addEventListener('pointerdown', initDrag);

        offcanvasClassList = resizer.parentElement.classList;

        // get the offcanvas position
        if (offcanvasClassList.contains('offcanvas-start')) {
          position = 'left';
        } else if (offcanvasClassList.contains('offcanvas-bottom')) {
          position = 'bottom';
        } else if (offcanvasClassList.contains('offcanvas-top')) {
          position = 'top';
        } else {
          position = 'right';
        }

      });
    },
  };
})(jQuery, window.Drupal);
