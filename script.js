/* Simple interactive behavior:
   - Mobile hamburger toggle
   - 3D tilt for .tilt-card elements (mouse move)
   - Keyboard focus effect (accessibility)
*/

document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.setAttribute('aria-hidden', String(expanded));
      mobileMenu.classList.toggle('open');
    });
  }

  // TILT EFFECT
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    // Mouse move for 3D tilt (desktop & tablet)
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // relative mouse position [-1,1]
      const rx = (e.clientX - cx) / (rect.width/2);
      const ry = (e.clientY - cy) / (rect.height/2);
      const maxTilt = 10; // degrees
      const rotateY = rx * maxTilt; // horizontal movement -> rotateY
      const rotateX = -ry * maxTilt; // vertical movement -> rotateX
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
      card.classList.add('tilt-active');
    };

    const handleMouseLeave = () => {
      card.style.transform = '';
      card.classList.remove('tilt-active');
    };

    // Add listeners only if pointer supports hover
    // This avoids noisy behavior on touch-only devices.
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    } else {
      // Touch fallback: tap to toggle scale effect
      let tapped = false;
      card.addEventListener('touchstart', () => {
        card.style.transform = 'scale(1.02) translateZ(0)';
        setTimeout(()=>{ card.style.transform = ''; }, 600);
      }, {passive:true});
    }

    // Keyboard focus: gently raise card on focus
    card.addEventListener('focus', () => {
      card.style.transform = 'translateZ(15px) scale(1.02)';
    });
    card.addEventListener('blur', () => {
      card.style.transform = '';
    });
  });

  // Optional: close mobile menu on link click
  document.querySelectorAll('.mobile-nav a').forEach(a => {
    a.addEventListener('click', () => {
      if (mobileMenu && hamburger) {
        mobileMenu.setAttribute('aria-hidden','true');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded','false');
      }
    });
  });
});
