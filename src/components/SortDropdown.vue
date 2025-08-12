<template>
  <div class="sort-dropdown" ref="sortDropdown">
    <!-- Sort Trigger Button -->
    <button 
      class="sort-trigger"
      @click="toggleDropdown"
      :class="{ active: isOpen }"
    >
      <div class="sort-trigger-content">
        <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 6h18"></path>
          <path d="M7 12h10"></path>
          <path d="M10 18h4"></path>
        </svg>
        <span class="sort-label">Sort by:</span>
        <span class="sort-current">{{ currentSortLabel }}</span>
      </div>
      <svg 
        class="dropdown-arrow"
        :class="{ rotated: isOpen }"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
      >
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    </button>
    
    <!-- Dropdown Menu -->
    <div 
      v-if="isOpen"
      class="sort-menu"
      :class="{ 'menu-up': shouldOpenUpward }"
    >
      <!-- Sort Options -->
      <div class="sort-options">
        <button
          v-for="option in sortOptions"
          :key="option.value"
          :class="['sort-option', { 
            active: selectedSort === option.value,
            featured: option.featured
          }]"
          @click="selectSort(option.value)"
        >
          <div class="option-content">
            <div class="option-main">
              <span class="option-icon">{{ option.icon }}</span>
              <div class="option-text">
                <span class="option-label">{{ option.label }}</span>
                <span v-if="option.description" class="option-description">{{ option.description }}</span>
              </div>
            </div>
            <div class="option-meta">
              <span v-if="option.featured" class="featured-badge">Popular</span>
              <span v-if="selectedSort === option.value" class="selected-indicator">✓</span>
            </div>
          </div>
        </button>
      </div>
      
      <!-- Quick Filters Section -->
      <div class="quick-filters-section">
        <div class="section-header">
          <h4 class="section-title">Quick Filters</h4>
        </div>
        <div class="quick-filters">
          <button
            v-for="filter in quickFilters"
            :key="filter.value"
            :class="['quick-filter', { active: activeQuickFilters.includes(filter.value) }]"
            @click="toggleQuickFilter(filter.value)"
          >
            <span class="filter-icon">{{ filter.icon }}</span>
            <span class="filter-label">{{ filter.label }}</span>
          </button>
        </div>
      </div>
      
      <!-- View Options Section -->
      <div class="view-options-section">
        <div class="section-header">
          <h4 class="section-title">View</h4>
        </div>
        <div class="view-options">
          <button
            v-for="view in viewOptions"
            :key="view.value"
            :class="['view-option', { active: selectedView === view.value }]"
            @click="selectView(view.value)"
            :title="view.description"
          >
            <svg class="view-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path :d="view.iconPath"></path>
            </svg>
            <span class="view-label">{{ view.label }}</span>
          </button>
        </div>
      </div>
      
      <!-- Results Info -->
      <div class="results-info">
        <span class="results-count">{{ resultsCount }} products</span>
        <button 
          v-if="hasActiveFilters"
          class="clear-sort-filters"
          @click="clearSortAndFilters"
        >
          Clear all
        </button>
      </div>
    </div>
    
    <!-- Overlay for mobile -->
    <div 
      v-if="isOpen && isMobile"
      class="dropdown-overlay"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'SortDropdown',
  data() {
    return {
      isOpen: false,
      shouldOpenUpward: false,
      isMobile: false,
      selectedSort: 'featured',
      selectedView: 'grid',
      activeQuickFilters: [],
      
      sortOptions: [
        {
          value: 'featured',
          label: 'Featured',
          description: 'Our top picks for you',
          icon: '⭐',
          featured: true
        },
        {
          value: 'newest',
          label: 'New Arrivals',
          description: 'Latest products first',
          icon: '🆕',
          featured: true
        },
        {
          value: 'price-low',
          label: 'Price: Low to High',
          description: 'Best deals first',
          icon: '💰',
          featured: false
        },
        {
          value: 'price-high',
          label: 'Price: High to Low',
          description: 'Premium products first',
          icon: '💎',
          featured: false
        },
        {
          value: 'rating',
          label: 'Customer Rating',
          description: 'Highest rated first',
          icon: '⭐',
          featured: true
        },
        {
          value: 'popularity',
          label: 'Most Popular',
          description: 'Best sellers first',
          icon: '🔥',
          featured: false
        },
        {
          value: 'discount',
          label: 'Biggest Savings',
          description: 'Best discounts first',
          icon: '🏷️',
          featured: false
        },
        {
          value: 'name-asc',
          label: 'Name: A to Z',
          description: 'Alphabetical order',
          icon: '🔤',
          featured: false
        },
        {
          value: 'name-desc',
          label: 'Name: Z to A',
          description: 'Reverse alphabetical',
          icon: '🔡',
          featured: false
        }
      ],
      
      quickFilters: [
        { value: 'on-sale', label: 'On Sale', icon: '🏷️' },
        { value: 'new-arrivals', label: 'New', icon: '🆕' },
        { value: 'free-shipping', label: 'Free Shipping', icon: '🚚' },
        { value: 'top-rated', label: 'Top Rated', icon: '⭐' },
        { value: 'eco-friendly', label: 'Eco-Friendly', icon: '🌱' }
      ],
      
      viewOptions: [
        {
          value: 'grid',
          label: 'Grid',
          description: 'Grid view with large product images',
          iconPath: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z'
        },
        {
          value: 'list',
          label: 'List',
          description: 'Detailed list view with specifications',
          iconPath: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'
        },
        {
          value: 'compact',
          label: 'Compact',
          description: 'Compact grid view showing more products',
          iconPath: 'M3 3h5v5H3zM10 3h5v5h-5zM17 3h5v5h-5zM3 10h5v5H3zM10 10h5v5h-5zM17 10h5v5h-5zM3 17h5v5H3zM10 17h5v5h-5zM17 17h5v5h-5z'
        }
      ]
    }
  },
  computed: {
    ...mapState(['filters', 'products']),
    ...mapGetters(['filteredProducts']),
    
    currentSortLabel() {
      const option = this.sortOptions.find(opt => opt.value === this.selectedSort)
      return option ? option.label : 'Featured'
    },
    
    resultsCount() {
      return this.filteredProducts.length
    },
    
    hasActiveFilters() {
      return this.activeQuickFilters.length > 0 || 
             Object.values(this.filters).some(filter => 
               filter && filter !== 'all' && filter !== 'name'
             )
    }
  },
  mounted() {
    this.checkMobile()
    this.loadSavedPreferences()
    
    // Event listeners
    document.addEventListener('click', this.handleClickOutside)
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    toggleDropdown() {
      if (this.isOpen) {
        this.closeDropdown()
      } else {
        this.openDropdown()
      }
    },
    
    openDropdown() {
      this.isOpen = true
      this.checkDropdownPosition()
      
      // Prevent body scroll on mobile
      if (this.isMobile) {
        document.body.style.overflow = 'hidden'
      }
      
      this.$emit('dropdown-opened')
    },
    
    closeDropdown() {
      this.isOpen = false
      
      // Restore body scroll
      if (this.isMobile) {
        document.body.style.overflow = ''
      }
      
      this.$emit('dropdown-closed')
    },
    
    selectSort(sortValue) {
      this.selectedSort = sortValue
      this.applySorting()
      this.savePreferences()
      this.closeDropdown()
      
      this.$emit('sort-changed', sortValue)
    },
    
    selectView(viewValue) {
      this.selectedView = viewValue
      this.savePreferences()
      
      this.$emit('view-changed', viewValue)
    },
    
    toggleQuickFilter(filterValue) {
      const index = this.activeQuickFilters.indexOf(filterValue)
      if (index > -1) {
        this.activeQuickFilters.splice(index, 1)
      } else {
        this.activeQuickFilters.push(filterValue)
      }
      
      this.applyQuickFilters()
      this.savePreferences()
      
      this.$emit('quick-filters-changed', this.activeQuickFilters)
    },
    
    clearSortAndFilters() {
      this.selectedSort = 'featured'
      this.activeQuickFilters = []
      this.applySorting()
      this.applyQuickFilters()
      this.savePreferences()
      
      // Clear store filters
      this.$store.dispatch('setFilters', {
        category: 'all',
        brand: 'all',
        priceRange: [0, 500],
        sortBy: 'featured'
      })
      
      this.$emit('filters-cleared')
    },
    
    applySorting() {
      this.$store.dispatch('setFilters', { sortBy: this.selectedSort })
    },
    
    applyQuickFilters() {
      // Apply quick filters to store or emit to parent
      const filterMap = {
        'on-sale': { onSale: true },
        'new-arrivals': { isNew: true },
        'free-shipping': { freeShipping: true },
        'top-rated': { minRating: 4.5 },
        'eco-friendly': { ecoFriendly: true }
      }
      
      const appliedFilters = {}
      this.activeQuickFilters.forEach(filter => {
        Object.assign(appliedFilters, filterMap[filter] || {})
      })
      
      this.$emit('quick-filters-applied', appliedFilters)
    },
    
    handleClickOutside(event) {
      if (this.$refs.sortDropdown && !this.$refs.sortDropdown.contains(event.target)) {
        this.closeDropdown()
      }
    },
    
    handleResize() {
      this.checkMobile()
      if (this.isOpen) {
        this.checkDropdownPosition()
      }
    },
    
    handleScroll() {
      if (this.isOpen) {
        this.checkDropdownPosition()
      }
    },
    
    checkMobile() {
      this.isMobile = window.innerWidth <= 768
    },
    
    checkDropdownPosition() {
      this.$nextTick(() => {
        if (!this.$refs.sortDropdown) return
        
        const dropdownRect = this.$refs.sortDropdown.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const spaceBelow = viewportHeight - dropdownRect.bottom
        const spaceAbove = dropdownRect.top
        
        // If not enough space below and more space above, open upward
        this.shouldOpenUpward = spaceBelow < 400 && spaceAbove > spaceBelow
      })
    },
    
    savePreferences() {
      const preferences = {
        sort: this.selectedSort,
        view: this.selectedView,
        quickFilters: this.activeQuickFilters
      }
      localStorage.setItem('sortPreferences', JSON.stringify(preferences))
    },
    
    loadSavedPreferences() {
      const saved = localStorage.getItem('sortPreferences')
      if (saved) {
        try {
          const preferences = JSON.parse(saved)
          this.selectedSort = preferences.sort || 'featured'
          this.selectedView = preferences.view || 'grid'
          this.activeQuickFilters = preferences.quickFilters || []
          
          // Apply saved preferences
          this.applySorting()
          this.applyQuickFilters()
        } catch (error) {
          console.error('Error loading sort preferences:', error)
        }
      }
    }
  }
}
</script>

<style scoped>
.sort-dropdown {
  position: relative;
  display: inline-block;
}

/* Sort Trigger Button */
.sort-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.sort-trigger:hover {
  border-color: #667eea;
  background: #f8f9ff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.sort-trigger.active {
  border-color: #667eea;
  background: #f8f9ff;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.sort-trigger-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.sort-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
  flex-shrink: 0;
}

.sort-label {
  color: #666;
  font-weight: 500;
}

.sort-current {
  color: #333;
  font-weight: 600;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  color: #666;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.sort-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  min-width: 320px;
  max-width: 400px;
  z-index: 1000;
  margin-top: 8px;
  border: 1px solid #e1e5e9;
  overflow: hidden;
  animation: dropdownFadeIn 0.3s ease-out;
}

.sort-menu.menu-up {
  top: auto;
  bottom: 100%;
  margin-top: 0;
  margin-bottom: 8px;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Sort Options */
.sort-options {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sort-option {
  display: block;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 12px;
  margin-bottom: 6px;
  text-align: left;
}

.sort-option:last-child {
  margin-bottom: 0;
}

.sort-option:hover {
  background: #f8f9ff;
  border-color: #667eea;
}

.sort-option.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.sort-option.featured {
  border: 1px solid #ffd700;
}

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-main {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.option-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.option-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-label {
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
}

.option-description {
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.2;
}

.option-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.featured-badge {
  background: #ffd700;
  color: #333;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.selected-indicator {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

/* Quick Filters Section */
.quick-filters-section,
.view-options-section {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header {
  margin-bottom: 12px;
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.quick-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  font-weight: 500;
}

.quick-filter:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.quick-filter.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.filter-icon {
  font-size: 12px;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
}

/* View Options */
.view-options {
  display: flex;
  gap: 8px;
}

.view-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.view-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.view-option.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.view-icon {
  width: 18px;
  height: 18px;
}

.view-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Results Info */
.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9ff;
  border-top: 1px solid #e1e5e9;
}

.results-count {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.clear-sort-filters {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.clear-sort-filters:hover {
  background: rgba(220, 53, 69, 0.1);
}

/* Mobile Overlay */
.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sort-trigger {
    min-width: 160px;
    padding: 10px 14px;
    font-size: 13px;
  }
  
  .sort-menu {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    border-radius: 16px 16px 0 0;
    max-height: 80vh;
    overflow-y: auto;
    min-width: auto;
    max-width: none;
  }
  
  .sort-menu.menu-up {
    position: fixed;
    bottom: 0;
    margin-bottom: 0;
  }
  
  .sort-options {
    padding: 20px 16px 16px;
  }
  
  .sort-option {
    padding: 14px 16px;
    margin-bottom: 8px;
  }
  
  .option-label {
    font-size: 15px;
  }
  
  .option-description {
    font-size: 13px;
  }
  
  .quick-filters-section,
  .view-options-section {
    padding: 16px;
  }
  
  .quick-filter {
    padding: 8px 14px;
    font-size: 13px;
  }
  
  .view-option {
    padding: 10px 12px;
  }
  
  .view-label {
    font-size: 10px;
  }
  
  .results-info {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .sort-trigger {
    min-width: 140px;
    padding: 8px 12px;
  }
  
  .sort-label {
    display: none;
  }
  
  .sort-menu {
    max-height: 85vh;
  }
  
  .quick-filters {
    gap: 4px;
  }
  
  .quick-filter {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .filter-icon {
    font-size: 11px;
  }
  
  .filter-label {
    font-size: 11px;
  }
}

/* Desktop positioning adjustment */
@media (min-width: 1200px) {
  .sort-menu {
    min-width: 380px;
  }
}
</style>
