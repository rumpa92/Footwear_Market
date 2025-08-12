<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <h1>👟 SoleHub</h1>
        </div>
        
        <div class="search-bar">
          <div class="search-wrapper">
            <input
              type="text"
              :value="searchQuery"
              @input="updateSearch"
              placeholder="Search for shoes, brands..."
              class="search-input"
            >
            <button class="search-btn">🔍</button>
          </div>
        </div>
        
        <div class="header-actions">
          <button class="action-btn favorites-btn">
            ❤️
            <span v-if="favoriteCount" class="badge-count">{{ favoriteCount }}</span>
          </button>
          
          <button class="action-btn cart-btn" @click="toggleCart">
            🛒
            <span v-if="cartItemCount" class="badge-count">{{ cartItemCount }}</span>
          </button>
          
          <button class="action-btn user-btn" @click="toggleUserMenu">
            👤
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'HeaderComponent',
  computed: {
    ...mapState(['searchQuery', 'user']),
    ...mapGetters(['cartItemCount']),
    favoriteCount() {
      return this.user.favorites.length
    }
  },
  methods: {
    updateSearch(event) {
      this.$store.dispatch('setSearchQuery', event.target.value)
    },
    toggleCart() {
      // Toggle cart sidebar visibility
      const cartSidebar = document.querySelector('.cart-sidebar')
      if (cartSidebar) {
        cartSidebar.classList.toggle('open')
      }
    },
    toggleUserMenu() {
      // Toggle user menu (would implement dropdown)
      console.log('Toggle user menu')
    }
  }
}
</script>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  gap: 24px;
}

.logo h1 {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-bar {
  flex: 1;
  max-width: 500px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 14px 20px;
  padding-right: 50px;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  font-size: 18px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.search-btn:hover {
  background-color: #f8f9fa;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-btn {
  position: relative;
  background: none;
  border: none;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
}

.badge-count {
  position: absolute;
  top: 4px;
  right: 4px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .header-content {
    gap: 12px;
  }
  
  .logo h1 {
    font-size: 24px;
  }
  
  .search-bar {
    max-width: none;
  }
  
  .search-input {
    padding: 12px 16px;
    padding-right: 45px;
    font-size: 14px;
  }
  
  .header-actions {
    gap: 8px;
  }
  
  .action-btn {
    padding: 10px;
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .header-content {
    flex-wrap: wrap;
  }
  
  .search-bar {
    order: 3;
    width: 100%;
    margin-top: 12px;
  }
}
</style>
