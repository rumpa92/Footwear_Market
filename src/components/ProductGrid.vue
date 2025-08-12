<template>
  <div class="product-grid">
    <div class="grid-header">
      <h2 v-if="searchQuery" class="grid-title">
        Search Results for "{{ searchQuery }}"
      </h2>
      <h2 v-else class="grid-title">All Products</h2>
      <p class="results-count">{{ filteredProducts.length }} products found</p>
    </div>
    
    <div v-if="loading" class="loading">
      Loading products...
    </div>
    
    <div v-else-if="filteredProducts.length === 0" class="no-results">
      <div class="no-results-icon">😞</div>
      <h3>No products found</h3>
      <p>Try adjusting your filters or search query</p>
    </div>
    
    <div v-else class="products-grid">
      <ProductCard 
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @add-to-cart="handleAddToCart"
        @toggle-favorite="handleToggleFavorite"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import ProductCard from './ProductCard.vue'

export default {
  name: 'ProductGrid',
  components: {
    ProductCard
  },
  computed: {
    ...mapState(['loading', 'searchQuery']),
    ...mapGetters(['filteredProducts'])
  },
  methods: {
    handleAddToCart(payload) {
      this.$store.dispatch('addToCart', payload)
      // Show toast notification (would implement)
      console.log('Added to cart:', payload)
    },
    handleToggleFavorite(productId) {
      this.$store.dispatch('toggleFavorite', productId)
    }
  }
}
</script>

<style scoped>
.product-grid {
  width: 100%;
}

.grid-header {
  margin-bottom: 32px;
  text-align: center;
}

.grid-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
}

.results-count {
  color: #666;
  font-size: 16px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.no-results {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.no-results-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-results h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.no-results p {
  color: #666;
  font-size: 16px;
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .grid-title {
    font-size: 24px;
  }
  
  .grid-header {
    margin-bottom: 24px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
