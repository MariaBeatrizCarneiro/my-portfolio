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

function setupMobileNav() {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav-burger');
  const list = document.getElementById('nav-list');
  if (!nav || !burger || !list) return;

  const setOpen = (open) => {
    list.classList.toggle('show', open);
    burger.setAttribute('aria-expanded', String(open));
  };

  burger.addEventListener('click', () => setOpen(!list.classList.contains('show')));
  list.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', () => setOpen(false));
}

function setupActiveSectionHighlight() {
  const links = [...document.querySelectorAll('.nav-list a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener('DOMContentLoaded', () => {
  fillDynamicDates();
  setupMobileNav();
  setupActiveSectionHighlight();
});
