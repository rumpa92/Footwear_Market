<template>
  <div class="personalized-section">
    <div class="section-header">
      <div class="header-content">
        <h2 class="section-title">
          <span class="title-icon">🎯</span>
          Recommended for You
        </h2>
        <p class="section-subtitle">AI-powered picks based on your browsing history and preferences</p>
      </div>
      <div class="personalization-score">
        <div class="score-circle">
          <span class="score-value">{{ matchScore }}%</span>
        </div>
        <div class="score-info">
          <span class="score-label">Match Score</span>
          <span class="score-description">Based on your activity</span>
        </div>
      </div>
    </div>
    
    <div class="recommendations-grid">
      <div
        v-for="recommendation in recommendations"
        :key="recommendation.id"
        class="recommendation-card"
        @click="viewProduct(recommendation.product)"
      >
        <div class="card-header">
          <div class="recommendation-reason">
            <span class="reason-icon">{{ recommendation.reasonIcon }}</span>
            <span class="reason-text">{{ recommendation.reason }}</span>
          </div>
          <div class="confidence-score">{{ recommendation.confidence }}%</div>
        </div>
        
        <div class="product-image">
          <img :src="recommendation.product.image" :alt="recommendation.product.name">
          <div class="product-badges">
            <span v-if="recommendation.product.isNew" class="badge badge-new">New</span>
            <span v-if="recommendation.product.onSale" class="badge badge-sale">Sale</span>
          </div>
        </div>
        
        <div class="product-details">
          <h3 class="product-name">{{ recommendation.product.name }}</h3>
          <p class="product-brand">{{ recommendation.product.brand }}</p>
          
          <div class="product-price">
            <span class="current-price">${{ recommendation.product.price }}</span>
            <span 
              v-if="recommendation.product.onSale" 
              class="original-price"
            >${{ recommendation.product.originalPrice }}</span>
          </div>
          
          <div class="recommendation-insights">
            <div class="insight" v-for="insight in recommendation.insights" :key="insight.type">
              <span class="insight-icon">{{ insight.icon }}</span>
              <span class="insight-text">{{ insight.text }}</span>
            </div>
          </div>
        </div>
        
        <div class="card-actions">
          <button 
            @click.stop="addToCart(recommendation.product)"
            class="quick-add-btn"
          >
            Quick Add
          </button>
          <button 
            @click.stop="toggleFavorite(recommendation.product.id)"
            class="favorite-btn"
            :class="{ active: isFavorite(recommendation.product.id) }"
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
    
    <div class="personalization-footer">
      <div class="footer-content">
        <div class="training-info">
          <h4>How we personalize for you</h4>
          <div class="training-factors">
            <div class="factor">
              <span class="factor-icon">👀</span>
              <span class="factor-text">Browsing history</span>
              <span class="factor-weight">High impact</span>
            </div>
            <div class="factor">
              <span class="factor-icon">🛒</span>
              <span class="factor-text">Purchase patterns</span>
              <span class="factor-weight">Medium impact</span>
            </div>
            <div class="factor">
              <span class="factor-icon">❤️</span>
              <span class="factor-text">Favorites & wishlist</span>
              <span class="factor-weight">High impact</span>
            </div>
            <div class="factor">
              <span class="factor-icon">🔍</span>
              <span class="factor-text">Search queries</span>
              <span class="factor-weight">Medium impact</span>
            </div>
          </div>
        </div>
        <div class="privacy-controls">
          <button @click="managePersonalization" class="manage-btn">
            Manage Personalization
          </button>
          <button @click="viewPrivacySettings" class="privacy-btn">
            Privacy Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PersonalizedSection',
  data() {
    return {
      matchScore: 92,
      recommendations: [
        {
          id: 1,
          reason: 'Similar to your recent views',
          reasonIcon: '👀',
          confidence: 94,
          product: {
            id: 101,
            name: 'Nike Air Max 90',
            brand: 'Nike',
            price: 120,
            originalPrice: 150,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
            isNew: false,
            onSale: true
          },
          insights: [
            { type: 'size', icon: '📏', text: 'Available in your size (9)' },
            { type: 'color', icon: '🎨', text: 'Matches your style preferences' },
            { type: 'price', icon: '💰', text: 'Within your budget range' }
          ]
        },
        {
          id: 2,
          reason: 'Trending in your area',
          reasonIcon: '🔥',
          confidence: 87,
          product: {
            id: 102,
            name: 'Adidas Ultraboost 22',
            brand: 'Adidas',
            price: 180,
            image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop',
            isNew: true,
            onSale: false
          },
          insights: [
            { type: 'trending', icon: '📈', text: 'Popular in your city' },
            { type: 'activity', icon: '🏃', text: 'Perfect for running' },
            { type: 'reviews', icon: '⭐', text: '4.8/5 customer rating' }
          ]
        },
        {
          id: 3,
          reason: 'Complements your cart',
          reasonIcon: '🛒',
          confidence: 91,
          product: {
            id: 103,
            name: 'Converse Chuck 70',
            brand: 'Converse',
            price: 85,
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
            isNew: false,
            onSale: false
          },
          insights: [
            { type: 'style', icon: '👔', text: 'Casual style match' },
            { type: 'occasions', icon: '🎉', text: 'Great for weekends' },
            { type: 'versatile', icon: '🔄', text: 'Versatile styling' }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    viewProduct(product) {
      this.$emit('view-product', product)
    },
    addToCart(product) {
      this.$emit('add-to-cart', {
        product,
        size: '9', // Default or previously selected size
        color: product.colors ? product.colors[0] : 'Default'
      })
    },
    toggleFavorite(productId) {
      // Would dispatch to store
      console.log('Toggle favorite:', productId)
    },
    isFavorite(productId) {
      return this.user.favorites.includes(productId)
    },
    managePersonalization() {
      console.log('Manage personalization settings')
    },
    viewPrivacySettings() {
      console.log('View privacy settings')
    }
  }
}
</script>

<style scoped>
.personalized-section {
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 48px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-content {
  flex: 1;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.title-icon {
  font-size: 32px;
}

.section-subtitle {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

.personalization-score {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.score-circle {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
}

.score-info {
  display: flex;
  flex-direction: column;
}

.score-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.score-description {
  font-size: 12px;
  color: #666;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.recommendation-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  border-color: rgba(102, 126, 234, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.recommendation-reason {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(102, 126, 234, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
}

.reason-icon {
  font-size: 14px;
}

.reason-text {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
}

.confidence-score {
  background: #28a745;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}

.product-image {
  position: relative;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
}

.badge {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.badge-new {
  background: #4facfe;
  color: white;
}

.badge-sale {
  background: #ff6b6b;
  color: white;
}

.product-details {
  margin-bottom: 16px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.product-brand {
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 8px;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
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

.recommendation-insights {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.insight {
  display: flex;
  align-items: center;
  gap: 8px;
}

.insight-icon {
  font-size: 12px;
  width: 16px;
}

.insight-text {
  font-size: 12px;
  color: #666;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.quick-add-btn {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.favorite-btn {
  width: 40px;
  height: 40px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  border-color: #ff6b6b;
  background: #fff5f5;
}

.favorite-btn.active {
  background: #ff6b6b;
  border-color: #ff6b6b;
  color: white;
}

.personalization-footer {
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  padding-top: 24px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.training-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.training-factors {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.factor {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.factor-icon {
  font-size: 14px;
}

.factor-text {
  flex: 1;
  color: #666;
}

.factor-weight {
  font-weight: 600;
  color: #667eea;
}

.privacy-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.manage-btn,
.privacy-btn {
  padding: 8px 16px;
  border: 1px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.manage-btn:hover,
.privacy-btn:hover {
  background: #667eea;
  color: white;
}

@media (max-width: 1024px) {
  .personalized-section {
    padding: 32px 24px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 20px;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .training-factors {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .personalized-section {
    padding: 24px 16px;
  }
  
  .section-title {
    font-size: 24px;
  }
}
</style>
