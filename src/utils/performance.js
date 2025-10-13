class MobilePerformance {
  constructor() {
    this.isMobile = window.innerWidth <= 745;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.init();
  }
  
  init() {
    if (this.isMobile) {
      this.optimizeForMobile();
    }
    
    if (this.reducedMotion) {
      this.disableAnimations();
    }
  }
  
  optimizeForMobile() {
    // Reduce animation complexity
    gsap.globalTimeline.timeScale(1.5); // Speed up animations
    
    // Disable parallax effects
    document.querySelectorAll('[data-parallax]').forEach(el => {
      el.removeAttribute('data-parallax');
    });
    
    // Reduce image quality for faster loading
    document.querySelectorAll('img').forEach(img => {
      if (img.dataset.src) {
        const src = img.dataset.src;
        // Add mobile image size parameter if supported
        img.dataset.src = src.replace(/\.(jpg|png)$/i, '-mobile.$1');
      }
    });
  }
  
  disableAnimations() {
    // Respect user's motion preferences
    document.documentElement.classList.add('reduced-motion');
  }
}