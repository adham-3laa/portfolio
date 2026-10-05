type SwipeDirection = -1 | 1;
type ShowcaseState = 'idle' | 'rotating' | 'modal-open';

interface StackLayer {
  shell: HTMLElement;
  img: HTMLImageElement;
  role: number;
  imageIndex: number;
}

interface RolePose {
  x: number;
  y: number;
  z: number;
  rotateY: number;
  rotateX: number;
  scale: number;
  opacity: number;
  brightness: number;
  contrast: number;
  zIndex: number;
}

const VISIBLE_LAYER_COUNT = 4;
const AUTO_ADVANCE_MS = 3000;
const ROTATE_DURATION_MS = 1720;
const ROTATE_EASING = 'cubic-bezier(0.24, 0.78, 0.28, 1)';
const INTERSECTION_ACTIVE_THRESHOLD = 0.35;

const DEPTH_FACTOR = 0.23;
const DEPTH_MIN_PX = 74;
const DEPTH_MAX_PX = 136;
const X_SHIFT_FACTOR = 0.06;
const X_SHIFT_MIN_PX = 16;
const X_SHIFT_MAX_PX = 50;
const Y_SHIFT_FACTOR = 0.024;
const Y_SHIFT_MIN_PX = 6;
const Y_SHIFT_MAX_PX = 18;

const MODAL_OUT_EASING = 'cubic-bezier(0.32, 0, 0.67, 0)';
const MODAL_IN_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const POINTER_COARSE = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const DESKTOP_MEDIA = window.matchMedia('(min-width: 768px)');

export function initClinicGallery(): void {
  const container = document.querySelector<HTMLElement>('.clinic-3d-composition');
  if (!container) return;

  const stage = container.querySelector<HTMLElement>('.clinic-drum-stage');
  const track = container.querySelector<HTMLElement>('.clinic-drum-track');
  if (!stage || !track) return;
  const showcaseContainer: HTMLElement = container;
  const showcaseStage: HTMLElement = stage;

  const layerShells = Array.from(container.querySelectorAll<HTMLElement>('.clinic-stack-layer')).slice(0, VISIBLE_LAYER_COUNT);
  if (layerShells.length !== VISIBLE_LAYER_COUNT) return;

  const clinicImages = [
    '/img/clinc/1.jpeg',
    '/img/clinc/2.jpeg',
    '/img/clinc/3.jpeg',
    '/img/clinc/4.jpeg',
    '/img/clinc/5.jpeg',
    '/img/clinc/6.jpeg',
    '/img/clinc/7.jpg',
    '/img/clinc/8.jpeg',
    '/img/clinc/9.jpeg',
    '/img/clinc/10.jpeg'
  ] as const;

  window.addEventListener('click', (e) => {
     const target = e.target as HTMLElement;
     // Catch any click within the clinic visual region
     if (target.closest('.project-showcase__visual') || target.closest('.clinic-3d-composition') || target.closest('.clinic-click-overlay')) {
       e.stopPropagation();
       openGallery(showcaseIndex);
     }
  }, { capture: true });

  const layers: StackLayer[] = [];
  for (const [index, shell] of layerShells.entries()) {
    const img = shell.querySelector<HTMLImageElement>('img');
    if (!img) return;
    layers.push({ shell, img, role: index, imageIndex: index });
  }

  showcaseContainer.setAttribute('tabindex', '0');
  showcaseContainer.setAttribute('role', 'button');
  showcaseContainer.setAttribute('aria-haspopup', 'dialog');
  showcaseContainer.setAttribute('aria-expanded', 'false');

  let showcaseIndex = 0;
  let showcaseState: ShowcaseState = 'idle';
  let showcaseTransitionToken = 0;
  let showcaseAnimations: Animation[] = [];
  let showcaseAutoRotateTimer: number | null = null;
  let isShowcaseIntersecting = true;

  let activeMousePointerId: number | null = null;
  let currentIndex = 0;
  let isOpen = false;
  let modalTransitionToken = 0;
  let modalAnimations: Animation[] = [];
  let lastFocusedElement: HTMLElement | null = null;
  let depthRaf = 0;
  let depthPointerX = 0;
  let depthPointerY = 0;

  let stackDepth = 116;
  let stackXShift = 34;
  let stackYShift = 12;

  const imageCache = new Set<string>();
  for (const layer of layers) {
    const src = layer.img.getAttribute('src');
    if (src) imageCache.add(src);
  }

  const canUseDepthMotion = !REDUCED_MOTION && !POINTER_COARSE;
  const canUseShowcaseRotation = !REDUCED_MOTION && !POINTER_COARSE && DESKTOP_MEDIA.matches;
  const openFromPreview = (): void => {
    openGallery(showcaseIndex);
  };

  showcaseContainer.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openFromPreview();
  });
  showcaseContainer.addEventListener('pointerenter', handlePointerEnter, { passive: true });
  showcaseContainer.addEventListener('pointermove', handlePointerMove, { passive: true });
  showcaseContainer.addEventListener('pointerleave', handlePointerLeave, { passive: true });
  showcaseContainer.addEventListener('pointercancel', handlePointerCancel, { passive: true });

  initializeLayers();
  updateStackGeometry();
  warmShowcaseCache(showcaseIndex);
  setupVisibilityGuards();
  startShowcaseAutoRotate();

  function wrapIndex(index: number): number {
    return (index + clinicImages.length) % clinicImages.length;
  }

  function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }

  function cancelAnimations(animations: Animation[]): void {
    for (const animation of animations) {
      animation.cancel();
    }
  }

  async function waitForAnimations(animations: Animation[]): Promise<void> {
    await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
  }

  function preloadImage(src: string): Promise<void> {
    if (imageCache.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const image = new Image();
      let settled = false;

      const settle = (loaded: boolean): void => {
        if (settled) return;
        settled = true;
        if (loaded) imageCache.add(src);
        resolve();
      };

      image.onload = () => settle(true);
      image.onerror = () => settle(false);
      image.src = src;

      if (image.complete) {
        settle(image.naturalWidth > 0);
      }
    });
  }

  function getRoleName(role: number): string {
    if (role === 0) return 'front';
    if (role === 1) return 'mid';
    if (role === 2) return 'back';
    return 'far';
  }

  function applyRoleClass(layer: StackLayer): void {
    layer.shell.classList.remove('is-front', 'is-mid', 'is-back', 'is-far');
    const roleName = getRoleName(layer.role);
    layer.shell.classList.add(`is-${roleName}`);
    layer.shell.dataset.role = roleName;
  }

  function getRolePose(role: number): RolePose {
    if (role === 0) {
      return {
        x: 0,
        y: 0,
        z: 0,
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        opacity: 1,
        brightness: 1.02,
        contrast: 1.03,
        zIndex: 22
      };
    }

    if (role === 1) {
      return {
        x: 0,
        y: 0,
        z: -stackDepth * 0.2,
        rotateY: 0,
        rotateX: 0,
        scale: 0.9,
        opacity: 0.74,
        brightness: 0.93,
        contrast: 0.96,
        zIndex: 15
      };
    }

    if (role === 2) {
      return {
        x: 0,
        y: 0,
        z: -stackDepth * 0.4,
        rotateY: 0,
        rotateX: 0,
        scale: 0.8,
        opacity: 0.54,
        brightness: 0.82,
        contrast: 0.9,
        zIndex: 10
      };
    }

    return {
      x: 0,
      y: 0,
      z: -stackDepth * 0.6,
      rotateY: 0,
      rotateX: 0,
      scale: 0.7,
      opacity: 0.36,
      brightness: 0.7,
      contrast: 0.84,
      zIndex: 6
    };
  }

  function poseToTransform(pose: RolePose): string {
    return `translate3d(${pose.x.toFixed(2)}px, ${pose.y.toFixed(2)}px, ${pose.z.toFixed(2)}px) rotateY(${pose.rotateY.toFixed(2)}deg) rotateX(${pose.rotateX.toFixed(2)}deg) scale(${pose.scale.toFixed(3)})`;
  }

  function poseToFilter(pose: RolePose): string {
    return `brightness(${pose.brightness.toFixed(3)}) contrast(${pose.contrast.toFixed(3)})`;
  }

  function applyLayerPose(layer: StackLayer): void {
    const pose = getRolePose(layer.role);
    layer.shell.style.transform = poseToTransform(pose);
    layer.shell.style.opacity = pose.opacity.toFixed(3);
    layer.shell.style.filter = poseToFilter(pose);
    layer.shell.style.zIndex = String(pose.zIndex);
    applyRoleClass(layer);
  }

  function initializeLayers(): void {
    for (const [index, layer] of layers.entries()) {
      layer.role = index;
      layer.imageIndex = wrapIndex(showcaseIndex + index);
      layer.img.src = clinicImages[layer.imageIndex];
      applyLayerPose(layer);
    }
  }

  function syncLayerSources(centerIndex: number): void {
    for (const layer of layers) {
      const imageIndex = wrapIndex(centerIndex + layer.role);
      layer.imageIndex = imageIndex;
      const src = clinicImages[imageIndex];
      if (layer.img.getAttribute('src') !== src) {
        layer.img.src = src;
      }
    }
  }

  function warmShowcaseCache(centerIndex: number): void {
    const indices = new Set<number>();
    for (let offset = -1; offset <= VISIBLE_LAYER_COUNT + 1; offset += 1) {
      indices.add(wrapIndex(centerIndex + offset));
    }
    for (const index of indices) {
      void preloadImage(clinicImages[index]);
    }
  }

  function updateStackGeometry(): void {
    if (!canUseShowcaseRotation) return;

    const width = showcaseStage.getBoundingClientRect().width;
    if (!width) return;

    stackDepth = clamp(width * DEPTH_FACTOR, DEPTH_MIN_PX, DEPTH_MAX_PX);
    stackXShift = clamp(width * X_SHIFT_FACTOR, X_SHIFT_MIN_PX, X_SHIFT_MAX_PX);
    stackYShift = clamp(width * Y_SHIFT_FACTOR, Y_SHIFT_MIN_PX, Y_SHIFT_MAX_PX);

    const shadowOpacity = clamp(0.78 + (stackDepth - DEPTH_MIN_PX) / (DEPTH_MAX_PX - DEPTH_MIN_PX) * 0.18, 0.78, 0.96);
    showcaseContainer.style.setProperty('--clinic-stage-shadow-opacity', shadowOpacity.toFixed(3));

    if (showcaseState !== 'rotating') {
      for (const layer of layers) {
        applyLayerPose(layer);
      }
    }
  }

  function canRotateNow(): boolean {
    return canUseShowcaseRotation && showcaseState === 'idle' && !isOpen && !document.hidden && isShowcaseIntersecting;
  }

  function createMidPose(start: RolePose, end: RolePose): RolePose {
    const curveSign = end.x >= start.x ? 1 : -1;
    return {
      x: (start.x + end.x) * 0.5,
      y: (start.y + end.y) * 0.5,
      z: Math.max(start.z, end.z),
      rotateY: (start.rotateY + end.rotateY) * 0.5 + curveSign * 2,
      rotateX: (start.rotateX + end.rotateX) * 0.5 + 0.24,
      scale: (start.scale + end.scale) * 0.5 + 0.002,
      opacity: clamp((start.opacity + end.opacity) * 0.52, 0.28, 1),
      brightness: clamp((start.brightness + end.brightness) * 0.5 + 0.03, 0.62, 1.06),
      contrast: clamp((start.contrast + end.contrast) * 0.5 + 0.01, 0.82, 1.06),
      zIndex: Math.max(start.zIndex, end.zIndex)
    };
  }

  function animateLayerToRole(layer: StackLayer, nextRole: number): Animation {
    const startPose = getRolePose(layer.role);
    const endPose = getRolePose(nextRole);
    const midPose = createMidPose(startPose, endPose);

    return layer.shell.animate(
      [
        {
          transform: poseToTransform(startPose),
          opacity: startPose.opacity.toFixed(3),
          filter: poseToFilter(startPose)
        },
        {
          offset: 0.56,
          transform: poseToTransform(midPose),
          opacity: midPose.opacity.toFixed(3),
          filter: midPose.filter = poseToFilter(midPose)
        },
        {
          transform: poseToTransform(endPose),
          opacity: endPose.opacity.toFixed(3),
          filter: poseToFilter(endPose)
        }
      ],
      {
        duration: ROTATE_DURATION_MS,
        easing: ROTATE_EASING,
        fill: 'forwards'
      }
    );
  }

  async function rotateForward(): Promise<void> {
    if (!canRotateNow()) return;

    showcaseState = 'rotating';
    const token = ++showcaseTransitionToken;
    const nextFrontIndex = wrapIndex(showcaseIndex + 1);
    const incomingFarIndex = wrapIndex(showcaseIndex + VISIBLE_LAYER_COUNT);

    try {
      await Promise.all([preloadImage(clinicImages[nextFrontIndex]), preloadImage(clinicImages[incomingFarIndex])]);
      if (token !== showcaseTransitionToken) return;

      cancelAnimations(showcaseAnimations);
      const nextRoles = new Map<StackLayer, number>();
      const animations: Animation[] = [];

      for (const layer of layers) {
        const nextRole = (layer.role + VISIBLE_LAYER_COUNT - 1) % VISIBLE_LAYER_COUNT;
        nextRoles.set(layer, nextRole);
        animations.push(animateLayerToRole(layer, nextRole));
      }

      showcaseAnimations = animations;
      await waitForAnimations(animations);
      if (token !== showcaseTransitionToken) return;

      for (const layer of layers) {
        const mappedRole = nextRoles.get(layer);
        if (mappedRole === undefined) continue;
        layer.role = mappedRole;
      }

      showcaseIndex = nextFrontIndex;
      const farLayer = layers.find((layer) => layer.role === VISIBLE_LAYER_COUNT - 1);
      if (farLayer) {
        farLayer.imageIndex = wrapIndex(showcaseIndex + VISIBLE_LAYER_COUNT - 1);
        farLayer.img.src = clinicImages[farLayer.imageIndex];
      }

      for (const layer of layers) {
        applyLayerPose(layer);
      }
      warmShowcaseCache(showcaseIndex);
    } finally {
      if (token === showcaseTransitionToken && !isOpen) {
        showcaseAnimations = [];
        showcaseState = 'idle';
      }
    }
  }

  function cancelShowcaseTransition(): void {
    showcaseTransitionToken++;
    cancelAnimations(showcaseAnimations);
    showcaseAnimations = [];
    syncLayerSources(showcaseIndex);
    for (const layer of layers) {
      applyLayerPose(layer);
    }
    if (!isOpen) {
      showcaseState = 'idle';
    }
  }

  function startShowcaseAutoRotate(): void {
    if (!canUseShowcaseRotation || REDUCED_MOTION || showcaseAutoRotateTimer !== null) return;

    showcaseAutoRotateTimer = window.setInterval(() => {
      void rotateForward();
    }, AUTO_ADVANCE_MS);
  }

  function stopShowcaseAutoRotate(): void {
    if (showcaseAutoRotateTimer === null) return;
    window.clearInterval(showcaseAutoRotateTimer);
    showcaseAutoRotateTimer = null;
  }

  function resumeAutoRotateIfAllowed(): void {
    if (isOpen || REDUCED_MOTION || !canUseShowcaseRotation) return;
    if (showcaseAutoRotateTimer === null) {
      startShowcaseAutoRotate();
    }
  }

  function setupVisibilityGuards(): void {
    if (canUseShowcaseRotation && 'ResizeObserver' in window) {
      const stageResizeObserver = new ResizeObserver(() => {
        updateStackGeometry();
      });
      stageResizeObserver.observe(showcaseStage);
    }

    if (canUseShowcaseRotation && 'IntersectionObserver' in window) {
      const showcaseIntersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          isShowcaseIntersecting = entry.isIntersecting && entry.intersectionRatio >= INTERSECTION_ACTIVE_THRESHOLD;
          if (isShowcaseIntersecting) {
            resumeAutoRotateIfAllowed();
          }
        },
        { threshold: [0, INTERSECTION_ACTIVE_THRESHOLD, 0.6] }
      );
      showcaseIntersectionObserver.observe(showcaseContainer);
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) return;
      resumeAutoRotateIfAllowed();
    });
  }

  function applyDepthStyles(): void {
    depthRaf = 0;
    const rect = showcaseContainer.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const rawX = ((depthPointerX - rect.left) / rect.width - 0.5) * 2;
    const rawY = ((depthPointerY - rect.top) / rect.height - 0.5) * 2;
    const normalizedX = clamp(rawX, -1, 1);
    const normalizedY = clamp(rawY, -1, 1);

    const tiltY = normalizedX * 4.2;
    const tiltX = normalizedY * -3.4;
    const glowOpacity = 0.48 + (Math.abs(normalizedX) + Math.abs(normalizedY)) * 0.08;

    showcaseContainer.style.setProperty('--clinic-tilt-y', `${tiltY.toFixed(2)}deg`);
    showcaseContainer.style.setProperty('--clinic-tilt-x', `${tiltX.toFixed(2)}deg`);
    showcaseContainer.style.setProperty('--clinic-glow-opacity', glowOpacity.toFixed(3));
  }

  function scheduleDepthStyles(clientX: number, clientY: number): void {
    if (!canUseDepthMotion) return;

    depthPointerX = clientX;
    depthPointerY = clientY;
    if (depthRaf) return;
    depthRaf = requestAnimationFrame(applyDepthStyles);
  }

  function resetDepthStyles(): void {
    if (!canUseDepthMotion) return;

    if (depthRaf) {
      cancelAnimationFrame(depthRaf);
      depthRaf = 0;
    }

    showcaseContainer.style.setProperty('--clinic-tilt-y', '0deg');
    showcaseContainer.style.setProperty('--clinic-tilt-x', '0deg');
    showcaseContainer.style.setProperty('--clinic-glow-opacity', '0.44');
  }

  function handlePointerEnter(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    activeMousePointerId = event.pointerId;
    scheduleDepthStyles(event.clientX, event.clientY);
  }

  function handlePointerMove(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    if (activeMousePointerId !== null && event.pointerId !== activeMousePointerId) return;
    scheduleDepthStyles(event.clientX, event.clientY);
  }

  function handlePointerLeave(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    if (activeMousePointerId !== null && event.pointerId !== activeMousePointerId) return;
    activeMousePointerId = null;
    resetDepthStyles();
  }

  function handlePointerCancel(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    if (activeMousePointerId !== null && event.pointerId !== activeMousePointerId) return;
    activeMousePointerId = null;
    resetDepthStyles();
  }

  const overlay = document.createElement('div');
  overlay.id = 'clinic-gallery-overlay';
  overlay.className = 'clinic-gallery-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  showcaseContainer.setAttribute('aria-controls', overlay.id);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'clinic-gallery-close';
  closeBtn.type = 'button';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close gallery');
  closeBtn.addEventListener('click', closeGallery);

  const prevBtn = document.createElement('button');
  prevBtn.className = 'clinic-gallery-zone clinic-gallery-zone--prev';
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Previous image');
  prevBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    navigate(-1);
  });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'clinic-gallery-zone clinic-gallery-zone--next';
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'Next image');
  nextBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    navigate(1);
  });

  const imageContainer = document.createElement('div');
  imageContainer.className = 'clinic-gallery-image-wrapper';

  const imgEl = document.createElement('img');
  imgEl.className = 'clinic-gallery-image';
  imgEl.alt = 'Clinic System Screenshot';

  const counter = document.createElement('div');
  counter.className = 'clinic-gallery-counter';

  imageContainer.appendChild(imgEl);
  overlay.appendChild(closeBtn);
  overlay.appendChild(prevBtn);
  overlay.appendChild(imageContainer);
  overlay.appendChild(nextBtn);
  overlay.appendChild(counter);

  document.body.appendChild(overlay);

  function navigate(direction: SwipeDirection): void {
    currentIndex = wrapIndex(currentIndex + direction);
    updateModalImage();
  }

  function animateModalOut(): Animation {
    return imgEl.animate(
      [
        { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' },
        { opacity: 0.34, transform: 'translate3d(0, 6px, 0) scale(0.995)' }
      ],
      { duration: 150, easing: MODAL_OUT_EASING, fill: 'forwards' }
    );
  }

  function animateModalIn(fromOpenState: boolean): Animation {
    return imgEl.animate(
      [
        {
          opacity: fromOpenState ? 0 : 0.34,
          transform: fromOpenState ? 'translate3d(0, 8px, 0) scale(0.996)' : 'translate3d(0, -4px, 0) scale(1.004)'
        },
        { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
      ],
      { duration: fromOpenState ? 280 : 250, easing: MODAL_IN_EASING, fill: 'forwards' }
    );
  }

  function updateModalImage(options?: { immediate?: boolean }): void {
    const immediate = options?.immediate ?? false;
    const token = ++modalTransitionToken;
    const targetSrc = clinicImages[currentIndex];

    counter.textContent = `${currentIndex + 1} / ${clinicImages.length}`;

    cancelAnimations(modalAnimations);
    modalAnimations = [];

    void (async () => {
      if (!immediate && imgEl.src) {
        const outAnimation = animateModalOut();
        modalAnimations = [outAnimation];
        await waitForAnimations([outAnimation]);
        if (token !== modalTransitionToken) return;
      }

      await preloadImage(targetSrc);
      if (token !== modalTransitionToken) return;

      imgEl.src = targetSrc;

      const inAnimation = animateModalIn(immediate);
      modalAnimations = [inAnimation];
      await waitForAnimations([inAnimation]);

      if (token === modalTransitionToken) {
        modalAnimations = [];
      }
    })().catch(() => {
      if (token !== modalTransitionToken) return;
      imgEl.src = targetSrc;
      imgEl.style.opacity = '1';
      modalAnimations = [];
    });
  }

  function openGallery(startIndex = showcaseIndex): void {
    isOpen = true;
    stopShowcaseAutoRotate();
    cancelShowcaseTransition();
    resetDepthStyles();
    showcaseState = 'modal-open';

    showcaseContainer.setAttribute('aria-expanded', 'true');
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');

    currentIndex = wrapIndex(startIndex);
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    updateModalImage({ immediate: true });
    document.body.style.overflow = 'hidden';
    closeBtn.focus({ preventScroll: true });
  }

  function closeGallery(): void {
    if (!isOpen) return;

    isOpen = false;
    showcaseState = 'idle';

    showcaseContainer.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resumeAutoRotateIfAllowed();

    modalTransitionToken++;
    cancelAnimations(modalAnimations);
    modalAnimations = [];

    if (lastFocusedElement) {
      lastFocusedElement.focus({ preventScroll: true });
      lastFocusedElement = null;
    }
  }

  window.addEventListener('keydown', (event) => {
    if (!isOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeGallery();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigate(-1);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(1);
    }
  });

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target === imageContainer) {
      closeGallery();
    }
  });
}
