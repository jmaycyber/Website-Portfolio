const contactReferences = [
  { label: 'Phone', value: '09639471380',href: 'tel:09639471380', type: 'phone'},
  { label: 'Gmail', value: 'joanami.mendoza@gmail.com', href: 'mailto:joanami.mendoza@gmail.com',type: 'email'},
  { label: 'LinkedIn', value: 'joana-may-mendoza-8800bb412',href: 'https://www.linkedin.com/in/joana-may-mendoza-8800bb412', type: 'linkedin'}
];

function getContactIconSvg(type) {
  const common = {
    width: 18, height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round'
  };

  const icons = {
    phone: `
      <svg xmlns="http://www.w3.org/2000/svg" width="${common.width}" height="${common.height}" viewBox="${common.viewBox}" fill="${common.fill}" stroke="${common.stroke}" stroke-width="${common.strokeWidth}" stroke-linecap="${common.strokeLinecap}" stroke-linejoin="${common.strokeLinejoin}">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 10.8 19.86 19.86 0 0 1 0 2.18 2 2 0 0 1 2 0h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.64 2.63a2 2 0 0 1-.45 2.11L6 7.91a16 16 0 0 0 9.09 9.09l1.45-1.23a2 2 0 0 1 2.11-.45c.85.3 1.73.52 2.63.64A2 2 0 0 1 22 16.92Z"/>
      </svg>
    `,
    email: `
      <svg xmlns="http://www.w3.org/2000/svg" width="${common.width}" height="${common.height}" viewBox="${common.viewBox}" fill="${common.fill}" stroke="${common.stroke}" stroke-width="${common.strokeWidth}" stroke-linecap="${common.strokeLinecap}" stroke-linejoin="${common.strokeLinejoin}">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <path d="M4 7l8 6 8-6"/>
      </svg>
    `,
    linkedin: `
      <svg xmlns="http://www.w3.org/2000/svg" width="${common.width}" height="${common.height}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M6.94 8.5A1.56 1.56 0 1 1 6.9 5.38a1.56 1.56 0 0 1 .04 3.12ZM5.5 10h2.88v8H5.5zm4.9 0h2.76v1.1h.04c.38-.72 1.32-1.48 2.72-1.48 2.9 0 3.44 1.91 3.44 4.39V18h-2.88v-16.67c0-1.34-.03-3.06-1.86-3.06-1.87 0-2.16 1.46-2.16 2.96V18h-2.86V10Z"/>
      </svg>
    `
  };

  return icons[type] || icons.phone;
}

const portraitCards = [
  { id: 'portrait-joana-1', image: 'images/portrait-joana-1.jpg', alt: 'Joana Mendoza portrait one', label: 'Portrait one'},
  { id: 'portrait-joana-2', image: 'images/portrait-joana-2.jpg', alt: 'Joana Mendoza portrait two', label: 'Portrait two'},
  { id: 'portrait-joana-3', image: 'images/portrait-joana-3.jpg', alt: 'Joana Mendoza portrait three', label: 'Portrait three'}
];

const skillToolsConfig = {
  'microsoft-office': ['Word', 'Excel', 'PowerPoint'],
  'google-workspace': ['Docs', 'Sheets', 'Slides'],
  'data-entry': ['Typing', 'Forms', 'Accuracy'],
  'data-analysis-visualization': ['Excel', 'SQL', 'Tableau', 'Power BI'],
  'editing-design': ['Photoshop', 'Canva', 'Figma'],
  'basic-programming': ['HTML', 'CSS', 'JavaScript'],
  'ui-ux': ['Figma', 'Prototyping', 'Wireframes'],
  'troubleshooting': ['Windows', 'Networking', 'Support'],
  'architecture': ['Planning', 'Systems', 'Documentation'],
  'social-media': ['Content', 'Branding', 'Engagement'],
  'research': ['Search', 'Analysis', 'Summaries'],
  'adaptable': ['Learning', 'Growth', 'Adaptability'],
  'teamwork': ['Collaboration', 'Listening', 'Feedback'],
  'time-management': ['Planning', 'Focus', 'Scheduling'],
  'problem-solving': ['Debugging', 'Logic', 'Solutions']
};

const credentialLinks = [
  { label: 'Credly', value: 'Certificates & badges', href: 'https://www.credly.com/users/joanamay-mendoza-it.f2052220'},
  { label: 'Google Drive', value: 'Portfolio docs', href: 'https://drive.google.com/'},
  { label: 'LinkedIn', value: 'Professional profile', href: 'https://www.linkedin.com/in/joana-may-mendoza-8800bb412'}
];

function renderContactLinks() {
  const container = document.getElementById('contact-list');

  if (!container) return;

  container.innerHTML = contactReferences
    .map((contact) => {
      const isExternal = contact.type !== 'phone' && contact.type !== 'email';
      const iconSvg = getContactIconSvg(contact.type);

      return `
        <a
          class="contact-card"
          href="${contact.href}"
          ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}
          aria-label="${contact.label}: ${contact.value}"
        >
          <span class="contact-icon" aria-hidden="true">${iconSvg}</span>
          <span class="contact-details">
            <span class="contact-label">${contact.label}</span>
            <span class="contact-value">${contact.value}</span>
          </span>
        </a>
      `;
    })
    .join('');
}

function renderCredentials() {
  const container = document.getElementById('credential-list');

  if (!container) return;

  const validLinks = credentialLinks.filter((link) => link.href && link.href.trim());

  container.innerHTML = validLinks
    .map((link) => `
      <a
        class="credential-link"
        href="${link.href}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="${link.label}: ${link.value}"
      >
        <span class="credential-label">${link.label}</span>
        <span class="credential-value">${link.value}</span>
      </a>
    `)
    .join('');
}

function getSkillTools(skillKey) {
  return skillToolsConfig[skillKey] || ['Tools'];
}

function setupSkillBadges() {
  const badges = document.querySelectorAll('.skill-badge');

  badges.forEach((badge) => {
    const skillKey = badge.dataset.skill || 'adaptable';
    const tools = getSkillTools(skillKey);

    const popover = document.createElement('span');
    popover.className = 'skill-popover';
    popover.setAttribute('aria-hidden', 'true');
    popover.innerHTML = tools
      .map((tool) => `<span class="tool-pill" title="${tool}" aria-label="${tool}">${tool}</span>`)
      .join('');

    badge.appendChild(popover);

    badge.addEventListener('click', () => {
      const isActive = badge.classList.contains('is-open');
      badges.forEach((item) => item.classList.remove('is-open'));
      if (!isActive) {
        badge.classList.add('is-open');
      }
    });

    badge.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        badge.click();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.skill-badge')) {
      badges.forEach((badge) => badge.classList.remove('is-open'));
    }
  });
}

function setupPortraitStack() {
  const stack = document.getElementById('portrait-stack');

  if (!stack) return;

  let portraitOrder = portraitCards.map((card) => card.id);

  function applyPortraitOrder() {
    const positions = ['is-front', 'is-middle', 'is-back'];
    portraitOrder.forEach((cardId, index) => {
      const card = stack.querySelector(`[data-card-id="${cardId}"]`);
      if (!card) return;

      card.classList.remove('is-front', 'is-middle', 'is-back');
      card.classList.add(positions[Math.min(index, positions.length - 1)]);
      card.style.zIndex = String(3 - index);
    });
  }

  const cards = portraitCards.map((card) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'portrait-card';
    button.dataset.cardId = card.id;
    button.setAttribute('aria-label', `${card.label}: ${card.alt}`);
    button.innerHTML = `<img src="${card.image}" alt="${card.alt}" loading="lazy">`;

    button.addEventListener('click', () => {
      const clicked = portraitOrder.indexOf(card.id);
      if (clicked === -1) return;
      const nextOrder = [...portraitOrder];
      const [selected] = nextOrder.splice(clicked, 1);
      nextOrder.unshift(selected);
      portraitOrder = nextOrder;
      applyPortraitOrder();
    });

    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        button.click();
      }
    });

    return button;
  });

  cards.forEach((card) => stack.appendChild(card));
  applyPortraitOrder();
}

function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = targetId ? document.querySelector(targetId) : null;

      if (!target) return;

      event.preventDefault();

      const headerHeight = document.querySelector('header')?.offsetHeight || 0;
      const y = target.getBoundingClientRect().top + window.scrollY - (headerHeight + 18);

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('is-active', active);
        });
      });
    },
    {
      rootMargin: '-25% 0px -55% 0px',
      threshold: [0.2]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

window.addEventListener('DOMContentLoaded', () => {
  renderContactLinks();
  renderCredentials();
  setupSkillBadges();
  setupPortraitStack();
  setupNavigation();
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
});
