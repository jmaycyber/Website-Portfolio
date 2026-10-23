const featuredProjects = [
  {
    title: 'Local Distribution Portal',
    type: 'Personal Project',
    statusClass: 'status-prototype',
    statusText: 'Prototype',
    description: 'A centralized distribution management portal designed to help government officials maintain accurate household registries, manage family membership updates, and track the distribution of goods or assistance.',
    liveUrl: 'https://lgu-portal101.pages.dev/'
  },
  {
    title: 'My DreamLine — E-Commerce',
    type: 'Academic Project',
    statusClass: 'status-live',
    statusText: 'Completed',
    description: 'An e-commerce application designed to provide users with an accessible online shopping experience, includes features such as product browsing, shopping cart management, and a secure checkout process.',
    liveUrl: 'https://autumnjo-store.pages.dev/'
  },
  {
    title: 'ShareTots — CRUD Application',
    type: 'Personal Project',
    statusClass: 'status-prototype',
    statusText: 'Prototype',
    description: 'A thread-inspired social application designed to explore content sharing and post management through CRUD functionality.',
    liveUrl: 'https://my-sharetots.pages.dev/'
  }
];

const figmaProjects = [
  {
    title: 'Learning Platform Interface',
    type: 'UI/UX',
    description: 'An interface design exploration for a learning management system, focusing on the organization and presentation of learning-related information.',
    url: 'https://www.figma.com/design/VpRROxNatJbkR2iYqZyYyi/LMS-UI-UX?node-id=0-1&t=y2gRN0STKAfSNZMk-1'
  },
  {
    title: 'Travel App Concept',
    type: 'UI/UX',
    description: 'A travel-oriented interface concept exploring the presentation and organization of travel-related experiences.',
    url: 'https://www.figma.com/design/GoqgzL1azar7GP53hs8sJw/TravelBuddy?t=y2gRN0STKAfSNZMk-1'
  },
  {
    title: 'Canteen Operations Interface',
    type: 'UI/UX',
    description: 'An interface design exploration for a canteen-related workflow, with attention to information hierarchy and operational usability.',
    url: 'https://www.figma.com/design/aef60KtOKH8tXLDTV68fwr/canteen-operator?t=y2gRN0STKAfSNZMk-1'
  }
];

function setYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function renderFeaturedProjects() {
  const projectGallery = document.getElementById('project-gallery');
  if (!projectGallery) return;

  projectGallery.innerHTML = featuredProjects.map((project) => {
    return `
      <article class="project-card" aria-label="${project.title}">
        <div class="project-meta">
          <span class="status ${project.statusClass}">${project.statusText}</span>
          <span class="project-type">${project.type}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-links">
          <a class="project-action" href="${project.liveUrl}" target="_blank" rel="noopener noreferrer">See Link</a>
        </div>
      </article>
    `;
  }).join('');
}

function setupCertificatePreviews() {
  const certificatePreviews = document.querySelectorAll('.cert-visual[data-image-src]');

  certificatePreviews.forEach((preview) => {
    const certificateImage = new Image();
    const certificateImageUrl = preview.dataset.imageSrc;

    certificateImage.alt = preview.dataset.imageAlt || 'Certificate image';
    certificateImage.onload = () => {
      preview.prepend(certificateImage);
      preview.classList.add('has-image');

      const certificateEntry = preview.parentElement;
      const certificateAction = certificateEntry.querySelector('[data-certificate-action]');
      if (certificateAction) {
        const link = document.createElement('a');
        link.className = 'button button-secondary certificate-action';
        link.href = certificateImageUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'View Certificate';
        certificateAction.replaceWith(link);
      }
    };
    certificateImage.src = certificateImageUrl;
  });
}

function renderFigmaProjects() {
  const figmaGallery = document.getElementById('figma-gallery');
  if (!figmaGallery) return;

  figmaGallery.innerHTML = figmaProjects.map((project) => `
    <article class="project-card project-card--figma" aria-label="${project.title}">
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
  setupCertificatePreviews();
  setupMenu();
  setupNavigationState();
  setYear();
});
