<template>
  <div class="hero-carousel">
    <div class="carousel-container" ref="carouselContainer">
      <div 
        class="carousel-track"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="carousel-slide"
          :class="{ active: index === currentSlide }"
          @click="handleSlideClick(slide)"
        >
          <div class="slide-background" :style="{ backgroundImage: `url(${slide.backgroundImage})` }">
            <div class="slide-overlay"></div>
          </div>
          
          <div class="slide-content">
            <div class="slide-text">
              <div class="slide-badge" v-if="slide.badge">
                {{ slide.badge }}
              </div>
              <h1 class="slide-title" v-html="slide.title"></h1>
              <p class="slide-subtitle">{{ slide.subtitle }}</p>
              <div class="slide-actions">
                <button class="slide-cta primary" @click.stop="handleCTAClick(slide.primaryCTA)">
                  {{ slide.primaryCTA.text }}
                </button>
                <button 
                  v-if="slide.secondaryCTA"
                  class="slide-cta secondary" 
                  @click.stop="handleCTAClick(slide.secondaryCTA)"
                >
                  {{ slide.secondaryCTA.text }}
                </button>
              </div>
            </div>
            
            <div class="slide-visual" v-if="slide.productImage">
              <img :src="slide.productImage" :alt="slide.title" class="product-image">
              <div class="floating-elements">
                <div class="price-tag" v-if="slide.price">
                  <span class="currency">$</span>
                  <span class="amount">{{ slide.price }}</span>
                  <span v-if="slide.originalPrice" class="original-price">${{ slide.originalPrice }}</span>
                </div>
                <div class="discount-badge" v-if="slide.discount">
                  {{ slide.discount }}% OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Navigation Dots -->
      <div class="carousel-dots">
        <button
          v-for="(slide, index) in slides"
          :key="`dot-${slide.id}`"
          class="carousel-dot"
          :class="{ active: index === currentSlide }"
          @click="goToSlide(index)"
        ></button>
      </div>
      
      <!-- Navigation Arrows -->
      <button class="carousel-nav prev" @click="previousSlide" :disabled="currentSlide === 0">
        <span>‹</span>
      </button>
      <button class="carousel-nav next" @click="nextSlide" :disabled="currentSlide === slides.length - 1">
        <span>›</span>
      </button>
      
      <!-- Progress Bar -->
      <div class="carousel-progress">
        <div 
          class="progress-fill"
          :style="{ 
            width: `${progressWidth}%`,
            animationDuration: `${autoSlideInterval}ms`
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroCarousel',
  data() {
    return {
      currentSlide: 0,
      autoSlideTimer: null,
      autoSlideInterval: 4000,
      touchStartX: 0,
      touchEndX: 0,
      isUserInteracting: false,
      progressWidth: 0,
      slides: [
        {
          id: 1,
          title: 'Winter Collection<br><span class="highlight">2024</span>',
          subtitle: 'Stay warm, stay stylish with our premium winter footwear',
          badge: 'New Arrival',
          backgroundImage: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=1200&h=600&fit=crop',
          productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
          price: 159,
          originalPrice: 199,
          discount: 20,
          primaryCTA: {
            text: 'Shop Winter',
            action: 'category',
            target: 'winter-collection'
          },
          secondaryCTA: {
            text: 'View All',
            action: 'browse',
            target: 'all-shoes'
          }
        },
        {
          id: 2,
          title: '<span class="highlight">Athletic</span><br>Performance',
          subtitle: 'Professional-grade athletic footwear for peak performance',
          badge: 'Best Sellers',
          backgroundImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop',
          productImage: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop',
          price: 180,
          primaryCTA: {
            text: 'Shop Athletic',
            action: 'category',
            target: 'athletic'
          },
          secondaryCTA: {
            text: 'Size Guide',
            action: 'info',
            target: 'size-guide'
          }
        },
        {
          id: 3,
          title: 'Limited Edition<br><span class="highlight">Collaborations</span>',
          subtitle: 'Exclusive designer partnerships you won\'t find anywhere else',
          badge: 'Exclusive',
          backgroundImage: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&h=600&fit=crop',
          productImage: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop',
          price: 250,
          originalPrice: 320,
          discount: 22,
          primaryCTA: {
            text: 'Shop Limited',
            action: 'category',
            target: 'limited-edition'
          },
          secondaryCTA: {
            text: 'Learn More',
            action: 'info',
            target: 'collaborations'
          }
        },
        {
          id: 4,
          title: 'Sustainable<br><span class="highlight">Future</span>',
          subtitle: 'Eco-friendly footwear made from recycled materials',
          badge: 'Eco-Friendly',
          backgroundImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=600&fit=crop',
          productImage: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop',
          price: 135,
          primaryCTA: {
            text: 'Shop Sustainable',
            action: 'category',
            target: 'eco-friendly'
          },
          secondaryCTA: {
            text: 'Our Mission',
            action: 'info',
            target: 'sustainability'
          }
        }
      ]
    }
  },
  mounted() {
    this.startAutoSlide()
    this.updateProgress()
  },
  beforeDestroy() {
    this.stopAutoSlide()
  },
  methods: {
    startAutoSlide() {
      this.autoSlideTimer = setInterval(() => {
        if (!this.isUserInteracting) {
          this.nextSlide()
        }
      }, this.autoSlideInterval)
    },
    stopAutoSlide() {
      if (this.autoSlideTimer) {
        clearInterval(this.autoSlideTimer)
        this.autoSlideTimer = null
      }
    },
    resetAutoSlide() {
      this.stopAutoSlide()
      this.progressWidth = 0
      setTimeout(() => {
        this.startAutoSlide()
        this.updateProgress()
      }, 100)
    },
    updateProgress() {
      this.progressWidth = 0
      setTimeout(() => {
        this.progressWidth = 100
      }, 100)
    },
    nextSlide() {
      if (this.currentSlide < this.slides.length - 1) {
        this.currentSlide++
      } else {
        this.currentSlide = 0
      }
      this.updateProgress()
    },
    previousSlide() {
      if (this.currentSlide > 0) {
        this.currentSlide--
      } else {
        this.currentSlide = this.slides.length - 1
      }
      this.resetAutoSlide()
    },
    goToSlide(index) {
      this.currentSlide = index
      this.resetAutoSlide()
    },
    handleSlideClick(slide) {
      this.handleCTAClick(slide.primaryCTA)
    },
    handleCTAClick(cta) {
      console.log('CTA clicked:', cta)
      this.$emit('cta-click', cta)
      // Would implement navigation logic based on action type
    },
    handleTouchStart(event) {
      this.isUserInteracting = true
      this.touchStartX = event.touches[0].clientX
    },
    handleTouchMove(event) {
      event.preventDefault()
      this.touchEndX = event.touches[0].clientX
    },
    handleTouchEnd() {
      this.isUserInteracting = false
      const swipeThreshold = 50
      const swipeDistance = this.touchStartX - this.touchEndX
      
      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          this.nextSlide()
        } else {
          this.previousSlide()
        }
      }
      
      this.touchStartX = 0
      this.touchEndX = 0
    }
  }
}
</script>

<style scoped>
.hero-carousel {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 20px;
  margin-bottom: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
  position: relative;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  cursor: pointer;
  overflow: hidden;
}

.slide-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: transform 0.6s ease;
}

.carousel-slide:hover .slide-background {
  transform: scale(1.05);
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.slide-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 60px;
  z-index: 2;
}

.slide-text {
  flex: 1;
  max-width: 500px;
  color: white;
  animation: slideInLeft 0.8s ease-out;
}

.slide-badge {
  display: inline-block;
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.slide-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 16px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.slide-title .highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.slide-subtitle {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 32px;
  opacity: 0.9;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.slide-actions {
  display: flex;
  gap: 16px;
}

.slide-cta {
  padding: 16px 32px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.slide-cta.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.slide-cta.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.slide-cta.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.slide-cta.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
}

.slide-visual {
  position: relative;
  flex-shrink: 0;
  animation: slideInRight 0.8s ease-out;
}

.product-image {
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.carousel-slide:hover .product-image {
  transform: scale(1.05) rotate(2deg);
}

.floating-elements {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-tag {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 12px 16px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.currency {
  font-size: 14px;
  color: #666;
}

.amount {
  font-size: 24px;
  font-weight: 800;
  color: #333;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.discount-badge {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  animation: pulse 2s infinite;
}

.carousel-dots {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 3;
}

.carousel-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-dot.active {
  background: white;
  transform: scale(1.2);
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.carousel-nav:hover:not(:disabled) {
  background: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.carousel-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-nav.prev {
  left: 24px;
}

.carousel-nav.next {
  right: 24px;
}

.carousel-nav span {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.carousel-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 3;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width linear;
  width: 0%;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-carousel {
    height: 400px;
  }
  
  .slide-content {
    padding: 40px;
  }
  
  .slide-title {
    font-size: 36px;
  }
  
  .product-image {
    width: 250px;
    height: 250px;
  }
}

@media (max-width: 768px) {
  .hero-carousel {
    height: 350px;
    border-radius: 16px;
  }
  
  .slide-content {
    flex-direction: column;
    text-align: center;
    padding: 32px 24px;
    gap: 24px;
  }
  
  .slide-text {
    max-width: 100%;
  }
  
  .slide-title {
    font-size: 28px;
  }
  
  .slide-subtitle {
    font-size: 16px;
  }
  
  .slide-actions {
    justify-content: center;
  }
  
  .slide-cta {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .product-image {
    width: 200px;
    height: 200px;
  }
  
  .carousel-nav {
    width: 40px;
    height: 40px;
  }
  
  .carousel-nav span {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .hero-carousel {
    height: 300px;
    border-radius: 12px;
  }
  
  .slide-content {
    padding: 24px 16px;
  }
  
  .slide-title {
    font-size: 24px;
  }
  
  .slide-subtitle {
    font-size: 14px;
  }
  
  .slide-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .slide-cta {
    width: 100%;
  }
  
  .product-image {
    width: 150px;
    height: 150px;
  }
  
  .carousel-nav {
    display: none; /* Hide on very small screens */
  }
  
  .floating-elements {
    position: static;
    flex-direction: row;
    justify-content: center;
    margin-top: 12px;
  }
}
</style>
