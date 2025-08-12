<template>
  <div class="promo-strip" :class="{ 'is-scrolling': isScrolling }">
    <div class="promo-container">
      <div class="promo-content" ref="promoContent">
        <div 
          v-for="(promo, index) in currentPromos"
          :key="promo.id"
          class="promo-item"
          :class="{ active: index === activePromo }"
          @click="handlePromoClick(promo)"
        >
          <div class="promo-icon">{{ promo.icon }}</div>
          <div class="promo-text">
            <span class="promo-main">{{ promo.main }}</span>
            <span class="promo-sub" v-if="promo.sub">{{ promo.sub }}</span>
          </div>
          <div class="promo-action" v-if="promo.action">
            <span class="action-text">{{ promo.action }}</span>
            <span class="action-arrow">→</span>
          </div>
          <div class="promo-timer" v-if="promo.timer">
            <span class="timer-text">{{ formatTime(promo.timer) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Navigation dots for mobile -->
      <div class="promo-dots" v-if="promos.length > 1">
        <button
          v-for="(promo, index) in promos"
          :key="`dot-${promo.id}`"
          class="promo-dot"
          :class="{ active: index === activePromo }"
          @click="setActivePromo(index)"
        ></button>
      </div>
      
      <!-- Close button -->
      <button class="promo-close" @click="closePromo" title="Close">
        ✕
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PromoStrip',
  data() {
    return {
      activePromo: 0,
      autoRotateTimer: null,
      isScrolling: false,
      promos: [
        {
          id: 1,
          icon: '🚚',
          main: 'FREE SHIPPING',
          sub: 'on orders over $100',
          action: 'Shop Now',
          type: 'shipping',
          priority: 'high'
        },
        {
          id: 2,
          icon: '⚡',
          main: 'FLASH SALE',
          sub: 'Up to 50% off selected items',
          action: 'View Deals',
          timer: Date.now() + (2 * 60 * 60 * 1000), // 2 hours from now
          type: 'sale',
          priority: 'urgent'
        },
        {
          id: 3,
          icon: '🎁',
          main: 'NEW MEMBER BONUS',
          sub: '15% off your first order',
          action: 'Sign Up',
          type: 'signup',
          priority: 'medium'
        },
        {
          id: 4,
          icon: '👟',
          main: 'TRY BEFORE YOU BUY',
          sub: '30-day free returns',
          action: 'Learn More',
          type: 'service',
          priority: 'low'
        },
        {
          id: 5,
          icon: '📱',
          main: 'DOWNLOAD OUR APP',
          sub: 'Get exclusive app-only deals',
          action: 'Download',
          type: 'app',
          priority: 'medium'
        }
      ],
      dismissedPromos: [],
      rotationInterval: 4000
    }
  },
  computed: {
    currentPromos() {
      return this.promos.filter(promo => !this.dismissedPromos.includes(promo.id))
    },
    hasActiveTimer() {
      return this.currentPromos.some(promo => promo.timer)
    }
  },
  mounted() {
    this.startAutoRotation()
    if (this.hasActiveTimer) {
      this.startTimerUpdates()
    }
    this.detectScrolling()
  },
  beforeDestroy() {
    this.stopAutoRotation()
    this.stopTimerUpdates()
  },
  methods: {
    startAutoRotation() {
      if (this.currentPromos.length > 1) {
        this.autoRotateTimer = setInterval(() => {
          this.nextPromo()
        }, this.rotationInterval)
      }
    },
    stopAutoRotation() {
      if (this.autoRotateTimer) {
        clearInterval(this.autoRotateTimer)
        this.autoRotateTimer = null
      }
    },
    nextPromo() {
      if (this.currentPromos.length > 1) {
        this.activePromo = (this.activePromo + 1) % this.currentPromos.length
      }
    },
    setActivePromo(index) {
      this.activePromo = index
      this.stopAutoRotation()
      setTimeout(() => {
        this.startAutoRotation()
      }, this.rotationInterval)
    },
    handlePromoClick(promo) {
      console.log('Promo clicked:', promo)
      this.$emit('promo-click', promo)
      
      // Handle different promo types
      switch (promo.type) {
        case 'shipping':
          this.$emit('show-shipping-info')
          break
        case 'sale':
          this.$emit('navigate-to-sale')
          break
        case 'signup':
          this.$emit('show-signup')
          break
        case 'service':
          this.$emit('show-returns-info')
          break
        case 'app':
          this.$emit('show-app-download')
          break
      }
    },
    closePromo() {
      const currentPromo = this.currentPromos[this.activePromo]
      if (currentPromo) {
        this.dismissedPromos.push(currentPromo.id)
        
        if (this.currentPromos.length === 0) {
          // Hide the entire strip if no promos left
          this.$emit('all-promos-dismissed')
        } else {
          // Adjust active promo index
          if (this.activePromo >= this.currentPromos.length) {
            this.activePromo = 0
          }
        }
      }
    },
    formatTime(timestamp) {
      const now = Date.now()
      const remaining = timestamp - now
      
      if (remaining <= 0) {
        return 'Expired'
      }
      
      const hours = Math.floor(remaining / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`
      } else {
        return `${seconds}s`
      }
    },
    startTimerUpdates() {
      this.timerInterval = setInterval(() => {
        // Force reactivity update for timer display
        this.$forceUpdate()
      }, 1000)
    },
    stopTimerUpdates() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
    },
    detectScrolling() {
      let scrollTimer = null
      window.addEventListener('scroll', () => {
        this.isScrolling = true
        clearTimeout(scrollTimer)
        scrollTimer = setTimeout(() => {
          this.isScrolling = false
        }, 150)
      })
    }
  }
}
</script>

<style scoped>
.promo-strip {
  position: sticky;
  top: 89px; /* Adjust based on header height */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  z-index: 90;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.promo-strip.is-scrolling {
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.promo-container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.promo-content {
  position: relative;
  overflow: hidden;
  min-height: 60px;
  display: flex;
  align-items: center;
}

.promo-item {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 16px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(10px);
  position: absolute;
  top: 0;
  left: 0;
}

.promo-item.active {
  opacity: 1;
  transform: translateY(0);
  position: relative;
}

.promo-item:hover {
  transform: translateY(-2px);
}

.promo-icon {
  font-size: 24px;
  flex-shrink: 0;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-3px);
  }
}

.promo-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.promo-main {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.promo-sub {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 400;
}

.promo-action {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.promo-action:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(2px);
}

.action-text {
  font-size: 14px;
  font-weight: 600;
}

.action-arrow {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.promo-action:hover .action-arrow {
  transform: translateX(3px);
}

.promo-timer {
  display: flex;
  align-items: center;
  background: rgba(255, 107, 107, 0.9);
  padding: 6px 12px;
  border-radius: 16px;
  flex-shrink: 0;
  animation: pulse 2s infinite;
}

.timer-text {
  font-size: 12px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.promo-dots {
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 2;
}

.promo-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
}

.promo-dot.active {
  background: white;
  transform: scale(1.3);
}

.promo-close {
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.promo-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .promo-container {
    padding: 0 16px;
  }
  
  .promo-item {
    gap: 12px;
  }
  
  .promo-icon {
    font-size: 20px;
  }
  
  .promo-main {
    font-size: 14px;
  }
  
  .promo-sub {
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .promo-strip {
    top: 85px; /* Adjust for mobile header */
  }
  
  .promo-content {
    min-height: 50px;
  }
  
  .promo-item {
    padding: 12px 0;
    gap: 10px;
  }
  
  .promo-text {
    min-width: 0; /* Allow text to shrink */
  }
  
  .promo-main {
    font-size: 13px;
  }
  
  .promo-sub {
    font-size: 11px;
  }
  
  .promo-action {
    padding: 6px 12px;
  }
  
  .action-text {
    font-size: 12px;
  }
  
  .promo-close {
    right: 12px;
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .promo-container {
    padding: 0 12px;
  }
  
  .promo-item {
    gap: 8px;
    padding: 10px 0;
  }
  
  .promo-icon {
    font-size: 18px;
  }
  
  .promo-main {
    font-size: 12px;
  }
  
  .promo-sub {
    display: none; /* Hide subtitle on very small screens */
  }
  
  .promo-action {
    padding: 4px 8px;
  }
  
  .action-text {
    font-size: 11px;
  }
  
  .promo-timer {
    padding: 4px 8px;
  }
  
  .timer-text {
    font-size: 11px;
  }
  
  .promo-dots {
    display: none; /* Hide dots on very small screens */
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .promo-strip {
    background: #000;
    border-bottom: 2px solid #fff;
  }
  
  .promo-action {
    background: #fff;
    color: #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .promo-item {
    transition: none;
  }
  
  .promo-icon {
    animation: none;
  }
  
  .promo-timer {
    animation: none;
  }
  
  .action-arrow {
    transition: none;
  }
}
</style>
