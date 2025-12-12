const jokeEl = document.getElementById('joke');
const newJokeBtn = document.getElementById('newJoke');
const copyBtn = document.getElementById('copyBtn');
const sourceEl = document.getElementById('source');
const yearEl = document.getElementById('year');

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const FALLBACK = [
  "Why did the scarecrow win an award? Because he was outstanding in his field.",
  "I told my computer I needed a break, and now it won't stop sending me Kit Kat ads.",
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "I changed my password to 'incorrect'. So whenever I forget it, the computer will say 'Your password is incorrect.'"
];

function safeSetSource(text) {
  if (sourceEl) sourceEl.textContent = text;
}

function showLoading(isLoading) {
  if (!jokeEl) return;
  if (isLoading) {
    jokeEl.style.opacity = '0.7';
    jokeEl.textContent = 'Fetching a fresh joke...';
  } else {
    jokeEl.style.opacity = '1';
  }
}

function showJoke(text) {
  if (!jokeEl) return;
  jokeEl.style.transition = 'none';
  jokeEl.style.opacity = '0';
  jokeEl.style.transform = 'translateY(6px)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      jokeEl.textContent = text;
      jokeEl.style.transition = 'transform .32s ease, opacity .32s ease';
      jokeEl.style.opacity = '1';
      jokeEl.style.transform = 'translateY(0)';
    });
  });
}

async function fetchJoke() {
  showLoading(true);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch('https://official-joke-api.appspot.com/random_joke', {
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error();
    const data = await res.json();
    const text = data && (data.setup ? `${data.setup} ${data.punchline || ''}` : (data.joke || JSON.stringify(data)));

    showJoke(text);
    safeSetSource('Source: Official Joke API');
  } catch {
    const text = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
    showJoke(text);
    safeSetSource('Source: Local fallback');
  } finally {
    showLoading(false);
  }
}

function handleKeyActivate(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fetchJoke();
  }
}

if (newJokeBtn) {
  newJokeBtn.addEventListener('click', fetchJoke);
  newJokeBtn.addEventListener('keydown', handleKeyActivate);
}

async function copyCurrentJoke() {
  if (!jokeEl) return;
  const text = jokeEl.textContent || '';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      if (copyBtn) copyBtn.textContent = 'Copied!';
      setTimeout(() => { if (copyBtn) copyBtn.textContent = 'Copy'; }, 1400);
      return;
    } catch {}
  }

  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);

    if (ok) {
      if (copyBtn) copyBtn.textContent = 'Copied!';
      setTimeout(() => { if (copyBtn) copyBtn.textContent = 'Copy'; }, 1400);
    } else {
      if (copyBtn) copyBtn.textContent = 'Unable to copy';
      setTimeout(() => { if (copyBtn) copyBtn.textContent = 'Copy'; }, 1400);
    }
  } catch {
    if (copyBtn) copyBtn.textContent = 'Unable to copy';
    setTimeout(() => { if (copyBtn) copyBtn.textContent = 'Copy'; }, 1400);
  }
}

if (copyBtn) {
  copyBtn.addEventListener('click', copyCurrentJoke);
  copyBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      copyCurrentJoke();
    }
  });
}

window.addEventListener('load', () => {
  if (!jokeEl) {
    safeSetSource('Error: UI element #joke not found');
    return;
  }
  fetchJoke();
});
