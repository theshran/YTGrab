/* =========================================================
   YTGrab — main.js
   Theme toggle, mobile nav, language dropdown, FAQ accordion,
   and a placeholder download flow to wire up to a real backend.
   ========================================================= */

const THEME_STORAGE_KEY = "ytgrab-theme";

function initTheme(){
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  const toggle = document.querySelector(".theme-toggle");
  if (toggle){
    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_STORAGE_KEY, next);
    });
  }
}

function initMobileNav(){
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (!menuToggle || !nav) return;
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => nav.classList.remove("open"));
  });
}

function initLangDropdown(){
  const btn = document.querySelector(".lang-btn");
  const menu = document.querySelector(".lang-menu");
  if (!btn || !menu) return;
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });
  document.addEventListener("click", () => menu.classList.remove("open"));
  menu.addEventListener("click", (e) => e.stopPropagation());
}

function initFaqAccordion(){
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      // close siblings for a clean single-open accordion
      item.parentElement.querySelectorAll(".faq-item.open").forEach(other => {
        if (other !== item){
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      item.classList.toggle("open", !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + "px" : null;
    });
  });
}

function initFooterYear(){
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* -----------------------------------------------------------
   Demo download flow.
   This is a FRONTEND-ONLY placeholder. Replace fetchVideoInfo()
   with a real call to your backend (e.g. a Cloudflare Worker
   that runs yt-dlp on a VPS and returns available formats).
   ----------------------------------------------------------- */

function isLikelyYoutubeUrl(value){
  return /youtu\.?be/i.test(value.trim());
}

async function fetchVideoInfo(url){
  // TODO: replace with a real API call, e.g.:
  // const res = await fetch("https://api.yourdomain.com/resolve", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ url })
  // });
  // return res.json();

  await new Promise(r => setTimeout(r, 900)); // simulate network latency
  return {
    title: "Sample video title",
    duration: "3:32",
    formats: [
      { label: "MP4", quality: "1080p", size: "48 MB" },
      { label: "MP4", quality: "360p", size: "12 MB" },
      { label: "MP3", quality: "Audio", size: "3 MB" },
    ],
  };
}

function renderResult(info){
  const box = document.querySelector(".result-box");
  if (!box) return;

  const formatsHtml = info.formats.map(f => `
    <div class="format-option">
      <span><span class="format-tag">${f.label}</span>${f.quality} · ${f.size}</span>
      <button type="button" class="icon-btn" aria-label="Download ${f.label} ${f.quality}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>
      </button>
    </div>
  `).join("");

  box.innerHTML = `
    <div class="result-thumb">
      <div class="thumb-ph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 5v14l11-7z"/></svg></div>
      <div>
        <div style="font-weight:650;">${info.title}</div>
        <div style="font-size:.85rem;color:var(--color-text-muted);">${info.duration}</div>
      </div>
    </div>
    ${formatsHtml}
  `;
  box.classList.add("show");
}

function initDownloadForm(){
  const form = document.querySelector("#downloader-form");
  if (!form) return;
  const input = form.querySelector("input[type='url'], input[type='text']");
  const button = form.querySelector("button[type='submit']");
  const label = button ? button.querySelector(".btn-label") : null;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = input.value.trim();
    if (!url){
      input.focus();
      return;
    }
    if (!isLikelyYoutubeUrl(url)){
      input.setCustomValidity("Paste a valid YouTube link");
      input.reportValidity();
      return;
    }
    input.setCustomValidity("");

    button.classList.add("is-loading");
    button.disabled = true;
    const dict = (window.I18N && I18N[getCurrentLang()]) || {};
    if (label) label.textContent = dict.btn_fetching || "Fetching…";

    try{
      const info = await fetchVideoInfo(url);
      renderResult(info);
    } finally {
      button.classList.remove("is-loading");
      button.disabled = false;
      if (label) label.textContent = dict.btn_download || "Download";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  initLangDropdown();
  initFaqAccordion();
  initFooterYear();
  initDownloadForm();
});
