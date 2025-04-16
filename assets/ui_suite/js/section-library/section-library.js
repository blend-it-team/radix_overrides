((Drupal, once) => {
  Drupal.behaviors.sectionLibrary = {
    attach(context) {
      if (
        once(
          'choose-from-section-library',
          '.js-layout-builder-section-library-filter-type',
          context,
        ).length
      ) {
        const filterLinks = document.querySelectorAll(
          '.js-layout-builder-section-library-link',
        );

        const filterSearchInput = document.querySelector(
          '.js-layout-builder-section-library-filter',
        );
        const filterTypeSelect = document.querySelector(
          '.js-layout-builder-section-library-filter-type',
        );

        const toggleSectionLibraryEntry = (link) => {
          const query = filterSearchInput.value
            ? filterSearchInput.value.toLowerCase()
            : '';
          const filterType = filterTypeSelect.value.toLowerCase();

          let filterResult;
          // If we're filtering by Type "All", we only need to worry about text searching.
          if (filterType === 'any') {
            // Filter by the text search only.
            filterResult =
              link.textContent.toLowerCase().indexOf(query.toLowerCase()) !==
              -1;
          } else {
            // Filter by the "Type" dropdown first.
            filterResult =
              link.dataset.sectionType.toLowerCase().indexOf(filterType) !== -1;

            // Additionally filter by the text search.
            if (filterResult) {
              filterResult =
                link.textContent.toLowerCase().indexOf(query.toLowerCase()) !==
                -1;
            }
          }
          if (filterResult) {
            link.style.display = '';
          } else {
            link.style.display = 'none';
          }
        };

        const filterSectionLibraryList = () => {
          const query = filterSearchInput.value
            ? filterSearchInput.value.toLowerCase()
            : '';
          const filterType = filterTypeSelect.value.toLowerCase();

          // If text searching with more than 1 character, or choosing a "Type", narrow results.
          if (filterType !== 'any' || query.length >= 2) {
            filterLinks.forEach(toggleSectionLibraryEntry);
          } else if (filterType === 'any' && query.length < 2) {
            // If no filter is applied, show all links.
            filterLinks.forEach((link) => {
              link.style.display = '';
            });
            Drupal.announce(Drupal.t('All available sections are listed.'));
          }
        };

        filterSearchInput.addEventListener(
          'keyup',
          Drupal.debounce(filterSectionLibraryList, 200, false),
        );
        filterTypeSelect.addEventListener('change', filterSectionLibraryList);
      }
    },
  };
})(Drupal, once);
