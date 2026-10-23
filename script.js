const featuredProjects = [
  {
    title: 'Local Distribution Portal',
    type: 'Personal',
    statusClass: 'status-prototype',
    statusText: 'Prototype',
    description: 'A centralized distribution management portal designed to help government officials maintain accurate household registries, manage family membership updates, and track the distribution of goods or assistance.',
    liveUrl: '',
    actionLabel: 'Live demo',
    actionDisabled: true
  },
  {
    title: 'E-Commerce: My DreamLine',
    type: 'Academic',
    statusClass: 'status-live',
    statusText: 'Under Improvement',
    description: 'An e-commerce application designed to provide users with an accessible online shopping experience, includes features such as product browsing, shopping cart management, and a secure checkout process.',
    liveUrl: '',
    actionLabel: 'View project',
    actionDisabled: false
  },
  {
    title: 'ShareTots: CRUD Application',
    type: 'Personal',
    statusClass: 'status-prototype',
    statusText: 'Prototype',
    description: 'A thread-inspired social application designed to explore content sharing and post management through CRUD functionality.',
    liveUrl: '',
    actionLabel: 'Prototype',
    actionDisabled: true
  }
];

const certificatesDriveUrl = 'https://drive.google.com/drive/folders/12hdQMdLK6TkX1yKj32U3EDfuX-vJYX86?usp=sharing';

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
    const actionMarkup = project.actionDisabled || !project.liveUrl
      ? '<span class="project-action" aria-disabled="true">Project link coming soon</span>'
      : '<a class="project-action" href="'+project.liveUrl+'" target="_blank" rel="noopener noreferrer">'+project.actionLabel+'</a>';

    return `
      <article class="project-card" aria-label="${project.title}">
        <div class="project-meta">
          <span class="status ${project.statusClass}">${project.statusText}</span>
          <span class="project-type">${project.type}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-links">
          ${actionMarkup}
        </div>
      </article>
    `;
  }).join('');
}

function setupCertificatesLink() {
  const placeholder = document.getElementById('certificate-link');
  if (!placeholder || certificatesDriveUrl === '[ADD_GOOGLE_DRIVE_CERTIFICATES_LINK]') return;

  const link = document.createElement('a');
  link.className = placeholder.className;
  link.href = certificatesDriveUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'View Certificates & Badges';
  placeholder.replaceWith(link);
}

async function setupCertificatePreviews() {
  const previews = document.querySelectorAll('.cert-visual[data-image-src]');

  for (const preview of previews) {
    const status = preview.querySelector('span');
    const imageUrl = preview.dataset.imageSrc;

    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      if (!response.ok) continue;

      const image = document.createElement('img');
      image.src = imageUrl;
      image.alt = preview.dataset.imageAlt || 'Certificate image';
      preview.prepend(image);
      preview.classList.add('has-image');
    } catch {
      if (status) status.textContent = 'Preview unavailable — add the image to the images folder.';
    }
  }
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
  setupCertificatesLink();
  setupCertificatePreviews();
  setupMenu();
  setupNavigationState();
  setYear();
});
