<template>
  <div class="smart-search-container">
    <div class="search-bar" :class="{ expanded: isExpanded, focused: isFocused }">
      <div class="search-input-wrapper">
        <button class="search-icon-btn" @click="handleSearch">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
        
        <input
          ref="searchInput"
          v-model="searchQuery"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleKeydown"
          @keyup.enter="handleSearch"
          :placeholder="currentPlaceholder"
          class="search-input"
          autocomplete="off"
        />
        
        <!-- Voice Search -->
        <button 
          v-if="supportsSpeech"
          class="voice-btn"
          :class="{ active: isListening }"
          @click="toggleVoiceSearch"
          :title="isListening ? 'Stop listening' : 'Voice search'"
        >
          <svg class="voice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </button>
        
        <!-- Clear Search -->
        <button 
          v-if="searchQuery"
          class="clear-btn"
          @click="clearSearch"
          title="Clear search"
        >
          <svg class="clear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <!-- Auto-suggestions Dropdown -->
      <div 
        v-if="showSuggestions && (suggestions.length > 0 || recentSearches.length > 0)"
        class="suggestions-dropdown"
        ref="suggestionsDropdown"
      >
        <!-- Recent Searches -->
        <div v-if="!searchQuery && recentSearches.length > 0" class="suggestions-section">
          <div class="section-header">
            <h4 class="section-title">Recent Searches</h4>
            <button class="clear-recent" @click="clearRecentSearches">Clear</button>
          </div>
          <div
            v-for="(search, index) in recentSearches.slice(0, 5)"
            :key="`recent-${index}`"
            :class="['suggestion-item', { highlighted: highlightedIndex === index }]"
            @click="selectSuggestion(search.query, 'recent')"
            @mouseenter="highlightedIndex = index"
          >
            <svg class="suggestion-icon recent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12,6 12,12 16,14"></polyline>
            </svg>
            <span class="suggestion-text">{{ search.query }}</span>
            <span class="suggestion-meta">{{ search.timestamp }}</span>
          </div>
        </div>
        
        <!-- Search Suggestions -->
        <div v-if="suggestions.length > 0" class="suggestions-section">
          <div class="section-header" v-if="!searchQuery">
            <h4 class="section-title">Popular Searches</h4>
          </div>
          
          <!-- Product Suggestions -->
          <div v-if="suggestions.products.length > 0" class="suggestion-group">
            <h5 class="group-title">Products</h5>
            <div
              v-for="(product, index) in suggestions.products.slice(0, 3)"
              :key="`product-${product.id}`"
              :class="['suggestion-item product', { highlighted: highlightedIndex === index + getIndexOffset('products') }]"
              @click="selectSuggestion(product.name, 'product', product)"
              @mouseenter="highlightedIndex = index + getIndexOffset('products')"
            >
              <img :src="product.image" :alt="product.name" class="product-thumbnail">
              <div class="product-info">
                <span class="product-name">{{ product.name }}</span>
                <span class="product-price">${{ product.price }}</span>
              </div>
              <span class="suggestion-type">Product</span>
            </div>
          </div>
          
          <!-- Brand Suggestions -->
          <div v-if="suggestions.brands.length > 0" class="suggestion-group">
            <h5 class="group-title">Brands</h5>
            <div
              v-for="(brand, index) in suggestions.brands.slice(0, 4)"
              :key="`brand-${brand}`"
              :class="['suggestion-item brand', { highlighted: highlightedIndex === index + getIndexOffset('brands') }]"
              @click="selectSuggestion(brand, 'brand')"
              @mouseenter="highlightedIndex = index + getIndexOffset('brands')"
            >
              <svg class="suggestion-icon brand" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <span class="suggestion-text">{{ brand }}</span>
              <span class="suggestion-type">Brand</span>
            </div>
          </div>
          
          <!-- Category Suggestions -->
          <div v-if="suggestions.categories.length > 0" class="suggestion-group">
            <h5 class="group-title">Categories</h5>
            <div
              v-for="(category, index) in suggestions.categories.slice(0, 3)"
              :key="`category-${category}`"
              :class="['suggestion-item category', { highlighted: highlightedIndex === index + getIndexOffset('categories') }]"
              @click="selectSuggestion(category, 'category')"
              @mouseenter="highlightedIndex = index + getIndexOffset('categories')"
            >
              <svg class="suggestion-icon category" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span class="suggestion-text">{{ category }}</span>
              <span class="suggestion-type">Category</span>
            </div>
          </div>
          
          <!-- Keywords/Features -->
          <div v-if="suggestions.keywords.length > 0" class="suggestion-group">
            <h5 class="group-title">Features</h5>
            <div
              v-for="(keyword, index) in suggestions.keywords.slice(0, 4)"
              :key="`keyword-${keyword}`"
              :class="['suggestion-item keyword', { highlighted: highlightedIndex === index + getIndexOffset('keywords') }]"
              @click="selectSuggestion(keyword, 'keyword')"
              @mouseenter="highlightedIndex = index + getIndexOffset('keywords')"
            >
              <svg class="suggestion-icon keyword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span class="suggestion-text">{{ keyword }}</span>
              <span class="suggestion-type">Feature</span>
            </div>
          </div>
        </div>
        
        <!-- No Results -->
        <div v-if="searchQuery && suggestions.length === 0 && !isLoading" class="no-results">
          <svg class="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <p class="no-results-text">No suggestions found for "{{ searchQuery }}"</p>
          <p class="no-results-hint">Try searching for brands, categories, or product names</p>
        </div>
        
        <!-- Loading -->
        <div v-if="isLoading" class="loading-suggestions">
          <div class="loading-spinner"></div>
          <span>Searching...</span>
        </div>
      </div>
    </div>
    
    <!-- Search History Overlay (Mobile) -->
    <div 
      v-if="showMobileHistory && isMobile"
      class="mobile-search-overlay"
      @click="closeMobileSearch"
    >
      <div class="mobile-search-content" @click.stop>
        <!-- Mobile search content would go here -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'SmartSearchBar',
  data() {
    return {
      searchQuery: '',
      isFocused: false,
      isExpanded: false,
      showSuggestions: false,
      suggestions: {
        products: [],
        brands: [],
        categories: [],
        keywords: []
      },
      recentSearches: [],
      highlightedIndex: -1,
      isLoading: false,
      searchTimeout: null,
      placeholderIndex: 0,
      placeholderInterval: null,
      isListening: false,
      recognition: null,
      supportsSpeech: false,
      isMobile: false,
      showMobileHistory: false,
      
      placeholders: [
        "Search for shoes, brands...",
        "Try 'Nike Air Max'",
        "Search 'running shoes'",
        "Find 'size 10 sneakers'",
        "Look for 'black boots'"
      ],
      
      popularKeywords: [
        'waterproof', 'lightweight', 'cushioning', 'breathable',
        'non-slip', 'arch support', 'memory foam', 'steel toe'
      ],
      
      mockProducts: [
        {
          id: 1,
          name: 'Nike Air Max 270',
          price: 150,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop'
        },
        {
          id: 2,
          name: 'Adidas Ultraboost',
          price: 180,
          image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=60&h=60&fit=crop'
        }
      ]
    }
  },
  computed: {
    ...mapState(['filters', 'products']),
    ...mapGetters(['availableBrands', 'availableCategories']),
    
    currentPlaceholder() {
      return this.placeholders[this.placeholderIndex]
    }
  },
  watch: {
    searchQuery(newQuery) {
      if (newQuery.length > 0) {
        this.debouncedSearch()
      } else {
        this.suggestions = {
          products: [],
          brands: [],
          categories: [],
          keywords: []
        }
      }
    }
  },
  mounted() {
    this.loadRecentSearches()
    this.initSpeechRecognition()
    this.startPlaceholderRotation()
    this.checkMobile()
    
    // Click outside to close suggestions
    document.addEventListener('click', this.handleClickOutside)
    window.addEventListener('resize', this.checkMobile)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
    window.removeEventListener('resize', this.checkMobile)
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval)
    }
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  },
  methods: {
    handleInput() {
      this.showSuggestions = true
    },
    
    handleFocus() {
      this.isFocused = true
      this.isExpanded = true
      this.showSuggestions = true
    },
    
    handleBlur() {
      // Delay to allow click on suggestions
      setTimeout(() => {
        this.isFocused = false
        if (!this.searchQuery) {
          this.isExpanded = false
        }
      }, 150)
    },
    
    handleKeydown(event) {
      const totalSuggestions = this.getTotalSuggestions()
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          this.highlightedIndex = Math.min(this.highlightedIndex + 1, totalSuggestions - 1)
          break
        case 'ArrowUp':
          event.preventDefault()
          this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1)
          break
        case 'Escape':
          this.closeSuggestions()
          break
        case 'Tab':
          if (this.showSuggestions && this.highlightedIndex >= 0) {
            event.preventDefault()
            this.selectHighlightedSuggestion()
          }
          break
      }
    },
    
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.performSearch(this.searchQuery.trim())
      }
    },
    
    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      this.searchTimeout = setTimeout(() => {
        this.fetchSuggestions()
      }, 300)
    },
    
    async fetchSuggestions() {
      if (!this.searchQuery.trim()) return
      
      this.isLoading = true
      
      try {
        // Simulate API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const query = this.searchQuery.toLowerCase()
        
        // Filter products
        const products = this.mockProducts.filter(product =>
          product.name.toLowerCase().includes(query)
        )
        
        // Filter brands
        const brands = this.availableBrands.filter(brand =>
          brand.toLowerCase().includes(query)
        )
        
        // Filter categories
        const categories = this.availableCategories.filter(category =>
          category.toLowerCase().includes(query)
        )
        
        // Filter keywords
        const keywords = this.popularKeywords.filter(keyword =>
          keyword.toLowerCase().includes(query)
        )
        
        this.suggestions = {
          products,
          brands,
          categories,
          keywords
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    selectSuggestion(suggestion, type, data = null) {
      this.searchQuery = suggestion
      this.performSearch(suggestion, type, data)
      this.closeSuggestions()
    },
    
    selectHighlightedSuggestion() {
      // Implementation for selecting highlighted suggestion
      // This would need to map highlightedIndex to actual suggestion
    },
    
    performSearch(query, type = 'general', data = null) {
      // Add to recent searches
      this.addToRecentSearches(query)
      
      // Emit search event
      this.$emit('search', { query, type, data })
      
      // Update store
      this.$store.dispatch('setSearchQuery', query)
      
      // Handle different search types
      switch (type) {
        case 'brand':
          this.$store.dispatch('setFilters', { brand: query })
          break
        case 'category':
          this.$store.dispatch('setFilters', { category: query })
          break
        case 'product':
          if (data) {
            this.$emit('product-selected', data)
          }
          break
      }
      
      this.closeSuggestions()
    },
    
    clearSearch() {
      this.searchQuery = ''
      this.$store.dispatch('setSearchQuery', '')
      this.suggestions = {
        products: [],
        brands: [],
        categories: [],
        keywords: []
      }
      this.closeSuggestions()
      this.$refs.searchInput.focus()
    },
    
    closeSuggestions() {
      this.showSuggestions = false
      this.highlightedIndex = -1
    },
    
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.closeSuggestions()
        if (!this.searchQuery) {
          this.isExpanded = false
        }
      }
    },
    
    addToRecentSearches(query) {
      const search = {
        query,
        timestamp: new Date().toLocaleDateString()
      }
      
      // Remove duplicate
      this.recentSearches = this.recentSearches.filter(s => s.query !== query)
      
      // Add to beginning
      this.recentSearches.unshift(search)
      
      // Keep only 10 recent searches
      this.recentSearches = this.recentSearches.slice(0, 10)
      
      // Save to localStorage
      localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches))
    },
    
    loadRecentSearches() {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        this.recentSearches = JSON.parse(saved)
      }
    },
    
    clearRecentSearches() {
      this.recentSearches = []
      localStorage.removeItem('recentSearches')
    },
    
    initSpeechRecognition() {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        this.supportsSpeech = true
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition()
        
        this.recognition.continuous = false
        this.recognition.interimResults = false
        this.recognition.lang = 'en-US'
        
        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          this.searchQuery = transcript
          this.isListening = false
          this.handleSearch()
        }
        
        this.recognition.onerror = () => {
          this.isListening = false
        }
        
        this.recognition.onend = () => {
          this.isListening = false
        }
      }
    },
    
    toggleVoiceSearch() {
      if (!this.supportsSpeech) return
      
      if (this.isListening) {
        this.recognition.stop()
        this.isListening = false
      } else {
        this.recognition.start()
        this.isListening = true
      }
    },
    
    startPlaceholderRotation() {
      this.placeholderInterval = setInterval(() => {
        this.placeholderIndex = (this.placeholderIndex + 1) % this.placeholders.length
      }, 3000)
    },
    
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    
    getTotalSuggestions() {
      return this.suggestions.products.length +
             this.suggestions.brands.length +
             this.suggestions.categories.length +
             this.suggestions.keywords.length +
             (this.searchQuery ? 0 : this.recentSearches.length)
    },
    
    getIndexOffset(type) {
      let offset = 0
      if (!this.searchQuery && this.recentSearches.length > 0) {
        offset += Math.min(this.recentSearches.length, 5)
      }
      
      switch (type) {
        case 'brands':
          offset += this.suggestions.products.length
          break
        case 'categories':
          offset += this.suggestions.products.length + this.suggestions.brands.length
          break
        case 'keywords':
          offset += this.suggestions.products.length + this.suggestions.brands.length + this.suggestions.categories.length
          break
      }
      
      return offset
    },
    
    closeMobileSearch() {
      this.showMobileHistory = false
    }
  }
}
</script>

<style scoped>
.smart-search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-bar {
  position: relative;
  background: white;
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.search-bar.focused {
  border-color: #667eea;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);
}

.search-bar.expanded {
  border-radius: 16px;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  padding: 4px;
}

.search-icon-btn {
  background: none;
  border: none;
  padding: 12px;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon-btn:hover {
  background: #f8f9ff;
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 12px 16px;
  background: transparent;
  color: #333;
}

.search-input::placeholder {
  color: #999;
  transition: all 0.3s ease;
}

.voice-btn, .clear-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 4px;
}

.voice-btn:hover, .clear-btn:hover {
  background: #f8f9ff;
}

.voice-btn.active {
  background: #ff4757;
  color: white;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.voice-icon, .clear-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.voice-btn.active .voice-icon {
  color: white;
}

.clear-icon {
  color: #999;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 8px;
  border: 1px solid #e1e5e9;
}

.suggestions-section {
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.clear-recent {
  background: none;
  border: none;
  color: #667eea;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.clear-recent:hover {
  background: #f8f9ff;
}

.suggestion-group {
  margin-bottom: 16px;
}

.suggestion-group:last-child {
  margin-bottom: 0;
}

.group-title {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px 0;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.suggestion-item:hover,
.suggestion-item.highlighted {
  background: #f8f9ff;
  border-color: #667eea;
}

.suggestion-item.product {
  padding: 12px;
}

.suggestion-icon {
  width: 16px;
  height: 16px;
  color: #999;
  flex-shrink: 0;
}

.suggestion-icon.recent {
  color: #667eea;
}

.suggestion-icon.brand {
  color: #28a745;
}

.suggestion-icon.category {
  color: #ffc107;
}

.suggestion-icon.keyword {
  color: #17a2b8;
}

.product-thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.product-price {
  color: #667eea;
  font-weight: 700;
  font-size: 13px;
}

.suggestion-text {
  flex: 1;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.suggestion-type {
  font-size: 11px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.suggestion-meta {
  font-size: 12px;
  color: #999;
}

.no-results {
  text-align: center;
  padding: 32px 16px;
}

.no-results-icon {
  width: 48px;
  height: 48px;
  color: #ccc;
  margin-bottom: 16px;
}

.no-results-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.no-results-hint {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.loading-suggestions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  color: #667eea;
  font-weight: 500;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e1e5e9;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mobile-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  padding-top: 60px;
}

.mobile-search-content {
  background: white;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 16px 16px 0 0;
  margin-top: auto;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .search-bar {
    border-radius: 20px;
  }
  
  .search-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  .suggestions-dropdown {
    border-radius: 12px;
    max-height: 60vh;
  }
  
  .suggestion-item {
    padding: 12px;
  }
  
  .product-thumbnail {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .search-input-wrapper {
    padding: 2px;
  }
  
  .search-input {
    padding: 10px 12px;
    font-size: 16px;
  }
  
  .search-icon-btn {
    padding: 10px;
  }
  
  .suggestions-section {
    padding: 12px;
  }
  
  .suggestion-item {
    padding: 10px;
  }
}
</style>
