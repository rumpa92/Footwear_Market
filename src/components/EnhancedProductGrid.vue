<template>
  <div class="enhanced-product-grid">
    <!-- Grid Controls -->
    <div class="grid-controls">
      <div class="view-options">
        <button
          v-for="view in viewTypes"
          :key="view.type"
          :class="['view-btn', { active: currentView === view.type }]"
          @click="changeView(view.type)"
          :title="view.description"
        >
          <svg class="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path :d="view.iconPath"></path>
          </svg>
          <span class="view-label">{{ view.label }}</span>
        </button>
      </div>
      
      <div class="grid-info">
        <span class="results-count">{{ filteredProducts.length }} products</span>
        <div class="display-density">
          <label class="density-label">Density:</label>
          <input
            type="range"
            min="1"
            max="5"
            v-model="gridDensity"
            class="density-slider"
            @input="updateGridDensity"
          />
        </div>
      </div>
    </div>
    
    <!-- Product Grid -->
    <div 
      :class="[
        'products-grid',
        `view-${currentView}`,
        `density-${gridDensity}`
      ]"
    >
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        :class="['product-card', {
          'card-loading': product.loading,
          'card-favorited': isFavorited(product.id)
        }]"
        @click="selectProduct(product)"
        @mouseenter="startHover(product)"
        @mouseleave="endHover(product)"
      >
        
        <!-- Product Image Section -->
        <div class="product-image-section">
          <!-- Main Product Image with Zoom -->
          <div class="product-image-container" ref="imageContainer">
            <img
              :src="getDisplayImage(product)"
              :alt="product.name"
              class="product-image"
              @load="handleImageLoad(product)"
              @error="handleImageError(product)"
              @mousemove="handleImageMouseMove"
              @mouseleave="handleImageMouseLeave"
            />
            
            <!-- Zoom Lens (Desktop) -->
            <div 
              v-if="!isMobile && hoveredProduct === product.id && enableZoom"
              class="zoom-lens"
              :style="zoomLensStyle"
            ></div>
            
            <!-- Image Gallery Dots -->
            <div v-if="product.images && product.images.length > 1" class="image-gallery-dots">
              <button
                v-for="(image, index) in product.images"
                :key="index"
                :class="['gallery-dot', { active: product.selectedImageIndex === index }]"
                @click.stop="selectImage(product, index)"
              ></button>
            </div>
            
            <!-- Product Badges -->
            <div class="product-badges">
              <span v-if="product.isNew" class="badge new">NEW</span>
              <span v-if="product.onSale" class="badge sale">
                {{ calculateDiscount(product.price, product.originalPrice) }}% OFF
              </span>
              <span v-if="product.freeShipping" class="badge shipping">FREE SHIP</span>
              <span v-if="product.fastDelivery" class="badge fast">⚡ FAST</span>
              <span v-if="product.ecoFriendly" class="badge eco">🌱 ECO</span>
            </div>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
              <button 
                class="quick-action-btn favorite-btn"
                :class="{ active: isFavorited(product.id) }"
                @click.stop="toggleFavorite(product.id)"
                title="Add to favorites"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              
              <button 
                class="quick-action-btn compare-btn"
                :class="{ active: isInComparison(product.id) }"
                @click.stop="toggleComparison(product.id)"
                title="Add to compare"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 11V9a2 2 0 0 1 2-2h7l-3-3m0 6l3-3M21 12V8a2 2 0 0 0-2-2h-7l3-3m0 6l-3-3"></path>
                </svg>
              </button>
              
              <button 
                class="quick-action-btn quick-view-btn"
                @click.stop="openQuickView(product)"
                title="Quick view"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            
            <!-- Mobile Swipe Gallery -->
            <div v-if="isMobile && product.images && product.images.length > 1" class="mobile-gallery">
              <div class="gallery-swipe-container" ref="galleryContainer">
                <div 
                  class="gallery-swipe"
                  :style="{ transform: `translateX(-${product.selectedImageIndex * 100}%)` }"
                >
                  <img
                    v-for="(image, index) in product.images"
                    :key="index"
                    :src="image"
                    :alt="`${product.name} view ${index + 1}`"
                    class="gallery-image"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Quick Add Section -->
          <div v-if="hoveredProduct === product.id || currentView === 'list'" class="quick-add-section">
            <!-- Size Selection -->
            <div v-if="product.sizes && product.sizes.length > 0" class="quick-size-selector">
              <label class="selector-label">Size:</label>
              <div class="size-options">
                <button
                  v-for="size in product.sizes.slice(0, 4)"
                  :key="size"
                  :class="['size-option', { selected: product.selectedSize === size }]"
                  @click.stop="selectSize(product, size)"
                >
                  {{ size }}
                </button>
                <button 
                  v-if="product.sizes.length > 4"
                  class="size-option more"
                  @click.stop="showAllSizes(product)"
                >
                  +{{ product.sizes.length - 4 }}
                </button>
              </div>
            </div>
            
            <!-- Color Selection -->
            <div v-if="product.colors && product.colors.length > 0" class="quick-color-selector">
              <label class="selector-label">Color:</label>
              <div class="color-options">
                <button
                  v-for="color in product.colors.slice(0, 5)"
                  :key="color.name"
                  :class="['color-option', { selected: product.selectedColor === color.name }]"
                  :style="{ backgroundColor: color.hex }"
                  @click.stop="selectColor(product, color.name)"
                  :title="color.name"
                ></button>
                <button 
                  v-if="product.colors.length > 5"
                  class="color-option more"
                  @click.stop="showAllColors(product)"
                >
                  +{{ product.colors.length - 5 }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Product Information -->
        <div class="product-info">
          <div class="product-header">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-brand">{{ product.brand }}</p>
          </div>
          
          <!-- Product Rating -->
          <div class="product-rating">
            <div class="stars">
              <span 
                v-for="star in 5" 
                :key="star" 
                class="star"
                :class="{ 
                  filled: star <= Math.floor(product.rating),
                  half: star === Math.ceil(product.rating) && product.rating % 1 !== 0
                }"
              >
                ⭐
              </span>
            </div>
            <span class="rating-text">{{ product.rating }} ({{ product.reviews }})</span>
          </div>
          
          <!-- Product Price -->
          <div class="product-price">
            <span class="current-price">${{ product.price }}</span>
            <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
              ${{ product.originalPrice }}
            </span>
            <span v-if="product.originalPrice && product.originalPrice > product.price" class="savings">
              Save ${{ (product.originalPrice - product.price).toFixed(2) }}
            </span>
          </div>
          
          <!-- Product Features (List View) -->
          <div v-if="currentView === 'list'" class="product-features">
            <div class="feature-tags">
              <span v-for="feature in product.features" :key="feature" class="feature-tag">
                {{ feature }}
              </span>
            </div>
          </div>
          
          <!-- Availability Status -->
          <div class="availability-status">
            <span 
              :class="['availability-indicator', getAvailabilityClass(product)]"
            >
              {{ getAvailabilityText(product) }}
            </span>
            <span v-if="product.lowStock" class="low-stock-warning">
              Only {{ product.stockCount }} left!
            </span>
          </div>
          
          <!-- Add to Cart Button -->
          <div class="add-to-cart-section">
            <button 
              class="add-to-cart-btn"
              :class="{ 
                'btn-disabled': !isAddToCartEnabled(product),
                'btn-loading': product.addingToCart
              }"
              @click.stop="addToCart(product)"
              :disabled="!isAddToCartEnabled(product) || product.addingToCart"
            >
              <svg v-if="product.addingToCart" class="loading-spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <svg v-else class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>{{ getAddToCartText(product) }}</span>
            </button>
          </div>
        </div>
        
      </div>
    </div>
    
    <!-- Zoom Modal (Desktop) -->
    <div 
      v-if="!isMobile && zoomModal.show"
      class="zoom-modal"
      @click="closeZoomModal"
    >
      <div class="zoom-modal-content" @click.stop>
        <img 
          :src="zoomModal.image"
          :alt="zoomModal.productName"
          class="zoom-modal-image"
          :style="zoomModalImageStyle"
          @mousemove="handleZoomModalMouseMove"
        />
        <button class="close-zoom" @click="closeZoomModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="page-btn prev"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        ← Previous
      </button>
      
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="['page-number', { active: page === currentPage }]"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="page-btn next"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next →
      </button>
    </div>
    
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'EnhancedProductGrid',
  data() {
    return {
      currentView: 'grid', // grid, list, compact
      gridDensity: 3, // 1-5 scale
      hoveredProduct: null,
      isMobile: false,
      enableZoom: true,
      currentPage: 1,
      productsPerPage: 12,
      
      // Zoom functionality
      zoomLensStyle: {
        display: 'none',
        left: '0px',
        top: '0px'
      },
      zoomModal: {
        show: false,
        image: '',
        productName: ''
      },
      zoomModalImageStyle: {
        transform: 'scale(1)',
        transformOrigin: 'center center'
      },
      
      // View options
      viewTypes: [
        {
          type: 'grid',
          label: 'Grid',
          description: 'Standard grid view with large images',
          iconPath: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'
        },
        {
          type: 'list',
          label: 'List',
          description: 'Detailed list view with extended information',
          iconPath: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'
        },
        {
          type: 'compact',
          label: 'Compact',
          description: 'Compact grid showing more products per row',
          iconPath: 'M3 3h5v5H3zM10 3h5v5h-5zM17 3h5v5h-5zM3 10h5v5H3zM10 10h5v5h-5zM17 10h5v5h-5zM3 17h5v5H3zM10 17h5v5h-5zM17 17h5v5h-5z'
        }
      ],
      
      // Product states
      comparisonList: [],
      loadingProducts: []
    }
  },
  computed: {
    ...mapState(['filters', 'user']),
    ...mapGetters(['filteredProducts']),
    
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.productsPerPage
      const end = start + this.productsPerPage
      return this.enhancedProducts.slice(start, end)
    },
    
    enhancedProducts() {
      return this.filteredProducts.map(product => ({
        ...product,
        selectedImageIndex: 0,
        selectedSize: null,
        selectedColor: null,
        loading: this.loadingProducts.includes(product.id),
        addingToCart: false,
        // Mock additional data
        images: this.generateProductImages(product),
        colors: this.generateColorOptions(product),
        features: this.generateFeatures(product),
        stockCount: Math.floor(Math.random() * 20) + 1,
        lowStock: Math.random() < 0.3,
        freeShipping: Math.random() < 0.6,
        fastDelivery: Math.random() < 0.4,
        ecoFriendly: Math.random() < 0.2
      }))
    },
    
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.productsPerPage)
    },
    
    visiblePages() {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(this.totalPages, start + maxVisible - 1)
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    }
  },
  mounted() {
    this.checkMobile()
    this.loadSavedPreferences()
    
    window.addEventListener('resize', this.checkMobile)
    window.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile)
    window.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    // View and grid management
    changeView(viewType) {
      this.currentView = viewType
      this.savePreferences()
    },
    
    updateGridDensity() {
      this.savePreferences()
    },
    
    // Product interaction
    selectProduct(product) {
      this.$emit('product-selected', product)
      console.log('Selected product:', product.name)
    },
    
    startHover(product) {
      if (!this.isMobile) {
        this.hoveredProduct = product.id
      }
    },
    
    endHover(product) {
      if (!this.isMobile) {
        this.hoveredProduct = null
        this.resetZoom()
      }
    },
    
    // Image handling
    getDisplayImage(product) {
      if (product.images && product.images.length > 0) {
        return product.images[product.selectedImageIndex] || product.image
      }
      return product.image
    },
    
    selectImage(product, index) {
      product.selectedImageIndex = index
    },
    
    handleImageLoad(product) {
      this.loadingProducts = this.loadingProducts.filter(id => id !== product.id)
    },
    
    handleImageError(product) {
      console.warn('Failed to load image for product:', product.name)
      this.loadingProducts = this.loadingProducts.filter(id => id !== product.id)
    },
    
    // Zoom functionality
    handleImageMouseMove(event) {
      if (!this.enableZoom || this.isMobile) return
      
      const container = event.currentTarget.parentElement
      const rect = container.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const lensSize = 100
      const lensX = Math.max(0, Math.min(x - lensSize/2, rect.width - lensSize))
      const lensY = Math.max(0, Math.min(y - lensSize/2, rect.height - lensSize))
      
      this.zoomLensStyle = {
        display: 'block',
        left: lensX + 'px',
        top: lensY + 'px',
        width: lensSize + 'px',
        height: lensSize + 'px'
      }
    },
    
    handleImageMouseLeave() {
      this.resetZoom()
    },
    
    resetZoom() {
      this.zoomLensStyle.display = 'none'
    },
    
    openZoomModal(product) {
      if (this.isMobile) return
      
      this.zoomModal = {
        show: true,
        image: this.getDisplayImage(product),
        productName: product.name
      }
    },
    
    closeZoomModal() {
      this.zoomModal.show = false
    },
    
    handleZoomModalMouseMove(event) {
      const img = event.target
      const rect = img.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height
      
      this.zoomModalImageStyle = {
        transform: 'scale(2)',
        transformOrigin: `${x * 100}% ${y * 100}%`
      }
    },
    
    // Product variants
    selectSize(product, size) {
      product.selectedSize = size
    },
    
    selectColor(product, color) {
      product.selectedColor = color
      // Update main image based on color selection
      const colorIndex = product.colors.findIndex(c => c.name === color)
      if (colorIndex !== -1 && product.images) {
        product.selectedImageIndex = Math.min(colorIndex, product.images.length - 1)
      }
    },
    
    showAllSizes(product) {
      this.$emit('show-all-sizes', product)
    },
    
    showAllColors(product) {
      this.$emit('show-all-colors', product)
    },
    
    // Favorites and comparison
    toggleFavorite(productId) {
      this.$store.dispatch('toggleFavorite', productId)
    },
    
    isFavorited(productId) {
      return this.user.favorites && this.user.favorites.includes(productId)
    },
    
    toggleComparison(productId) {
      const index = this.comparisonList.indexOf(productId)
      if (index > -1) {
        this.comparisonList.splice(index, 1)
      } else {
        if (this.comparisonList.length < 4) {
          this.comparisonList.push(productId)
        } else {
          alert('You can compare up to 4 products at a time')
        }
      }
    },
    
    isInComparison(productId) {
      return this.comparisonList.includes(productId)
    },
    
    // Quick view
    openQuickView(product) {
      this.$emit('quick-view', product)
    },
    
    // Cart functionality
    isAddToCartEnabled(product) {
      // Check if required selections are made
      if (product.sizes && product.sizes.length > 0 && !product.selectedSize) {
        return false
      }
      if (product.colors && product.colors.length > 0 && !product.selectedColor) {
        return false
      }
      return !product.addingToCart && this.getAvailabilityClass(product) === 'in-stock'
    },
    
    getAddToCartText(product) {
      if (product.addingToCart) return 'Adding...'
      if (!this.isAddToCartEnabled(product)) return 'Select Options'
      return 'Add to Cart'
    },
    
    async addToCart(product) {
      if (!this.isAddToCartEnabled(product)) return
      
      product.addingToCart = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        this.$store.dispatch('addToCart', {
          product,
          size: product.selectedSize || product.sizes?.[0],
          color: product.selectedColor || product.colors?.[0]?.name || 'Default'
        })
        
        this.$emit('product-added', product)
        
        // Show success feedback
        this.showAddToCartSuccess(product)
        
      } catch (error) {
        console.error('Error adding to cart:', error)
        this.showAddToCartError()
      } finally {
        product.addingToCart = false
      }
    },
    
    showAddToCartSuccess(product) {
      // Simple success indication - in real app might show toast
      console.log('Added to cart:', product.name)
    },
    
    showAddToCartError() {
      console.error('Failed to add to cart')
    },
    
    // Availability
    getAvailabilityClass(product) {
      if (product.stockCount === 0) return 'out-of-stock'
      if (product.lowStock) return 'low-stock'
      return 'in-stock'
    },
    
    getAvailabilityText(product) {
      if (product.stockCount === 0) return 'Out of stock'
      if (product.lowStock) return 'Low stock'
      return 'In stock'
    },
    
    // Pagination
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        // Scroll to top of grid
        this.$el.scrollIntoView({ behavior: 'smooth' })
      }
    },
    
    // Utility methods
    calculateDiscount(currentPrice, originalPrice) {
      if (!originalPrice || originalPrice <= currentPrice) return 0
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    },
    
    generateProductImages(product) {
      // Mock function to generate multiple product images
      const baseImage = product.image
      return [
        baseImage,
        baseImage.replace('w=400', 'w=400&sat=-20'), // Slight variation
        baseImage.replace('w=400', 'w=400&hue=30'),   // Color variation
        baseImage.replace('w=400', 'w=400&blur=0.2')  // Detail shot
      ].slice(0, Math.floor(Math.random() * 3) + 2) // 2-4 images
    },
    
    generateColorOptions(product) {
      const colors = [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Gray', hex: '#808080' },
        { name: 'Navy', hex: '#000080' },
        { name: 'Brown', hex: '#8B4513' },
        { name: 'Red', hex: '#DC143C' },
        { name: 'Blue', hex: '#4169E1' },
        { name: 'Green', hex: '#228B22' }
      ]
      
      const shuffled = colors.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, Math.floor(Math.random() * 5) + 2) // 2-6 colors
    },
    
    generateFeatures(product) {
      const allFeatures = [
        'Breathable mesh', 'Cushioned sole', 'Non-slip grip', 
        'Waterproof', 'Lightweight', 'Arch support',
        'Memory foam', 'Flexible sole', 'Durable materials'
      ]
      
      const shuffled = allFeatures.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, Math.floor(Math.random() * 4) + 2) // 2-5 features
    },
    
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    
    handleKeydown(event) {
      // Keyboard navigation for accessibility
      if (event.key === 'Escape' && this.zoomModal.show) {
        this.closeZoomModal()
      }
    },
    
    savePreferences() {
      const preferences = {
        view: this.currentView,
        density: this.gridDensity,
        enableZoom: this.enableZoom
      }
      localStorage.setItem('gridPreferences', JSON.stringify(preferences))
    },
    
    loadSavedPreferences() {
      const saved = localStorage.getItem('gridPreferences')
      if (saved) {
        try {
          const preferences = JSON.parse(saved)
          this.currentView = preferences.view || 'grid'
          this.gridDensity = preferences.density || 3
          this.enableZoom = preferences.enableZoom !== false
        } catch (error) {
          console.error('Error loading grid preferences:', error)
        }
      }
    }
  }
}
</script>

<style scoped>
.enhanced-product-grid {
  width: 100%;
}

/* Grid Controls */
.grid-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.view-options {
  display: flex;
  gap: 8px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  font-weight: 500;
}

.view-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.view-btn.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.view-icon {
  width: 14px;
  height: 14px;
}

.grid-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.results-count {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.display-density {
  display: flex;
  align-items: center;
  gap: 8px;
}

.density-label {
  font-size: 13px;
  color: #666;
}

.density-slider {
  width: 80px;
}

/* Products Grid */
.products-grid {
  display: grid;
  gap: 20px;
  margin-bottom: 32px;
}

/* Grid View */
.products-grid.view-grid.density-1 { grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); }
.products-grid.view-grid.density-2 { grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); }
.products-grid.view-grid.density-3 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.products-grid.view-grid.density-4 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
.products-grid.view-grid.density-5 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }

/* List View */
.products-grid.view-list {
  grid-template-columns: 1fr;
  gap: 16px;
}

.products-grid.view-list .product-card {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 20px;
}

/* Compact View */
.products-grid.view-compact.density-1 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
.products-grid.view-compact.density-2 { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
.products-grid.view-compact.density-3 { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
.products-grid.view-compact.density-4 { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
.products-grid.view-compact.density-5 { grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }

/* Product Card */
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e1e5e9;
  position: relative;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.product-card.card-favorited {
  border-color: #ff6b6b;
}

/* Product Image Section */
.product-image-section {
  position: relative;
}

.product-image-container {
  position: relative;
  overflow: hidden;
  background: #f8f9fa;
}

.products-grid.view-grid .product-image-container,
.products-grid.view-compact .product-image-container {
  height: 250px;
}

.products-grid.view-list .product-image-container {
  height: 200px;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* Zoom Lens */
.zoom-lens {
  position: absolute;
  border: 2px solid #667eea;
  background: rgba(102, 126, 234, 0.2);
  pointer-events: none;
  border-radius: 50%;
  z-index: 10;
}

/* Image Gallery */
.image-gallery-dots {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4px;
}

.gallery-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
}

.gallery-dot.active {
  background: white;
  transform: scale(1.2);
}

/* Mobile Gallery */
.mobile-gallery {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.gallery-swipe-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.gallery-swipe {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
}

/* Product Badges */
.product-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 5;
}

.badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
}

.badge.new { background: #4facfe; }
.badge.sale { background: #fa709a; }
.badge.shipping { background: #28a745; }
.badge.fast { background: #ffc107; color: #333; }
.badge.eco { background: #17a2b8; }

/* Quick Actions */
.quick-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 5;
}

.product-card:hover .quick-actions {
  opacity: 1;
}

.quick-action-btn {
  width: 32px;
  height: 32px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.quick-action-btn:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.quick-action-btn.active {
  background: #667eea;
  color: white;
}

.quick-action-btn.favorite-btn.active {
  background: #ff6b6b;
}

.quick-action-btn svg {
  width: 14px;
  height: 14px;
}

/* Quick Add Section */
.quick-add-section {
  padding: 12px;
  background: #f8f9ff;
  border-top: 1px solid #e1e5e9;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quick-size-selector,
.quick-color-selector {
  margin-bottom: 8px;
}

.quick-size-selector:last-child,
.quick-color-selector:last-child {
  margin-bottom: 0;
}

.selector-label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
  margin-bottom: 4px;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.size-options,
.color-options {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.size-option {
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  background: white;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.size-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.size-option.selected {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.size-option.more {
  background: #f0f0f0;
  color: #666;
  font-size: 10px;
}

.color-option {
  width: 20px;
  height: 20px;
  border: 2px solid #e1e5e9;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.color-option:hover {
  border-color: #667eea;
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #667eea;
  transform: scale(1.1);
}

.color-option.selected::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 10px;
  font-weight: bold;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.color-option.more {
  background: #f0f0f0;
  color: #666;
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

/* Product Info */
.product-info {
  padding: 16px;
}

.product-header {
  margin-bottom: 8px;
}

.product-name {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.2;
}

.product-brand {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stars {
  display: flex;
  gap: 1px;
}

.star {
  font-size: 12px;
  filter: grayscale(1);
  opacity: 0.3;
  transition: all 0.2s ease;
}

.star.filled {
  filter: grayscale(0);
  opacity: 1;
}

.star.half {
  filter: grayscale(0);
  opacity: 0.7;
}

.rating-text {
  font-size: 12px;
  color: #666;
}

.product-price {
  margin-bottom: 8px;
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
  margin-left: 8px;
}

.savings {
  font-size: 12px;
  color: #28a745;
  font-weight: 600;
  margin-left: 8px;
}

.product-features {
  margin-bottom: 12px;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.feature-tag {
  background: #f0f0f0;
  color: #666;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
}

.availability-status {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.availability-indicator {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.availability-indicator.in-stock {
  background: #d4edda;
  color: #155724;
}

.availability-indicator.low-stock {
  background: #fff3cd;
  color: #856404;
}

.availability-indicator.out-of-stock {
  background: #f8d7da;
  color: #721c24;
}

.low-stock-warning {
  font-size: 11px;
  color: #dc3545;
  font-weight: 600;
}

.add-to-cart-section {
  margin-top: 12px;
}

.add-to-cart-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.add-to-cart-btn:disabled,
.add-to-cart-btn.btn-disabled {
  background: #e1e5e9;
  color: #999;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.add-to-cart-btn.btn-loading {
  cursor: not-allowed;
}

.cart-icon,
.loading-spinner {
  width: 16px;
  height: 16px;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Zoom Modal */
.zoom-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
}

.zoom-modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  cursor: zoom-in;
}

.zoom-modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.close-zoom {
  position: absolute;
  top: -40px;
  right: 0;
  background: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.close-zoom:hover {
  background: #f0f0f0;
}

.close-zoom svg {
  width: 16px;
  height: 16px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding: 20px;
}

.page-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  background: #f8f9ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.page-number:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.page-number.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .products-grid.view-grid.density-1,
  .products-grid.view-grid.density-2,
  .products-grid.view-grid.density-3,
  .products-grid.view-grid.density-4,
  .products-grid.view-grid.density-5 {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .products-grid.view-compact.density-1,
  .products-grid.view-compact.density-2,
  .products-grid.view-compact.density-3,
  .products-grid.view-compact.density-4,
  .products-grid.view-compact.density-5 {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .grid-controls {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .view-options {
    justify-content: center;
  }
  
  .grid-info {
    justify-content: space-between;
  }
  
  .products-grid.view-list .product-card {
    grid-template-columns: 1fr;
  }
  
  .products-grid.view-list .product-image-container {
    height: 200px;
  }
  
  .quick-actions {
    opacity: 1; /* Always show on mobile */
  }
  
  .page-numbers {
    flex-wrap: wrap;
  }
  
  .density-slider {
    width: 60px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .product-card {
    margin: 0 auto;
    max-width: 300px;
  }
  
  .view-btn .view-label {
    display: none;
  }
  
  .page-btn {
    padding: 6px 12px;
    font-size: 14px;
  }
  
  .page-number {
    width: 36px;
    height: 36px;
  }
}
</style>
