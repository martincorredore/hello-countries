/* Hello, World — vanilla JavaScript, no local-data requests or build tools. */
(() => {
  'use strict';

  const countries = window.COUNTRIES;
  const ids = Object.keys(countries);
  const $ = (selector) => document.querySelector(selector);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const stage = $('#globe-stage');
  const panel = $('#country-panel');
  const home = { lat: 17, lng: -63, altitude: 1.85 };
  const assets = {
    three: 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js',
    earth: 'https://cdn.jsdelivr.net/npm/three-globe@2.44.0/example/img/earth-blue-marble.jpg',
    bump: 'https://cdn.jsdelivr.net/npm/three-globe@2.44.0/example/img/earth-topology.png',
    water: 'https://cdn.jsdelivr.net/npm/three-globe@2.44.0/example/img/earth-water.png',
    clouds: 'https://cdn.jsdelivr.net/gh/turban/webgl-earth@master/images/fair_clouds_4k.png',
    borders: 'https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@v5.1.2/geojson/ne_110m_admin_0_countries.geojson'
  };

  let globe, cloudMesh, keyLight, activeId = null, hoveredId = null;
  let rotationEnabled = !motion.matches;
  let flightFrame = 0, renderFrame = 0, lastFrame = 0, headlineAnimation;
  let priorFocus = null, clockFormatter = null, loading = false;
  let THREE;
  const notices = new Set();

  // Country controls are available before any network-dependent work begins.
  $('#destination-list').innerHTML = ids.map((id, index) => {
    const c = countries[id];
    return `<button class="destination" data-country="${id}" aria-label="Say hello to ${c.name}">
      <span class="number">0${index + 1}</span><span class="flag" aria-hidden="true">${c.flag}</span>
      <span><strong>${c.shortName || c.name}</strong><small>${c.region}</small></span><span class="destination-arrow" aria-hidden="true">↗</span>
    </button>`;
  }).join('');

  function announce(text) { $('#announcement').textContent = text; }

  function closeMenu() {
    $('#navigation').classList.remove('open');
    $('#menu-toggle').setAttribute('aria-expanded', 'false');
  }

  function theme(c) {
    const colors = c?.colors || ['#b7f5ce', '#162b30', '#10202d'];
    ['--primary', '--secondary', '--tertiary'].forEach((name, i) => document.body.style.setProperty(name, colors[i]));
    document.body.style.setProperty('--accent', c?.accent || '#b7f5ce');
  }

  function updateHeadline(c) {
    headlineAnimation?.cancel();
    const heading = $('#greeting');
    heading.textContent = c ? c.greeting : 'Hello World';
    if (!c) heading.insertAdjacentHTML('beforeend', '<span class="headline-dot">.</span>');
    heading.lang = c?.languageCode || 'en';
    $('#description').textContent = c?.description || 'A little curiosity can take you a long way.';
    $('#eyebrow').innerHTML = `<span></span> ${c ? `${c.region.toUpperCase()} · A NEW PERSPECTIVE` : 'ONE PLANET. ENDLESS CONNECTIONS.'}`;
    if (!motion.matches) headlineAnimation = heading.animate([
      { opacity: 0, transform: 'translateY(15px)', filter: 'blur(6px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }
    ], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }

  function updateTime() {
    const el = $('#local-time');
    if (!el || !clockFormatter) return;
    const now = new Date();
    el.textContent = clockFormatter.format(now);
    el.dateTime = now.toISOString();
  }

  function renderPanel(c) {
    const index = ids.indexOf(activeId);
    const next = ids[(index + 1) % ids.length];
    const info = (label, value, wide = false) => `<dl class="info-card${wide ? ' wide' : ''}"><dt>${label}</dt><dd>${value}</dd></dl>`;
    $('#panel-content').innerHTML = `
      <div class="country-identity"><span class="panel-flag" aria-hidden="true">${c.flag}</span><div><h2 id="panel-name">${c.name}</h2><p lang="${c.languageCode}">${c.greeting}</p></div></div>
      <div class="capital-time"><span>◷ &nbsp; Right now in ${c.capital}</span><time id="local-time"></time></div>
      <div class="info-grid">
        ${info('Capital', c.capital)}
        ${info('Population', `${c.population} <small>(${c.populationYear} est.)</small>`)}
        ${info('Currency', c.currency)}${info('Area', c.area)}
        ${info('Language(s)', c.languages, true)}${info('Time zone(s)', c.zones, true)}
      </div>
      <div class="hello-card"><div><p class="label">A HELLO GOES A LONG WAY</p><strong lang="${c.languageCode}">${c.hello}</strong><span class="pronunciation">/ ${c.pronunciation} /</span></div><button class="listen" id="listen" aria-label="Hear ${c.hello} pronounced" title="Hear the greeting"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Z M15 8a6 6 0 0 1 0 8 M18 5a10 10 0 0 1 0 14"/></svg></button></div>
      <div class="facts-heading"><h3>Five things to fall in love with</h3><span>Tap to discover ↘</span></div>
      <div class="facts">${c.facts.map((fact, i) => `<details class="fact" style="--i:${i}"><summary><span class="fact-icon" aria-hidden="true">${fact[0]}</span>${fact[1]}</summary><p>${fact[2]}</p></details>`).join('')}</div>
      <details class="source-details"><summary>Sources & a few helpful notes</summary><p>Population figures are approximate 2024 estimates. Time-zone rules can change. Borders follow Natural Earth and are shown for exploration.</p>
        <a href="https://data.worldbank.org/indicator/SP.POP.TOTL" target="_blank" rel="noopener noreferrer">World Bank</a>
        ${c.sources.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`).join('')}
        <p>Earth imagery: NASA / three-globe. Clouds: webgl-earth. Map: Natural Earth.</p>
      </details>
      <div class="panel-bottom"><span>0${index + 1} / 05 destinations</span><button data-country="${next}">Next stop: ${countries[next].shortName || countries[next].name} ↗</button></div>`;
    clockFormatter = new Intl.DateTimeFormat('en', { timeZone: c.timeZone, hour: '2-digit', minute: '2-digit', hour12: true });
    updateTime();
    panel.scrollTop = 0;
    $('#listen').disabled = !('speechSynthesis' in window);
    $('#listen').addEventListener('click', () => {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(c.hello);
      utterance.lang = c.languageCode;
      utterance.rate = 0.8;
      const voices = speechSynthesis.getVoices();
      utterance.voice = voices.find(v => v.lang === c.languageCode) || voices.find(v => v.lang.startsWith(c.languageCode.split('-')[0])) || null;
      utterance.onerror = () => announce(`Audio is unavailable. Pronunciation: ${c.pronunciation}.`);
      speechSynthesis.speak(utterance);
    });
  }

  function selectCountry(id, moveFocus = true) {
    if (!countries[id]) return;
    if (!activeId) priorFocus = document.activeElement;
    activeId = id;
    hoveredId = null;
    const c = countries[id];
    window.speechSynthesis?.cancel();
    document.body.classList.add('is-country');
    panel.inert = false;
    panel.setAttribute('aria-hidden', 'false');
    $('.destination-dock').inert = true;
    theme(c);
    updateHeadline(c);
    renderPanel(c);
    closeMenu();
    updateNavigation();
    setRotation(false);
    $('#scene-label').textContent = `${c.flag} ${c.name.toUpperCase()}`;
    $('#scene-detail').textContent = `${Math.abs(c.lat).toFixed(1)}° ${c.lat < 0 ? 'S' : 'N'} · ${Math.abs(c.lng).toFixed(1)}° ${c.lng < 0 ? 'W' : 'E'}`;
    updatePolygons();
    if (globe) {
      globe.htmlElementsData([{ lat: c.capitalLat, lng: c.capitalLng, name: c.capital }]);
      flyTo(c);
    }
    if (moveFocus) $('#close-panel').focus({ preventScroll: true });
    announce(`${c.greeting} Exploring ${c.name}. Capital: ${c.capital}. Country guide opened.`);
  }

  function goHome() {
    const wasCountry = Boolean(activeId);
    activeId = null;
    window.speechSynthesis?.cancel();
    document.body.classList.remove('is-country');
    if (wasCountry && panel.contains(document.activeElement)) {
      const target = priorFocus?.isConnected && !priorFocus.closest('.destination-dock') ? priorFocus : $('.brand');
      target.focus({ preventScroll: true });
    }
    panel.inert = true;
    panel.setAttribute('aria-hidden', 'true');
    $('.destination-dock').inert = false;
    theme(null);
    updateHeadline(null);
    closeMenu();
    updateNavigation();
    $('#scene-label').textContent = 'LIVE A LITTLE. EXPLORE A LOT.';
    $('#scene-detail').textContent = 'Your next hello is out there.';
    updatePolygons();
    globe?.htmlElementsData([]);
    flyTo(home);
    setRotation(!motion.matches);
    announce('Hello World. Back home. Choose a country to explore.');
  }

  function updateNavigation() {
    document.querySelectorAll('nav [data-country]').forEach(button => {
      const active = button.dataset.country === activeId;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('.nav-home').classList.toggle('active', !activeId);
    $('.nav-home').setAttribute('aria-pressed', String(!activeId));
  }

  function setRotation(enabled) {
    rotationEnabled = enabled;
    if (globe) globe.controls().autoRotate = enabled;
    $('#rotation').textContent = enabled ? 'Ⅱ' : '▷';
    $('#rotation').setAttribute('aria-pressed', String(enabled));
    $('#rotation').setAttribute('aria-label', `${enabled ? 'Pause' : 'Resume'} globe rotation`);
    $('#rotation').title = `${enabled ? 'Pause' : 'Resume'} globe rotation`;
  }

  // One cancellable flight prevents rapid selections from queuing camera moves.
  function flyTo(target) {
    cancelAnimationFrame(flightFrame);
    if (!globe) return;
    const to = { lat: target.lat, lng: target.lng, altitude: target.altitude };
    if (motion.matches) { globe.pointOfView(to); return; }
    const from = globe.pointOfView();
    const deltaLng = ((to.lng - from.lng + 540) % 360) - 180;
    const start = performance.now();
    const animate = (now) => {
      const t = Math.min(1, (now - start) / 2000);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      globe.pointOfView({
        lat: from.lat + (to.lat - from.lat) * ease,
        lng: from.lng + deltaLng * ease,
        altitude: from.altitude + (to.altitude - from.altitude) * ease
      });
      if (t < 1) flightFrame = requestAnimationFrame(animate);
    };
    flightFrame = requestAnimationFrame(animate);
  }

  function featureId(feature) { return feature?.properties?.ADM0_A3; }
  function rgba(hex, opacity) {
    return `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${opacity})`;
  }
  function polygonColor(feature) {
    const id = featureId(feature);
    if (id === activeId) return rgba(countries[id].colors[0], id === 'DEU' ? 0.5 : 0.24);
    if (id === hoveredId) return rgba(countries[id].accent, 0.2);
    return activeId ? 'rgba(0,0,0,0.17)' : 'rgba(0,0,0,0)';
  }
  function updatePolygons() {
    if (!globe) return;
    globe.polygonCapColor(polygonColor)
      .polygonAltitude(f => featureId(f) === activeId ? 0.012 : 0.001)
      .polygonStrokeColor(f => featureId(f) === activeId ? countries[activeId].accent : featureId(f) === hoveredId ? countries[hoveredId].accent : 'rgba(210,231,234,0.12)');
  }

  document.addEventListener('click', event => {
    const countryButton = event.target.closest('[data-country]');
    if (countryButton) selectCountry(countryButton.dataset.country);
    if (event.target.closest('[data-home], .brand, #close-panel')) { event.preventDefault(); goHome(); }
    if (!event.target.closest('.header')) closeMenu();
  });
  $('#menu-toggle').addEventListener('click', () => {
    const open = $('#navigation').classList.toggle('open');
    $('#menu-toggle').setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.matches('input,textarea,select,[contenteditable="true"]')) return;
    if (/^[1-5]$/.test(event.key)) { event.preventDefault(); selectCountry(ids[Number(event.key) - 1]); }
    if (event.key.toLowerCase() === 'h' || event.key === 'Escape') { event.preventDefault(); goHome(); }
  });
  $('#rotation').addEventListener('click', () => setRotation(!rotationEnabled));
  [['#zoom-in', 0.78], ['#zoom-out', 1.28]].forEach(([selector, factor]) => {
    $(selector).addEventListener('click', () => {
      if (!globe) return;
      cancelAnimationFrame(flightFrame);
      const pov = globe.pointOfView();
      globe.pointOfView({ ...pov, altitude: Math.max(0.18, Math.min(4, pov.altitude * factor)) }, motion.matches ? 0 : 350);
    });
  });
  $('#retry').addEventListener('click', () => location.reload());

  // Retain the original playful headline color change, every two seconds.
  let previousHue = 140;
  setInterval(() => {
    if (activeId || document.hidden || motion.matches) return;
    previousHue = (previousHue + 45 + Math.random() * 230) % 360;
    $('#greeting').style.color = `hsl(${previousHue} 85% 79%)`;
  }, 2000);
  setInterval(updateTime, 10000);

  // Static procedural stars stay crisp on Retina screens without a texture fetch.
  function drawStars() {
    const canvas = $('#stars');
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    let seed = 721;
    const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < innerWidth * innerHeight / 2400; i++) {
      const x = random() * innerWidth, y = random() * innerHeight;
      ctx.beginPath();
      ctx.fillStyle = `rgba(192,215,228,${0.1 + random() * 0.45})`;
      ctx.arc(x, y, random() > 0.97 ? 1.1 : 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  drawStars();
  window.addEventListener('resize', drawStars);
  window.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || motion.matches) return;
    const glow = $('#cursor-glow');
    glow.style.opacity = '1';
    glow.style.transform = `translate(${event.clientX - 130}px, ${event.clientY - 130}px)`;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { $('#cursor-glow').style.opacity = '0'; });

  function notice(message) {
    notices.add(message);
    $('#asset-notice').textContent = [...notices].join(' ');
    $('#asset-notice').hidden = false;
  }

  function loadTexture(url) {
    return new Promise((resolve, reject) => {
      let timedOut = false;
      const timeout = setTimeout(() => { timedOut = true; reject(new Error('Texture request timed out')); }, 25000);
      new THREE.TextureLoader().load(url, texture => {
        clearTimeout(timeout);
        if (timedOut) { texture.dispose(); return; }
        texture.anisotropy = Math.min(8, globe.renderer().capabilities.getMaxAnisotropy());
        resolve(texture);
      }, undefined, error => { clearTimeout(timeout); reject(error); });
    });
  }

  async function loadBorders() {
    try {
      const response = await fetch(assets.borders, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error(`Border request: ${response.status}`);
      const data = await response.json();
      const missing = ids.filter(id => !data.features.some(f => featureId(f) === id));
      if (missing.length) throw new Error(`Missing borders: ${missing.join(', ')}`);
      globe.polygonsData(data.features);
      updatePolygons();
    } catch (error) {
      console.warn('Country borders unavailable:', error);
      notice('Borders unavailable. Use the country buttons to explore.');
    }
  }

  function animateAtmosphere(now) {
    const delta = Math.min((now - lastFrame) / 1000 || 0, 0.1);
    lastFrame = now;
    if (cloudMesh && !motion.matches) cloudMesh.rotation.y += delta * 0.006;
    // Camera-relative sunlight keeps the selected destination readable, with a soft night-side limb.
    if (keyLight && globe) keyLight.position.copy(globe.camera().position).applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.65).normalize().multiplyScalar(600);
    renderFrame = requestAnimationFrame(animateAtmosphere);
  }

  async function initGlobe() {
    if (loading) return;
    loading = true;
    try {
      if (typeof window.Globe !== 'function') throw new Error('The globe library is unavailable. Check your connection and reload.');
      THREE = await Promise.race([
        import(assets.three),
        new Promise((_, reject) => setTimeout(() => reject(new Error('The 3D engine timed out. Check your connection and reload.')), 25000))
      ]);
      globe = Globe({ animateIn: false, waitForGlobeReady: false, rendererConfig: { antialias: true, alpha: true } })($('#globe'))
        .width(stage.clientWidth).height(stage.clientHeight)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true).atmosphereColor('#6da9ec').atmosphereAltitude(0.14)
        .polygonSideColor(() => 'rgba(120,180,200,0.08)')
        .polygonsTransitionDuration(motion.matches ? 0 : 600)
        .polygonLabel(f => {
          const c = countries[featureId(f)];
          return c ? `<div class="globe-tooltip">${c.flag} Say hello to ${c.shortName || c.name} ↗</div>` : '';
        })
        .onPolygonClick(f => { if (countries[featureId(f)]) selectCountry(featureId(f)); })
        .onPolygonHover(f => {
          const id = featureId(f);
          hoveredId = countries[id] ? id : null;
          stage.style.cursor = hoveredId ? 'pointer' : 'grab';
          updatePolygons();
        })
        .htmlLat('lat').htmlLng('lng').htmlAltitude(0.021)
        .htmlElement(d => {
          const marker = document.createElement('div');
          marker.className = 'capital-marker';
          marker.innerHTML = `<i></i><span>${d.name}</span>`;
          return marker;
        });
      globe.renderer().setPixelRatio(Math.min(devicePixelRatio, 2));
      const controls = globe.controls();
      controls.autoRotateSpeed = 0.35;
      controls.enableDamping = !motion.matches;
      controls.dampingFactor = 0.07;
      controls.minDistance = 118;
      controls.maxDistance = 500;
      controls.enablePan = false;
      controls.addEventListener('start', () => cancelAnimationFrame(flightFrame));
      setRotation(rotationEnabled);
      globe.pointOfView(activeId ? countries[activeId] : home);
      keyLight = new THREE.DirectionalLight('#fff6e6', 2.6);
      const fill = new THREE.DirectionalLight('#88b9ff', 0.65);
      fill.position.set(-200, 100, -150);
      globe.lights([new THREE.AmbientLight('#b9d4ff', 1.45), keyLight, fill]);

      new ResizeObserver(() => {
        if (globe) globe.width(stage.clientWidth).height(stage.clientHeight);
      }).observe(stage);
      globe.renderer().domElement.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        $('#error-message').textContent = 'The graphics context was interrupted. Reload to bring the globe back.';
        $('#globe-error').hidden = false;
        globe.pauseAnimation();
        cancelAnimationFrame(renderFrame);
      });
      renderFrame = requestAnimationFrame(animateAtmosphere);
      const borderPromise = loadBorders();
      const [earth, bump, water, clouds] = await Promise.allSettled([
        loadTexture(assets.earth), loadTexture(assets.bump), loadTexture(assets.water), loadTexture(assets.clouds)
      ]);
      if (earth.status !== 'fulfilled') throw new Error('Earth imagery couldn’t load. Check your internet connection and try again.');
      const material = globe.globeMaterial();
      earth.value.colorSpace = THREE.SRGBColorSpace;
      material.map = earth.value;
      material.color.set('#ffffff');
      if (bump.status === 'fulfilled') { material.bumpMap = bump.value; material.bumpScale = 0.22; }
      if (water.status === 'fulfilled') { material.specularMap = water.value; material.specular.set('#708b9c'); material.shininess = 25; }
      if (clouds.status === 'fulfilled') {
        clouds.value.colorSpace = THREE.SRGBColorSpace;
        cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(100.45, 96, 64), new THREE.MeshPhongMaterial({
          map: clouds.value, transparent: true, opacity: 0.34, depthWrite: false, shininess: 0
        }));
        cloudMesh.rotation.y = -Math.PI / 2;
        // Exclude the cloud shell from raycasting so it never steals country clicks.
        cloudMesh.raycast = () => {};
        globe.scene().add(cloudMesh);
      }
      material.needsUpdate = true;
      if ([bump, water, clouds].some(result => result.status === 'rejected')) notice('Some visual layers couldn’t load. Reload to retry.');
      if (activeId) {
        const c = countries[activeId];
        globe.htmlElementsData([{ lat: c.capitalLat, lng: c.capitalLng, name: c.capital }]);
      }
      await borderPromise;
      $('#loading').hidden = true;
      announce('Your planet is ready. Choose a country, or drag to explore.');
    } catch (error) {
      console.warn('Globe initialization:', error);
      $('#loading').hidden = true;
      $('#globe-error').hidden = false;
      $('#error-message').textContent = `${error.message} Country guides are still available.`;
      $('#globe').style.opacity = '0';
      document.querySelectorAll('.globe-tools button').forEach(button => { button.disabled = true; });
      globe?.pauseAnimation();
      cancelAnimationFrame(renderFrame);
    } finally { loading = false; }
  }

  motion.addEventListener('change', () => {
    setRotation(!motion.matches && !activeId);
    if (globe) { globe.controls().enableDamping = !motion.matches; globe.polygonsTransitionDuration(motion.matches ? 0 : 600); }
    if (motion.matches) { headlineAnimation?.cancel(); flyTo(activeId ? countries[activeId] : home); }
  });
  document.addEventListener('visibilitychange', () => {
    if (!globe) return;
    if (document.hidden) { globe.pauseAnimation(); cancelAnimationFrame(renderFrame); }
    else { globe.resumeAnimation(); lastFrame = 0; cancelAnimationFrame(renderFrame); renderFrame = requestAnimationFrame(animateAtmosphere); }
  });
  setRotation(rotationEnabled);
  initGlobe();
})();
