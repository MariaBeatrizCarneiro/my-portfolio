document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
  
    // Toggle the mobile menu
    menuToggle.addEventListener('click', function () {
      navList.classList.toggle('show');
    });
  
    // Ensure the mobile menu is closed when scrolling
    window.addEventListener('scroll', function () {
      if (!navList.contains(event.target) && navList.classList.contains('show')) {
        navList.classList.remove('show');
      }
    });
  });
