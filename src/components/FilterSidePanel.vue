<template>
  <div class="filter-side-panel">
    <!-- Mobile Filter Button -->
    <button 
      v-if="isMobile"
      class="mobile-filter-btn"
      @click="togglePanel"
      :class="{ active: isPanelOpen }"
    >
      <svg class="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
      </svg>
      <span>Filters</span>
      <span v-if="activeFiltersCount > 0" class="filter-count-badge">{{ activeFiltersCount }}</span>
    </button>
    
    <!-- Filter Panel Overlay (Mobile) -->
    <div 
      v-if="isMobile && isPanelOpen"
      class="filter-overlay"
      @click="closePanel"
    ></div>
    
    <!-- Filter Panel -->
    <div 
      :class="['filter-panel', { 
        'mobile-open': isMobile && isPanelOpen,
        'desktop-sticky': !isMobile && isSticky 
      }]"
      ref="filterPanel"
    >
      <!-- Panel Header -->
      <div class="filter-header">
        <h3 class="filter-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filters
        </h3>
        
        <div class="header-actions">
          <button 
            v-if="activeFiltersCount > 0"
            class="clear-all-btn"
            @click="clearAllFilters"
          >
            Clear All ({{ activeFiltersCount }})
          </button>
          
          <button 
            v-if="isMobile"
            class="close-panel-btn"
            @click="closePanel"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Active Filters Summary -->
      <div v-if="activeFiltersCount > 0" class="active-filters-summary">
        <div class="active-filter-chips">
          <span
            v-for="filter in activeFilterChips"
            :key="filter.key"
            class="active-filter-chip"
          >
            {{ filter.label }}
            <button 
              class="remove-filter-btn"
              @click="removeFilter(filter.key, filter.value)"
            >
              ×
            </button>
          </span>
        </div>
      </div>
      
      <!-- Filter Sections -->
      <div class="filter-content">
        
        <!-- Size Filter -->
        <div class="filter-section">
          <h4 class="section-title">
            <button 
              class="section-toggle"
              @click="toggleSection('size')"
            >
              <span>Size</span>
              <svg 
                class="toggle-icon"
                :class="{ rotated: expandedSections.size }"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </h4>
          
          <div v-if="expandedSections.size" class="section-content">
            <!-- Size Grid -->
            <div class="size-grid">
              <label
                v-for="size in availableSizes"
                :key="size.value"
                :class="['size-option', { 
                  selected: selectedSizes.includes(size.value),
                  unavailable: size.count === 0
                }]"
              >
                <input
                  type="checkbox"
                  :value="size.value"
                  v-model="selectedSizes"
                  @change="updateFilters"
                  :disabled="size.count === 0"
                />
                <span class="size-label">{{ size.label }}</span>
                <span class="size-count">({{ size.count }})</span>
              </label>
            </div>
            
            <!-- Size Converter -->
            <div class="size-converter">
              <button class="converter-btn" @click="showSizeGuide = !showSizeGuide">
                📏 Size Guide
              </button>
              <div v-if="showSizeGuide" class="size-guide">
                <div class="size-conversion">
                  <h5>Size Conversion Chart</h5>
                  <div class="conversion-table">
                    <div class="conversion-row header">
                      <span>US</span>
                      <span>EU</span>
                      <span>UK</span>
                      <span>CM</span>
                    </div>
                    <div v-for="conversion in sizeConversions" :key="conversion.us" class="conversion-row">
                      <span>{{ conversion.us }}</span>
                      <span>{{ conversion.eu }}</span>
                      <span>{{ conversion.uk }}</span>
                      <span>{{ conversion.cm }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Color Filter -->
        <div class="filter-section">
          <h4 class="section-title">
            <button 
              class="section-toggle"
              @click="toggleSection('color')"
            >
              <span>Color</span>
              <svg 
                class="toggle-icon"
                :class="{ rotated: expandedSections.color }"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </h4>
          
          <div v-if="expandedSections.color" class="section-content">
            <div class="color-options">
              <label
                v-for="color in availableColors"
                :key="color.value"
                :class="['color-option', { selected: selectedColors.includes(color.value) }]"
                :title="color.label"
              >
                <input
                  type="checkbox"
                  :value="color.value"
                  v-model="selectedColors"
                  @change="updateFilters"
                />
                <span 
                  class="color-swatch"
                  :style="{ backgroundColor: color.hex }"
                ></span>
                <span class="color-label">{{ color.label }}</span>
                <span class="color-count">({{ color.count }})</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Brand Filter -->
        <div class="filter-section">
          <h4 class="section-title">
            <button 
              class="section-toggle"
              @click="toggleSection('brand')"
            >
              <span>Brand</span>
              <svg 
                class="toggle-icon"
                :class="{ rotated: expandedSections.brand }"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </h4>
          
          <div v-if="expandedSections.brand" class="section-content">
            <!-- Brand Search -->
            <div class="brand-search">
              <input
                v-model="brandSearchQuery"
                placeholder="Search brands..."
                class="brand-search-input"
              />
            </div>
            
            <!-- Popular Brands -->
            <div class="brand-options">
              <label
                v-for="brand in filteredBrands"
                :key="brand.value"
                :class="['brand-option', { selected: selectedBrands.includes(brand.value) }]"
              >
                <input
                  type="checkbox"
                  :value="brand.value"
                  v-model="selectedBrands"
                  @change="updateFilters"
                />
                <span class="brand-logo">{{ brand.logo }}</span>
                <span class="brand-label">{{ brand.label }}</span>
                <span class="brand-count">({{ brand.count }})</span>
              </label>
            </div>
            
            <button 
              v-if="availableBrandsData.length > 6"
              class="show-more-brands"
              @click="showAllBrands = !showAllBrands"
            >
              {{ showAllBrands ? 'Show Less' : `Show All (${availableBrandsData.length})` }}
            </button>
          </div>
        </div>
        
        <!-- Price Range Filter -->
        <div class="filter-section">
          <h4 class="section-title">
            <button 
              class="section-toggle"
              @click="toggleSection('price')"
            >
              <span>Price Range</span>
              <svg 
                class="toggle-icon"
                :class="{ rotated: expandedSections.price }"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </h4>
          
          <div v-if="expandedSections.price" class="section-content">
            <!-- Price Range Slider -->
            <div class="price-range-container">
              <div class="price-inputs">
                <div class="price-input-group">
                  <label>Min</label>
                  <input
                    type="number"
                    v-model.number="priceRange[0]"
                    @input="updatePriceRange"
                    :min="priceMin"
                    :max="priceMax"
                    class="price-input"
                  />
                </div>
                <span class="price-separator">-</span>
                <div class="price-input-group">
                  <label>Max</label>
                  <input
                    type="number"
                    v-model.number="priceRange[1]"
                    @input="updatePriceRange"
                    :min="priceMin"
                    :max="priceMax"
                    class="price-input"
                  />
                </div>
              </div>
              
              <!-- Custom Range Slider -->
              <div class="price-slider-container">
                <div class="price-slider">
                  <input
                    type="range"
                    :min="priceMin"
                    :max="priceMax"
                    v-model.number="priceRange[0]"
                    @input="updatePriceRange"
                    class="price-slider-input min-slider"
                  />
                  <input
                    type="range"
                    :min="priceMin"
                    :max="priceMax"
                    v-model.number="priceRange[1]"
                    @input="updatePriceRange"
                    class="price-slider-input max-slider"
                  />
                </div>
                <div class="price-labels">
                  <span>${{ priceMin }}</span>
                  <span>${{ priceMax }}</span>
                </div>
              </div>
            </div>
            
            <!-- Quick Price Filters -->
            <div class="quick-price-filters">
              <button
                v-for="preset in pricePresets"
                :key="preset.label"
                :class="['price-preset', { 
                  active: priceRange[0] === preset.min && priceRange[1] === preset.max 
                }]"
                @click="setPricePreset(preset)"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Material Filter -->
        <div class="filter-section">
          <h4 class="section-title">
            <button 
              class="section-toggle"
              @click="toggleSection('material')"
            >
              <span>Material</span>
              <svg 
                class="toggle-icon"
                :class="{ rotated: expandedSections.material }"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </h4>
          
          <div v-if="expandedSections.material" class="section-content">
            <div class="material-options">
              <label
                v-for="material in availableMaterials"
                :key="material.value"
                :class="['material-option', { selected: selectedMaterials.includes(material.value) }]"
              >
                <input
                  type="checkbox"
                  :value="material.value"
                  v-model="selectedMaterials"
                  @change="updateFilters"
                />
                <span class="material-icon">{{ material.icon }}</span>
                <span class="material-label">{{ material.label }}</span>
                <span class="material-count">({{ material.count }})</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Features Filter -->
        <div class="filter-section">
          <h4 class="section-title">
            <button 
              class="section-toggle"
              @click="toggleSection('features')"
            >
              <span>Features</span>
              <svg 
                class="toggle-icon"
                :class="{ rotated: expandedSections.features }"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </h4>
          
          <div v-if="expandedSections.features" class="section-content">
            <div class="feature-options">
              <label
                v-for="feature in availableFeatures"
                :key="feature.value"
                :class="['feature-option', { selected: selectedFeatures.includes(feature.value) }]"
              >
                <input
                  type="checkbox"
                  :value="feature.value"
                  v-model="selectedFeatures"
                  @change="updateFilters"
                />
                <span class="feature-icon">{{ feature.icon }}</span>
                <span class="feature-label">{{ feature.label }}</span>
                <span class="feature-count">({{ feature.count }})</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Style/Type Filter -->
        <div class="filter-section">
          <h4 class="section-title">
            <button 
              class="section-toggle"
              @click="toggleSection('style')"
            >
              <span>Style</span>
              <svg 
                class="toggle-icon"
                :class="{ rotated: expandedSections.style }"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </h4>
          
          <div v-if="expandedSections.style" class="section-content">
            <div class="style-options">
              <label
                v-for="style in availableStyles"
                :key="style.value"
                :class="['style-option', { selected: selectedStyles.includes(style.value) }]"
              >
                <input
                  type="checkbox"
                  :value="style.value"
                  v-model="selectedStyles"
                  @change="updateFilters"
                />
                <span class="style-icon">{{ style.icon }}</span>
                <span class="style-label">{{ style.label }}</span>
                <span class="style-count">({{ style.count }})</span>
              </label>
            </div>
          </div>
        </div>
        
      </div>
      
      <!-- Apply Filters Button (Mobile) -->
      <div v-if="isMobile" class="filter-footer">
        <button class="apply-filters-btn" @click="applyFilters">
          Apply Filters ({{ filteredProductsCount }})
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'FilterSidePanel',
  data() {
    return {
      isPanelOpen: false,
      isMobile: false,
      isSticky: false,
      showSizeGuide: false,
      showAllBrands: false,
      brandSearchQuery: '',
      
      // Expanded sections
      expandedSections: {
        size: true,
        color: true,
        brand: true,
        price: true,
        material: false,
        features: false,
        style: false
      },
      
      // Selected filters
      selectedSizes: [],
      selectedColors: [],
      selectedBrands: [],
      selectedMaterials: [],
      selectedFeatures: [],
      selectedStyles: [],
      priceRange: [0, 500],
      
      // Price range settings
      priceMin: 0,
      priceMax: 500,
      pricePresets: [
        { label: 'Under $50', min: 0, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100 - $200', min: 100, max: 200 },
        { label: '$200+', min: 200, max: 500 }
      ],
      
      // Available options data
      availableSizes: [
        { value: '6', label: '6', count: 15 },
        { value: '6.5', label: '6.5', count: 12 },
        { value: '7', label: '7', count: 18 },
        { value: '7.5', label: '7.5', count: 14 },
        { value: '8', label: '8', count: 22 },
        { value: '8.5', label: '8.5', count: 16 },
        { value: '9', label: '9', count: 25 },
        { value: '9.5', label: '9.5', count: 19 },
        { value: '10', label: '10', count: 21 },
        { value: '10.5', label: '10.5', count: 13 },
        { value: '11', label: '11', count: 17 },
        { value: '11.5', label: '11.5', count: 8 },
        { value: '12', label: '12', count: 12 }
      ],
      
      availableColors: [
        { value: 'black', label: 'Black', hex: '#000000', count: 45 },
        { value: 'white', label: 'White', hex: '#FFFFFF', count: 38 },
        { value: 'brown', label: 'Brown', hex: '#8B4513', count: 22 },
        { value: 'blue', label: 'Blue', hex: '#0066CC', count: 18 },
        { value: 'red', label: 'Red', hex: '#CC0000', count: 14 },
        { value: 'gray', label: 'Gray', hex: '#808080', count: 31 },
        { value: 'navy', label: 'Navy', hex: '#000080', count: 16 },
        { value: 'green', label: 'Green', hex: '#008000', count: 12 },
        { value: 'beige', label: 'Beige', hex: '#F5F5DC', count: 19 },
        { value: 'pink', label: 'Pink', hex: '#FFC0CB', count: 9 }
      ],
      
      availableBrandsData: [
        { value: 'nike', label: 'Nike', logo: '✓', count: 45 },
        { value: 'adidas', label: 'Adidas', logo: '⚡', count: 38 },
        { value: 'puma', label: 'Puma', logo: '🐾', count: 25 },
        { value: 'newbalance', label: 'New Balance', logo: 'N', count: 22 },
        { value: 'converse', label: 'Converse', logo: '⭐', count: 18 },
        { value: 'vans', label: 'Vans', logo: '🔥', count: 15 },
        { value: 'reebok', label: 'Reebok', logo: '△', count: 12 },
        { value: 'jordan', label: 'Jordan', logo: '🏀', count: 28 }
      ],
      
      availableMaterials: [
        { value: 'leather', label: 'Leather', icon: '🐄', count: 35 },
        { value: 'canvas', label: 'Canvas', icon: '🎨', count: 22 },
        { value: 'mesh', label: 'Mesh', icon: '🕳️', count: 18 },
        { value: 'synthetic', label: 'Synthetic', icon: '🧪', count: 28 },
        { value: 'suede', label: 'Suede', icon: '🪶', count: 15 },
        { value: 'rubber', label: 'Rubber', icon: '⚫', count: 12 }
      ],
      
      availableFeatures: [
        { value: 'waterproof', label: 'Waterproof', icon: '💧', count: 15 },
        { value: 'breathable', label: 'Breathable', icon: '💨', count: 32 },
        { value: 'cushioned', label: 'Cushioned', icon: '☁️', count: 28 },
        { value: 'non-slip', label: 'Non-slip', icon: '🛡️', count: 22 },
        { value: 'arch-support', label: 'Arch Support', icon: '🏗️', count: 18 },
        { value: 'memory-foam', label: 'Memory Foam', icon: '🧠', count: 14 }
      ],
      
      availableStyles: [
        { value: 'sneakers', label: 'Sneakers', icon: '👟', count: 45 },
        { value: 'boots', label: 'Boots', icon: '🥾', count: 25 },
        { value: 'sandals', label: 'Sandals', icon: '👡', count: 18 },
        { value: 'loafers', label: 'Loafers', icon: '👞', count: 22 },
        { value: 'heels', label: 'Heels', icon: '👠', count: 15 },
        { value: 'flats', label: 'Flats', icon: '🥿', count: 20 }
      ],
      
      sizeConversions: [
        { us: '6', eu: '36', uk: '3.5', cm: '22.5' },
        { us: '7', eu: '37', uk: '4.5', cm: '23.5' },
        { us: '8', eu: '38', uk: '5.5', cm: '24.5' },
        { us: '9', eu: '39', uk: '6.5', cm: '25.5' },
        { us: '10', eu: '40', uk: '7.5', cm: '26.5' },
        { us: '11', eu: '41', uk: '8.5', cm: '27.5' }
      ]
    }
  },
  computed: {
    ...mapState(['filters', 'products']),
    ...mapGetters(['filteredProducts']),
    
    activeFiltersCount() {
      let count = 0
      if (this.selectedSizes.length > 0) count += this.selectedSizes.length
      if (this.selectedColors.length > 0) count += this.selectedColors.length
      if (this.selectedBrands.length > 0) count += this.selectedBrands.length
      if (this.selectedMaterials.length > 0) count += this.selectedMaterials.length
      if (this.selectedFeatures.length > 0) count += this.selectedFeatures.length
      if (this.selectedStyles.length > 0) count += this.selectedStyles.length
      if (this.priceRange[0] > this.priceMin || this.priceRange[1] < this.priceMax) count += 1
      return count
    },
    
    activeFilterChips() {
      const chips = []
      
      this.selectedSizes.forEach(size => {
        chips.push({ key: 'sizes', value: size, label: `Size ${size}` })
      })
      
      this.selectedColors.forEach(color => {
        const colorData = this.availableColors.find(c => c.value === color)
        chips.push({ key: 'colors', value: color, label: colorData?.label || color })
      })
      
      this.selectedBrands.forEach(brand => {
        const brandData = this.availableBrandsData.find(b => b.value === brand)
        chips.push({ key: 'brands', value: brand, label: brandData?.label || brand })
      })
      
      if (this.priceRange[0] > this.priceMin || this.priceRange[1] < this.priceMax) {
        chips.push({ 
          key: 'price', 
          value: 'range', 
          label: `$${this.priceRange[0]} - $${this.priceRange[1]}` 
        })
      }
      
      return chips
    },
    
    filteredBrands() {
      if (!this.brandSearchQuery) {
        return this.showAllBrands ? this.availableBrandsData : this.availableBrandsData.slice(0, 6)
      }
      
      return this.availableBrandsData.filter(brand =>
        brand.label.toLowerCase().includes(this.brandSearchQuery.toLowerCase())
      )
    },
    
    filteredProductsCount() {
      return this.filteredProducts.length
    }
  },
  mounted() {
    this.checkMobile()
    this.loadSavedFilters()
    window.addEventListener('resize', this.checkMobile)
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile)
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    togglePanel() {
      this.isPanelOpen = !this.isPanelOpen
      if (this.isPanelOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    
    closePanel() {
      this.isPanelOpen = false
      document.body.style.overflow = ''
    },
    
    toggleSection(section) {
      this.expandedSections[section] = !this.expandedSections[section]
    },
    
    updateFilters() {
      const filters = {
        sizes: this.selectedSizes,
        colors: this.selectedColors,
        brands: this.selectedBrands,
        materials: this.selectedMaterials,
        features: this.selectedFeatures,
        styles: this.selectedStyles,
        priceRange: this.priceRange
      }
      
      this.$emit('filters-changed', filters)
      this.saveFilters()
      
      if (!this.isMobile) {
        this.applyFiltersToStore()
      }
    },
    
    applyFilters() {
      this.applyFiltersToStore()
      if (this.isMobile) {
        this.closePanel()
      }
    },
    
    applyFiltersToStore() {
      // Apply filters to Vuex store
      this.$store.dispatch('setFilters', {
        sizes: this.selectedSizes.length > 0 ? this.selectedSizes : null,
        colors: this.selectedColors.length > 0 ? this.selectedColors : null,
        brands: this.selectedBrands.length > 0 ? this.selectedBrands : null,
        materials: this.selectedMaterials.length > 0 ? this.selectedMaterials : null,
        features: this.selectedFeatures.length > 0 ? this.selectedFeatures : null,
        styles: this.selectedStyles.length > 0 ? this.selectedStyles : null,
        priceRange: this.priceRange
      })
    },
    
    updatePriceRange() {
      // Ensure min is not greater than max
      if (this.priceRange[0] > this.priceRange[1]) {
        this.priceRange = [this.priceRange[1], this.priceRange[0]]
      }
      this.updateFilters()
    },
    
    setPricePreset(preset) {
      this.priceRange = [preset.min, preset.max]
      this.updateFilters()
    },
    
    removeFilter(key, value) {
      switch (key) {
        case 'sizes':
          this.selectedSizes = this.selectedSizes.filter(s => s !== value)
          break
        case 'colors':
          this.selectedColors = this.selectedColors.filter(c => c !== value)
          break
        case 'brands':
          this.selectedBrands = this.selectedBrands.filter(b => b !== value)
          break
        case 'materials':
          this.selectedMaterials = this.selectedMaterials.filter(m => m !== value)
          break
        case 'features':
          this.selectedFeatures = this.selectedFeatures.filter(f => f !== value)
          break
        case 'styles':
          this.selectedStyles = this.selectedStyles.filter(s => s !== value)
          break
        case 'price':
          this.priceRange = [this.priceMin, this.priceMax]
          break
      }
      this.updateFilters()
    },
    
    clearAllFilters() {
      this.selectedSizes = []
      this.selectedColors = []
      this.selectedBrands = []
      this.selectedMaterials = []
      this.selectedFeatures = []
      this.selectedStyles = []
      this.priceRange = [this.priceMin, this.priceMax]
      this.updateFilters()
    },
    
    saveFilters() {
      const filters = {
        sizes: this.selectedSizes,
        colors: this.selectedColors,
        brands: this.selectedBrands,
        materials: this.selectedMaterials,
        features: this.selectedFeatures,
        styles: this.selectedStyles,
        priceRange: this.priceRange
      }
      localStorage.setItem('savedFilters', JSON.stringify(filters))
    },
    
    loadSavedFilters() {
      const saved = localStorage.getItem('savedFilters')
      if (saved) {
        const filters = JSON.parse(saved)
        this.selectedSizes = filters.sizes || []
        this.selectedColors = filters.colors || []
        this.selectedBrands = filters.brands || []
        this.selectedMaterials = filters.materials || []
        this.selectedFeatures = filters.features || []
        this.selectedStyles = filters.styles || []
        this.priceRange = filters.priceRange || [this.priceMin, this.priceMax]
      }
    },
    
    checkMobile() {
      this.isMobile = window.innerWidth <= 1024
    },
    
    handleScroll() {
      if (!this.isMobile) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        this.isSticky = scrollTop > 100
      }
    }
  }
}
</script>

<style scoped>
.filter-side-panel {
  position: relative;
}

/* Mobile Filter Button */
.mobile-filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.mobile-filter-btn:hover,
.mobile-filter-btn.active {
  border-color: #667eea;
  background: #f8f9ff;
  color: #667eea;
}

.filter-icon {
  width: 18px;
  height: 18px;
}

.filter-count-badge {
  background: #667eea;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  position: absolute;
  top: -6px;
  right: -6px;
}

/* Filter Panel Overlay */
.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
}

/* Filter Panel */
.filter-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.filter-panel.desktop-sticky {
  position: sticky;
  top: 90px;
  height: calc(100vh - 120px);
  overflow-y: auto;
}

.filter-panel.mobile-open {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 90%;
  max-width: 400px;
  border-radius: 12px 0 0 12px;
  z-index: 9999;
  overflow-y: auto;
}

/* Panel Header */
.filter-header {
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e1e5e9;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.title-icon {
  width: 20px;
  height: 20px;
  color: #667eea;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.clear-all-btn {
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-all-btn:hover {
  background: #dc3545;
  color: white;
}

.close-panel-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-panel-btn:hover {
  background: #f8f9ff;
}

.close-panel-btn svg {
  width: 18px;
  height: 18px;
  color: #666;
}

/* Active Filters Summary */
.active-filters-summary {
  padding: 16px 20px;
  border-bottom: 1px solid #e1e5e9;
  background: #f8f9ff;
}

.active-filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.active-filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.remove-filter-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  padding: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.remove-filter-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Filter Content */
.filter-content {
  padding: 0 20px 20px;
}

/* Filter Section */
.filter-section {
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;
}

.filter-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 16px 0;
}

.section-toggle {
  display: flex;
  justify-content: between;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  text-align: left;
}

.toggle-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
  color: #667eea;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.section-content {
  margin-top: 16px;
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

/* Size Grid */
.size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.size-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  text-align: center;
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

.size-option.unavailable {
  opacity: 0.5;
  cursor: not-allowed;
}

.size-option input {
  display: none;
}

.size-label {
  font-weight: 600;
  font-size: 14px;
}

.size-count {
  font-size: 10px;
  opacity: 0.8;
}

/* Color Options */
.color-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.color-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.color-option.selected {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.color-option input {
  display: none;
}

.color-swatch {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #ddd;
  flex-shrink: 0;
}

.color-label {
  flex: 1;
  font-weight: 500;
  font-size: 13px;
}

.color-count {
  font-size: 11px;
  opacity: 0.8;
}

/* Brand Options */
.brand-search {
  margin-bottom: 12px;
}

.brand-search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.brand-search-input:focus {
  border-color: #667eea;
}

.brand-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.brand-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.brand-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.brand-option.selected {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.brand-option input {
  display: none;
}

.brand-logo {
  width: 20px;
  text-align: center;
  font-weight: bold;
  flex-shrink: 0;
}

.brand-label {
  flex: 1;
  font-weight: 500;
  font-size: 14px;
}

.brand-count {
  font-size: 12px;
  opacity: 0.8;
}

.show-more-brands {
  background: none;
  border: 1px solid #667eea;
  color: #667eea;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.show-more-brands:hover {
  background: #667eea;
  color: white;
}

/* Price Range */
.price-range-container {
  margin-bottom: 16px;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.price-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.price-input-group label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.price-input {
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.price-input:focus {
  border-color: #667eea;
}

.price-separator {
  font-weight: bold;
  color: #666;
  margin-top: 20px;
}

.price-slider-container {
  position: relative;
  margin-bottom: 16px;
}

.price-slider {
  position: relative;
  height: 6px;
  background: #e1e5e9;
  border-radius: 3px;
}

.price-slider-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: transparent;
  pointer-events: none;
  outline: none;
  -webkit-appearance: none;
}

.price-slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  pointer-events: all;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.price-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.quick-price-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.price-preset {
  padding: 6px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 16px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.price-preset:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.price-preset.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

/* Material, Feature, Style Options */
.material-options,
.feature-options,
.style-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.material-option,
.feature-option,
.style-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.material-option:hover,
.feature-option:hover,
.style-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.material-option.selected,
.feature-option.selected,
.style-option.selected {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.material-option input,
.feature-option input,
.style-option input {
  display: none;
}

.material-icon,
.feature-icon,
.style-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.material-label,
.feature-label,
.style-label {
  flex: 1;
  font-weight: 500;
  font-size: 14px;
}

.material-count,
.feature-count,
.style-count {
  font-size: 12px;
  opacity: 0.8;
}

/* Size Guide */
.size-converter {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e1e5e9;
}

.converter-btn {
  background: none;
  border: 1px solid #667eea;
  color: #667eea;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.converter-btn:hover {
  background: #667eea;
  color: white;
}

.size-guide {
  margin-top: 12px;
  padding: 12px;
  background: #f8f9ff;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.size-conversion h5 {
  font-size: 13px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.conversion-table {
  font-size: 11px;
}

.conversion-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid #e1e5e9;
}

.conversion-row.header {
  font-weight: 700;
  color: #667eea;
}

.conversion-row:last-child {
  border-bottom: none;
}

/* Filter Footer */
.filter-footer {
  padding: 16px 20px;
  border-top: 1px solid #e1e5e9;
  background: white;
  position: sticky;
  bottom: 0;
}

.apply-filters-btn {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.apply-filters-btn:hover {
  transform: translateY(-2px);
}

/* Desktop Hide Mobile Elements */
@media (min-width: 1025px) {
  .mobile-filter-btn {
    display: none;
  }
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .filter-panel {
    display: none;
  }
  
  .filter-panel.mobile-open {
    display: block;
  }
  
  .mobile-filter-btn {
    display: flex;
  }
}

@media (max-width: 768px) {
  .filter-panel.mobile-open {
    width: 100%;
    border-radius: 0;
  }
  
  .filter-header {
    padding: 16px;
  }
  
  .filter-content {
    padding: 0 16px 16px;
  }
  
  .size-grid {
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  }
  
  .color-options {
    grid-template-columns: 1fr;
  }
  
  .price-inputs {
    flex-direction: column;
    gap: 8px;
  }
  
  .price-separator {
    display: none;
  }
}
</style>
