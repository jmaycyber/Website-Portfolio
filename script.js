const featuredProjects = [
  {
    title: 'SIT Website – School of Information Technology',
    type: 'Academic Project',
    statusClass: 'status-prototype',
    statusText: 'Local Project',
    description: 'An academic institutional website designed to present school information, faculty profiles, and relevant resources through an organized and accessible web interface.',
    liveUrl: 'SIT%20website/index.html',
    thumbnail: 'SIT%20website/images/faculty1.jpg',
    thumbnailAlt: 'SIT faculty and facilities cover image'
  },
  {
    title: 'Local Distribution Portal',
    type: 'Personal Project',
    statusClass: 'status-prototype',
    statusText: 'Prototype',
    description: 'A centralized distribution management portal designed to help government officials maintain accurate household registries, manage family membership updates, and track the distribution of goods or assistance.',
    liveUrl: 'LGUPortal-main/index.html'
  },
  {
    title: 'E-Commerce / DreamLine',
    type: 'Academic Project',
    statusClass: 'status-prototype',
    statusText: 'Prototype',
    description: 'An e-commerce application designed to provide users with an accessible online shopping experience, includes features such as product browsing, shopping cart management, and a secure checkout process.',
    liveUrl: 'E-Commerce-Project-main/index.html',
    thumbnail: 'E-Commerce-Project-main/assets/images/dress1.jpg',
    thumbnailAlt: 'Dress product from the DreamLine store'
  },
  {
    title: 'ShareTots — CRUD Application',
    type: 'Personal Project',
    statusClass: 'status-prototype',
    statusText: 'Prototype',
    description: 'A thread-inspired social application designed to explore content sharing and post management through CRUD functionality.',
    liveUrl: 'ShareTots-main/index.html'
  }
];

const figmaProjects = [
  {
    title: 'Learning Platform Interface',
    type: 'UI/UX',
    description: 'An interface design exploration for a learning management system, focusing on the organization and presentation of learning-related information.',
    url: 'https://www.figma.com/design/VpRROxNatJbkR2iYqZyYyi/LMS-UI-UX?node-id=0-1&t=y2gRN0STKAfSNZMk-1',
    thumbnail: 'images/figma-learning-platform.webp'
  },
  {
    title: 'Travel App Concept',
    type: 'UI/UX',
    description: 'A travel-oriented interface concept exploring the presentation and organization of travel-related experiences.',
    url: 'https://www.figma.com/design/GoqgzL1azar7GP53hs8sJw/TravelBuddy?t=y2gRN0STKAfSNZMk-1',
    thumbnail: 'images/figma-travel-app.webp'
  },
  {
    title: 'Canteen Operations Interface',
    type: 'UI/UX',
    description: 'An interface design exploration for a canteen-related workflow, with attention to information hierarchy and operational usability.',
    url: 'https://www.figma.com/design/aef60KtOKH8tXLDTV68fwr/canteen-operator?t=y2gRN0STKAfSNZMk-1',
    thumbnail: 'images/figma-canteen-interface.png'
  }
];

function setYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function renderFeaturedProjects() {
  renderProjectCards(featuredProjects, 'project-gallery');
}

function renderProjectCards(projects, galleryId) {
  const projectGallery = document.getElementById(galleryId);
  if (!projectGallery) return;

  projectGallery.innerHTML = projects.map((project) => {
    return `
      <article class="project-card" aria-label="${project.title}">
        ${project.thumbnail
          ? `<div class="project-preview"><img src="${project.thumbnail}" alt="${project.thumbnailAlt || project.title + ' preview'}" loading="lazy"></div>`
          : '<div class="project-preview project-preview--placeholder" aria-hidden="true"><span>Project preview</span></div>'}
        <div class="project-meta">
          <span class="status ${project.statusClass}">${project.statusText}</span>
          <span class="project-type">${project.type}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-links">
          <a class="project-action" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">Open Project</a>
        </div>
      </article>
    `;
  }).join('');
}

function renderFigmaProjects() {
  const figmaGallery = document.getElementById('figma-gallery');
  if (!figmaGallery) return;

  figmaGallery.innerHTML = figmaProjects.map((project) => `
    <article class="project-card project-card--figma" aria-label="${project.title}">
      <div class="project-preview">
        <img src="${project.thumbnail}" alt="${project.title} Figma design preview" loading="lazy">
      </div>
      <div class="project-meta">
        <span class="status status-prototype">${project.type}</span>
        <span class="project-type">Design Project</span>
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

  if (!toggle || !nav) return;

  const navigationLinks = nav.querySelectorAll('a');

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  });

  navigationLinks.forEach((link) => {
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
