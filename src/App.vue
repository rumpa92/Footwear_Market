<template>
  <div id="app">
    <HeaderComponent @show-auth="showAuthModal" />
    <main class="main-content">
      <div class="container">
        <div class="page-layout">
          <aside class="sidebar">
            <FiltersComponent />
          </aside>
          <div class="content">
            <HeroSection v-if="!searchQuery" />
            <ProductGrid />
          </div>
        </div>
      </div>
    </main>
    <CartSidebar />
    <FooterComponent />

    <!-- Authentication Modal -->
    <AuthModal
      :visible="authModalVisible"
      @close="hideAuthModal"
      @signin-success="handleSignInSuccess"
      @signup-success="handleSignUpSuccess"
      @social-login="handleSocialLogin"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import HeaderComponent from './components/HeaderComponent.vue'
import FiltersComponent from './components/FiltersComponent.vue'
import HeroSection from './components/HeroSection.vue'
import ProductGrid from './components/ProductGrid.vue'
import CartSidebar from './components/CartSidebar.vue'
import FooterComponent from './components/FooterComponent.vue'
import AuthModal from './components/AuthModal.vue'

export default {
  name: 'App',
  components: {
    HeaderComponent,
    FiltersComponent,
    HeroSection,
    ProductGrid,
    CartSidebar,
    FooterComponent,
    AuthModal
  },
  data() {
    return {
      authModalVisible: false
    }
  },
  computed: {
    ...mapState(['searchQuery'])
  },
  methods: {
    showAuthModal() {
      this.authModalVisible = true
    },
    hideAuthModal() {
      this.authModalVisible = false
    },
    handleSignInSuccess(userData) {
      console.log('Sign in successful:', userData)
      this.$store.dispatch('loginUser', userData)
      // Show success message or redirect
    },
    handleSignUpSuccess(userData) {
      console.log('Sign up successful:', userData)
      this.$store.dispatch('loginUser', { name: userData.firstName + ' ' + userData.lastName })
      // Show success message or redirect
    },
    handleSocialLogin(provider) {
      console.log('Social login with:', provider)
      // Would integrate with actual social auth
    }
  },
  mounted() {
    this.$store.dispatch('loadProducts')
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fafafa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

.page-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  margin-top: 20px;
}

.sidebar {
  background: white;
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 20px;
}

.content {
  min-height: 600px;
}

@media (max-width: 1024px) {
  .page-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .sidebar {
    position: static;
    order: 2;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .main-content {
    padding: 16px 0;
  }
  
  .page-layout {
    gap: 16px;
    margin-top: 16px;
  }
  
  .sidebar {
    padding: 20px;
  }
}

/* Utility Classes */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: white;
  color: #333;
  border: 2px solid #e1e5e9;
}

.btn-secondary:hover {
  border-color: #667eea;
  color: #667eea;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 12px;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 16px;
}

.badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-new {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.badge-sale {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.text-primary {
  color: #667eea;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.text-muted {
  color: #6c757d;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading::after {
  content: '';
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
