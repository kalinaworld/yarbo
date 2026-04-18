// Weather & clock — Yulan, NY (41.4726° N, 74.8218° W)
const YULAN_LAT = 41.4726, YULAN_LON = -74.8218, YULAN_TZ = 'America/New_York';

function updateClock() {
  const el = document.getElementById('weather-time');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString('en-US', {
    timeZone: YULAN_TZ, hour: 'numeric', minute: '2-digit'
  });
}

async function fetchWeather() {
  const el = document.getElementById('weather-temp');
  if (!el) return;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${YULAN_LAT}&longitude=${YULAN_LON}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`;
    const data = await fetch(url).then(r => r.json());
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    const icon = weatherIcon(code);
    el.textContent = `${icon} ${temp}°F`;
  } catch {
    el.textContent = '';
  }
}

function weatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code <= 3) return '☁️';
  if (code <= 49) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}

updateClock();
fetchWeather();
setInterval(updateClock, 60_000);
setInterval(fetchWeather, 15 * 60_000);

// Dark mode toggle
const darkToggle = document.getElementById('dark-toggle');
const themeLink = document.getElementById('theme-css');

function setDark(isDark) {
  themeLink.href = isDark ? 'css/theme-dark.css' : '';
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('hy-dark', isDark ? '1' : '');
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedDark = localStorage.getItem('hy-dark');
const startDark = savedDark !== null ? savedDark === '1' : prefersDark;
setDark(startDark);

darkToggle.addEventListener('click', () => {
  setDark(!document.documentElement.classList.contains('dark'));
});

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
