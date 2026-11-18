  /* ============================================================
     1) DATOS DE CONTACTO — edita solo este bloque.
     El teléfono se muestra tal cual; whatsapp va sin "+" ni espacios.
     ============================================================ */
  const CONTACT = {
    phoneDisplay: "+58 414 123 4567",
    phoneRaw: "+584141234567",
    whatsapp: "584141234567",
    email: "hola@jef.com"
  };

  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  /* ---------- 2) Aplicar datos de contacto en toda la página ---------- */
  document.querySelectorAll('[data-contact="phone"]').forEach(el => {
    el.textContent = CONTACT.phoneDisplay;
  });
  document.querySelectorAll('[data-contact="phone-link"]').forEach(el => {
    el.setAttribute("href", "tel:" + CONTACT.phoneRaw);
  });
  document.querySelectorAll('[data-contact="email"]').forEach(el => {
    el.textContent = CONTACT.email;
  });
  document.querySelectorAll('[data-contact="email-link"]').forEach(el => {
    el.setAttribute("href", "mailto:" + CONTACT.email);
  });
  document.querySelectorAll('[data-contact="whatsapp-link"]').forEach(el => {
    const text = el.dataset.waText || "Hola, me gustaría pedir un presupuesto de transporte.";
    el.setAttribute("href", "https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(text));
  });
  document.querySelectorAll('[data-contact="year"]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 3) Saludo según la hora del dispositivo ---------- */
  const saludoEl = document.getElementById("saludo");
  if (saludoEl) {
    const h = new Date().getHours();
    // 6:00–11:59 → buenos días · 12:00–18:59 → buenas tardes · resto → buenas noches
    const saludo = h < 6 ? "Buenas noches." : h < 12 ? "Buenos días." : h < 19 ? "Buenas tardes." : "Buenas noches.";
    saludoEl.textContent = saludo + " Tu transporte,";
  }
  /* ---------- 4) Menú móvil ---------- */
  const navToggle = $("#navToggle");
  const mobileNav = $("#mobileNav");
  const setMenu = (open) => {
    mobileNav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  navToggle.addEventListener("click", () => setMenu(!mobileNav.classList.contains("is-open")));
  mobileNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
      setMenu(false);
      navToggle.focus();
    }
  });

  /* ---------- 5) Revelado suave al entrar en pantalla ---------- */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Función reutilizable: las tarjetas del catálogo se inyectan después y también hay que revelarlas.
  const observarRevelados = (raiz = document) => {
    const items = raiz.querySelectorAll(".reveal:not(.is-visible)");
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach((el, i) => {
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
      io.observe(el);
    });
  };
  observarRevelados();

  /* ---------- 7) Botón "Volver arriba" ---------- */
  const toTop = $("#toTop");
  if (toTop) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        document.documentElement.classList.toggle("scrolled", window.scrollY > 300);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // estado correcto si la página carga a mitad de scroll
    toTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
  }

  /* ---------- 6) Formulario sin servidor: WhatsApp / email ---------- */
  const form = $("#quoteForm");
  const success = $("#formSuccess");
  const waSend = $("#waSend");
  const mailSend = $("#mailSend");
  const editRequest = $("#editRequest");
  const dateInput = $("#fecha");

  if (dateInput) {
    const today = new Date();
    const iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = iso;
  }

  const val = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };
  const prettyDate = (value) => {
    if (!value) return "";
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
  };

  const buildMessage = (data) => {
    const lines = [
      `Hola, soy ${data.nombre}. Quiero un presupuesto de ${data.servicio}.`,
      `Origen: ${data.origen}`,
      `Destino: ${data.destino}`
    ];
    if (data.fecha) lines.push(`Fecha: ${prettyDate(data.fecha)}`);
    if (data.detalle) lines.push(`Personas o bultos: ${data.detalle}`);
    if (data.notas) lines.push(`Detalles: ${data.notas}`);
    lines.push(`Teléfono de contacto: ${data.telefono}`);
    return lines.join("\n");
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = {
      nombre: val("nombre"),
      telefono: val("telefono"),
      servicio: val("servicio"),
      origen: val("origen"),
      destino: val("destino"),
      fecha: val("fecha"),
      detalle: val("detalle"),
      notas: val("notas")
    };

    const message = buildMessage(data);
    const waUrl = "https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(message);
    const mailUrl = "mailto:" + CONTACT.email
      + "?subject=" + encodeURIComponent("Presupuesto de transporte · " + data.servicio)
      + "&body=" + encodeURIComponent(message);

    waSend.href = waUrl;
    mailSend.href = mailUrl;

    form.hidden = true;
    success.hidden = false;
    success.focus({ preventScroll: true });
    success.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });

    // Abrimos WhatsApp como acción principal (el panel queda como alternativa).
    window.open(waUrl, "_blank", "noopener");
  });

  editRequest?.addEventListener("click", () => {
    success.hidden = true;
    form.hidden = false;
    $("#nombre").focus();
  });

  /* ---------- 8) Catálogo desde datos/*.json ----------
     Para añadir una unidad: edita datos/maquinaria.json o datos/conductores.json.
     Las unidades retiradas se marcan "disponible": false (nunca se borran). */
  const CAMPOS_OBLIGATORIOS = ["id", "nombre", "foto", "alt", "capacidad", "detalle"];

  const escapar = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  // Aviso con botón de WhatsApp: la sección nunca queda en blanco.
  const avisoCatalogo = (texto) => {
    const p = document.createElement("p");
    p.className = "catalogo-aviso";
    const a = document.createElement("a");
    a.href = "https://wa.me/" + CONTACT.whatsapp + "?text=" +
      encodeURIComponent("Hola, quiero información sobre maquinaria y transportes.");
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "Escríbenos por WhatsApp";
    p.append(texto + " ", a, " y te enviamos la información.");
    return p;
  };

  // Si la foto todavía no existe, se ve un recuadro gris en vez del icono de imagen rota.
  const marcarFotoPendiente = (img) => {
    img.addEventListener("error", () => {
      const caja = document.createElement("div");
      caja.className = "foto-pendiente";
      caja.textContent = "Foto pendiente";
      img.replaceWith(caja);
    }, { once: true });
  };

  const tarjetaMaquinaria = (u, i) => `
    <article class="card reveal" id="${escapar(u.id)}">
      <div class="card-media">
        <img src="${escapar(u.foto)}" alt="${escapar(u.alt || u.nombre)}" width="640" height="480"${i === 0 ? "" : ' loading="lazy"'} decoding="async">
      </div>
      <div class="card-body">
        <h3>${escapar(u.nombre)}</h3>
        <p>${escapar(u.detalle)}</p>
        <span class="card-meta">${escapar(u.capacidad)}</span>
        <a class="btn btn-secondary btn-sm" href="index.html#presupuesto">
          Solicitar información
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13m0 0-5-5m5 5-5 5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </article>`;

  const tarjetaEquipo = (u, i) => `
    <article class="card card--team reveal" id="${escapar(u.id)}">
      <img class="avatar-photo" src="${escapar(u.foto)}" alt="${escapar(u.alt || u.nombre)}" width="200" height="200"${i === 0 ? "" : ' loading="lazy"'} decoding="async">
      <h3>${escapar(u.nombre)}</h3>
      <p class="team-role">${escapar(u.capacidad)}</p>
      <p class="team-bio">${escapar(u.detalle)}</p>
    </article>`;

  async function cargarCatalogo() {
    const contenedores = document.querySelectorAll("[data-catalogo]");
    if (!contenedores.length) return;

    await Promise.all(Array.from(contenedores).map(async (cont) => {
      const esEquipo = cont.dataset.tipo === "equipo";
      cont.setAttribute("aria-busy", "true");
      try {
        const respuesta = await fetch(cont.dataset.catalogo, { cache: "no-cache" });
        if (!respuesta.ok) throw new Error("HTTP " + respuesta.status);
        const datos = await respuesta.json();
        const lista = Array.isArray(datos) ? datos : (datos.unidades || datos.conductores || []);
        if (!Array.isArray(lista)) throw new Error("formato inesperado");

        // Una entrada incompleta se descarta; si no queda ninguna, salta el aviso.
        const visibles = lista
          .filter(u => u && u.disponible !== false &&
            CAMPOS_OBLIGATORIOS.every(c => typeof u[c] === "string" && u[c].trim() !== ""))
          .sort((a, b) => (Number(a.orden) || 99) - (Number(b.orden) || 99));

        if (!visibles.length) throw new Error("sin unidades disponibles");

        cont.innerHTML = visibles.map(esEquipo ? tarjetaEquipo : tarjetaMaquinaria).join("");
        cont.querySelectorAll("img").forEach(marcarFotoPendiente);
        observarRevelados(cont);
      } catch (error) {
        console.warn("No se pudo cargar " + cont.dataset.catalogo, error);
        cont.replaceChildren(avisoCatalogo("No pudimos cargar el catálogo ahora mismo."));
      } finally {
        cont.removeAttribute("aria-busy");
      }
    }));
  }

  cargarCatalogo();
