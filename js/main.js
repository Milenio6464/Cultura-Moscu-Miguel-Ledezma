(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const link = (href, text, cls = "src-link") =>
    `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}&nbsp;↗</a>`;

  /* ---------- Nav + timeline ---------- */
  const nav = $("#navDates");
  const tl = $("#timelineList");
  CHAPTERS.forEach((c) => {
    nav.appendChild(el("a", "", c.id)).href = "#ch-" + c.id;
    const li = el("li", "", `<a href="#ch-${c.id}"><span class="tl-dot"></span><b>${c.id}</b><em>${esc(TIMELINE_NOTES[c.id])}</em></a>`);
    li.dataset.id = c.id;
    tl.appendChild(li);
  });

  /* ---------- Chapters ---------- */
  const wrap = $("#chapters");
  CHAPTERS.forEach((c, i) => {
    const evLink = c.ev.link || P(c.ev.file);
    const sec = el("section", `chapter layout-${c.layout}`);
    sec.id = "ch-" + c.id;
    sec.dataset.state = "synthetic";

    sec.innerHTML = `
      <div class="syn">
        <figure class="recon">
          <img src="${c.ai}" alt="Синтетическая реконструкция, созданная ИИ: ${esc(c.title)}" loading="lazy">
          <span class="label label-ai">Реконструкция, созданная ИИ, — не проверена</span>
          <button class="hotspot" style="left:${c.hs[0]}%;top:${c.hs[1]}%" aria-label="Открыть подлинный документ: ${esc(c.title)}">
            <span class="hs-core"></span><span class="hs-tip">открыть подлинный документ →</span>
          </button>
        </figure>
        <div class="syn-card">
          <p class="period">${esc(c.period)}</p>
          <h2 class="ch-title">${esc(c.title)}</h2>
          <p class="fake">${esc(c.fake)}</p>
          <p class="hint">один предмет на этом изображении помнит иначе — присмотритесь…</p>
        </div>
      </div>

      <div class="rec" aria-hidden="true">
        <div class="rec-bg"><img src="${c.ai}" alt="" loading="lazy"></div>
        <div class="rec-top">
          <figure class="evidence">
            <p class="kicker red-light">ПОДЛИННОЕ СВИДЕТЕЛЬСТВО</p>
            <img src="${C(c.ev.file)}" alt="${esc(c.ev.cap)}" loading="lazy">
            <figcaption><p>${esc(c.ev.cap)}</p>${link(evLink, c.ev.credit, "credit")}</figcaption>
          </figure>
          <article class="paper record">
            <span class="label label-verified">ПРОВЕРЕНО / ИСТОРИЧЕСКИЙ ДОКУМЕНТ</span>
            <p class="period dark">${esc(c.period)}</p>
            <h2 class="ch-title dark">${esc(c.title)}</h2>
            ${c.body.map((p) => `<p class="record-body">${esc(p)}</p>`).join("")}
            <p class="kicker red">КЛЮЧЕВЫЕ ДАТЫ</p>
            <dl class="key-dates">${c.dates.map(([d, t]) => `<div><dt>${esc(d)}</dt><dd>${esc(t)}</dd></div>`).join("")}</dl>
          </article>
        </div>

        <div class="more">
          <p class="kicker red-light">ДРУГИЕ СВИДЕТЕЛЬСТВА</p>
          <p class="more-lead">Одно изображение не исправит машину. Память складывается из многих документов — у каждого свой автор и своя дата.</p>
          <div class="more-grid n${c.more.length}">
            ${c.more.map((m) => `
              <figure>
                <img src="${C(m.file, 1000)}" alt="${esc(m.cap)}" loading="lazy">
                <figcaption><p>${esc(m.cap)}</p>${link(P(m.file), m.credit, "credit")}</figcaption>
              </figure>`).join("")}
          </div>
        </div>

        <div class="paper verdict">
          <figure class="machine">
            <img src="${c.ai}" alt="Версия машины" loading="lazy">
            <figcaption>✕&nbsp;&nbsp;ВЕРСИЯ МАШИНЫ — НЕ ПРОВЕРЕНА</figcaption>
          </figure>
          <div class="verdict-text">
            <p class="kicker red">В ЧЁМ ОШИБЛОСЬ ИЗОБРАЖЕНИЕ</p>
            <p class="wrong">${esc(c.wrong)}</p>
            <div class="verdict-links">
              ${link(evLink, c.ev.credit)}
              ${c.more.map((m) => link(P(m.file), m.credit)).join("")}
            </div>
            <button class="btn btn-return" type="button"><span>ВЕРНУТЬСЯ К СИНТЕТИЧЕСКОЙ ВЕРСИИ</span><i>↺</i></button>
          </div>
        </div>
      </div>`;

    wrap.appendChild(sec);
    if (i < CHAPTERS.length - 1) {
      const t = el("div", "transition");
      t.setAttribute("aria-hidden", "true");
      wrap.appendChild(t);
    }
  });

  /* ---------- Reveal / return ---------- */
  const verified = new Set();
  const status = $("#archiveStatus");
  const updateStatus = () => {
    status.textContent = verified.size === 0
      ? "НЕ ПРОВЕРЕН"
      : `ПРОВЕРЕНО ${verified.size} / ${CHAPTERS.length}`;
    document.querySelectorAll("#timelineList li").forEach((li) =>
      li.classList.toggle("done", verified.has(li.dataset.id)));
    document.querySelectorAll("#navDates a").forEach((a) =>
      a.classList.toggle("done", verified.has(a.textContent)));
  };

  const setState = (sec, state) => {
    sec.dataset.state = state;
    $(".syn", sec).setAttribute("aria-hidden", state === "record");
    $(".rec", sec).setAttribute("aria-hidden", state !== "record");
    if (state === "record") verified.add(sec.id.slice(3));
    updateStatus();
    const top = sec.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
  };

  wrap.addEventListener("click", (e) => {
    const hs = e.target.closest(".hotspot");
    if (hs) return setState(hs.closest(".chapter"), "record");
    const back = e.target.closest(".btn-return");
    if (back) return setState(back.closest(".chapter"), "synthetic");
  });

  /* ---------- Active date in nav ---------- */
  const navLinks = [...document.querySelectorAll("#navDates a")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = en.target.id.slice(3);
      navLinks.forEach((a) => a.classList.toggle("active", a.textContent === id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll(".chapter").forEach((s) => io.observe(s));

  /* ---------- The eye ---------- */
  const eyeBtn = $("#eyeBtn");
  const finale = $("#eye");
  eyeBtn.addEventListener("click", () => {
    const open = !finale.classList.contains("open");
    finale.classList.toggle("open", open);
    eyeBtn.setAttribute("aria-pressed", open);
    eyeBtn.setAttribute("aria-label", open ? "Закрыть глаз" : "Открыть глаз");
  });

  /* ---------- Sources ---------- */
  $("#visualSources").innerHTML = VISUAL_SOURCES.map(([t, m, u]) =>
    `<div class="source-card"><p class="source-title">${esc(t)}</p>${link(u, m, "source-meta")}</div>`).join("");
  $("#historicalSources").innerHTML = HISTORICAL_SOURCES.map(([t, m, u]) =>
    `<div class="hist">${link(u, t, "hist-title")}<p class="hist-meta">${esc(m)}</p></div>`).join("");
})();
