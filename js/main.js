// Sticky header style on scroll
const header = document.getElementById('site-header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Contact form — simple client-side handling (wire to backend/Formspree later)
const form = document.getElementById('contact-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const name = form.querySelector('#name').value.trim();

  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Simulated submission delay — replace with fetch() to a real endpoint
  setTimeout(() => {
    btn.textContent = `Thanks, ${name || 'friend'}! We'll be in touch soon.`;
    btn.style.background = '#52B788';
    form.querySelectorAll('input, textarea').forEach(el => el.value = '');
  }, 900);
});

// Subtle fade-in on scroll for sections
const observer = new IntersectionObserver(
  entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
  { threshold: 0.12 }
);

document.querySelectorAll('.section').forEach(s => {
  s.style.opacity = '0';
  s.style.transform = 'translateY(20px)';
  s.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  observer.observe(s);
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.section.visible, .section').forEach(s => {
    s.style.opacity = '1';
    s.style.transform = 'none';
  });
});

// Add .visible styles via JS (avoids needing extra CSS class)
const style = document.createElement('style');
style.textContent = '.section.visible { opacity: 1 !important; transform: none !important; }';
document.head.appendChild(style);
