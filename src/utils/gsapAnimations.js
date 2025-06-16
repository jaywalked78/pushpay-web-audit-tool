import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Configuration
const ANIMATION_CONFIG = {
  defaultDuration: 0.8,
  defaultEase: 'power2.out',
  staggerDelay: 0.1,
  mobileBreakpoint: 768,
};

// Initialize ScrollTrigger animations
export const initializeAnimations = () => {
  // Refresh ScrollTrigger on route changes
  ScrollTrigger.refresh();

  // Kill all existing ScrollTriggers to prevent duplicates
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());

  // Check if animations should be reduced on mobile
  const isMobile = window.innerWidth < ANIMATION_CONFIG.mobileBreakpoint;
  
  if (isMobile) {
    // Simplified animations for mobile
    initializeMobileAnimations();
  } else {
    // Full animations for desktop
    initializeDesktopAnimations();
  }
  
  // Initialize fade in/out scroll effects
  initializeFadeScrollEffects();
};

// Desktop animations
const initializeDesktopAnimations = () => {
  // Fade up animation for elements with .fade-up class
  gsap.utils.toArray('.fade-up').forEach(element => {
    // Set initial state to ensure visibility
    gsap.set(element, { y: 30, opacity: 0 });
    
    gsap.to(element, {
      y: 0,
      opacity: 1,
      duration: ANIMATION_CONFIG.defaultDuration,
      ease: ANIMATION_CONFIG.defaultEase,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        once: true,
      }
    });
  });

  // Stagger animations for card groups
  const cardGroups = gsap.utils.toArray('.animate-stagger-group');
  cardGroups.forEach(group => {
    const cards = group.querySelectorAll('.animate-stagger-item');
    // Set initial state
    gsap.set(cards, { y: 50, opacity: 0 });
    
    gsap.to(cards, {
      y: 0,
      opacity: 1,
      duration: ANIMATION_CONFIG.defaultDuration,
      stagger: ANIMATION_CONFIG.staggerDelay,
      ease: ANIMATION_CONFIG.defaultEase,
      scrollTrigger: {
        trigger: group,
        start: 'top 80%',
        once: true,
      }
    });
  });

  // Number counter animations
  gsap.utils.toArray('[data-count]').forEach(element => {
    const target = parseFloat(element.getAttribute('data-count'));
    const decimals = element.getAttribute('data-decimals') || 0;
    
    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      once: true,
      onEnter: () => animateCounter(element, target, decimals)
    });
  });

  // Progress bar animations
  gsap.utils.toArray('.animate-progress').forEach(element => {
    const targetWidth = element.getAttribute('data-progress') || element.style.width;
    
    gsap.from(element, {
      width: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        once: true,
      }
    });
  });

  // Scale animations
  gsap.utils.toArray('.animate-scale').forEach(element => {
    // Set initial state
    gsap.set(element, { scale: 0, opacity: 0 });
    
    gsap.to(element, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        once: true,
      }
    });
  });

  // Slide animations
  gsap.utils.toArray('.animate-slide-left').forEach(element => {
    // Set initial state
    gsap.set(element, { x: -50, opacity: 0 });
    
    gsap.to(element, {
      x: 0,
      opacity: 1,
      duration: ANIMATION_CONFIG.defaultDuration,
      ease: ANIMATION_CONFIG.defaultEase,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        once: true,
      }
    });
  });

  gsap.utils.toArray('.animate-slide-right').forEach(element => {
    // Set initial state
    gsap.set(element, { x: 50, opacity: 0 });
    
    gsap.to(element, {
      x: 0,
      opacity: 1,
      duration: ANIMATION_CONFIG.defaultDuration,
      ease: ANIMATION_CONFIG.defaultEase,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        once: true,
      }
    });
  });
};

// Simplified mobile animations
const initializeMobileAnimations = () => {
  // Set initial states for mobile elements
  const mobileElements = gsap.utils.toArray('.fade-up, .animate-stagger-item, .animate-scale, .animate-slide-left, .animate-slide-right');
  gsap.set(mobileElements, { opacity: 0, y: 20 });
  
  // Use batch for better performance on mobile
  ScrollTrigger.batch('.fade-up, .animate-stagger-item, .animate-scale, .animate-slide-left, .animate-slide-right', {
    onEnter: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
      overwrite: true
    }),
    start: 'top 90%',
    once: true
  });

  // Simple progress bar animations for mobile
  const progressElements = gsap.utils.toArray('.animate-progress');
  gsap.set(progressElements, { width: 0 });
  
  ScrollTrigger.batch('.animate-progress', {
    onEnter: batch => gsap.to(batch, {
      width: 'auto',
      duration: 0.8,
      ease: 'power2.out',
      overwrite: true
    }),
    start: 'top 85%',
    once: true
  });
};

// Animate counter from 0 to target value
export const animateCounter = (element, target, decimals = 0) => {
  const obj = { value: 0 };
  
  gsap.to(obj, {
    value: target,
    duration: 2,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = obj.value.toFixed(decimals);
    }
  });
};

// Animate circular progress (for score circles)
export const animateCircularProgress = (element, score, maxScore = 100) => {
  const circle = element.querySelector('.progress-circle');
  const scoreText = element.querySelector('.score-text');
  
  if (!circle) return;
  
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / maxScore) * circumference;
  
  // Set initial state
  gsap.set(circle, {
    strokeDasharray: circumference,
    strokeDashoffset: circumference,
  });
  
  // Animate
  gsap.to(circle, {
    strokeDashoffset: offset,
    duration: 1.5,
    ease: 'power2.inOut',
  });
  
  // Animate score text if exists
  if (scoreText) {
    animateCounter(scoreText, score, 1);
  }
};

// Special animation for CLS Demo
export const triggerCLSAnimation = () => {
  const clsDemo = document.querySelector('.cls-demo-container');
  if (!clsDemo) return;
  
  // Trigger the existing CLS animation
  const button = clsDemo.querySelector('button');
  if (button) {
    button.click();
  }
};

// Animation for revenue loss (money flying away effect)
export const animateRevenueLoss = (element) => {
  const dollarSigns = [];
  const container = element.parentElement;
  
  // Create floating dollar signs
  for (let i = 0; i < 5; i++) {
    const dollar = document.createElement('span');
    dollar.textContent = '$';
    dollar.className = 'absolute text-red-500 text-2xl font-bold pointer-events-none';
    dollar.style.left = `${Math.random() * 100}%`;
    dollar.style.top = '50%';
    container.appendChild(dollar);
    dollarSigns.push(dollar);
  }
  
  // Animate them floating up and fading out
  gsap.to(dollarSigns, {
    y: -100,
    opacity: 0,
    duration: 2,
    stagger: 0.2,
    ease: 'power2.out',
    onComplete: () => {
      dollarSigns.forEach(dollar => dollar.remove());
    }
  });
};

// Refresh animations on window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

// Fade in/out scroll effects
export const initializeFadeScrollEffects = () => {
  // Elements that fade in when entering viewport and fade out when leaving
  gsap.utils.toArray('.fade-scroll').forEach(element => {
    gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play reverse play reverse', // fade in, fade out, fade in, fade out
          onLeave: () => gsap.to(element, { opacity: 0.3, duration: 0.3 }),
          onEnterBack: () => gsap.to(element, { opacity: 1, duration: 0.3 }),
        }
      }
    );
  });
  
  // Elements that slide in from sides and fade out when scrolling past
  gsap.utils.toArray('.slide-fade-scroll').forEach(element => {
    const isLeft = element.classList.contains('slide-left');
    gsap.fromTo(element,
      { x: isLeft ? -100 : 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );
  });
};

// Cleanup function
export const cleanupAnimations = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};