<template>
  <div class="filters">
    <div class="filter-header">
      <h3>Filters</h3>
      <button class="clear-filters" @click="clearAllFilters">Clear All</button>
    </div>
    
    <div class="filter-section">
      <h4>Category</h4>
      <div class="filter-options">
        <label v-for="category in categories" :key="category" class="filter-option">
          <input
            type="radio"
            name="category"
            :value="category"
            :checked="filters.category === category"
            @change="updateCategory"
          >
          <span class="checkmark"></span>
          <span class="label-text">{{ formatLabel(category) }}</span>
        </label>
      </div>
    </div>
    
    <div class="filter-section">
      <h4>Brand</h4>
      <div class="filter-options">
        <label v-for="brand in brands" :key="brand" class="filter-option">
          <input
            type="radio"
            name="brand"
            :value="brand"
            :checked="filters.brand === brand"
            @change="updateBrand"
          >
          <span class="checkmark"></span>
          <span class="label-text">{{ brand }}</span>
        </label>
      </div>
    </div>
    
    <div class="filter-section">
      <h4>Price Range</h4>
      <div class="price-range">
        <div class="price-inputs">
          <input
            type="number"
            :value="filters.priceRange[0]"
            @input="updatePriceMin"
            placeholder="Min"
            class="price-input"
          >
          <span>-</span>
          <input
            type="number"
            :value="filters.priceRange[1]"
            @input="updatePriceMax"
            placeholder="Max"
            class="price-input"
          >
        </div>
        <div class="price-slider">
          <input
            type="range"
            :min="0"
            :max="500"
            :value="filters.priceRange[0]"
            @input="updatePriceMin"
            class="slider min-slider"
          >
          <input
            type="range"
            :min="0"
            :max="500"
            :value="filters.priceRange[1]"
            @input="updatePriceMax"
            class="slider max-slider"
          >
        </div>
      </div>
    </div>
    
    <div class="filter-section">
      <h4>Sort By</h4>
      <select :value="filters.sortBy" @change="updateSort" class="sort-select">
        <option value="name">Name A-Z</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Highest Rated</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
    
    <div class="filter-section">
      <h4>Quick Filters</h4>
      <div class="quick-filters">
        <button 
          class="quick-filter-btn"
          :class="{ active: showOnSale }"
          @click="toggleOnSale"
        >
          🏷️ On Sale
        </button>
        <button 
          class="quick-filter-btn"
          :class="{ active: showNew }"
          @click="toggleNew"
        >
          ✨ New Arrivals
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'FiltersComponent',
  data() {
    return {
      showOnSale: false,
      showNew: false
    }
  },
  computed: {
    ...mapState(['filters']),
    ...mapGetters(['availableBrands', 'availableCategories']),
    categories() {
      return ['all', ...this.availableCategories]
    },
    brands() {
      return ['all', ...this.availableBrands]
    }
  },
  methods: {
    updateCategory(event) {
      this.$store.dispatch('setFilters', { category: event.target.value })
    },
    updateBrand(event) {
      this.$store.dispatch('setFilters', { brand: event.target.value })
    },
    updatePriceMin(event) {
      const min = parseInt(event.target.value)
      this.$store.dispatch('setFilters', { 
        priceRange: [min, this.filters.priceRange[1]] 
      })
    },
    updatePriceMax(event) {
      const max = parseInt(event.target.value)
      this.$store.dispatch('setFilters', { 
        priceRange: [this.filters.priceRange[0], max] 
      })
    },
    updateSort(event) {
      this.$store.dispatch('setFilters', { sortBy: event.target.value })
    },
    toggleOnSale() {
      this.showOnSale = !this.showOnSale
      // Would implement filtering logic here
    },
    toggleNew() {
      this.showNew = !this.showNew
      // Would implement filtering logic here
    },
    clearAllFilters() {
      this.$store.dispatch('setFilters', {
        category: 'all',
        brand: 'all',
        priceRange: [0, 500],
        sortBy: 'name'
      })
      this.showOnSale = false
      this.showNew = false
    },
    formatLabel(text) {
      if (text === 'all') return 'All Categories'
      return text.charAt(0).toUpperCase() + text.slice(1)
    }
  }
}
</script>

<style scoped>
.filters {
  width: 100%;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.filter-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.clear-filters {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.clear-filters:hover {
  background-color: #f8f9fa;
}

.filter-section {
  margin-bottom: 28px;
}

.filter-section h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  position: relative;
}

.filter-option input[type="radio"] {
  opacity: 0;
  position: absolute;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 50%;
  margin-right: 12px;
  position: relative;
  transition: all 0.2s ease;
}

.filter-option input[type="radio"]:checked + .checkmark {
  border-color: #667eea;
  background-color: #667eea;
}

.filter-option input[type="radio"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
}

.label-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.filter-option:hover .label-text {
  color: #333;
}

.price-range {
  margin-top: 8px;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.price-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.price-input:focus {
  border-color: #667eea;
}

.price-slider {
  position: relative;
  height: 6px;
  background-color: #e1e5e9;
  border-radius: 3px;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.sort-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.sort-select:focus {
  border-color: #667eea;
}

.quick-filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-filter-btn {
  padding: 10px 16px;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
}

.quick-filter-btn:hover {
  border-color: #667eea;
  background-color: #f8f9ff;
}

.quick-filter-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

@media (max-width: 1024px) {
  .filters {
    margin-bottom: 24px;
  }
  
  .filter-section {
    margin-bottom: 20px;
  }
}
</style>
