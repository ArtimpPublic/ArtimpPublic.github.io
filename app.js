/* ==========================================================================
   ARTIMP PUBLICIDAD CALI — Interactive UI & WhatsApp Quote Engine
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

  // 3. Interactive Quote Builder -> WhatsApp
  const chips = document.querySelectorAll('.quote-chip');
  const totalEl = document.getElementById('quoteTotal');
  const sendBtn = document.getElementById('sendQuoteBtn');
  const bizInput = document.getElementById('bizName');
  const cityInput = document.getElementById('bizCity');

  const formatCOP = (val) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);

  const updateQuote = () => {
    let total = 0;
    const selectedNames = [];
    chips.forEach((chip) => {
      if (chip.classList.contains('selected')) {
        total += Number(chip.dataset.price || 0);
        selectedNames.push(chip.dataset.name);
      }
    });
    if (totalEl) {
      totalEl.textContent = total > 0 ? `Desde ${formatCOP(total)}` : 'Selecciona 1 o más servicios';
    }
    return { total, selectedNames };
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      updateQuote();
    });
  });

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const { total, selectedNames } = updateQuote();
      const biz = (bizInput?.value || '').trim();
      const city = (cityInput?.value || '').trim() || 'Cali';
      const itemsText =
        selectedNames.length > 0
          ? selectedNames.map((n) => `• ${n}`).join('\n')
          : '• Asesoría personalizada para mi negocio';
      const estText = total > 0 ? `\nReferencia estimada: ${formatCOP(total)} COP` : '';
      const bizText = biz ? `\nNegocio: ${biz}` : '';
      const msg = `¡Hola ARTIMP! Quiero cotizar lo siguiente desde su página web:${bizText}\nCiudad: ${city}\n\nServicios de interés:\n${itemsText}${estText}\n\n¿Me comparten tiempos de entrega y disponibilidad?`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  updateQuote();

  // 4. Subtle 3D Tilt on Hero Frame (desktop pointer only)
  const heroFrame = document.getElementById('heroFrame');
  if (heroFrame && window.matchMedia('(pointer: fine)').matches) {
    heroFrame.addEventListener('mousemove', (e) => {
      const rect = heroFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroFrame.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 5}deg)`;
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
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }
})();
