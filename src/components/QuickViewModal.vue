<template>
  <div class="quick-view-modal" :class="{ open: isVisible }" @click="closeModal">
    <div class="modal-overlay"></div>
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <!-- Close Button -->
        <button class="modal-close" @click="closeModal">✕</button>
        
        <!-- Product Images -->
        <div class="product-images">
          <div class="main-image">
            <img 
              :src="currentImage" 
              :alt="product.name"
              class="main-product-image"
              @load="imageLoaded = true"
            >
            
            <!-- Image Navigation -->
            <button 
              v-if="product.images && product.images.length > 1"
              class="image-nav prev"
              @click="previousImage"
              :disabled="currentImageIndex === 0"
            >
              ‹
            </button>
            <button 
              v-if="product.images && product.images.length > 1"
              class="image-nav next"
              @click="nextImage"
              :disabled="currentImageIndex === product.images.length - 1"
            >
              ›
            </button>
            
            <!-- Image Indicators -->
            <div v-if="product.images && product.images.length > 1" class="image-indicators">
              <button
                v-for="(image, index) in product.images"
                :key="index"
                class="indicator"
                :class="{ active: index === currentImageIndex }"
                @click="setCurrentImage(index)"
              ></button>
            </div>
          </div>
          
          <!-- Thumbnail Images -->
          <div v-if="product.images && product.images.length > 1" class="thumbnail-images">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              class="thumbnail"
              :class="{ active: index === currentImageIndex }"
              @click="setCurrentImage(index)"
            >
              <img :src="image" :alt="`${product.name} ${index + 1}`">
            </button>
          </div>
        </div>
        
        <!-- Product Details -->
        <div class="product-details">
          <!-- Product Header -->
          <div class="product-header">
            <div class="product-badges">
              <span v-if="product.isNew" class="badge badge-new">New</span>
              <span v-if="product.onSale" class="badge badge-sale">Sale</span>
              <span v-if="product.trending" class="badge badge-trending">🔥 Trending</span>
            </div>
            
            <button 
              class="favorite-btn"
              :class="{ active: isFavorite }"
              @click="toggleFavorite"
            >
              ❤️
            </button>
          </div>
          
          <!-- Product Info -->
          <div class="product-info">
            <h2 class="product-title">{{ product.name }}</h2>
            <p class="product-brand">{{ product.brand }}</p>
            
            <!-- Rating -->
            <div class="product-rating">
              <div class="stars">
                <span 
                  v-for="n in 5" 
                  :key="n" 
                  class="star"
                  :class="{ filled: n <= Math.floor(product.rating) }"
                >★</span>
              </div>
              <span class="rating-text">{{ product.rating }} ({{ product.reviews }} reviews)</span>
            </div>
            
            <!-- Price -->
            <div class="product-price">
              <span class="current-price">${{ product.price }}</span>
              <span 
                v-if="product.onSale && product.originalPrice > product.price" 
                class="original-price"
              >${{ product.originalPrice }}</span>
              <span v-if="product.onSale" class="discount-percentage">
                {{ Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) }}% OFF
              </span>
            </div>
            
            <!-- Product Description -->
            <div class="product-description">
              <p>{{ product.description || 'Premium quality footwear designed for comfort and style. Made with high-quality materials and expert craftsmanship.' }}</p>
            </div>
          </div>
          
          <!-- Product Options -->
          <div class="product-options">
            <!-- Size Selection -->
            <div class="size-selection">
              <div class="option-header">
                <h4>Size</h4>
                <button class="size-guide-btn" @click="showSizeGuide">📏 Size Guide</button>
              </div>
              <div class="size-grid">
                <button
                  v-for="size in product.sizes"
                  :key="size"
                  class="size-option"
                  :class="{ 
                    selected: selectedSize === size,
                    'out-of-stock': isOutOfStock(size)
                  }"
                  @click="selectSize(size)"
                  :disabled="isOutOfStock(size)"
                >
                  {{ size }}
                </button>
              </div>
              <p v-if="!selectedSize" class="size-warning">Please select a size</p>
            </div>
            
            <!-- Color Selection -->
            <div v-if="product.colors && product.colors.length > 1" class="color-selection">
              <div class="option-header">
                <h4>Color</h4>
              </div>
              <div class="color-options">
                <button
                  v-for="color in product.colors"
                  :key="color"
                  class="color-option"
                  :class="{ selected: selectedColor === color }"
                  @click="selectColor(color)"
                  :title="color"
                >
                  <span class="color-preview" :style="{ backgroundColor: getColorHex(color) }"></span>
                  <span class="color-name">{{ color }}</span>
                </button>
              </div>
            </div>
            
            <!-- Quantity -->
            <div class="quantity-selection">
              <h4>Quantity</h4>
              <div class="quantity-controls">
                <button 
                  class="qty-btn"
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                >-</button>
                <span class="quantity">{{ quantity }}</span>
                <button 
                  class="qty-btn"
                  @click="increaseQuantity"
                  :disabled="quantity >= 10"
                >+</button>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="action-buttons">
            <button 
              class="add-to-cart-btn"
              :disabled="!selectedSize || addingToCart"
              @click="addToCart"
            >
              <span v-if="addingToCart" class="loading-spinner"></span>
              <span v-else>🛒 Add to Cart</span>
            </button>
            
            <button class="buy-now-btn" :disabled="!selectedSize" @click="buyNow">
              ⚡ Buy Now
            </button>
          </div>
          
          <!-- Additional Info -->
          <div class="additional-info">
            <div class="info-tabs">
              <button
                v-for="tab in infoTabs"
                :key="tab.id"
                class="info-tab"
                :class="{ active: activeTab === tab.id }"
                @click="setActiveTab(tab.id)"
              >
                {{ tab.name }}
              </button>
            </div>
            
            <div class="tab-content">
              <div v-if="activeTab === 'details'" class="details-content">
                <ul>
                  <li>Premium quality materials</li>
                  <li>Comfortable cushioned sole</li>
                  <li>Durable construction</li>
                  <li>Available in multiple sizes</li>
                </ul>
              </div>
              
              <div v-if="activeTab === 'shipping'" class="shipping-content">
                <div class="shipping-option">
                  <span class="shipping-icon">🚚</span>
                  <div>
                    <strong>Free Standard Shipping</strong>
                    <p>5-7 business days</p>
                  </div>
                </div>
                <div class="shipping-option">
                  <span class="shipping-icon">⚡</span>
                  <div>
                    <strong>Express Shipping - $9.99</strong>
                    <p>2-3 business days</p>
                  </div>
                </div>
              </div>
              
              <div v-if="activeTab === 'returns'" class="returns-content">
                <p><strong>30-Day Free Returns</strong></p>
                <p>Easy returns and exchanges. No questions asked.</p>
                <button class="return-policy-btn">View Return Policy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'QuickViewModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      currentImageIndex: 0,
      selectedSize: null,
      selectedColor: null,
      quantity: 1,
      addingToCart: false,
      imageLoaded: false,
      activeTab: 'details',
      infoTabs: [
        { id: 'details', name: 'Details' },
        { id: 'shipping', name: 'Shipping' },
        { id: 'returns', name: 'Returns' }
      ]
    }
  },
  computed: {
    ...mapState(['user']),
    isVisible() {
      return this.visible && Object.keys(this.product).length > 0
    },
    currentImage() {
      if (this.product.images && this.product.images.length > 0) {
        return this.product.images[this.currentImageIndex]
      }
      return this.product.image || ''
    },
    isFavorite() {
      return this.user.favorites.includes(this.product.id)
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.resetModal()
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    product: {
      handler(newProduct) {
        if (newProduct && Object.keys(newProduct).length > 0) {
          this.initializeProduct()
        }
      },
      deep: true
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    resetModal() {
      this.currentImageIndex = 0
      this.selectedSize = null
      this.selectedColor = null
      this.quantity = 1
      this.addingToCart = false
      this.imageLoaded = false
      this.activeTab = 'details'
    },
    initializeProduct() {
      // Set default color if available
      if (this.product.colors && this.product.colors.length > 0) {
        this.selectedColor = this.product.colors[0]
      }
      
      // Generate additional images if not provided
      if (!this.product.images) {
        this.product.images = [
          this.product.image,
          // Add some variation to the main image
          this.product.image.replace('400', '400&rotate=10'),
          this.product.image.replace('400', '400&sepia=20')
        ].filter(Boolean)
      }
    },
    previousImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--
      }
    },
    nextImage() {
      if (this.currentImageIndex < this.product.images.length - 1) {
        this.currentImageIndex++
      }
    },
    setCurrentImage(index) {
      this.currentImageIndex = index
    },
    selectSize(size) {
      this.selectedSize = size
    },
    selectColor(color) {
      this.selectedColor = color
    },
    isOutOfStock(size) {
      // Mock out of stock logic
      return Math.random() < 0.1 // 10% chance of being out of stock
    },
    getColorHex(colorName) {
      const colorMap = {
        'Black': '#000000',
        'White': '#FFFFFF',
        'Red': '#FF0000',
        'Blue': '#0000FF',
        'Green': '#008000',
        'Brown': '#8B4513',
        'Grey': '#808080',
        'Navy': '#000080',
        'Maroon': '#800000'
      }
      return colorMap[colorName] || '#ccc'
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    increaseQuantity() {
      if (this.quantity < 10) {
        this.quantity++
      }
    },
    async addToCart() {
      if (!this.selectedSize) return
      
      this.addingToCart = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        for (let i = 0; i < this.quantity; i++) {
          this.$emit('add-to-cart', {
            product: this.product,
            size: this.selectedSize,
            color: this.selectedColor || this.product.colors[0]
          })
        }
        
        this.showSuccessMessage()
        
      } catch (error) {
        console.error('Add to cart failed:', error)
      } finally {
        this.addingToCart = false
      }
    },
    buyNow() {
      this.addToCart()
      setTimeout(() => {
        this.closeModal()
        // Would navigate to checkout
        console.log('Navigate to checkout')
      }, 1000)
    },
    toggleFavorite() {
      this.$emit('toggle-favorite', this.product.id)
    },
    setActiveTab(tabId) {
      this.activeTab = tabId
    },
    showSizeGuide() {
      console.log('Show size guide')
      // Would open size guide modal
    },
    showSuccessMessage() {
      // Create floating success message
      const modal = this.$el
      const success = document.createElement('div')
      success.textContent = '✅ Added to Cart!'
      success.className = 'success-message'
      success.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #28a745;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1001;
        animation: successPop 2s ease-out forwards;
      `
      
      modal.appendChild(success)
      
      // Add CSS animation if not exists
      if (!document.querySelector('#success-pop-styles')) {
        const style = document.createElement('style')
        style.id = 'success-pop-styles'
        style.textContent = `
          @keyframes successPop {
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
              transform: translate(-50%, -50%) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.9);
            }
          }
        `
        document.head.appendChild(style)
      }
      
      setTimeout(() => {
        if (modal.contains(success)) {
          modal.removeChild(success)
        }
      }, 2000)
    }
  }
}
</script>

<style scoped>
.quick-view-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.quick-view-modal.open {
  visibility: visible;
  opacity: 1;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  transform: scale(0.9);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.quick-view-modal.open .modal-container {
  transform: scale(1);
}

.modal-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 500px;
  max-height: 90vh;
  overflow: hidden;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #333;
  z-index: 10;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: white;
  transform: scale(1.1);
}

/* Product Images */
.product-images {
  position: relative;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.main-image {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.main-product-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.image-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #333;
  transition: all 0.2s ease;
}

.image-nav:hover:not(:disabled) {
  background: white;
  transform: translateY(-50%) scale(1.1);
}

.image-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.image-nav.prev {
  left: 20px;
}

.image-nav.next {
  right: 20px;
}

.image-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.5);
}

.thumbnail-images {
  display: flex;
  gap: 8px;
  padding: 16px;
  overflow-x: auto;
}

.thumbnail {
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.thumbnail:hover {
  border-color: #667eea;
}

.thumbnail.active {
  border-color: #667eea;
  transform: scale(1.05);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Details */
.product-details {
  padding: 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.product-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
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

.badge-trending {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  color: white;
}

.favorite-btn {
  width: 40px;
  height: 40px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  border-color: #ff6b6b;
  background: #fff5f5;
}

.favorite-btn.active {
  background: #ff6b6b;
  border-color: #ff6b6b;
  color: white;
}

.product-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.product-brand {
  font-size: 16px;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 12px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 16px;
}

.star.filled {
  color: #ffd700;
}

.rating-text {
  font-size: 14px;
  color: #666;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.current-price {
  font-size: 32px;
  font-weight: 800;
  color: #333;
}

.original-price {
  font-size: 20px;
  color: #999;
  text-decoration: line-through;
}

.discount-percentage {
  background: #ff6b6b;
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.product-description {
  color: #666;
  line-height: 1.6;
}

/* Product Options */
.size-selection,
.color-selection,
.quantity-selection {
  margin-bottom: 20px;
}

.option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.option-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.size-guide-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-decoration: underline;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 8px;
}

.size-option {
  padding: 12px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  text-align: center;
}

.size-option:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.size-option.selected {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.size-option.out-of-stock {
  background: #f8f9fa;
  color: #ccc;
  cursor: not-allowed;
  text-decoration: line-through;
}

.size-warning {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 8px;
}

.color-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-option:hover {
  border-color: #667eea;
}

.color-option.selected {
  border-color: #667eea;
  background: #f8f9ff;
}

.color-preview {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.color-name {
  font-size: 12px;
  font-weight: 600;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity {
  font-size: 18px;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.add-to-cart-btn,
.buy-now-btn {
  flex: 1;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-to-cart-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.buy-now-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.buy-now-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}

.add-to-cart-btn:disabled,
.buy-now-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Additional Info */
.info-tabs {
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 16px;
}

.info-tab {
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.info-tab:hover {
  color: #667eea;
}

.info-tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  min-height: 100px;
}

.details-content ul {
  list-style: none;
  padding: 0;
}

.details-content li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
}

.details-content li:before {
  content: '✓';
  color: #28a745;
  font-weight: bold;
  margin-right: 8px;
}

.shipping-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.shipping-icon {
  font-size: 20px;
}

.returns-content p {
  margin-bottom: 12px;
  color: #666;
}

.return-policy-btn {
  background: none;
  border: 1px solid #667eea;
  color: #667eea;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.return-policy-btn:hover {
  background: #667eea;
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }
  
  .modal-content {
    grid-template-columns: 1fr;
    max-height: 95vh;
  }
  
  .product-details {
    padding: 24px;
  }
  
  .main-image {
    padding: 20px;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .current-price {
    font-size: 28px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .modal-container {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
  
  .product-details {
    padding: 20px;
  }
  
  .size-grid {
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  }
}
</style>
