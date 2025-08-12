<template>
  <div class="ai-recommendations" v-if="hasRecommendations">
    <!-- Main Recommendations Container -->
    <div class="recommendations-container">
      
      <!-- Section Header -->
      <div class="recommendations-header">
        <div class="header-content">
          <div class="ai-badge">
            <svg class="ai-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            <span>AI Powered</span>
          </div>
          <h2 class="section-title">{{ currentSectionTitle }}</h2>
          <p class="section-subtitle">{{ currentSectionSubtitle }}</p>
        </div>
        
        <!-- Recommendation Type Tabs -->
        <div class="recommendation-tabs">
          <button
            v-for="tab in availableTabs"
            :key="tab.type"
            :class="['tab-button', { active: activeTab === tab.type }]"
            @click="switchTab(tab.type)"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
            <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
          </button>
        </div>
      </div>
      
      <!-- Recommendations Content -->
      <div class="recommendations-content">
        
        <!-- You Might Also Like -->
        <div v-if="activeTab === 'similar' && similarProducts.length > 0" class="recommendation-section">
          <div class="products-grid">
            <div
              v-for="product in similarProducts"
              :key="product.id"
              class="recommendation-card"
              @click="selectProduct(product)"
            >
              <div class="card-header">
                <div class="confidence-score">
                  <span class="score-label">Match</span>
                  <div class="score-bar">
                    <div 
                      class="score-fill"
                      :style="{ width: product.matchScore + '%' }"
                    ></div>
                  </div>
                  <span class="score-value">{{ product.matchScore }}%</span>
                </div>
                <div class="recommendation-reason">
                  <span class="reason-tag">{{ product.reason }}</span>
                </div>
              </div>
              
              <div class="product-image-container">
                <img :src="product.image" :alt="product.name" class="product-image" />
                <div class="product-badges">
                  <span v-if="product.isNew" class="badge new">NEW</span>
                  <span v-if="product.onSale" class="badge sale">{{ product.discount }}% OFF</span>
                  <span v-if="product.trending" class="badge trending">🔥 TRENDING</span>
                </div>
                <div class="quick-actions">
                  <button class="quick-view-btn" @click.stop="quickView(product)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                  <button class="quick-add-btn" @click.stop="quickAdd(product)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 5v14M5 12h14"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="product-details">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-brand">{{ product.brand }}</p>
                <div class="product-rating">
                  <div class="stars">
                    <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= product.rating }">⭐</span>
                  </div>
                  <span class="rating-text">({{ product.reviews }})</span>
                </div>
                <div class="product-price">
                  <span class="current-price">${{ product.price }}</span>
                  <span v-if="product.originalPrice" class="original-price">${{ product.originalPrice }}</span>
                </div>
                <div class="recommendation-insights">
                  <div class="insight-tags">
                    <span v-for="tag in product.insights" :key="tag" class="insight-tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Complete the Look -->
        <div v-if="activeTab === 'complete' && completeTheLookSets.length > 0" class="recommendation-section">
          <div class="look-sets">
            <div
              v-for="set in completeTheLookSets"
              :key="set.id"
              class="look-set"
            >
              <div class="set-header">
                <h3 class="set-title">{{ set.title }}</h3>
                <p class="set-description">{{ set.description }}</p>
                <div class="set-savings">
                  <span class="savings-label">Bundle Savings:</span>
                  <span class="savings-amount">${{ set.savings }}</span>
                </div>
              </div>
              
              <div class="set-products">
                <div
                  v-for="product in set.products"
                  :key="product.id"
                  class="set-product"
                  @click="selectProduct(product)"
                >
                  <div class="product-image-wrapper">
                    <img :src="product.image" :alt="product.name" class="product-image" />
                    <div class="product-type-badge">{{ product.type }}</div>
                  </div>
                  <div class="product-summary">
                    <h4 class="product-name">{{ product.name }}</h4>
                    <span class="product-price">${{ product.price }}</span>
                  </div>
                  <button class="add-to-set-btn" @click.stop="addToCart(product)">
                    Add
                  </button>
                </div>
              </div>
              
              <div class="set-actions">
                <button class="add-all-btn" @click="addAllToCart(set.products)">
                  Add All to Cart - ${{ set.totalPrice }}
                </button>
                <button class="save-set-btn" @click="saveSet(set)">
                  Save Set
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Trending Styles -->
        <div v-if="activeTab === 'trending' && trendingProducts.length > 0" class="recommendation-section">
          <div class="trending-grid">
            <div
              v-for="product in trendingProducts"
              :key="product.id"
              class="trending-card"
              @click="selectProduct(product)"
            >
              <div class="trending-rank">
                <span class="rank-number">#{{ product.rank }}</span>
                <span class="rank-change" :class="product.changeDirection">
                  {{ product.changeDirection === 'up' ? '↗' : '↘' }}
                  {{ product.changeAmount }}
                </span>
              </div>
              
              <div class="product-image-container">
                <img :src="product.image" :alt="product.name" class="product-image" />
                <div class="trending-overlay">
                  <div class="trend-stats">
                    <div class="stat">
                      <span class="stat-value">{{ product.views }}</span>
                      <span class="stat-label">Views</span>
                    </div>
                    <div class="stat">
                      <span class="stat-value">{{ product.purchases }}</span>
                      <span class="stat-label">Sold</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="trend-metrics">
                  <span class="trend-score">Trend Score: {{ product.trendScore }}/100</span>
                  <span class="trend-category">{{ product.trendCategory }}</span>
                </div>
                <div class="product-price">
                  <span class="current-price">${{ product.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Personalized Picks -->
        <div v-if="activeTab === 'personalized' && personalizedPicks.length > 0" class="recommendation-section">
          <div class="personalized-intro">
            <div class="user-profile-summary">
              <div class="profile-avatar">
                <span class="avatar-text">{{ userInitials }}</span>
              </div>
              <div class="profile-info">
                <h3 class="profile-title">Your Style Profile</h3>
                <div class="profile-tags">
                  <span v-for="tag in userStyleTags" :key="tag" class="style-tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="personalized-grid">
            <div
              v-for="product in personalizedPicks"
              :key="product.id"
              class="personalized-card"
              @click="selectProduct(product)"
            >
              <div class="personalization-header">
                <div class="ai-confidence">
                  <svg class="ai-brain-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
                  </svg>
                  <span class="confidence-text">{{ product.confidence }}% match</span>
                </div>
                <div class="prediction-tags">
                  <span v-for="prediction in product.predictions" :key="prediction" class="prediction-tag">
                    {{ prediction }}
                  </span>
                </div>
              </div>
              
              <div class="product-image-container">
                <img :src="product.image" :alt="product.name" class="product-image" />
              </div>
              
              <div class="product-details">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-brand">{{ product.brand }}</p>
                <div class="personalization-reasons">
                  <h4 class="reasons-title">Why we picked this for you:</h4>
                  <ul class="reasons-list">
                    <li v-for="reason in product.reasons" :key="reason" class="reason-item">
                      {{ reason }}
                    </li>
                  </ul>
                </div>
                <div class="product-price">
                  <span class="current-price">${{ product.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      <!-- Load More / Refresh -->
      <div class="recommendations-footer">
        <button 
          class="refresh-recommendations"
          @click="refreshRecommendations"
          :disabled="isLoading"
        >
          <svg 
            class="refresh-icon"
            :class="{ spinning: isLoading }"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path d="M3 2v6h6M21 12a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 8M21 22v-6h-6M3 12a9 9 0 0 0 9 9 9 9 0 0 0 6-2.3L21 16"></path>
          </svg>
          {{ isLoading ? 'Finding new suggestions...' : 'Show New Suggestions' }}
        </button>
        
        <div class="recommendation-feedback">
          <span class="feedback-text">How are these recommendations?</span>
          <div class="feedback-buttons">
            <button class="feedback-btn good" @click="provideFeedback('good')">👍</button>
            <button class="feedback-btn bad" @click="provideFeedback('bad')">👎</button>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'AISmartRecommendations',
  props: {
    currentProduct: {
      type: Object,
      default: null
    },
    userBehavior: {
      type: Object,
      default: () => ({})
    },
    context: {
      type: String,
      default: 'general' // 'product-detail', 'category', 'cart', 'general'
    }
  },
  data() {
    return {
      activeTab: 'similar',
      isLoading: false,
      
      // Mock user data
      userInitials: 'JD',
      userStyleTags: ['Casual', 'Athletic', 'Comfort-focused', 'Brand-conscious'],
      
      // Available recommendation types
      availableTabs: [
        { type: 'similar', label: 'You Might Also Like', icon: '💡', count: 6 },
        { type: 'complete', label: 'Complete the Look', icon: '🎯', count: 3 },
        { type: 'trending', label: 'Trending Now', icon: '🔥', count: 8 },
        { type: 'personalized', label: 'For You', icon: '👤', count: 5 }
      ],
      
      // Mock recommendation data
      similarProducts: [
        {
          id: 101,
          name: 'Nike Air Max Plus',
          brand: 'Nike',
          price: 160,
          originalPrice: 200,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
          rating: 4.6,
          reviews: 189,
          matchScore: 94,
          reason: 'Similar Style',
          onSale: true,
          discount: 20,
          insights: ['Air cushioning', 'Popular choice'],
          isNew: false,
          trending: true
        },
        {
          id: 102,
          name: 'Adidas UltraBoost 23',
          brand: 'Adidas',
          price: 180,
          image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&h=300&fit=crop',
          rating: 4.8,
          reviews: 256,
          matchScore: 87,
          reason: 'Same Category',
          insights: ['Boost technology', 'Highly rated'],
          isNew: true,
          trending: false
        },
        {
          id: 103,
          name: 'New Balance 990v6',
          brand: 'New Balance',
          price: 185,
          image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=300&fit=crop',
          rating: 4.7,
          reviews: 134,
          matchScore: 82,
          reason: 'Customer Preference',
          insights: ['Premium materials', 'Made in USA'],
          isNew: false,
          trending: false
        }
      ],
      
      completeTheLookSets: [
        {
          id: 1,
          title: 'Athletic Casual Set',
          description: 'Complete your sporty look with these coordinated pieces',
          savings: 25,
          totalPrice: 285,
          products: [
            {
              id: 201,
              name: 'Nike Dri-FIT Shorts',
              type: 'Shorts',
              price: 45,
              image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=150&h=150&fit=crop'
            },
            {
              id: 202,
              name: 'Nike Performance Socks',
              type: 'Socks',
              price: 18,
              image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop'
            },
            {
              id: 203,
              name: 'Nike Gym Bag',
              type: 'Accessories',
              price: 72,
              image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop'
            }
          ]
        }
      ],
      
      trendingProducts: [
        {
          id: 301,
          name: 'Jordan 1 Retro High OG',
          rank: 1,
          changeDirection: 'up',
          changeAmount: 3,
          price: 170,
          image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=300&h=300&fit=crop',
          views: '2.3K',
          purchases: '145',
          trendScore: 98,
          trendCategory: 'Basketball'
        },
        {
          id: 302,
          name: 'Yeezy Boost 350 V2',
          rank: 2,
          changeDirection: 'down',
          changeAmount: 1,
          price: 220,
          image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300&h=300&fit=crop',
          views: '1.9K',
          purchases: '98',
          trendScore: 95,
          trendCategory: 'Lifestyle'
        }
      ],
      
      personalizedPicks: [
        {
          id: 401,
          name: 'Allbirds Tree Runners',
          brand: 'Allbirds',
          price: 98,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
          confidence: 92,
          predictions: ['Will love', 'Perfect fit'],
          reasons: [
            'Matches your preference for sustainable brands',
            'Similar to your recent purchases',
            'Highly rated by users with similar style'
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState(['user', 'products']),
    ...mapGetters(['filteredProducts']),
    
    hasRecommendations() {
      return this.similarProducts.length > 0 || 
             this.completeTheLookSets.length > 0 || 
             this.trendingProducts.length > 0 || 
             this.personalizedPicks.length > 0
    },
    
    currentSectionTitle() {
      const tab = this.availableTabs.find(t => t.type === this.activeTab)
      return tab ? tab.label : 'Recommendations'
    },
    
    currentSectionSubtitle() {
      const subtitles = {
        'similar': 'Based on your current selection and browsing history',
        'complete': 'Curated sets to complete your perfect look',
        'trending': 'What\'s popular right now in footwear',
        'personalized': 'Handpicked just for you by our AI'
      }
      return subtitles[this.activeTab] || ''
    }
  },
  mounted() {
    this.loadRecommendations()
  },
  methods: {
    switchTab(tabType) {
      this.activeTab = tabType
      this.loadRecommendations()
    },
    
    async loadRecommendations() {
      // In a real app, this would call an API
      // For now, we'll just simulate loading
      this.isLoading = true
      
      setTimeout(() => {
        this.isLoading = false
        // Update recommendation counts
        this.updateTabCounts()
      }, 500)
    },
    
    updateTabCounts() {
      const counts = {
        'similar': this.similarProducts.length,
        'complete': this.completeTheLookSets.length,
        'trending': this.trendingProducts.length,
        'personalized': this.personalizedPicks.length
      }
      
      this.availableTabs.forEach(tab => {
        tab.count = counts[tab.type] || 0
      })
    },
    
    selectProduct(product) {
      this.$emit('product-selected', product)
      // Navigate to product detail page
      console.log('Navigate to product:', product.name)
    },
    
    quickView(product) {
      this.$emit('quick-view', product)
      console.log('Quick view:', product.name)
    },
    
    quickAdd(product) {
      this.$store.dispatch('addToCart', {
        product,
        size: '9', // Default size - in real app, would show size selector
        color: 'Default'
      })
      this.$emit('product-added', product)
      console.log('Added to cart:', product.name)
    },
    
    addToCart(product) {
      this.quickAdd(product)
    },
    
    addAllToCart(products) {
      products.forEach(product => {
        this.addToCart(product)
      })
      this.$emit('set-added', products)
      console.log('Added set to cart:', products.length, 'items')
    },
    
    saveSet(set) {
      this.$emit('set-saved', set)
      console.log('Saved set:', set.title)
    },
    
    async refreshRecommendations() {
      this.isLoading = true
      
      // Simulate API call to get fresh recommendations
      setTimeout(() => {
        // In real app, would update recommendation data
        this.isLoading = false
        console.log('Refreshed recommendations')
      }, 1000)
    },
    
    provideFeedback(type) {
      this.$emit('feedback', { type, tab: this.activeTab })
      console.log('Feedback provided:', type, 'for', this.activeTab)
      
      // Show thank you message
      this.showFeedbackThankYou()
    },
    
    showFeedbackThankYou() {
      // Simple thank you - in real app might show toast
      console.log('Thank you for your feedback!')
    }
  }
}
</script>

<style scoped>
.ai-recommendations {
  margin: 32px 0;
}

.recommendations-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header */
.recommendations-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
}

.header-content {
  margin-bottom: 24px;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}

.ai-icon {
  width: 14px;
  height: 14px;
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.recommendation-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.recommendation-tabs::-webkit-scrollbar {
  display: none;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.tab-button.active {
  background: white;
  color: #667eea;
  border-color: white;
}

.tab-icon {
  font-size: 14px;
}

.tab-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
}

.tab-button.active .tab-count {
  background: #667eea;
  color: white;
}

/* Content */
.recommendations-content {
  padding: 24px;
}

.recommendation-section {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.recommendation-card {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 12px;
  background: #f8f9ff;
  border-bottom: 1px solid #e1e5e9;
}

.confidence-score {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.score-label {
  font-size: 11px;
  font-weight: 600;
  color: #666;
}

.score-bar {
  flex: 1;
  height: 4px;
  background: #e1e5e9;
  border-radius: 2px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.5s ease;
}

.score-value {
  font-size: 11px;
  font-weight: 700;
  color: #667eea;
}

.recommendation-reason {
  display: flex;
  justify-content: center;
}

.reason-tag {
  background: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recommendation-card:hover .product-image {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.badge.new {
  background: #4facfe;
  color: white;
}

.badge.sale {
  background: #fa709a;
  color: white;
}

.badge.trending {
  background: #ff6b6b;
  color: white;
}

.quick-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recommendation-card:hover .quick-actions {
  opacity: 1;
}

.quick-view-btn,
.quick-add-btn {
  width: 32px;
  height: 32px;
  background: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.quick-view-btn:hover,
.quick-add-btn:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.quick-view-btn svg,
.quick-add-btn svg {
  width: 14px;
  height: 14px;
}

.product-details {
  padding: 16px;
}

.product-name {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.product-brand {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 12px;
  filter: grayscale(1);
  opacity: 0.3;
}

.star.filled {
  filter: grayscale(0);
  opacity: 1;
}

.rating-text {
  font-size: 12px;
  color: #666;
}

.product-price {
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
  margin-left: 8px;
}

.recommendation-insights {
  margin-top: 8px;
}

.insight-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.insight-tag {
  background: #f0f0f0;
  color: #666;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
}

/* Complete the Look Sets */
.look-sets {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.look-set {
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  background: #fafafa;
}

.set-header {
  margin-bottom: 16px;
}

.set-title {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.set-description {
  color: #666;
  margin-bottom: 8px;
}

.set-savings {
  display: flex;
  align-items: center;
  gap: 8px;
}

.savings-label {
  font-size: 14px;
  color: #666;
}

.savings-amount {
  font-size: 16px;
  font-weight: 700;
  color: #28a745;
}

.set-products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.set-product {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.set-product:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.product-image-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.product-type-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: #667eea;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
}

.product-summary {
  margin-bottom: 8px;
}

.add-to-set-btn {
  width: 100%;
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.add-to-set-btn:hover {
  background: #5a6fd8;
}

.set-actions {
  display: flex;
  gap: 12px;
}

.add-all-btn {
  flex: 1;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.add-all-btn:hover {
  transform: translateY(-2px);
}

.save-set-btn {
  padding: 12px 20px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-set-btn:hover {
  background: #667eea;
  color: white;
}

/* Trending Products */
.trending-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.trending-card {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.trending-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.trending-rank {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 10;
}

.rank-number {
  font-weight: 700;
  font-size: 14px;
}

.rank-change {
  font-size: 12px;
}

.rank-change.up {
  color: #28a745;
}

.rank-change.down {
  color: #dc3545;
}

.trending-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  padding: 16px;
}

.trending-card:hover .trending-overlay {
  opacity: 1;
}

.trend-stats {
  display: flex;
  gap: 16px;
  color: white;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-weight: 700;
  font-size: 16px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.product-info {
  padding: 16px;
}

.trend-metrics {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.trend-score {
  font-size: 12px;
  font-weight: 600;
  color: #667eea;
}

.trend-category {
  font-size: 11px;
  background: #f0f0f0;
  color: #666;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 600;
}

/* Personalized Picks */
.personalized-intro {
  margin-bottom: 24px;
  padding: 20px;
  background: #f8f9ff;
  border-radius: 12px;
  border: 1px solid #e1e5e9;
}

.user-profile-summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.profile-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.profile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.style-tag {
  background: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
}

.personalized-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.personalized-card {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.personalized-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.personalization-header {
  padding: 12px;
  background: #f8f9ff;
  border-bottom: 1px solid #e1e5e9;
}

.ai-confidence {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ai-brain-icon {
  width: 16px;
  height: 16px;
  color: #667eea;
}

.confidence-text {
  font-size: 12px;
  font-weight: 700;
  color: #667eea;
}

.prediction-tags {
  display: flex;
  gap: 4px;
}

.prediction-tag {
  background: #28a745;
  color: white;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
}

.personalization-reasons {
  margin-top: 12px;
}

.reasons-title {
  font-size: 13px;
  font-weight: 700;
  color: #333;
  margin-bottom: 6px;
}

.reasons-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reason-item {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  padding-left: 12px;
  position: relative;
}

.reason-item::before {
  content: '•';
  color: #667eea;
  position: absolute;
  left: 0;
}

/* Footer */
.recommendations-footer {
  padding: 20px 24px;
  border-top: 1px solid #e1e5e9;
  background: #f8f9ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.refresh-recommendations {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.refresh-recommendations:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.refresh-recommendations:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.refresh-icon {
  width: 16px;
  height: 16px;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.recommendation-feedback {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feedback-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.feedback-buttons {
  display: flex;
  gap: 6px;
}

.feedback-btn {
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s ease;
}

.feedback-btn:hover {
  border-color: #667eea;
  transform: scale(1.1);
}

.feedback-btn.good:hover {
  background: #28a745;
  border-color: #28a745;
}

.feedback-btn.bad:hover {
  background: #dc3545;
  border-color: #dc3545;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .recommendations-header {
    padding: 20px 16px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .section-subtitle {
    font-size: 14px;
  }
  
  .recommendation-tabs {
    margin: 0 -16px;
    padding: 0 16px;
  }
  
  .tab-button {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .recommendations-content {
    padding: 16px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .set-products {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }
  
  .set-actions {
    flex-direction: column;
  }
  
  .trending-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .personalized-grid {
    grid-template-columns: 1fr;
  }
  
  .recommendations-footer {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
  
  .user-profile-summary {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .trending-grid {
    grid-template-columns: 1fr;
  }
  
  .look-set {
    padding: 16px;
  }
  
  .set-products {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .profile-tags {
    justify-content: center;
  }
}
</style>
