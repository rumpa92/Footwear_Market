<template>
  <div 
    class="enhanced-product-card"
    :class="{ 
      'recently-viewed': product.lastViewed,
      'has-quick-add': product.quickAddAvailable 
    }"
    @click="handleProductClick"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- Product Image -->
    <div class="product-image-container">
      <div class="image-wrapper">
        <img 
          :src="product.image" 
          :alt="product.name"
          class="product-image"
          :class="{ 'loading': imageLoading }"
          @load="imageLoading = false"
          @error="handleImageError"
        >
        
        <!-- Image Overlay Elements -->
        <div class="image-overlay">
          <!-- Product Badges -->
          <div class="product-badges">
            <span v-if="product.isNew" class="badge badge-new">New</span>
            <span v-if="product.onSale" class="badge badge-sale">
              -{{ Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) }}%
            </span>
            <span v-if="product.lastViewed" class="badge badge-viewed">Recently Viewed</span>
          </div>
          
          <!-- Quick Actions -->
          <div class="quick-actions">
            <button 
              class="quick-action favorite"
              :class="{ active: isFavorite }"
              @click.stop="toggleFavorite"
              title="Add to Wishlist"
            >
              ❤️
            </button>
            <button 
              class="quick-action quick-view"
              @click.stop="openQuickView"
              title="Quick View"
            >
              👁️
            </button>
          </div>
          
          <!-- Quick Add Button -->
          <div 
            v-if="product.quickAddAvailable && product.sizePreference"
            class="quick-add-overlay"
          >
            <button 
              class="quick-add-btn"
              @click.stop="quickAddToCart"
              :disabled="quickAddLoading"
            >
              <span v-if="quickAddLoading" class="loading-spinner"></span>
              <span v-else>Quick Add ({{ product.sizePreference }})</span>
            </button>
          </div>
        </div>
        
        <!-- View Count Badge -->
        <div v-if="product.viewCount" class="view-count">
          👀 {{ formatViewCount(product.viewCount) }}
        </div>
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="product-info">
      <!-- Brand & Category -->
      <div class="product-meta">
        <span class="product-brand">{{ product.brand }}</span>
        <span class="product-category">{{ product.category }}</span>
      </div>
      
      <!-- Product Name -->
      <h3 class="product-name">{{ product.name }}</h3>
      
      <!-- Rating & Reviews -->
      <div class="product-rating">
        <div class="stars">
          <span 
            v-for="n in 5" 
            :key="n" 
            class="star"
            :class="{ filled: n <= Math.floor(product.rating) }"
          >
            ★
          </span>
        </div>
        <span class="rating-text">({{ product.reviews }})</span>
        <span v-if="product.trending" class="trending-indicator">🔥</span>
      </div>
      
      <!-- Price -->
      <div class="product-price">
        <span class="current-price">${{ product.price }}</span>
        <span 
          v-if="product.onSale && product.originalPrice > product.price" 
          class="original-price"
        >
          ${{ product.originalPrice }}
        </span>
      </div>
      
      <!-- Size Options (for quick add) -->
      <div v-if="showSizeOptions" class="size-options">
        <button
          v-for="size in product.sizes.slice(0, 4)"
          :key="size"
          class="size-option"
          :class="{ selected: selectedSize === size }"
          @click.stop="selectSize(size)"
        >
          {{ size }}
        </button>
        <span v-if="product.sizes.length > 4" class="more-sizes">
          +{{ product.sizes.length - 4 }} more
        </span>
      </div>
      
      <!-- Action Buttons -->
      <div class="product-actions">
        <button 
          v-if="!product.quickAddAvailable"
          class="action-btn primary"
          @click.stop="addToCart"
        >
          Add to Cart
        </button>
        <button 
          v-else
          class="action-btn outline"
          @click.stop="showSizeSelector"
        >
          Select Size
        </button>
      </div>
    </div>
    
    <!-- Long Press Tooltip -->
    <div v-if="showLongPressTooltip" class="long-press-tooltip">
      Hold for Quick View
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'EnhancedProductCard',
  props: {
    product: {
      type: Object,
      required: true
    },
    section: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      imageLoading: true,
      quickAddLoading: false,
      selectedSize: null,
      showSizeOptions: false,
      showLongPressTooltip: false,
      touchStartTime: 0,
      longPressTimer: null,
      longPressThreshold: 500
    }
  },
  computed: {
    ...mapState(['user']),
    isFavorite() {
      return this.user.favorites.includes(this.product.id)
    }
  },
  mounted() {
    if (this.product.sizePreference) {
      this.selectedSize = this.product.sizePreference
    }
  },
  methods: {
    handleProductClick() {
      this.$emit('product-click', this.product)
      // Track product view
      this.trackProductView()
    },
    handleTouchStart(event) {
      this.touchStartTime = Date.now()
      this.longPressTimer = setTimeout(() => {
        this.handleLongPress()
      }, this.longPressThreshold)
    },
    handleTouchEnd(event) {
      const touchDuration = Date.now() - this.touchStartTime
      clearTimeout(this.longPressTimer)
      
      if (touchDuration < this.longPressThreshold) {
        // Regular tap
        this.handleProductClick()
      }
    },
    handleLongPress() {
      navigator.vibrate?.(50) // Haptic feedback if available
      this.$emit('long-press', this.product)
      this.openQuickView()
    },
    toggleFavorite() {
      this.$emit('toggle-favorite', this.product.id)
      
      // Visual feedback
      const button = event.target.closest('.favorite')
      button.classList.add('bounce')
      setTimeout(() => {
        button.classList.remove('bounce')
      }, 300)
    },
    openQuickView() {
      this.$emit('quick-view', this.product)
    },
    async quickAddToCart() {
      if (!this.product.sizePreference) return
      
      this.quickAddLoading = true
      
      try {
        // Simulate quick add delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        this.$emit('add-to-cart', {
          product: this.product,
          size: this.product.sizePreference,
          color: this.product.colors[0] // Default color
        })
        
        // Show success feedback
        this.showSuccessAnimation()
        
      } catch (error) {
        console.error('Quick add failed:', error)
      } finally {
        this.quickAddLoading = false
      }
    },
    addToCart() {
      if (!this.selectedSize) {
        this.showSizeSelector()
        return
      }
      
      this.$emit('add-to-cart', {
        product: this.product,
        size: this.selectedSize,
        color: this.product.colors[0]
      })
    },
    showSizeSelector() {
      this.showSizeOptions = !this.showSizeOptions
    },
    selectSize(size) {
      this.selectedSize = size
      this.showSizeOptions = false
    },
    showSuccessAnimation() {
      // Create floating success message
      const card = this.$el
      const success = document.createElement('div')
      success.textContent = '✅ Added to Cart!'
      success.className = 'success-float'
      success.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #28a745;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        z-index: 1000;
        animation: successFloat 2s ease-out forwards;
      `
      
      card.appendChild(success)
      
      // Add CSS animation
      if (!document.querySelector('#success-animation-styles')) {
        const style = document.createElement('style')
        style.id = 'success-animation-styles'
        style.textContent = `
          @keyframes successFloat {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
            20% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1.1);
            }
            80% {
              opacity: 1;
              transform: translate(-50%, -60%) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -80%) scale(0.9);
            }
          }
        `
        document.head.appendChild(style)
      }
      
      setTimeout(() => {
        card.removeChild(success)
      }, 2000)
    },
    formatViewCount(count) {
      if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k'
      }
      return count.toString()
    },
    trackProductView() {
      // Analytics tracking
      console.log(`Product viewed: ${this.product.name} in section: ${this.section}`)
    },
    handleImageError() {
      this.imageLoading = false
      // Could set a fallback image here
    }
  }
}
</script>

<style scoped>
.enhanced-product-card {
  position: relative;
  width: 280px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.enhanced-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.enhanced-product-card.recently-viewed {
  border: 2px solid #667eea;
}

.enhanced-product-card.recently-viewed::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
  background-size: 200% 200%;
  border-radius: 18px;
  z-index: -1;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Image Container */
.product-image-container {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-image.loading {
  filter: blur(5px);
}

.enhanced-product-card:hover .product-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.1) 0%,
    transparent 30%,
    transparent 70%,
    rgba(0, 0, 0, 0.2) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.enhanced-product-card:hover .image-overlay {
  opacity: 1;
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-new {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.badge-sale {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.badge-viewed {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.quick-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
}

.enhanced-product-card:hover .quick-actions {
  opacity: 1;
  transform: translateX(0);
}

.quick-action {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.quick-action:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.quick-action.favorite.active {
  background: #ff6b6b;
  color: white;
}

.quick-action.bounce {
  animation: bounce 0.3s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.quick-add-overlay {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
}

.enhanced-product-card:hover .quick-add-overlay {
  opacity: 1;
  transform: translateY(0);
}

.quick-add-btn {
  width: 100%;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 12px;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.quick-add-btn:hover:not(:disabled) {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.quick-add-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid #e9ecef;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.view-count {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
}

/* Product Info */
.product-info {
  padding: 20px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.product-brand {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.product-category {
  font-size: 10px;
  color: #999;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 6px;
  text-transform: uppercase;
  font-weight: 500;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 1px;
}

.star {
  color: #ddd;
  font-size: 12px;
}

.star.filled {
  color: #ffd700;
}

.rating-text {
  font-size: 11px;
  color: #666;
}

.trending-indicator {
  font-size: 12px;
  animation: pulse 2s infinite;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.size-options {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.size-option {
  width: 32px;
  height: 32px;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}

.size-option:hover {
  border-color: #667eea;
  color: #667eea;
}

.size-option.selected {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.more-sizes {
  font-size: 10px;
  color: #999;
  font-weight: 500;
}

.product-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 14px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-btn.outline {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.action-btn.outline:hover {
  background: #667eea;
  color: white;
}

.long-press-tooltip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  z-index: 100;
  animation: tooltipFade 0.3s ease;
}

@keyframes tooltipFade {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .enhanced-product-card {
    width: 240px;
  }
  
  .product-image-container {
    height: 180px;
  }
  
  .product-info {
    padding: 16px;
  }
  
  .product-name {
    font-size: 14px;
  }
  
  .current-price {
    font-size: 16px;
  }
  
  .quick-actions {
    opacity: 1;
    transform: translateX(0);
  }
  
  .quick-add-overlay {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .enhanced-product-card {
    width: 200px;
  }
  
  .product-image-container {
    height: 150px;
  }
  
  .product-info {
    padding: 12px;
  }
  
  .quick-action {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .enhanced-product-card,
  .product-image,
  .quick-actions,
  .quick-add-overlay {
    transition: none;
  }
  
  .enhanced-product-card:hover {
    transform: none;
  }
  
  .trending-indicator {
    animation: none;
  }
}
</style>
