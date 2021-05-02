(function () {
  const scrollTopButton = document.querySelector('[data-js-scroll-top]');

  if (scrollTopButton) {
    document.addEventListener('scroll', function () {
      if (window.scrollY > 200) {
        scrollTopButton.classList.add('js-visible');
      } else {
        scrollTopButton.classList.remove('js-visible');
      }
    });
    scrollTopButton.addEventListener('click', function () {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    });
  }
})();
