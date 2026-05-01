// Weather & clock — Eldred, NY (41.5001° N, 74.8673° W)
const YULAN_LAT = 41.5001, YULAN_LON = -74.8673, YULAN_TZ = 'America/New_York';

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

// Dark mode — always on
document.getElementById('theme-css').href = 'css/theme-dark.css';
document.documentElement.classList.add('dark');

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

// Contact form — sends to Frank via Formsubmit.co (no backend needed)
const form = document.getElementById('contact-form');
if (form) form.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const name    = form.querySelector('#name').value.trim();
  const email   = form.querySelector('#email').value.trim();
  const phone   = form.querySelector('#phone').value.trim();
  const message = form.querySelector('#message').value.trim();

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch('https://formsubmit.co/ajax/monte1@hvc.rr.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name, email, phone, message,
        _subject: `New Yarbo Catskills inquiry from ${name || 'website visitor'}`,
        _captcha: 'false'
      })
    });
    const data = await res.json();
    if (data.success === 'true' || data.success === true) {
      btn.textContent = `Thanks, ${name || 'friend'}! We'll be in touch soon.`;
      btn.style.background = '#52B788';
      form.querySelectorAll('input, textarea').forEach(el => el.value = '');
    } else {
      throw new Error('Submission failed');
    }
  } catch {
    btn.textContent = 'Something went wrong — please email frank@yarbocatskills.com';
    btn.style.background = '#c0392b';
    btn.disabled = false;
  }
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
