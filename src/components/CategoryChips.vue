<template>
  <div class="category-chips">
    <div class="chips-container">
      <div class="chips-scroll" ref="chipsScroll">
        <div class="chips-wrapper">
          <button
            v-for="category in categories"
            :key="category.id"
            class="category-chip"
            :class="{ 
              active: activeCategory === category.id,
              'has-badge': category.badge
            }"
            @click="selectCategory(category)"
          >
            <span class="chip-icon">{{ category.icon }}</span>
            <span class="chip-text">{{ category.name }}</span>
            <span v-if="category.badge" class="chip-badge">{{ category.badge }}</span>
            <span v-if="category.count" class="chip-count">({{ category.count }})</span>
          </button>
        </div>
      </div>
      
      <!-- Scroll indicators -->
      <button 
        v-if="showScrollButtons"
        class="scroll-btn left"
        :class="{ visible: canScrollLeft }"
        @click="scrollLeft"
      >
        <span>‹</span>
      </button>
      <button 
        v-if="showScrollButtons"
        class="scroll-btn right"
        :class="{ visible: canScrollRight }"
        @click="scrollRight"
      >
        <span>›</span>
      </button>
    </div>
    
    <!-- Category Grid Modal for "More" -->
    <div v-if="showCategoryGrid" class="category-grid-modal" @click="closeCategoryGrid">
      <div class="category-grid-content" @click.stop>
        <div class="grid-header">
          <h3>All Categories</h3>
          <button @click="closeCategoryGrid" class="grid-close">✕</button>
        </div>
        <div class="category-grid">
          <div
            v-for="category in allCategories"
            :key="`grid-${category.id}`"
            class="grid-category"
            @click="selectCategory(category)"
          >
            <div class="grid-icon">{{ category.icon }}</div>
            <div class="grid-name">{{ category.name }}</div>
            <div class="grid-description">{{ category.description }}</div>
            <div v-if="category.count" class="grid-count">{{ category.count }} items</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryChips',
  data() {
    return {
      activeCategory: 'all',
      showCategoryGrid: false,
      canScrollLeft: false,
      canScrollRight: false,
      showScrollButtons: false,
      categories: [
        { 
          id: 'all', 
          name: 'All Shoes', 
          icon: '👟', 
          count: 1247,
          description: 'Browse our complete collection'
        },
        { 
          id: 'men', 
          name: 'Men', 
          icon: '👨', 
          count: 486,
          description: 'Footwear for men'
        },
        { 
          id: 'women', 
          name: 'Women', 
          icon: '👩', 
          count: 523,
          description: 'Footwear for women'
        },
        { 
          id: 'kids', 
          name: 'Kids', 
          icon: '👶', 
          count: 238,
          description: 'Shoes for children'
        },
        { 
          id: 'sports', 
          name: 'Sports', 
          icon: '⚽', 
          badge: 'Hot',
          count: 342,
          description: 'Athletic and sports shoes'
        },
        { 
          id: 'formal', 
          name: 'Formal', 
          icon: '👔', 
          count: 156,
          description: 'Dress shoes and formal wear'
        },
        { 
          id: 'casual', 
          name: 'Casual', 
          icon: '👕', 
          count: 398,
          description: 'Everyday comfortable shoes'
        },
        { 
          id: 'sneakers', 
          name: 'Sneakers', 
          icon: '👟', 
          badge: 'New',
          count: 445,
          description: 'Trendy sneakers and streetwear'
        },
        { 
          id: 'boots', 
          name: 'Boots', 
          icon: '🥾', 
          count: 189,
          description: 'Boots for all occasions'
        }
      ],
      allCategories: [] // Will be populated with more categories
    }
  },
  mounted() {
    this.setupScrollDetection()
    this.allCategories = [
      ...this.categories,
      // Additional categories for the grid
      { id: 'sandals', name: 'Sandals', icon: '🩴', count: 145, description: 'Comfortable sandals and flip-flops' },
      { id: 'heels', name: 'Heels', icon: '👠', count: 167, description: 'High heels and pumps' },
      { id: 'flats', name: 'Flats', icon: '🥿', count: 223, description: 'Comfortable flat shoes' },
      { id: 'running', name: 'Running', icon: '🏃', count: 234, description: 'Running and jogging shoes' },
      { id: 'basketball', name: 'Basketball', icon: '🏀', count: 89, description: 'Basketball performance shoes' },
      { id: 'hiking', name: 'Hiking', icon: '🥾', count: 112, description: 'Outdoor and hiking boots' },
      { id: 'skate', name: 'Skate', icon: '🛹', count: 78, description: 'Skateboarding shoes' },
      { id: 'work', name: 'Work', icon: '🔨', count: 134, description: 'Work and safety shoes' }
    ]
    this.checkScrollButtons()
  },
  methods: {
    selectCategory(category) {
      this.activeCategory = category.id
      this.showCategoryGrid = false
      this.$emit('category-selected', category)
      
      // Apply category filter to store
      this.$store.dispatch('setFilters', { category: category.id })
    },
    showMoreCategories() {
      this.showCategoryGrid = true
    },
    closeCategoryGrid() {
      this.showCategoryGrid = false
    },
    setupScrollDetection() {
      const container = this.$refs.chipsScroll
      if (container) {
        container.addEventListener('scroll', this.checkScrollButtons)
        window.addEventListener('resize', this.checkScrollButtons)
        this.checkScrollButtons()
      }
    },
    checkScrollButtons() {
      const container = this.$refs.chipsScroll
      if (container) {
        this.canScrollLeft = container.scrollLeft > 0
        this.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth)
        this.showScrollButtons = container.scrollWidth > container.clientWidth
      }
    },
    scrollLeft() {
      const container = this.$refs.chipsScroll
      if (container) {
        container.scrollBy({ left: -200, behavior: 'smooth' })
        setTimeout(this.checkScrollButtons, 300)
      }
    },
    scrollRight() {
      const container = this.$refs.chipsScroll
      if (container) {
        container.scrollBy({ left: 200, behavior: 'smooth' })
        setTimeout(this.checkScrollButtons, 300)
      }
    }
  }
}
</script>

<style scoped>
.category-chips {
  position: relative;
  margin-bottom: 32px;
}

.chips-container {
  position: relative;
  max-width: 100%;
}

.chips-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  scroll-behavior: smooth;
}

.chips-scroll::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.chips-wrapper {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  min-width: max-content;
}

.category-chip {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: 48px;
}

.category-chip:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
}

.category-chip.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.category-chip.has-badge::before {
  content: '';
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #ff6b6b;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.chip-icon {
  font-size: 18px;
}

.chip-text {
  font-weight: 600;
}

.chip-badge {
  background: #ff6b6b;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-chip.active .chip-badge {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
}

.chip-count {
  font-size: 12px;
  opacity: 0.7;
  font-weight: 500;
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  z-index: 2;
}

.scroll-btn.visible {
  opacity: 1;
  visibility: visible;
}

.scroll-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-50%) scale(1.05);
}

.scroll-btn.left {
  left: -20px;
}

.scroll-btn.right {
  right: -20px;
}

.scroll-btn span {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

/* Category Grid Modal */
.category-grid-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.category-grid-content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #f0f0f0;
}

.grid-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.grid-close {
  width: 36px;
  height: 36px;
  border: none;
  background: #f8f9fa;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #666;
  transition: all 0.2s ease;
}

.grid-close:hover {
  background: #e9ecef;
  color: #333;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 32px;
  max-height: 60vh;
  overflow-y: auto;
}

.grid-category {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.grid-category:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.grid-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.grid-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.grid-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.4;
}

.grid-count {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .chips-wrapper {
    gap: 10px;
  }
  
  .category-chip {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .chip-icon {
    font-size: 16px;
  }
  
  .scroll-btn {
    width: 36px;
    height: 36px;
  }
  
  .scroll-btn span {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .chips-wrapper {
    gap: 8px;
    padding: 12px 0;
  }
  
  .category-chip {
    padding: 8px 14px;
    font-size: 12px;
    min-height: 40px;
  }
  
  .chip-icon {
    font-size: 14px;
  }
  
  .chip-count {
    display: none; /* Hide counts on mobile */
  }
  
  .scroll-btn {
    display: none; /* Hide scroll buttons on mobile */
  }
  
  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    padding: 24px;
  }
  
  .grid-header {
    padding: 20px 24px;
  }
  
  .grid-header h3 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .category-chips {
    margin-bottom: 24px;
  }
  
  .chips-wrapper {
    padding: 8px 0;
  }
  
  .category-chip {
    padding: 6px 12px;
    min-height: 36px;
  }
  
  .chip-text {
    font-size: 11px;
  }
  
  .chip-badge {
    padding: 1px 6px;
    font-size: 9px;
  }
  
  .category-grid-modal {
    padding: 10px;
  }
  
  .category-grid-content {
    border-radius: 16px;
  }
  
  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    padding: 20px;
  }
  
  .grid-category {
    padding: 16px 12px;
  }
  
  .grid-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .grid-name {
    font-size: 14px;
  }
  
  .grid-description {
    font-size: 12px;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .category-chip {
    border-width: 3px;
  }
  
  .category-chip.active {
    background: #000;
    border-color: #000;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .category-chip {
    transition: none;
  }
  
  .scroll-btn {
    transition: none;
  }
  
  .category-chip.has-badge::before {
    animation: none;
  }
  
  .category-grid-modal {
    animation: none;
  }
}
</style>
