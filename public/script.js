function toggleMenu() {
    const navList = document.querySelector('.nav-list');
    navList.classList.toggle('show');

    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('show');
        });
    });
  }
