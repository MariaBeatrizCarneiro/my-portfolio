// Portuguese is the source language and lives in the HTML. This file holds the English
// strings and swaps the text of every element marked with data-i18n (innerHTML) or
// data-i18n-attr ("attribute:key;attribute:key").

const LANGUAGE_STORAGE_KEY = 'portfolio-language';
const SUPPORTED_LANGUAGES = ['pt', 'en'];

const EN_TRANSLATIONS = {
  'nav.label': 'Main',
  'nav.menu': 'Menu',
  'nav.about': 'About',
  'nav.experience': 'Experience',
  'nav.skills': 'Skills',
  'nav.education': 'Education',
  'nav.projects': 'Projects',
  'nav.contact': 'Contact',

  'about.title': 'About me',
  'about.text': 'I\'m Beatriz, I\'m <span id="age">23</span> years old and I currently split my time between three roles: CEO &amp; Founder of Bitwise Lab, Programming Trainer at the Aga Khan Foundation, and Informatics Engineering and Computing student at the Faculty of Engineering of the University of Porto.',
  'about.chip1': 'Enthusiastic student',
  'about.chip2': 'Passionate about technology',
  'about.chip3': 'Committed to excellence',
  'about.chip4': 'Relentless learner',
  'about.location': 'Location',
  'about.languages': 'Languages',
  'about.languagesValue': 'Portuguese and English (fluent)',

  'experience.title': 'Experience',
  'experience.bitwise.date': '2024 - Present',
  'experience.bitwise.text': 'Software development company specializing in mobile and web applications.<br>We build BoardMeeting, an AI and Blockchain meeting management app.',
  'experience.bitwise.logoAlt': 'Bitwise Lab logo',
  'experience.akf.date': '2025 - Present',
  'experience.akf.role': 'Programming Trainer',
  'experience.akf.org': 'Aga Khan Foundation Portugal',
  'experience.akf.project': 'Bytes4Future Project',
  'experience.akf.text': 'Trainer of courses such as Full Stack Developer and Data Analyst, among others,<br>helping people start their careers in technology.',
  'experience.akf.logoAlt': 'Aga Khan Foundation Portugal logo',

  'skills.title': 'Programming Skills',
  'skills.languages': 'Languages',
  'skills.databases': 'Databases',
  'skills.engineering': 'Software Engineering',
  'skills.oop': 'OOP Programming',

  'education.title': 'Education',
  'education.feup.date': '2021 - Present',
  'education.feup.name': 'University of Porto, Faculty of Engineering',
  'education.feup.degree': 'Bachelor\'s degree in Informatics Engineering',
  'education.school.degree': 'High school, Science and Technology track',

  'projects.title': 'Selected projects',
  'projects.p1.title': 'Issue Tracking',
  'projects.p1.text': 'Build a website to efficiently manage and track issue records.',
  'projects.p2.title': 'Database',
  'projects.p2.text': 'Creation and querying of a database about roller hockey championships.',
  'projects.p3.title': 'Student Timetables',
  'projects.p3.text': 'Develop a system to help manage timetables after their creation (editing, viewing, ...).',
  'projects.p3.oop': 'Object-Oriented Programming',
  'projects.p4.title': 'UNIX Programming',
  'projects.p4.text': 'Solving UNIX programming exercises as a group.',
  'projects.p4.tech': 'Systems programming (UNIX/LINUX API)',
  'projects.p5.title': 'RGB Color Images',
  'projects.p5.text': 'Represent and process RGB color images with 8 bits per RGB channel.',

  'contact.title': 'Contact',
  'contact.lead': 'Have a project in mind or want to know more about my work? Get in touch.',

  'footer.text': 'Copyright &copy; <span id="year">2026</span> Maria Beatriz Carneiro - All rights reserved.',
};

const PAGE_META = {
  pt: { description: 'Portfólio de Maria Beatriz Carneiro' },
  en: { description: 'Portfolio of Maria Beatriz Carneiro' },
};

// Portuguese originals, captured from the HTML before the first swap.
const originalHtml = new Map();
const originalAttributes = new Map();

function parseAttributeSpec(spec) {
  return spec.split(';').map((pair) => pair.split(':').map((part) => part.trim()));
}

function captureOriginals() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    originalHtml.set(element, element.innerHTML);
  });
  document.querySelectorAll('[data-i18n-attr]').forEach((element) => {
    const values = {};
    parseAttributeSpec(element.dataset.i18nAttr).forEach(([attribute]) => {
      values[attribute] = element.getAttribute(attribute);
    });
    originalAttributes.set(element, values);
  });
}

function translate(key, language, fallback) {
  if (language === 'pt') return fallback;
  if (key in EN_TRANSLATIONS) return EN_TRANSLATIONS[key];
  console.warn('Missing translation', { key, language });
  return fallback;
}

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.includes(saved)) return saved;
  } catch (error) {
    console.warn('Language preference could not be read', { error });
  }
  return (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

function saveLanguage(language) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.warn('Language preference could not be saved', { language, error });
  }
}

function applyLanguage(language) {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.innerHTML = translate(element.dataset.i18n, language, originalHtml.get(element));
  });
  document.querySelectorAll('[data-i18n-attr]').forEach((element) => {
    parseAttributeSpec(element.dataset.i18nAttr).forEach(([attribute, key]) => {
      const original = originalAttributes.get(element)[attribute];
      element.setAttribute(attribute, translate(key, language, original));
    });
  });

  document.documentElement.lang = language;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', PAGE_META[language].description);

  document.querySelectorAll('.lang-switch [data-lang]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === language));
  });

  // The age and the year live inside translated text, so they are refilled after each swap.
  fillDynamicDates();
}

document.addEventListener('DOMContentLoaded', () => {
  captureOriginals();
  applyLanguage(getInitialLanguage());

  document.querySelectorAll('.lang-switch [data-lang]').forEach((button) => {
    button.addEventListener('click', () => {
      const language = button.dataset.lang;
      applyLanguage(language);
      saveLanguage(language);
    });
  });
});
