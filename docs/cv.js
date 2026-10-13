// Generates an up-to-date CV as a PDF in the browser every time the button is clicked.
// Depends on jsPDF (loaded from cdnjs in index.html) and on calculateAge() from script.js.

const CV_COLORS = {
  background: [244, 246, 252],
  navy: [5, 10, 46],
  text: [5, 10, 46],
  white: [255, 255, 255],
};

const CV_LINKS = {
  email: 'mariabeatrizcarneiro2003@gmail.com',
  phone: '+351 911 550 650',
  location: 'Porto, Portugal',
  site: 'https://mariabeatrizcarneiro.github.io/my-portfolio/',
  linkedin: 'https://www.linkedin.com/in/maria-beatriz-carneiro-383106232/',
  github: 'https://github.com/MariaBeatrizCarneiro',
  bitwiseLab: 'https://bitwiselab.net',
};

const CV_TEXT = {
  en: {
    fileName: 'CV_BeatrizCarneiro_EN.pdf',
    documentTitle: 'CV Beatriz Carneiro',
    roles: ['CEO & Founder of Bitwise Lab', 'Programming Trainer at Aga Khan Foundation', 'Informatics Engineering Student'],
    about: 'ABOUT ME',
    aboutText: (age) => `I am ${age} years old.\nI am fluent in Portuguese and English.\nI enjoy passing on knowledge and inspiring growth in others.`,
    contacts: 'CONTACTS',
    personalSite: 'Personal site',
    education: 'MY EDUCATION',
    paragraphs: [
      'I am the CEO & Founder of Bitwise Lab, a software development company specializing in mobile and web applications.',
      'Since May 2025, I am a Programming Trainer at the Aga Khan Foundation, in the Bytes4Future project. I have taught courses such as Full Stack Developer and Data Analyst, among others, helping people start their careers in technology.',
      "I am a 3rd year student of a Bachelor's degree in Informatics Engineering at the Faculty of Engineering, University of Porto (FEUP).",
    ],
    skillsTitle: 'SOME OF MY PROGRAMMING SKILLS:',
    skills: [
      'C', 'C#', 'C++', 'Assembly', 'Python', 'Java', 'JavaScript',
      'TypeScript', 'React', 'NodeJs', 'NextJs', 'HTML', 'CSS',
      'Databases', 'SQL', 'NoSQL', 'MongoDB', 'Microsoft SQL',
      'OOP Programming', 'Software Development', 'Web Development',
    ],
  },
  pt: {
    fileName: 'CV_BeatrizCarneiro_PT.pdf',
    documentTitle: 'CV Beatriz Carneiro',
    roles: ['CEO e Fundadora da Bitwise Lab', 'Formadora de Programação na Fundação Aga Khan', 'Estudante de Engenharia Informática'],
    about: 'SOBRE MIM',
    aboutText: (age) => `Tenho ${age} anos.\nSou fluente em português e inglês.\nGosto de transmitir conhecimento e de inspirar o crescimento dos outros.`,
    contacts: 'CONTACTOS',
    personalSite: 'Site pessoal',
    education: 'FORMAÇÃO',
    paragraphs: [
      'Sou CEO e Fundadora da Bitwise Lab, uma empresa de desenvolvimento de software especializada em aplicações móveis e web.',
      'Desde maio de 2025, sou Formadora de Programação na Fundação Aga Khan, no projeto Bytes4Future. Já lecionei cursos como Full Stack Developer e Data Analyst, entre outros, ajudando pessoas a iniciarem a sua carreira na tecnologia.',
      'Sou aluna do 3.º ano da licenciatura em Engenharia Informática e Computação na Faculdade de Engenharia da Universidade do Porto (FEUP).',
    ],
    skillsTitle: 'ALGUMAS DAS MINHAS COMPETÊNCIAS DE PROGRAMAÇÃO:',
    skills: [
      'C', 'C#', 'C++', 'Assembly', 'Python', 'Java', 'JavaScript',
      'TypeScript', 'React', 'NodeJs', 'NextJs', 'HTML', 'CSS',
      'Bases de Dados', 'SQL', 'NoSQL', 'MongoDB', 'Microsoft SQL',
      'Programação Orientada a Objetos', 'Desenvolvimento de Software', 'Desenvolvimento Web',
    ],
  },
};


const PAGE = { width: 210, height: 297 };
const LEFT_X = 9;
const LEFT_WIDTH = 78;
const RIGHT_X = 104;
const RIGHT_WIDTH = 96;
const LINE_HEIGHT = 5.2;
const DOTTED_LINE_X = 84;

function loadRoundedPhoto(src, widthMm, heightMm) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const scale = 8; // pixels per mm, keeps the photo sharp in print
      const canvas = document.createElement('canvas');
      canvas.width = widthMm * scale;
      canvas.height = heightMm * scale;
      const context = canvas.getContext('2d');
      const radius = 9 * scale;
      context.beginPath();
      context.roundRect(0, 0, canvas.width, canvas.height, radius);
      context.clip();
      // "cover" crop, anchored near the top so the face stays in frame
      const ratio = Math.max(canvas.width / image.width, canvas.height / image.height);
      const drawWidth = image.width * ratio;
      const drawHeight = image.height * ratio;
      context.drawImage(image, (canvas.width - drawWidth) / 2, 0, drawWidth, drawHeight);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = () => {
      console.error('CV photo failed to load', { src });
      resolve(null);
    };
    image.src = src;
  });
}

function drawPill(doc, label, x, y, fontSize) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize);
  const width = doc.getTextWidth(label) + 8;
  doc.setFillColor(...CV_COLORS.navy);
  doc.roundedRect(x, y, width, 9, 2, 2, 'F');
  doc.setTextColor(...CV_COLORS.white);
  doc.text(label, x + 4, y + 6.2);
}

function drawParagraph(doc, text, x, y, width) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...CV_COLORS.text);
  const lines = doc.splitTextToSize(text, width);
  doc.text(lines, x, y, { lineHeightFactor: 1.35 });
  return y + lines.length * LINE_HEIGHT;
}

function drawHeader(doc, photo, t) {
  if (photo) doc.addImage(photo, 'PNG', 9, 6, 68, 70);

  doc.setFillColor(...CV_COLORS.navy);
  doc.roundedRect(84, 14, 100, 14, 3, 3, 'F');
  doc.setTextColor(...CV_COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(21);
  doc.text('Beatriz Carneiro', 134, 24, { align: 'center' });

  doc.setTextColor(...CV_COLORS.text);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.textWithLink(t.roles[0], 96, 42, { url: CV_LINKS.bitwiseLab });
  doc.text(t.roles[1], 96, 51);
  doc.text(t.roles[2], 96, 60);

  doc.setDrawColor(...CV_COLORS.navy);
  doc.setLineWidth(0.9);
  doc.setLineDashPattern([0.4, 1.4], 0);
  doc.line(DOTTED_LINE_X, 70, PAGE.width, 70);
  doc.line(DOTTED_LINE_X, 70, DOTTED_LINE_X, 62);
  doc.setLineDashPattern([], 0);
}

function drawAbout(doc, t, age) {
  drawPill(doc, t.about, LEFT_X, 84, 14);
  drawParagraph(doc, t.aboutText(age), LEFT_X, 102, LEFT_WIDTH);
}

const ICON_SIZE_MM = 5;

// Feather-style icons: SVG path data drawn on a canvas, then embedded as PNG.
const CV_ICONS = {
  phone: {
    paths: ['M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'],
  },
  email: {
    paths: ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', 'M22 6l-10 7L2 6'],
  },
  location: {
    paths: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'],
    circles: [[12, 10, 3]],
  },
  link: {
    paths: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
  },
  linkedin: {
    paths: ['M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'],
    rects: [[2, 9, 4, 12]],
    circles: [[4, 4, 2]],
  },
  github: {
    paths: ['M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'],
  },
};

function renderIcon(icon) {
  const size = 96;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  context.scale(size / 24, size / 24);
  context.strokeStyle = `rgb(${CV_COLORS.navy.join(',')})`;
  context.lineWidth = 2;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  (icon.paths || []).forEach((path) => context.stroke(new Path2D(path)));
  (icon.rects || []).forEach(([x, y, w, h]) => context.strokeRect(x, y, w, h));
  (icon.circles || []).forEach(([cx, cy, r]) => {
    context.beginPath();
    context.arc(cx, cy, r, 0, Math.PI * 2);
    context.stroke();
  });
  return canvas.toDataURL('image/png');
}

function drawContacts(doc, t) {
  drawPill(doc, t.contacts, LEFT_X, 128, 14);
  const rows = [
    ['phone', CV_LINKS.phone, null],
    ['email', CV_LINKS.email, `mailto:${CV_LINKS.email}`],
    ['location', CV_LINKS.location, null],
    ['link', t.personalSite, CV_LINKS.site],
    ['linkedin', 'LinkedIn', CV_LINKS.linkedin],
    ['github', 'GitHub', CV_LINKS.github],
    ['link', 'Bitwise Lab', CV_LINKS.bitwiseLab],
  ];
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  rows.forEach(([iconName, label, url], index) => {
    const y = 148 + index * 8.8;
    doc.addImage(renderIcon(CV_ICONS[iconName]), 'PNG', LEFT_X, y - 4, ICON_SIZE_MM, ICON_SIZE_MM);
    doc.setTextColor(...CV_COLORS.text);
    if (url) doc.textWithLink(label, LEFT_X + 8, y, { url });
    else doc.text(label, LEFT_X + 8, y);
  });
}

function drawEducation(doc, t) {
  drawPill(doc, t.education, RIGHT_X, 84, 14);
  const paragraphs = t.paragraphs;
  let y = 106;
  paragraphs.forEach((paragraph) => {
    y = drawParagraph(doc, paragraph, RIGHT_X, y, RIGHT_WIDTH) + 4;
  });
}

function layoutSkillRows(doc, skills) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  const gap = 4;
  const rowWidthLimit = PAGE.width - 2 * 16;
  const rows = [];
  let row = [];
  let rowWidth = 0;
  skills.forEach((label) => {
    const chip = { label, width: doc.getTextWidth(label) + 8 };
    if (row.length && rowWidth + gap + chip.width > rowWidthLimit) {
      rows.push(row);
      row = [];
      rowWidth = 0;
    }
    rowWidth += (row.length ? gap : 0) + chip.width;
    row.push(chip);
  });
  rows.push(row);
  return { rows, gap };
}

function drawSkills(doc, t) {
  const { rows, gap } = layoutSkillRows(doc, t.skills);
  const rowPitch = 11.5;
  const chipHeight = 8;
  const bottomMargin = 10;
  const contentHeight = 24 + (rows.length - 1) * rowPitch + chipHeight + bottomMargin;
  const top = Math.min(222, PAGE.height - contentHeight);

  doc.setFillColor(...CV_COLORS.navy);
  doc.roundedRect(0, top, PAGE.width, PAGE.height - top + 30, 14, 14, 'F');

  doc.setTextColor(...CV_COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(t.skillsTitle, PAGE.width / 2, top + 14, { align: 'center' });

  doc.setFontSize(10.5);
  rows.forEach((chipRow, rowIndex) => {
    const total = chipRow.reduce((sum, chip) => sum + chip.width, 0) + gap * (chipRow.length - 1);
    let x = (PAGE.width - total) / 2;
    const y = top + 24 + rowIndex * rowPitch;
    chipRow.forEach((chip) => {
      doc.setFillColor(...CV_COLORS.background);
      doc.roundedRect(x, y, chip.width, chipHeight, 2, 2, 'F');
      doc.setTextColor(...CV_COLORS.text);
      doc.text(chip.label, x + 4, y + 5.6);
      x += chip.width + gap;
    });
  });
}

async function generateCv(language) {
  const t = CV_TEXT[language];
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const photo = await loadRoundedPhoto('images/user-images/user.jpeg', 68, 70);

  doc.setFillColor(...CV_COLORS.background);
  doc.rect(0, 0, PAGE.width, PAGE.height, 'F');

  drawHeader(doc, photo, t);
  drawAbout(doc, t, calculateAge(new Date()));
  drawContacts(doc, t);
  drawEducation(doc, t);
  drawSkills(doc, t);

  doc.setProperties({ title: t.documentTitle, author: 'Maria Beatriz Carneiro' });
  doc.save(t.fileName);
}

function setupCvDropdown() {
  const toggle = document.querySelector('.cv-toggle');
  const menu = document.getElementById('cv-menu');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setOpen(menu.hidden));
  document.addEventListener('click', (event) => {
    if (!menu.hidden && !event.target.closest('.cv-dropdown')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });

  menu.querySelectorAll('[data-cv-lang]').forEach((link) => {
    link.addEventListener('click', async (event) => {
      event.preventDefault();
      const language = link.dataset.cvLang;
      setOpen(false);
      try {
        await generateCv(language);
      } catch (error) {
        console.error('CV generation failed', { language, error });
        alert(document.documentElement.lang === 'en'
          ? 'Could not generate the CV. Please try again later.'
          : 'Não foi possível gerar o CV. Tenta novamente mais tarde.');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', setupCvDropdown);
