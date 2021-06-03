(function () {
  // Trigger search overlay events and logic
  const rootDir = document.querySelector('html').dataset.hrldRoot;
  const postsPath = `${
    rootDir && window.location.href.includes(rootDir) ? `/${rootDir}` : ''
  }/posts/`;
  const searchIcon = document.querySelector('[data-js-search]');
  const searchIconClose = document.querySelector('[data-js-search-close]');
  const searchOverlay = document.querySelector('[data-js-search-overlay]');
  const body = document.body;
  const searchInput = document.querySelector('[data-js-search-input]');
  const searchResultsContainer = document.querySelector(
    '[data-js-search-results]'
  );

  if (
    searchIcon &&
    searchInput &&
    searchIconClose &&
    searchOverlay &&
    searchResultsContainer
  ) {
    searchIcon.addEventListener('click', function () {
      searchOverlay.classList.add('js-visible');
      body.classList.add('js-overflow-y-hidden');
      searchInput.focus();
    });

    searchIconClose.addEventListener('click', function () {
      searchInput.value = '';
      searchResultsContainer.innerHTML = '';
      searchOverlay.classList.remove('js-visible');
      body.classList.remove('js-overflow-y-hidden');
    });

    searchInput.addEventListener('keyup', function () {
      if (!this.value) {
        searchResultsContainer.innerHTML = '';
      }
      if (this.value && this.value.length >= 3 && harold && harold.search) {
        searchResultsContainer.innerHTML = '';
        const results = harold.search(this.value);
        if (!results || results.length === 0) {
          const noResults = document.createElement('div');
          noResults.classList.add('search-overlay-results-item');
          noResults.innerText = 'No results...';
          searchResultsContainer.appendChild(noResults);
        } else {
          results.forEach(function (result) {
            const resultItemContainer = document.createElement('div');
            resultItemContainer.classList.add('search-overlay-results-item');
            const resultItem = document.createElement('a');
            resultItem.innerText = result.title;
            resultItem.setAttribute('href', postsPath + result.fileName);
            resultItemContainer.appendChild(resultItem);
            searchResultsContainer.appendChild(resultItemContainer);
          });
        }
      }
    });
  }
})();
