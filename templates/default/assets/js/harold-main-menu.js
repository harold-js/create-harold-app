(function () {
  const menuIcon = document.querySelector('[data-js-menu]');
  const menuIconClose = document.querySelector('[data-js-menu-close]');
  const menuOverlay = document.querySelector('[data-js-menu-overlay]');
  const body = document.body;

  if (menuIcon && menuIconClose && menuOverlay) {
    menuIcon.addEventListener('click', function () {
      menuOverlay.classList.add('js-visible');
      body.classList.add('js-overflow-y-hidden');
    });

    menuIconClose.addEventListener('click', function () {
      menuOverlay.classList.remove('js-visible');
      body.classList.remove('js-overflow-y-hidden');
    });
  }
})();
