<template>
  <div class="quick-filters">
    <div class="filters-container">
      <!-- Main Filter Tabs -->
      <div class="filter-tabs">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          class="filter-tab"
          :class="{ active: activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-text">{{ tab.name }}</span>
          <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>
      
      <!-- Quick Action Buttons -->
      <div class="quick-actions">
        <button 
          class="quick-action size-filter"
          :class="{ active: showSizeFilter }"
          @click="toggleSizeFilter"
        >
          <span class="action-icon">📏</span>
          <span class="action-text">Size</span>
          <span v-if="selectedSizes.length" class="action-badge">{{ selectedSizes.length }}</span>
        </button>
        
        <button 
          class="quick-action price-filter"
          :class="{ active: showPriceFilter }"
          @click="togglePriceFilter"
        >
          <span class="action-icon">💰</span>
          <span class="action-text">Price</span>
          <span v-if="priceRange[0] > 0 || priceRange[1] < 500" class="action-badge">!</span>
        </button>
        
        <button 
          class="quick-action recently-viewed"
          @click="showRecentlyViewed"
          :class="{ active: viewingRecent }"
        >
          <span class="action-icon">🕒</span>
          <span class="action-text">Recent</span>
          <span v-if="recentlyViewedCount" class="action-badge">{{ recentlyViewedCount }}</span>
        </button>
        
        <button 
          class="quick-action try-on"
          @click="openTryOnFeature"
          :class="{ premium: true }"
        >
          <span class="action-icon">📱</span>
          <span class="action-text">Try On</span>
          <span class="premium-badge">AR</span>
        </button>
      </div>
    </div>
    
    <!-- Size Filter Dropdown -->
    <div v-if="showSizeFilter" class="filter-dropdown size-dropdown">
      <div class="dropdown-header">
        <h4>Select Sizes</h4>
        <button @click="clearSizes" class="clear-btn">Clear All</button>
      </div>
      <div class="size-grid">
        <button
          v-for="size in availableSizes"
          :key="size"
          class="size-option"
          :class="{ selected: selectedSizes.includes(size) }"
          @click="toggleSize(size)"
        >
          {{ size }}
        </button>
      </div>
      <div class="size-categories">
        <button
          v-for="category in sizeCategories"
          :key="category.id"
          class="size-category"
          @click="selectSizeCategory(category)"
        >
          {{ category.name }} ({{ category.range }})
        </button>
      </div>
    </div>
    
    <!-- Price Filter Dropdown -->
    <div v-if="showPriceFilter" class="filter-dropdown price-dropdown">
      <div class="dropdown-header">
        <h4>Price Range</h4>
        <button @click="clearPriceRange" class="clear-btn">Reset</button>
      </div>
      <div class="price-inputs">
        <div class="price-input-group">
          <label>Min Price</label>
          <input
            type="number"
            v-model="priceRange[0]"
            min="0"
            max="500"
            class="price-input"
            @input="updatePriceRange"
          >
        </div>
        <div class="price-input-group">
          <label>Max Price</label>
          <input
            type="number"
            v-model="priceRange[1]"
            min="0"
            max="500"
            class="price-input"
            @input="updatePriceRange"
          >
        </div>
      </div>
      <div class="price-slider">
        <input
          type="range"
          min="0"
          max="500"
          v-model="priceRange[0]"
          @input="updatePriceRange"
          class="slider min-slider"
        >
        <input
          type="range"
          min="0"
          max="500"
          v-model="priceRange[1]"
          @input="updatePriceRange"
          class="slider max-slider"
        >
      </div>
      <div class="price-presets">
        <button
          v-for="preset in pricePresets"
          :key="preset.id"
          class="price-preset"
          @click="setPricePreset(preset)"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>
    
    <!-- Recently Viewed Modal -->
    <div v-if="showRecentModal" class="recent-modal" @click="closeRecentModal">
      <div class="recent-content" @click.stop>
        <div class="recent-header">
          <h3>Recently Viewed</h3>
          <button @click="closeRecentModal" class="close-btn">✕</button>
        </div>
        <div class="recent-grid">
          <div
            v-for="product in recentlyViewed"
            :key="`recent-${product.id}`"
            class="recent-item"
            @click="selectRecentProduct(product)"
          >
            <img :src="product.image" :alt="product.name" class="recent-image">
            <div class="recent-info">
              <h4>{{ product.name }}</h4>
              <p>{{ product.brand }}</p>
              <span class="recent-price">${{ product.price }}</span>
            </div>
            <div class="recent-time">{{ formatRecentTime(product.viewedAt) }}</div>
          </div>
        </div>
        <div class="recent-actions">
          <button @click="clearRecentlyViewed" class="clear-recent-btn">
            Clear History
          </button>
        </div>
      </div>
    </div>
    
    <!-- Active Filters Display -->
    <div v-if="hasActiveFilters" class="active-filters">
      <div class="active-filter-tags">
        <span v-if="activeTab !== 'all'" class="filter-tag">
          {{ getTabName(activeTab) }}
          <button @click="clearTab" class="tag-remove">✕</button>
        </span>
        <span
          v-for="size in selectedSizes"
          :key="`size-${size}`"
          class="filter-tag"
        >
          Size {{ size }}
          <button @click="removeSize(size)" class="tag-remove">✕</button>
        </span>
        <span
          v-if="priceRange[0] > 0 || priceRange[1] < 500"
          class="filter-tag"
        >
          ${{ priceRange[0] }} - ${{ priceRange[1] }}
          <button @click="clearPriceRange" class="tag-remove">✕</button>
        </span>
      </div>
      <button @click="clearAllFilters" class="clear-all-btn">
        Clear All Filters
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'QuickFilters',
  data() {
    return {
      activeTab: 'all',
      showSizeFilter: false,
      showPriceFilter: false,
      showRecentModal: false,
      viewingRecent: false,
      selectedSizes: [],
      priceRange: [0, 500],
      filterTabs: [
        { id: 'all', name: 'All', icon: '👟', count: 1247 },
        { id: 'new', name: 'New', icon: '✨', count: 156 },
        { id: 'sale', name: 'Sale', icon: '��️', count: 89 },
        { id: 'popular', name: 'Popular', icon: '🔥', count: 234 },
        { id: 'premium', name: 'Premium', icon: '👑', count: 67 }
      ],
      availableSizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14],
      sizeCategories: [
        { id: 'small', name: 'Small', range: '6-8' },
        { id: 'medium', name: 'Medium', range: '8.5-10.5' },
        { id: 'large', name: 'Large', range: '11-13' },
        { id: 'xl', name: 'Extra Large', range: '13+' }
      ],
      pricePresets: [
        { id: 'budget', label: 'Under $50', min: 0, max: 50 },
        { id: 'mid', label: '$50-$150', min: 50, max: 150 },
        { id: 'premium', label: '$150-$300', min: 150, max: 300 },
        { id: 'luxury', label: '$300+', min: 300, max: 500 }
      ],
      recentlyViewed: [
        // Mock recently viewed products
        {
          id: 101,
          name: 'Nike Air Max 270',
          brand: 'Nike',
          price: 150,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
          viewedAt: Date.now() - 1000 * 60 * 30 // 30 minutes ago
        },
        {
          id: 102,
          name: 'Adidas Ultraboost',
          brand: 'Adidas',
          price: 180,
          image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200&h=200&fit=crop',
          viewedAt: Date.now() - 1000 * 60 * 60 * 2 // 2 hours ago
        }
      ]
    }
  },
  computed: {
    ...mapState(['filters']),
    hasActiveFilters() {
      return this.activeTab !== 'all' || 
             this.selectedSizes.length > 0 || 
             this.priceRange[0] > 0 || 
             this.priceRange[1] < 500
    },
    recentlyViewedCount() {
      return this.recentlyViewed.length
    }
  },
  methods: {
    setActiveTab(tabId) {
      this.activeTab = tabId
      this.applyFilters()
    },
    toggleSizeFilter() {
      this.showSizeFilter = !this.showSizeFilter
      this.showPriceFilter = false
    },
    togglePriceFilter() {
      this.showPriceFilter = !this.showPriceFilter
      this.showSizeFilter = false
    },
    toggleSize(size) {
      const index = this.selectedSizes.indexOf(size)
      if (index > -1) {
        this.selectedSizes.splice(index, 1)
      } else {
        this.selectedSizes.push(size)
      }
      this.applyFilters()
    },
    selectSizeCategory(category) {
      let sizes = []
      switch (category.id) {
        case 'small':
          sizes = [6, 6.5, 7, 7.5, 8]
          break
        case 'medium':
          sizes = [8.5, 9, 9.5, 10, 10.5]
          break
        case 'large':
          sizes = [11, 11.5, 12, 13]
          break
        case 'xl':
          sizes = [13, 14]
          break
      }
      this.selectedSizes = [...new Set([...this.selectedSizes, ...sizes])]
      this.applyFilters()
    },
    clearSizes() {
      this.selectedSizes = []
      this.applyFilters()
    },
    updatePriceRange() {
      // Ensure min doesn't exceed max
      if (this.priceRange[0] > this.priceRange[1]) {
        this.priceRange[1] = this.priceRange[0]
      }
      this.applyFilters()
    },
    setPricePreset(preset) {
      this.priceRange = [preset.min, preset.max]
      this.applyFilters()
    },
    clearPriceRange() {
      this.priceRange = [0, 500]
      this.applyFilters()
    },
    showRecentlyViewed() {
      if (this.recentlyViewed.length > 0) {
        this.showRecentModal = true
      } else {
        this.viewingRecent = !this.viewingRecent
        this.$emit('show-recent', this.viewingRecent)
      }
    },
    closeRecentModal() {
      this.showRecentModal = false
    },
    selectRecentProduct(product) {
      this.$emit('product-selected', product)
      this.closeRecentModal()
    },
    clearRecentlyViewed() {
      this.recentlyViewed = []
      this.closeRecentModal()
    },
    openTryOnFeature() {
      this.$emit('open-try-on')
      // Would integrate with AR try-on functionality
      console.log('Opening AR try-on feature')
    },
    removeSize(size) {
      const index = this.selectedSizes.indexOf(size)
      if (index > -1) {
        this.selectedSizes.splice(index, 1)
        this.applyFilters()
      }
    },
    clearTab() {
      this.activeTab = 'all'
      this.applyFilters()
    },
    clearAllFilters() {
      this.activeTab = 'all'
      this.selectedSizes = []
      this.priceRange = [0, 500]
      this.viewingRecent = false
      this.applyFilters()
    },
    applyFilters() {
      const filters = {
        category: this.activeTab === 'all' ? 'all' : this.activeTab,
        sizes: this.selectedSizes,
        priceRange: this.priceRange,
        showRecent: this.viewingRecent
      }
      
      this.$emit('filters-changed', filters)
      
      // Update store filters
      this.$store.dispatch('setFilters', {
        priceRange: this.priceRange
      })
    },
    getTabName(tabId) {
      const tab = this.filterTabs.find(t => t.id === tabId)
      return tab ? tab.name : tabId
    },
    formatRecentTime(timestamp) {
      const now = Date.now()
      const diff = now - timestamp
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (minutes < 60) {
        return `${minutes}m ago`
      } else if (hours < 24) {
        return `${hours}h ago`
      } else {
        return `${days}d ago`
      }
    }
  },
  mounted() {
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showSizeFilter = false
        this.showPriceFilter = false
      }
    })
  }
}
</script>

<style scoped>
.quick-filters {
  position: relative;
  margin-bottom: 32px;
}

.filters-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  background: white;
  padding: 16px 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex: 1;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #666;
  position: relative;
}

.filter-tab:hover {
  background: #e9ecef;
  border-color: #667eea;
}

.filter-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.tab-icon {
  font-size: 16px;
}

.tab-text {
  font-size: 14px;
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
}

.filter-tab.active .tab-count {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
}

.quick-actions {
  display: flex;
  gap: 12px;
}

.quick-action {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 12px;
  color: #666;
}

.quick-action:hover {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-2px);
}

.quick-action.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.quick-action.premium {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border-color: #ffd700;
  color: #333;
}

.quick-action.premium:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.3);
}

.action-icon {
  font-size: 14px;
}

.action-text {
  font-weight: 600;
}

.action-badge {
  background: #ff6b6b;
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  text-align: center;
}

.premium-badge {
  background: rgba(0, 0, 0, 0.2);
  color: #333;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Filter Dropdowns */
.filter-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 8px;
  padding: 24px;
  animation: slideDown 0.3s ease;
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

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dropdown-header h4 {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.clear-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
}

.clear-btn:hover {
  text-decoration: underline;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
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

.size-option:hover {
  border-color: #667eea;
  color: #667eea;
}

.size-option.selected {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.size-categories {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.size-category {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;
}

.size-category:hover {
  background: #e9ecef;
  border-color: #667eea;
}

.price-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.price-input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.price-input-group label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
}

.price-input {
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease;
}

.price-input:focus {
  border-color: #667eea;
}

.price-slider {
  position: relative;
  height: 40px;
  margin-bottom: 20px;
}

.slider {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 6px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  appearance: none;
  border-radius: 3px;
}

.slider::-webkit-slider-track {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.price-presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.price-preset {
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;
}

.price-preset:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Recently Viewed Modal */
.recent-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.recent-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #f0f0f0;
}

.recent-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f8f9fa;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #666;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.recent-grid {
  max-height: 400px;
  overflow-y: auto;
  padding: 20px 32px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 12px;
}

.recent-item:hover {
  background: #f8f9fa;
}

.recent-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.recent-info {
  flex: 1;
}

.recent-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.recent-info p {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.recent-price {
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
}

.recent-time {
  font-size: 12px;
  color: #999;
}

.recent-actions {
  padding: 20px 32px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.clear-recent-btn {
  padding: 12px 24px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.clear-recent-btn:hover {
  background: #ff5252;
  transform: translateY(-2px);
}

/* Active Filters */
.active-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9ff;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}

.active-filter-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #667eea;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.tag-remove {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
}

.tag-remove:hover {
  background: rgba(255, 255, 255, 0.3);
}

.clear-all-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.clear-all-btn:hover {
  background: #ff5252;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .filters-container {
    flex-direction: column;
    gap: 16px;
    padding: 16px 20px;
  }
  
  .filter-tabs {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .filter-tabs::-webkit-scrollbar {
    display: none;
  }
  
  .quick-actions {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .filter-dropdown {
    padding: 20px;
  }
  
  .size-grid {
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    gap: 8px;
  }
  
  .price-inputs {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .recent-header,
  .recent-grid,
  .recent-actions {
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media (max-width: 480px) {
  .filters-container {
    padding: 12px 16px;
  }
  
  .filter-tab {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .quick-action {
    padding: 8px 12px;
    font-size: 11px;
  }
  
  .action-text {
    display: none; /* Hide text on very small screens */
  }
  
  .active-filters {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}
</style>
