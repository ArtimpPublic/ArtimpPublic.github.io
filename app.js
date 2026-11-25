/* ==========================================================================
   ARTIMP PUBLICIDAD CALI — V2.0 Interactive UI & Custom Quote Engine
   ========================================================================== */

(() => {
  const WHATSAPP_NUMBER = '573167283557';

  // 1. Mobile Navigation Drawer
  const menuBtn = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (menuBtn && drawer) {
    const toggleDrawer = (force) => {
      const isOpen = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
      drawer.classList.toggle('open', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    };
    menuBtn.addEventListener('click', () => toggleDrawer());
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleDrawer(false));
    });
  }

  // 2. Portfolio Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const showcaseCards = document.querySelectorAll('.showcase-card');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      showcaseCards.forEach((card) => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  // 3. Custom Quote Builder (Line + Services + Details -> WhatsApp)
  const lineBtns = document.querySelectorAll('.line-pill-btn');
  const chips = document.querySelectorAll('.quote-chip');
  const summaryEl = document.getElementById('quoteSummaryText');
  const sendBtn = document.getElementById('sendQuoteBtn');
  const bizInput = document.getElementById('bizName');
  const cityInput = document.getElementById('bizCity');
  const specInput = document.getElementById('bizSpecs');

  let activeLine = 'Línea Comercial Estándar';

  const refreshSummary = () => {
    const selected = [];
    chips.forEach((chip) => {
      if (chip.classList.contains('selected')) {
        selected.push(chip.dataset.name);
      }
    });
    if (summaryEl) {
      summaryEl.textContent =
        selected.length > 0
          ? `${selected.length} ${selected.length === 1 ? 'servicio seleccionado' : 'servicios seleccionados'} · ${activeLine}`
          : `Selecciona 1 o más productos · ${activeLine}`;
    }
    return selected;
  };

  lineBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      lineBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeLine = btn.dataset.line;
      refreshSummary();
    });
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      refreshSummary();
    });
  });

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const selected = refreshSummary();
      const biz = (bizInput?.value || '').trim();
      const city = (cityInput?.value || '').trim() || 'Cali';
      const specs = (specInput?.value || '').trim();

      const itemsText =
        selected.length > 0
          ? selected.map((n) => `• ${n}`).join('\n')
          : '• Asesoría personalizada para mi negocio';

      let msg = `¡Hola ARTIMP! Quiero solicitar una cotización personalizada desde su página web:\n\n`;
      msg += `*Línea de acabado:* ${activeLine}\n`;
      if (biz) msg += `*Negocio / Marca:* ${biz}\n`;
      msg += `*Ubicación:* ${city}\n`;
      if (specs) msg += `*Medidas / Cantidad aprox.:* ${specs}\n`;
      msg += `\n*Productos de interés:*\n${itemsText}\n\n¿Me regalan asesoría y cotización?`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }

  refreshSummary();

  // 4. Subtle 3D Tilt on Hero Frame (desktop pointer only)
  const heroFrame = document.getElementById('heroFrame');
  if (heroFrame && window.matchMedia('(pointer: fine)').matches) {
    heroFrame.addEventListener('mousemove', (e) => {
      const rect = heroFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroFrame.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 4}deg)`;
    });
    heroFrame.addEventListener('mouseleave', () => {
      heroFrame.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  }

  // 5. Scroll Reveal Observer
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }
})();
