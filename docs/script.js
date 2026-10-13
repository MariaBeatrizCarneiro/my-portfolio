const BIRTH_DATE = { year: 2003, month: 5, day: 22 };

function calculateAge(today) {
  const month = today.getMonth() + 1;
  const hadBirthday =
    month > BIRTH_DATE.month ||
    (month === BIRTH_DATE.month && today.getDate() >= BIRTH_DATE.day);
  return today.getFullYear() - BIRTH_DATE.year - (hadBirthday ? 0 : 1);
}

function fillDynamicDates() {
  const today = new Date();
  const age = document.getElementById('age');
  const year = document.getElementById('year');
  if (age) age.textContent = calculateAge(today);
  if (year) year.textContent = today.getFullYear();
}

document.addEventListener('DOMContentLoaded', function () {
    fillDynamicDates();
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
