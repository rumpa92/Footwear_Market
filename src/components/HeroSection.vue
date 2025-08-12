<template>
  <div class="hero-section">
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">
          Step Into <span class="highlight">Style</span>
        </h1>
        <p class="hero-subtitle">
          Discover the latest footwear trends from top brands. From casual sneakers to premium athletics - find your perfect pair.
        </p>
        <div class="hero-buttons">
          <button class="btn btn-primary btn-lg" @click="scrollToProducts">
            Shop Now
          </button>
          <button class="btn btn-secondary btn-lg">
            View Collections
          </button>
        </div>
      </div>
      <div class="hero-image">
        <img 
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop&crop=center" 
          alt="Featured Footwear"
          class="hero-img"
        >
        <div class="floating-badge">
          <span class="badge badge-new">New Collection</span>
        </div>
      </div>
    </div>
    
    <div class="featured-section">
      <h2 class="section-title">Featured Products</h2>
      <div class="featured-grid">
        <div 
          v-for="product in featuredProducts" 
          :key="product.id"
          class="featured-card"
          @click="viewProduct(product)"
        >
          <div class="featured-image">
            <img :src="product.image" :alt="product.name">
            <div class="featured-badges">
              <span v-if="product.isNew" class="badge badge-new">New</span>
              <span v-if="product.onSale" class="badge badge-sale">Sale</span>
            </div>
          </div>
          <div class="featured-info">
            <h3>{{ product.name }}</h3>
            <p class="brand">{{ product.brand }}</p>
            <div class="price-rating">
              <div class="price">
                <span class="current-price">${{ product.price }}</span>
                <span 
                  v-if="product.onSale && product.originalPrice > product.price" 
                  class="original-price"
                >${{ product.originalPrice }}</span>
              </div>
              <div class="rating">
                <span class="stars">★★★★★</span>
                <span class="rating-text">({{ product.reviews }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🚚</div>
          <h3>Free Shipping</h3>
          <p>On orders over $100</p>
        </div>
        <div class="stat-card">
          <div class="stat-icon">↩️</div>
          <h3>Easy Returns</h3>
          <p>30-day return policy</p>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🛡️</div>
          <h3>Secure Payment</h3>
          <p>100% secure checkout</p>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <h3>Top Rated</h3>
          <p>4.8/5 customer rating</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HeroSection',
  computed: {
    ...mapGetters(['featuredProducts'])
  },
  methods: {
    scrollToProducts() {
      const productGrid = document.querySelector('.product-grid')
      if (productGrid) {
        productGrid.scrollIntoView({ behavior: 'smooth' })
      }
    },
    viewProduct(product) {
      console.log('View product:', product.name)
      // Would implement product modal or navigation
    }
  }
}
</script>

<style scoped>
.hero-section {
  margin-bottom: 60px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  margin-bottom: 80px;
  padding: 40px 0;
}

.hero-text {
  max-width: 500px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  color: #333;
}

.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
}

.hero-image {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-img {
  width: 100%;
  max-width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.hero-img:hover {
  transform: scale(1.05);
}

.floating-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.featured-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.featured-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.featured-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.featured-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-card:hover .featured-image img {
  transform: scale(1.1);
}

.featured-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
}

.featured-info {
  padding: 20px;
}

.featured-info h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}

.brand {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.price-rating {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  display: flex;
  align-items: center;
  gap: 8px;
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
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stars {
  color: #ffd700;
  font-size: 14px;
}

.rating-text {
  font-size: 12px;
  color: #666;
}

.stats-section {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  border-radius: 20px;
  padding: 60px 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.stat-card {
  text-align: center;
}

.stat-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.stat-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.stat-card p {
  color: #666;
  font-size: 14px;
}

@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 40px;
  }
  
  .featured-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
  
  .hero-buttons {
    flex-direction: column;
  }
  
  .featured-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
  }
  
  .stats-section {
    padding: 40px 20px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
