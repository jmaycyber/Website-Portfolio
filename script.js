const portraitCards = [
  {
    id: 'portrait-1',
    image: 'images/portrait-joana-1.jpg',
    alt: 'Joana Mendoza portrait photo',
    label: 'Portrait one'
  },
  {
    id: 'portrait-2',
    image: 'images/portrait-joana-2.jpg',
    alt: 'Joana Mendoza portrait photo',
    label: 'Portrait two'
  },
  {
    id: 'portrait-3',
    image: 'images/portrait-joana-3.jpg',
    alt: 'Joana Mendoza portrait photo',
    label: 'Portrait three'
  }
];

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

function setupPortraitStack() {
  const stack = document.getElementById('portrait-stack');
  if (!stack) return;

  let order = portraitCards.map((card) => card.id);

  function applyOrder() {
    const classes = ['is-front', 'is-middle', 'is-back'];
    order.forEach((cardId, index) => {
      const card = stack.querySelector(`[data-card-id="${cardId}"]`);
      if (!card) return;

      card.classList.remove('is-front', 'is-middle', 'is-back');
      card.classList.add(classes[Math.min(index, classes.length - 1)]);
      card.style.zIndex = String(3 - index);
    });
  }

  portraitCards.forEach((card) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'portrait-card';
    button.dataset.cardId = card.id;
    button.setAttribute('aria-label', card.label);
    button.innerHTML = `<img src="${card.image}" alt="${card.alt}" loading="lazy">`;

    button.addEventListener('click', () => {
      const index = order.indexOf(card.id);
      if (index === -1) return;

      const next = [...order];
      const [selected] = next.splice(index, 1);
      next.unshift(selected);
      order = next;
      applyOrder();
    });

    stack.appendChild(button);
  });

  applyOrder();
}

function setYear() {
  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setupMenu();
  setupNavigationState();
  setupPortraitStack();
  setYear();
});
