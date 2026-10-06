/* =========================================================
   SITE SETTINGS: behaviour only. Content lives in the HTML.
   ========================================================= */
const CONFIG = {
  theme: "system",          // "system" | "light" | "dark"
  formEndpoint: "",         // optional URL that accepts a JSON POST from the contact form
  animate: ".card,.work-item,.row,.step,.case,.stats>div,.timeline article,details,.band,.cta-band,.sec-head,.section h2,.chips,.split>*,.article>*",
  plugins: ["themeToggle","mobileNav","scrollProgress","headerShrink","sideRail","reveal","counters","parallax","workFilter","contactForm","newsletter"]
};

/* Plugin system: add your own with Site.use('name', fn), then list it in CONFIG.plugins */
const Site = { plugins: {}, use(n, f){ this.plugins[n] = f; } };
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const setTheme = t => { document.documentElement.dataset.theme = t; try { localStorage.setItem("theme", t); } catch {} };

Site.use("themeToggle", () => {
  const b = $("#themeBtn"); if (!b) return;
  const paint = () => b.textContent = document.documentElement.dataset.theme === "dark" ? "☀" : "☾";
  paint(); b.onclick = () => { setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"); paint(); };
});
Site.use("mobileNav", () => {
  const b = $("#burger"), n = $("#nav"); if (!b) return;
  b.onclick = () => b.setAttribute("aria-expanded", n.classList.toggle("open"));
  $$("a", n).forEach(a => a.onclick = () => n.classList.remove("open"));
});
Site.use("scrollProgress", () => {
  const p = $("#progress"); if (!p) return;
  const f = () => p.style.width = (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100) + "%";
  addEventListener("scroll", f, { passive: true }); f();
});
Site.use("headerShrink", () => {
  const h = $(".site-header"); if (!h) return;
  const f = () => h.classList.toggle("small", scrollY > 30); addEventListener("scroll", f, { passive: true }); f();
});
/* Side rail: built from <section data-title="..."> */
Site.use("sideRail", () => {
  const secs = $$("section[data-title]"); if (secs.length < 2) return;
  const rail = document.createElement("nav"); rail.className = "rail"; rail.setAttribute("aria-label", "On this page");
  secs.forEach((s, i) => { s.id = s.id || "s" + i; rail.insertAdjacentHTML("beforeend", `<a href="#${s.id}" aria-label="${s.dataset.title}"><span>${s.dataset.title}</span></a>`); });
  document.body.append(rail);
  const links = $$("a", rail);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach((l, i) => l.classList.toggle("on", secs[i] === e.target)); }), { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach(s => io.observe(s));
});
/* Scroll reveal with staggered children */
Site.use("reveal", () => {
  if (calm) return;
  const els = $$(CONFIG.animate); document.documentElement.classList.add("js");
  els.forEach(el => { el.setAttribute("data-anim", ""); el.style.transitionDelay = (([...el.parentNode.children].indexOf(el)) % 4) * 90 + "ms"; });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  els.forEach(el => io.observe(el));
});
/* Count-up numbers: <b data-count="150" data-suffix="+"> */
Site.use("counters", () => {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now();
    const tick = t => { const k = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(tick); };
    calm ? el.textContent = end + suf : requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$("[data-count]").forEach(el => io.observe(el));
});
/* Gentle parallax: add data-parallax="0.08" to any image wrapper */
Site.use("parallax", () => {
  const els = $$("[data-parallax]"); if (!els.length || calm) return;
  addEventListener("scroll", () => els.forEach(el => el.style.translate = `0 ${scrollY * (+el.dataset.parallax || .08) * -1}px`), { passive: true });
});
Site.use("workFilter", () => {
  const chips = $$("[data-filter]"); if (!chips.length) return;
  chips.forEach(c => c.onclick = () => {
    chips.forEach(x => x.classList.toggle("on", x === c));
    $$("[data-cat]").forEach(i => i.hidden = c.dataset.filter !== "all" && i.dataset.cat !== c.dataset.filter);
  });
});
/* Contact form: posts JSON to CONFIG.formEndpoint, otherwise opens an email draft to data-email */
Site.use("contactForm", () => {
  const f = $("#contact-form"); if (!f) return;
  f.onsubmit = async e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(f)), note = $("#form-note");
    if (CONFIG.formEndpoint) {
      try { await fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(d) }); note.textContent = "Message sent. We reply within 2 working days."; f.reset(); }
      catch { note.textContent = "Could not send. Please email us directly."; }
    } else {
      location.href = `mailto:${f.dataset.email}?subject=${encodeURIComponent("Enquiry from " + d.name)}&body=${encodeURIComponent(`${d.message}\n\nService: ${d.service}\nBudget: ${d.budget}\nEmail: ${d.email}`)}`;
      note.textContent = "Your email app should open with the message ready to send.";
    }
  };
});
Site.use("newsletter", () => {
  const f = $("#newsletter"); if (f) f.onsubmit = e => { e.preventDefault(); $("#news-note").textContent = "Subscribed. Connect your email service in script.js."; f.reset(); };
});

document.addEventListener("DOMContentLoaded", () => CONFIG.plugins.forEach(n => Site.plugins[n] && Site.plugins[n]()));
