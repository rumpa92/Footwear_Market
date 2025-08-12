<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" @click="openProductModal">
      <div class="product-badges">
        <span v-if="product.isNew" class="badge badge-new">New</span>
        <span v-if="product.onSale" class="badge badge-sale">Sale</span>
      </div>
      <button 
        class="favorite-btn"
        :class="{ active: isFavorite }"
        @click="toggleFavorite"
      >
        ❤️
      </button>
      <div class="product-overlay">
        <button class="quick-view-btn" @click="openProductModal">
          Quick View
        </button>
      </div>
    </div>
    
    <div class="product-info">
      <div class="product-brand">{{ product.brand }}</div>
      <h3 class="product-name" @click="openProductModal">{{ product.name }}</h3>
      
      <div class="product-rating">
        <div class="stars">
          <span v-for="n in 5" :key="n" :class="{ filled: n <= Math.floor(product.rating) }">★</span>
        </div>
        <span class="rating-text">({{ product.reviews }})</span>
      </div>
      
      <div class="product-price">
        <span class="current-price">${{ product.price }}</span>
        <span 
          v-if="product.onSale && product.originalPrice > product.price" 
          class="original-price"
        >${{ product.originalPrice }}</span>
        <span v-if="product.onSale" class="discount">
          -{{ Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) }}%
        </span>
      </div>
      
      <div class="product-options">
        <div class="size-selector">
          <label>Size:</label>
          <select v-model="selectedSize" class="size-select">
            <option value="">Select Size</option>
            <option v-for="size in product.sizes" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
        
        <div class="color-selector">
          <label>Color:</label>
          <div class="color-options">
            <button
              v-for="color in product.colors"
              :key="color"
              :class="{ active: selectedColor === color }"
              @click="selectedColor = color"
              class="color-option"
              :title="color"
            >
              {{ color.charAt(0) }}
            </button>
          </div>
        </div>
      </div>
      
      <button 
        class="add-to-cart-btn"
        :disabled="!selectedSize || !selectedColor"
        @click="addToCart"
      >
        🛒 Add to Cart
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedSize: '',
      selectedColor: ''
    }
  },
  computed: {
    ...mapState(['user']),
    isFavorite() {
      return this.user.favorites.includes(this.product.id)
    }
  },
  mounted() {
    // Set default selections
    if (this.product.sizes.length > 0) {
      this.selectedSize = this.product.sizes[0]
    }
    if (this.product.colors.length > 0) {
      this.selectedColor = this.product.colors[0]
    }
  },
  methods: {
    addToCart() {
      if (!this.selectedSize || !this.selectedColor) {
        alert('Please select size and color')
        return
      }
      
      this.$emit('add-to-cart', {
        product: this.product,
        size: this.selectedSize,
        color: this.selectedColor
      })
    },
    toggleFavorite() {
      this.$emit('toggle-favorite', this.product.id)
    },
    openProductModal() {
      console.log('Open product modal for:', this.product.name)
      // Would implement product modal
    }
  }
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  height: 250px;
  overflow: hidden;
  cursor: pointer;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
  z-index: 2;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 2;
  font-size: 16px;
}

.favorite-btn:hover {
  background: white;
  transform: scale(1.1);
}

.favorite-btn.active {
  background: #ff6b6b;
  color: white;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.quick-view-btn {
  background: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-view-btn:hover {
  background: #f8f9fa;
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
}

.product-brand {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease;
}

.product-name:hover {
  color: #667eea;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars span {
  color: #ddd;
  font-size: 14px;
}

.stars span.filled {
  color: #ffd700;
}

.rating-text {
  font-size: 12px;
  color: #666;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.current-price {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.discount {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.product-options {
  margin-bottom: 16px;
}

.size-selector,
.color-selector {
  margin-bottom: 12px;
}

.size-selector label,
.color-selector label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.size-select {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.size-select:focus {
  border-color: #667eea;
}

.color-options {
  display: flex;
  gap: 8px;
}

.color-option {
  width: 32px;
  height: 32px;
  border: 2px solid #e1e5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  background: #f8f9fa;
  transition: all 0.2s ease;
}

.color-option:hover {
  border-color: #667eea;
}

.color-option.active {
  border-color: #667eea;
  background: #667eea;
  color: white;
}

.add-to-cart-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.add-to-cart-btn:disabled {
  background: #e1e5e9;
  color: #999;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .product-image {
    height: 200px;
  }
  
  .product-info {
    padding: 16px;
  }
  
  .product-name {
    font-size: 16px;
  }
  
  .current-price {
    font-size: 18px;
  }
}
</style>
