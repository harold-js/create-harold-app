(function () {
  const scrollTopButton = document.querySelector('[data-js-scroll-top]');

  if (scrollTopButton) {
    let ticking = false;

    document.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 200) {
            scrollTopButton.classList.add('js-visible');
          } else {
            scrollTopButton.classList.remove('js-visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    scrollTopButton.addEventListener('click', function () {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    });
  }
})();
