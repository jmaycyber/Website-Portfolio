const featuredProjects = [
  {
    title: 'Local Distribution Portal',
    type: 'Prototype',
    statusClass: 'status-prototype',
    statusText: 'Prototype',
    description: 'A prototype built to support organized distribution workflows with a practical, user-friendly interface.',
    bullets: [
      'Resource request and overview layout',
      'Structured workflow for local operations',
      'Clear, task-focused interface design'
    ],
    liveUrl: '#',
    actionLabel: 'Live demo',
    actionDisabled: true
  },
  {
    title: 'DreamLine',
    type: 'Academic',
    statusClass: 'status-live',
    statusText: 'Completed',
    description: 'A student project focused on a clean and engaging web layout for a travel and booking concept.',
    bullets: [
      'Responsive landing-page design',
      'Product browsing and travel concept flow',
      'Front-end interface and landing page work'
    ],
    liveUrl: 'https://mendoza-joana.pages.dev/',
    actionLabel: 'View project',
    actionDisabled: false
  },
  {
    title: 'ShareTots',
    type: 'Personal',
    statusClass: 'status-prototype',
    statusText: 'Prototype',
    description: 'A prototype concept exploring practical sharing and community-oriented service workflows.',
    bullets: [
      'Simple service-focused interface',
      'Clear information hierarchy',
      'Application concept for local needs'
    ],
    liveUrl: '#',
    actionLabel: 'Prototype',
    actionDisabled: true
  }
];

const figmaProjects = [
  {
    title: 'Learning Platform Interface',
    type: 'UI/UX',
    description: 'An interface design exploration for a learning management system, focusing on the organization and presentation of learning-related information.',
    url: 'https://www.figma.com/design/VpRROxNatJbkR2iYqZyYyi/LMS-UI-UX?node-id=0-1&t=y2gRN0STKAfSNZMk-1',
    label: 'LMS UI/UX',
    thumbClass: 'project-thumb--lms'
  },
  {
    title: 'Travel App Concept',
    type: 'UI/UX',
    description: 'A travel-oriented interface concept exploring the presentation and organization of travel-related experiences.',
    url: 'https://www.figma.com/design/GoqgzL1azar7GP53hs8sJw/TravelBuddy?t=y2gRN0STKAfSNZMk-1',
    label: 'TravelBuddy',
    thumbClass: 'project-thumb--travel'
  },
  {
    title: 'Canteen Operations Interface',
    type: 'UI/UX',
    description: 'An interface design exploration for a canteen-related workflow, with attention to information hierarchy and operational usability.',
    url: 'https://www.figma.com/design/aef60KtOKH8tXLDTV68fwr/canteen-operator?t=y2gRN0STKAfSNZMk-1',
    label: 'Canteen operator',
    thumbClass: 'project-thumb--canteen'
  }
];

function setYear() {
  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
}

function renderFeaturedProjects() {
  const gallery = document.getElementById('project-gallery');
  if (!gallery) return;

  gallery.innerHTML = featuredProjects.map((project) => {
    const actionMarkup = project.actionDisabled
      ? '<span class="project-action" aria-disabled="true">'+project.actionLabel+'</span>'
      : '<a class="project-action" href="'+project.liveUrl+'" target="_blank" rel="noopener noreferrer">'+project.actionLabel+'</a>';

    return `
      <article class="project-card" aria-label="${project.title}">
        <div class="project-meta">
          <span class="status ${project.statusClass}">${project.statusText}</span>
          <span class="project-type">${project.type}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <ul>
          ${project.bullets.map((bullet) => `<li>${bullet}</li>`).join('')}
        </ul>
        <div class="project-links">
          ${actionMarkup}
        </div>
      </article>
    `;
  }).join('');
}

function renderFigmaProjects() {
  const gallery = document.getElementById('figma-gallery');
  if (!gallery) return;

  gallery.innerHTML = figmaProjects.map((project) => `
    <article class="project-card project-card--figma" aria-label="${project.title}">
      <div class="project-thumb ${project.thumbClass}">
        <span class="thumb-label">${project.label}</span>
      </div>
      <div class="project-meta">
        <span class="status status-prototype">Design Projects</span>
        <span class="project-type">Figma / UI/UX</span>
      </div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-links">
        <a class="project-action" href="${project.url}" target="_blank" rel="noopener noreferrer">Open in Figma</a>
      </div>
    </article>
  `).join('');
}

function setupMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const links = nav ? nav.querySelectorAll('a') : [];

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupNavigationState() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  if (!navLinks.length || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${currentId}`;
          link.classList.toggle('is-active', isActive);
        });
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-15% 0px -55% 0px'
    }
  );

  sections.forEach((section) => observer.observe(section));
}

window.addEventListener('DOMContentLoaded', () => {
  renderFeaturedProjects();
  renderFigmaProjects();
  setupMenu();
  setupNavigationState();
  setYear();
});
