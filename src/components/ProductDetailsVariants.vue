<template>
  <div class="product-details-variants">
    
    <!-- Color Variants Section -->
    <div class="variants-section color-variants">
      <div class="section-header">
        <h3 class="section-title">
          <span class="title-icon">🎨</span>
          Color
        </h3>
        <span v-if="selectedColor" class="selected-variant">{{ selectedColor.name }}</span>
      </div>
      
      <div class="color-options-container">
        <!-- Color Swatches -->
        <div class="color-swatches">
          <button
            v-for="color in availableColors"
            :key="color.id"
            :class="['color-swatch', {
              selected: selectedColor && selectedColor.id === color.id,
              unavailable: !color.available,
              low_stock: color.stock < 5 && color.stock > 0
            }]"
            @click="selectColor(color)"
            :disabled="!color.available"
            :title="getColorTooltip(color)"
          >
            <div 
              class="swatch-color"
              :style="{ 
                backgroundColor: color.hex,
                backgroundImage: color.pattern ? `url(${color.pattern})` : 'none'
              }"
            ></div>
            <span class="swatch-name">{{ color.name }}</span>
            
            <!-- Stock indicator -->
            <div v-if="color.stock < 5 && color.stock > 0" class="stock-indicator low">
              {{ color.stock }} left
            </div>
            <div v-else-if="!color.available" class="stock-indicator out">
              Out of stock
            </div>
            
            <!-- Price difference -->
            <div v-if="color.priceAdjustment" class="price-adjustment">
              {{ color.priceAdjustment > 0 ? '+' : '' }}${{ color.priceAdjustment }}
            </div>
          </button>
        </div>
        
        <!-- Color Filter Options -->
        <div class="color-filters">
          <button
            v-for="filter in colorFilters"
            :key="filter.type"
            :class="['color-filter', { active: activeColorFilter === filter.type }]"
            @click="filterByColorType(filter.type)"
          >
            {{ filter.label }} ({{ filter.count }})
          </button>
        </div>
      </div>
      
      <!-- Color Details -->
      <div v-if="selectedColor" class="color-details">
        <div class="color-info">
          <div class="color-preview">
            <div 
              class="large-swatch"
              :style="{ 
                backgroundColor: selectedColor.hex,
                backgroundImage: selectedColor.pattern ? `url(${selectedColor.pattern})` : 'none'
              }"
            ></div>
            <div class="color-meta">
              <h4 class="color-name">{{ selectedColor.name }}</h4>
              <p class="color-description">{{ selectedColor.description }}</p>
              <div class="color-attributes">
                <span v-for="attr in selectedColor.attributes" :key="attr" class="color-attribute">
                  {{ attr }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Color-specific images -->
          <div v-if="selectedColor.images" class="color-images">
            <div class="image-preview">
              <img 
                :src="selectedColor.images[selectedColorImageIndex]"
                :alt="`${product.name} in ${selectedColor.name}`"
                class="color-image"
                @click="openColorImageGallery"
              />
              <div v-if="selectedColor.images.length > 1" class="image-nav">
                <button 
                  class="nav-btn prev"
                  @click="previousColorImage"
                  :disabled="selectedColorImageIndex === 0"
                >
                  ‹
                </button>
                <span class="image-counter">
                  {{ selectedColorImageIndex + 1 }} / {{ selectedColor.images.length }}
                </span>
                <button 
                  class="nav-btn next"
                  @click="nextColorImage"
                  :disabled="selectedColorImageIndex === selectedColor.images.length - 1"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Size Variants Section -->
    <div class="variants-section size-variants">
      <div class="section-header">
        <h3 class="section-title">
          <span class="title-icon">📏</span>
          Size
        </h3>
        <div class="size-header-actions">
          <span v-if="selectedSize" class="selected-variant">{{ selectedSize.label }}</span>
          <button class="size-guide-btn" @click="showSizeGuide = !showSizeGuide">
            Size Guide
          </button>
        </div>
      </div>
      
      <div class="size-options-container">
        <!-- Size Grid -->
        <div class="size-grid">
          <button
            v-for="size in filteredSizes"
            :key="size.id"
            :class="['size-option', {
              selected: selectedSize && selectedSize.id === size.id,
              unavailable: !size.available,
              recommended: size.recommended,
              popular: size.popular
            }]"
            @click="selectSize(size)"
            :disabled="!size.available"
            :title="getSizeTooltip(size)"
          >
            <div class="size-content">
              <span class="size-label">{{ size.label }}</span>
              <div class="size-details">
                <span class="size-measurement">{{ size.measurement }}</span>
                <div v-if="size.recommended" class="recommended-badge">Recommended</div>
                <div v-if="size.popular" class="popular-badge">Popular</div>
              </div>
            </div>
            
            <!-- Stock and availability -->
            <div class="size-availability">
              <div v-if="!size.available" class="availability-status out">
                Out of stock
              </div>
              <div v-else-if="size.stock < 3" class="availability-status low">
                {{ size.stock }} left
              </div>
              <div v-else class="availability-status in">
                In stock
              </div>
            </div>
            
            <!-- Quick add indicator -->
            <div v-if="size.fastShipping" class="shipping-indicator">
              ⚡ Fast shipping
            </div>
          </button>
        </div>
        
        <!-- Size Filter Options -->
        <div class="size-filters">
          <button
            v-for="filter in sizeFilters"
            :key="filter.type"
            :class="['size-filter', { active: activeSizeFilter === filter.type }]"
            @click="filterBySize(filter.type)"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
      
      <!-- Size Guide -->
      <div v-if="showSizeGuide" class="size-guide">
        <div class="guide-header">
          <h4 class="guide-title">Size Guide</h4>
          <button class="close-guide" @click="showSizeGuide = false">×</button>
        </div>
        
        <div class="guide-content">
          <!-- Size Conversion Chart -->
          <div class="size-chart">
            <h5>Size Conversion</h5>
            <table class="conversion-table">
              <thead>
                <tr>
                  <th>US</th>
                  <th>EU</th>
                  <th>UK</th>
                  <th>CM</th>
                  <th>Inches</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="conversion in sizeConversions" :key="conversion.us">
                  <td>{{ conversion.us }}</td>
                  <td>{{ conversion.eu }}</td>
                  <td>{{ conversion.uk }}</td>
                  <td>{{ conversion.cm }}</td>
                  <td>{{ conversion.inches }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Fit Guide -->
          <div class="fit-guide">
            <h5>How to Measure Your Foot</h5>
            <div class="measurement-steps">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h6>Place foot on paper</h6>
                  <p>Stand on a piece of paper with your heel against a wall</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h6>Mark longest toe</h6>
                  <p>Mark the tip of your longest toe on the paper</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h6>Measure length</h6>
                  <p>Measure from heel to toe mark in centimeters</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Fit Recommendations -->
          <div class="fit-recommendations">
            <h5>Fit Recommendations</h5>
            <div class="fit-tips">
              <div class="fit-tip">
                <span class="tip-icon">👤</span>
                <span class="tip-text">This style runs true to size</span>
              </div>
              <div class="fit-tip">
                <span class="tip-icon">📏</span>
                <span class="tip-text">Medium width (D) recommended</span>
              </div>
              <div class="fit-tip">
                <span class="tip-icon">⭐</span>
                <span class="tip-text">94% of customers bought their usual size</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Size Recommendation AI -->
      <div v-if="selectedSize" class="size-recommendation">
        <div class="ai-recommendation">
          <div class="ai-badge">
            <span class="ai-icon">🤖</span>
            <span>AI Size Assistant</span>
          </div>
          <div class="recommendation-content">
            <p class="recommendation-text">{{ getSizeRecommendation() }}</p>
            <div class="confidence-bar">
              <div class="confidence-fill" :style="{ width: sizeConfidence + '%' }"></div>
            </div>
            <span class="confidence-text">{{ sizeConfidence }}% confidence</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Width Options (for applicable shoes) -->
    <div v-if="hasWidthOptions" class="variants-section width-variants">
      <div class="section-header">
        <h3 class="section-title">
          <span class="title-icon">↔️</span>
          Width
        </h3>
        <span v-if="selectedWidth" class="selected-variant">{{ selectedWidth.label }}</span>
      </div>
      
      <div class="width-options">
        <button
          v-for="width in availableWidths"
          :key="width.id"
          :class="['width-option', {
            selected: selectedWidth && selectedWidth.id === width.id,
            unavailable: !width.available
          }]"
          @click="selectWidth(width)"
          :disabled="!width.available"
        >
          <span class="width-label">{{ width.label }}</span>
          <span class="width-description">{{ width.description }}</span>
        </button>
      </div>
    </div>
    
    <!-- Material/Finish Options -->
    <div v-if="hasMaterialOptions" class="variants-section material-variants">
      <div class="section-header">
        <h3 class="section-title">
          <span class="title-icon">🧵</span>
          Material
        </h3>
        <span v-if="selectedMaterial" class="selected-variant">{{ selectedMaterial.name }}</span>
      </div>
      
      <div class="material-options">
        <div
          v-for="material in availableMaterials"
          :key="material.id"
          :class="['material-option', {
            selected: selectedMaterial && selectedMaterial.id === material.id,
            premium: material.premium
          }]"
          @click="selectMaterial(material)"
        >
          <div class="material-preview">
            <img :src="material.texture" :alt="material.name" class="material-texture" />
          </div>
          <div class="material-info">
            <h4 class="material-name">{{ material.name }}</h4>
            <p class="material-description">{{ material.description }}</p>
            <div class="material-features">
              <span v-for="feature in material.features" :key="feature" class="material-feature">
                {{ feature }}
              </span>
            </div>
            <div v-if="material.priceAdjustment" class="material-price">
              {{ material.priceAdjustment > 0 ? '+' : '' }}${{ material.priceAdjustment }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Customization Options -->
    <div v-if="hasCustomizations" class="variants-section customization-variants">
      <div class="section-header">
        <h3 class="section-title">
          <span class="title-icon">✨</span>
          Customizations
        </h3>
        <span class="customization-info">Make it uniquely yours</span>
      </div>
      
      <div class="customization-options">
        <!-- Personalization -->
        <div v-if="customizations.personalization" class="customization-group">
          <h4 class="group-title">Personalization</h4>
          <div class="personalization-option">
            <label class="option-label">Add Text ({{ maxPersonalizationChars }} chars max)</label>
            <input
              type="text"
              v-model="personalizationText"
              :maxlength="maxPersonalizationChars"
              class="personalization-input"
              placeholder="Enter custom text..."
            />
            <div class="char-count">{{ personalizationText.length }}/{{ maxPersonalizationChars }}</div>
          </div>
          <div class="personalization-preview">
            <span class="preview-label">Preview:</span>
            <span class="preview-text">{{ personalizationText || 'Your text here' }}</span>
          </div>
        </div>
        
        <!-- Lacing Options -->
        <div v-if="customizations.lacing" class="customization-group">
          <h4 class="group-title">Lacing Style</h4>
          <div class="lacing-options">
            <button
              v-for="lacing in lacingOptions"
              :key="lacing.id"
              :class="['lacing-option', { selected: selectedLacing === lacing.id }]"
              @click="selectLacing(lacing.id)"
            >
              <img :src="lacing.image" :alt="lacing.name" class="lacing-image" />
              <span class="lacing-name">{{ lacing.name }}</span>
            </button>
          </div>
        </div>
        
        <!-- Sole Options -->
        <div v-if="customizations.sole" class="customization-group">
          <h4 class="group-title">Sole Type</h4>
          <div class="sole-options">
            <label
              v-for="sole in soleOptions"
              :key="sole.id"
              :class="['sole-option', { selected: selectedSole === sole.id }]"
            >
              <input
                type="radio"
                :value="sole.id"
                v-model="selectedSole"
                class="sole-radio"
              />
              <div class="sole-content">
                <span class="sole-name">{{ sole.name }}</span>
                <span class="sole-description">{{ sole.description }}</span>
                <div v-if="sole.priceAdjustment" class="sole-price">
                  +${{ sole.priceAdjustment }}
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Variant Summary & Pricing -->
    <div class="variant-summary">
      <div class="summary-content">
        <div class="selected-variants">
          <h4 class="summary-title">Your Selection</h4>
          <div class="variant-list">
            <div v-if="selectedColor" class="variant-item">
              <span class="variant-label">Color:</span>
              <span class="variant-value">{{ selectedColor.name }}</span>
            </div>
            <div v-if="selectedSize" class="variant-item">
              <span class="variant-label">Size:</span>
              <span class="variant-value">{{ selectedSize.label }}</span>
            </div>
            <div v-if="selectedWidth" class="variant-item">
              <span class="variant-label">Width:</span>
              <span class="variant-value">{{ selectedWidth.label }}</span>
            </div>
            <div v-if="selectedMaterial" class="variant-item">
              <span class="variant-label">Material:</span>
              <span class="variant-value">{{ selectedMaterial.name }}</span>
            </div>
            <div v-if="personalizationText" class="variant-item">
              <span class="variant-label">Text:</span>
              <span class="variant-value">"{{ personalizationText }}"</span>
            </div>
          </div>
        </div>
        
        <div class="pricing-summary">
          <div class="price-breakdown">
            <div class="price-line base">
              <span class="price-label">Base Price:</span>
              <span class="price-value">${{ basePrice }}</span>
            </div>
            <div v-if="colorPriceAdjustment !== 0" class="price-line adjustment">
              <span class="price-label">Color Adjustment:</span>
              <span class="price-value">{{ colorPriceAdjustment > 0 ? '+' : '' }}${{ colorPriceAdjustment }}</span>
            </div>
            <div v-if="materialPriceAdjustment !== 0" class="price-line adjustment">
              <span class="price-label">Material Upgrade:</span>
              <span class="price-value">+${{ materialPriceAdjustment }}</span>
            </div>
            <div v-if="customizationPrice !== 0" class="price-line adjustment">
              <span class="price-label">Customizations:</span>
              <span class="price-value">+${{ customizationPrice }}</span>
            </div>
          </div>
          <div class="total-price">
            <span class="total-label">Total:</span>
            <span class="total-value">${{ totalPrice }}</span>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'ProductDetailsVariants',
  props: {
    product: {
      type: Object,
      required: true
    },
    initialColor: {
      type: String,
      default: null
    },
    initialSize: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // Selected variants
      selectedColor: null,
      selectedSize: null,
      selectedWidth: null,
      selectedMaterial: null,
      selectedLacing: 'standard',
      selectedSole: 'standard',
      
      // UI states
      showSizeGuide: false,
      selectedColorImageIndex: 0,
      activeColorFilter: 'all',
      activeSizeFilter: 'all',
      
      // Customization
      personalizationText: '',
      maxPersonalizationChars: 15,
      
      // AI recommendation
      sizeConfidence: 89,
      
      // Mock data - in real app would come from API
      availableColors: [
        {
          id: 'black',
          name: 'Midnight Black',
          hex: '#000000',
          description: 'Classic black with premium finish',
          attributes: ['Versatile', 'Professional'],
          available: true,
          stock: 15,
          priceAdjustment: 0,
          images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&sat=-50'
          ]
        },
        {
          id: 'white',
          name: 'Pure White',
          hex: '#FFFFFF',
          description: 'Clean white leather finish',
          attributes: ['Fresh', 'Minimalist'],
          available: true,
          stock: 8,
          priceAdjustment: 0,
          images: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
          ]
        },
        {
          id: 'navy',
          name: 'Navy Blue',
          hex: '#001f3f',
          description: 'Deep navy with subtle texture',
          attributes: ['Sophisticated', 'Casual'],
          available: true,
          stock: 12,
          priceAdjustment: 0
        },
        {
          id: 'brown',
          name: 'Cognac Brown',
          hex: '#A0522D',
          description: 'Rich cognac leather',
          attributes: ['Luxurious', 'Timeless'],
          available: true,
          stock: 6,
          priceAdjustment: 15
        },
        {
          id: 'red',
          name: 'Crimson Red',
          hex: '#DC143C',
          description: 'Bold statement red',
          attributes: ['Bold', 'Eye-catching'],
          available: false,
          stock: 0,
          priceAdjustment: 10
        }
      ],
      
      availableSizes: [
        { id: 'us-7', label: '7', measurement: '25.0 cm', available: true, stock: 5, recommended: false, popular: false, fastShipping: true },
        { id: 'us-7.5', label: '7.5', measurement: '25.5 cm', available: true, stock: 8, recommended: false, popular: true, fastShipping: true },
        { id: 'us-8', label: '8', measurement: '26.0 cm', available: true, stock: 12, recommended: false, popular: true, fastShipping: true },
        { id: 'us-8.5', label: '8.5', measurement: '26.5 cm', available: true, stock: 15, recommended: true, popular: true, fastShipping: true },
        { id: 'us-9', label: '9', measurement: '27.0 cm', available: true, stock: 18, recommended: true, popular: true, fastShipping: true },
        { id: 'us-9.5', label: '9.5', measurement: '27.5 cm', available: true, stock: 14, recommended: false, popular: true, fastShipping: true },
        { id: 'us-10', label: '10', measurement: '28.0 cm', available: true, stock: 11, recommended: false, popular: true, fastShipping: false },
        { id: 'us-10.5', label: '10.5', measurement: '28.5 cm', available: true, stock: 7, recommended: false, popular: false, fastShipping: false },
        { id: 'us-11', label: '11', measurement: '29.0 cm', available: true, stock: 4, recommended: false, popular: false, fastShipping: false },
        { id: 'us-11.5', label: '11.5', measurement: '29.5 cm', available: false, stock: 0, recommended: false, popular: false, fastShipping: false },
        { id: 'us-12', label: '12', measurement: '30.0 cm', available: true, stock: 2, recommended: false, popular: false, fastShipping: false }
      ],
      
      availableWidths: [
        { id: 'narrow', label: 'B (Narrow)', description: 'For narrow feet', available: true },
        { id: 'medium', label: 'D (Medium)', description: 'Standard width', available: true },
        { id: 'wide', label: 'EE (Wide)', description: 'For wide feet', available: true },
        { id: 'extra-wide', label: 'EEE (Extra Wide)', description: 'For extra wide feet', available: false }
      ],
      
      availableMaterials: [
        {
          id: 'standard-leather',
          name: 'Premium Leather',
          description: 'High-quality genuine leather',
          features: ['Durable', 'Classic', 'Breathable'],
          priceAdjustment: 0,
          premium: false,
          texture: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100&h=100&fit=crop'
        },
        {
          id: 'suede',
          name: 'Suede Finish',
          description: 'Soft suede material',
          features: ['Soft', 'Textured', 'Unique'],
          priceAdjustment: 25,
          premium: true,
          texture: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop'
        }
      ],
      
      lacingOptions: [
        { id: 'standard', name: 'Standard Lacing', image: 'https://via.placeholder.com/60x40/667eea/white?text=STD' },
        { id: 'straight', name: 'Straight Bar', image: 'https://via.placeholder.com/60x40/764ba2/white?text=STR' },
        { id: 'ladder', name: 'Ladder Lacing', image: 'https://via.placeholder.com/60x40/f093fb/white?text=LAD' }
      ],
      
      soleOptions: [
        { id: 'standard', name: 'Standard Sole', description: 'Regular comfort sole', priceAdjustment: 0 },
        { id: 'comfort', name: 'Comfort Plus', description: 'Extra cushioning', priceAdjustment: 20 },
        { id: 'performance', name: 'Performance Sole', description: 'Enhanced grip and support', priceAdjustment: 35 }
      ],
      
      colorFilters: [
        { type: 'all', label: 'All Colors', count: 5 },
        { type: 'neutral', label: 'Neutral', count: 3 },
        { type: 'bold', label: 'Bold', count: 2 }
      ],
      
      sizeFilters: [
        { type: 'all', label: 'All Sizes' },
        { type: 'available', label: 'Available Only' },
        { type: 'popular', label: 'Popular' },
        { type: 'recommended', label: 'Recommended' }
      ],
      
      sizeConversions: [
        { us: '7', eu: '40', uk: '6.5', cm: '25.0', inches: '9.8' },
        { us: '8', eu: '41', uk: '7.5', cm: '26.0', inches: '10.2' },
        { us: '9', eu: '42', uk: '8.5', cm: '27.0', inches: '10.6' },
        { us: '10', eu: '43', uk: '9.5', cm: '28.0', inches: '11.0' },
        { us: '11', eu: '44', uk: '10.5', cm: '29.0', inches: '11.4' },
        { us: '12', eu: '45', uk: '11.5', cm: '30.0', inches: '11.8' }
      ]
    }
  },
  computed: {
    basePrice() {
      return this.product.price || 0
    },
    
    colorPriceAdjustment() {
      return this.selectedColor ? this.selectedColor.priceAdjustment : 0
    },
    
    materialPriceAdjustment() {
      return this.selectedMaterial ? this.selectedMaterial.priceAdjustment : 0
    },
    
    customizationPrice() {
      let price = 0
      if (this.personalizationText) price += 15
      if (this.selectedSole !== 'standard') {
        const sole = this.soleOptions.find(s => s.id === this.selectedSole)
        price += sole ? sole.priceAdjustment : 0
      }
      return price
    },
    
    totalPrice() {
      return this.basePrice + this.colorPriceAdjustment + this.materialPriceAdjustment + this.customizationPrice
    },
    
    filteredSizes() {
      if (this.activeSizeFilter === 'all') return this.availableSizes
      if (this.activeSizeFilter === 'available') return this.availableSizes.filter(s => s.available)
      if (this.activeSizeFilter === 'popular') return this.availableSizes.filter(s => s.popular)
      if (this.activeSizeFilter === 'recommended') return this.availableSizes.filter(s => s.recommended)
      return this.availableSizes
    },
    
    hasWidthOptions() {
      return this.availableWidths && this.availableWidths.length > 0
    },
    
    hasMaterialOptions() {
      return this.availableMaterials && this.availableMaterials.length > 1
    },
    
    hasCustomizations() {
      return this.customizations.personalization || this.customizations.lacing || this.customizations.sole
    },
    
    customizations() {
      return {
        personalization: true,
        lacing: true,
        sole: true
      }
    }
  },
  mounted() {
    this.initializeDefaults()
  },
  methods: {
    initializeDefaults() {
      // Set initial color
      if (this.initialColor) {
        const color = this.availableColors.find(c => c.id === this.initialColor)
        if (color && color.available) {
          this.selectColor(color)
        }
      } else {
        // Select first available color
        const firstAvailable = this.availableColors.find(c => c.available)
        if (firstAvailable) {
          this.selectColor(firstAvailable)
        }
      }
      
      // Set initial size
      if (this.initialSize) {
        const size = this.availableSizes.find(s => s.id === this.initialSize)
        if (size && size.available) {
          this.selectSize(size)
        }
      }
      
      // Set default width
      const defaultWidth = this.availableWidths.find(w => w.label.includes('Medium'))
      if (defaultWidth) {
        this.selectWidth(defaultWidth)
      }
      
      // Set default material
      if (this.availableMaterials.length > 0) {
        this.selectMaterial(this.availableMaterials[0])
      }
    },
    
    selectColor(color) {
      if (!color.available) return
      
      this.selectedColor = color
      this.selectedColorImageIndex = 0
      this.emitVariantChange()
    },
    
    selectSize(size) {
      if (!size.available) return
      
      this.selectedSize = size
      this.emitVariantChange()
    },
    
    selectWidth(width) {
      if (!width.available) return
      
      this.selectedWidth = width
      this.emitVariantChange()
    },
    
    selectMaterial(material) {
      this.selectedMaterial = material
      this.emitVariantChange()
    },
    
    selectLacing(lacingId) {
      this.selectedLacing = lacingId
      this.emitVariantChange()
    },
    
    emitVariantChange() {
      this.$emit('variant-changed', {
        color: this.selectedColor,
        size: this.selectedSize,
        width: this.selectedWidth,
        material: this.selectedMaterial,
        lacing: this.selectedLacing,
        sole: this.selectedSole,
        personalization: this.personalizationText,
        totalPrice: this.totalPrice
      })
    },
    
    getColorTooltip(color) {
      if (!color.available) return `${color.name} - Out of stock`
      if (color.stock < 5) return `${color.name} - Only ${color.stock} left`
      return `${color.name} - ${color.description}`
    },
    
    getSizeTooltip(size) {
      if (!size.available) return `Size ${size.label} - Out of stock`
      let tooltip = `Size ${size.label} (${size.measurement})`
      if (size.recommended) tooltip += ' - Recommended for you'
      if (size.popular) tooltip += ' - Popular choice'
      return tooltip
    },
    
    getSizeRecommendation() {
      if (!this.selectedSize) return ''
      
      const recommendations = [
        'Perfect fit based on your foot profile',
        'Great choice! This size is popular with similar customers',
        'Excellent fit for your measurements',
        'This size matches your previous purchases'
      ]
      
      return recommendations[Math.floor(Math.random() * recommendations.length)]
    },
    
    filterByColorType(type) {
      this.activeColorFilter = type
      // In real app, would filter the availableColors array
    },
    
    filterBySize(type) {
      this.activeSizeFilter = type
    },
    
    previousColorImage() {
      if (this.selectedColorImageIndex > 0) {
        this.selectedColorImageIndex--
      }
    },
    
    nextColorImage() {
      if (this.selectedColor && this.selectedColorImageIndex < this.selectedColor.images.length - 1) {
        this.selectedColorImageIndex++
      }
    },
    
    openColorImageGallery() {
      this.$emit('open-gallery', {
        images: this.selectedColor.images,
        startIndex: this.selectedColorImageIndex
      })
    }
  },
  watch: {
    personalizationText() {
      this.emitVariantChange()
    },
    
    selectedSole() {
      this.emitVariantChange()
    }
  }
}
</script>

<style scoped>
.product-details-variants {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Section Styling */
.variants-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e1e5e9;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.title-icon {
  font-size: 20px;
}

.selected-variant {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  background: #f8f9ff;
  padding: 4px 12px;
  border-radius: 16px;
}

.size-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.size-guide-btn {
  background: none;
  border: 1px solid #667eea;
  color: #667eea;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-guide-btn:hover {
  background: #667eea;
  color: white;
}

/* Color Variants */
.color-options-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.color-swatches {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.color-swatch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.color-swatch:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.color-swatch.selected {
  border-color: #667eea;
  background: #f8f9ff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.color-swatch.unavailable {
  opacity: 0.5;
  cursor: not-allowed;
}

.color-swatch.low_stock {
  border-color: #ffc107;
}

.swatch-color {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ddd;
  background-size: cover;
  background-position: center;
}

.swatch-name {
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: #333;
}

.stock-indicator {
  position: absolute;
  top: -6px;
  right: -6px;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stock-indicator.low {
  background: #ffc107;
  color: #333;
}

.stock-indicator.out {
  background: #dc3545;
  color: white;
}

.price-adjustment {
  position: absolute;
  bottom: -6px;
  right: -6px;
  background: #28a745;
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
}

.color-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-filter {
  padding: 6px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 16px;
  background: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-filter:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.color-filter.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

/* Color Details */
.color-details {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.color-info {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 20px;
}

.color-preview {
  display: flex;
  gap: 16px;
}

.large-swatch {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 2px solid #ddd;
  flex-shrink: 0;
}

.color-meta {
  flex: 1;
}

.color-name {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.color-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.color-attributes {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.color-attribute {
  background: #f0f0f0;
  color: #666;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.color-images {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-preview {
  position: relative;
}

.color-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-image:hover {
  transform: scale(1.05);
}

.image-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
}

.nav-btn {
  width: 28px;
  height: 28px;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.2s ease;
}

.nav-btn:hover:not(:disabled) {
  border-color: #667eea;
  background: #f8f9ff;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-counter {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* Size Variants */
.size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.size-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
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

.size-option.recommended {
  border-color: #28a745;
}

.size-option.popular::after {
  content: '🔥';
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 12px;
}

.size-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.size-label {
  font-size: 16px;
  font-weight: 700;
}

.size-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.size-measurement {
  font-size: 10px;
  opacity: 0.8;
}

.recommended-badge,
.popular-badge {
  background: #28a745;
  color: white;
  padding: 1px 4px;
  border-radius: 4px;
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.popular-badge {
  background: #ff6b6b;
}

.size-availability {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 8px;
  white-space: nowrap;
}

.availability-status.in {
  background: #d4edda;
  color: #155724;
}

.availability-status.low {
  background: #fff3cd;
  color: #856404;
}

.availability-status.out {
  background: #f8d7da;
  color: #721c24;
}

.shipping-indicator {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: #667eea;
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 8px;
  font-weight: 700;
  white-space: nowrap;
}

.size-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.size-filter {
  padding: 6px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 16px;
  background: white;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-filter:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.size-filter.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

/* Size Guide */
.size-guide {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9ff;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.guide-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.close-guide {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.close-guide:hover {
  background: rgba(0, 0, 0, 0.1);
}

.guide-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.size-chart h5,
.fit-guide h5,
.fit-recommendations h5 {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

.conversion-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.conversion-table th,
.conversion-table td {
  padding: 6px 8px;
  text-align: center;
  border: 1px solid #e1e5e9;
}

.conversion-table th {
  background: #f0f0f0;
  font-weight: 600;
}

.measurement-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.step {
  display: flex;
  gap: 12px;
}

.step-number {
  width: 24px;
  height: 24px;
  background: #667eea;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content h6 {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 4px;
}

.step-content p {
  font-size: 11px;
  color: #666;
  margin: 0;
}

.fit-tips {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fit-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.tip-icon {
  font-size: 14px;
}

/* Size Recommendation */
.size-recommendation {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.ai-recommendation {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f4f8 100%);
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.ai-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
}

.ai-icon {
  font-size: 14px;
}

.recommendation-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recommendation-text {
  font-size: 14px;
  color: #333;
  margin: 0;
}

.confidence-bar {
  height: 6px;
  background: #e1e5e9;
  border-radius: 3px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #28a745);
  transition: width 0.5s ease;
}

.confidence-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* Width Variants */
.width-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.width-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.width-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.width-option.selected {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.width-option.unavailable {
  opacity: 0.5;
  cursor: not-allowed;
}

.width-label {
  font-size: 14px;
  font-weight: 700;
}

.width-description {
  font-size: 11px;
  opacity: 0.8;
  text-align: center;
}

/* Material Variants */
.material-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.material-option {
  display: flex;
  gap: 12px;
  padding: 16px;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.material-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.material-option.selected {
  border-color: #667eea;
  background: #f8f9ff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.material-option.premium {
  border-color: #ffd700;
}

.material-preview {
  flex-shrink: 0;
}

.material-texture {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.material-info {
  flex: 1;
}

.material-name {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.material-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.material-features {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.material-feature {
  background: #f0f0f0;
  color: #666;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
}

.material-price {
  font-size: 12px;
  font-weight: 700;
  color: #28a745;
}

/* Customization Options */
.customization-info {
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.customization-options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.customization-group {
  padding: 16px;
  background: #f8f9ff;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.group-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

/* Personalization */
.personalization-option {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.option-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.personalization-input {
  padding: 10px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.personalization-input:focus {
  border-color: #667eea;
}

.char-count {
  font-size: 12px;
  color: #666;
  text-align: right;
}

.personalization-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e1e5e9;
}

.preview-label {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.preview-text {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  font-style: italic;
}

/* Lacing Options */
.lacing-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.lacing-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lacing-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.lacing-option.selected {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.lacing-image {
  width: 50px;
  height: 30px;
  object-fit: cover;
  border-radius: 4px;
}

.lacing-name {
  font-size: 11px;
  font-weight: 600;
  text-align: center;
}

/* Sole Options */
.sole-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sole-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sole-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.sole-option.selected {
  border-color: #667eea;
  background: #f8f9ff;
}

.sole-radio {
  margin: 0;
}

.sole-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sole-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.sole-description {
  font-size: 12px;
  color: #666;
}

.sole-price {
  font-size: 12px;
  font-weight: 700;
  color: #28a745;
}

/* Variant Summary */
.variant-summary {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 2px solid #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
}

.summary-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: start;
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
}

.variant-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.variant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.variant-label {
  color: #666;
  font-weight: 500;
}

.variant-value {
  color: #333;
  font-weight: 600;
}

.pricing-summary {
  min-width: 200px;
}

.price-breakdown {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e1e5e9;
}

.price-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.price-line.base {
  font-weight: 600;
}

.price-line.adjustment {
  font-size: 13px;
  color: #666;
}

.price-label {
  color: #666;
}

.price-value {
  color: #333;
  font-weight: 600;
}

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.total-value {
  color: #667eea;
}

/* Responsive Design */
@media (max-width: 768px) {
  .product-details-variants {
    gap: 24px;
  }
  
  .variants-section {
    padding: 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .color-swatches {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  
  .size-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
  
  .color-info {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .guide-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .material-options {
    grid-template-columns: 1fr;
  }
  
  .summary-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .conversion-table {
    font-size: 10px;
  }
  
  .conversion-table th,
  .conversion-table td {
    padding: 4px 6px;
  }
}

@media (max-width: 480px) {
  .color-swatches {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
  
  .size-grid {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  }
  
  .width-options {
    grid-template-columns: 1fr;
  }
  
  .lacing-options {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .color-preview {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .customization-options {
    gap: 16px;
  }
  
  .variants-section {
    padding: 12px;
  }
}
</style>
