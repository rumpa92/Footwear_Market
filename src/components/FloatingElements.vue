<template>
  <div class="floating-elements">
    <!-- Floating Chatbot -->
    <div class="floating-chatbot" :class="{ 'chat-open': chatOpen }">
      <!-- Chat Messages Container -->
      <div v-if="chatOpen" class="chat-container">
        <div class="chat-header">
          <div class="chat-title">
            <span class="chat-icon">🤖</span>
            <span>Sole Assistant</span>
          </div>
          <button @click="toggleChat" class="chat-close">✕</button>
        </div>
        
        <div class="chat-messages" ref="chatMessages">
          <div
            v-for="(message, index) in chatMessages"
            :key="index"
            class="message"
            :class="{ 'user': message.type === 'user', 'bot': message.type === 'bot' }"
          >
            <div class="message-content">
              <p v-if="message.text">{{ message.text }}</p>
              <div v-if="message.suggestions" class="message-suggestions">
                <button
                  v-for="suggestion in message.suggestions"
                  :key="suggestion"
                  @click="selectSuggestion(suggestion)"
                  class="suggestion-btn"
                >
                  {{ suggestion }}
                </button>
              </div>
              <div v-if="message.products" class="message-products">
                <div
                  v-for="product in message.products"
                  :key="product.id"
                  class="chat-product"
                  @click="viewProduct(product)"
                >
                  <img :src="product.image" :alt="product.name" class="chat-product-image">
                  <div class="chat-product-info">
                    <h4>{{ product.name }}</h4>
                    <p>${{ product.price }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
          
          <div v-if="isTyping" class="typing-indicator">
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span class="typing-text">Assistant is typing...</span>
          </div>
        </div>
        
        <div class="chat-input-container">
          <div class="chat-input-wrapper">
            <input
              v-model="currentMessage"
              @keypress.enter="sendMessage"
              placeholder="Ask about shoes, sizes, or get recommendations..."
              class="chat-input"
              :disabled="isTyping"
            >
            <button 
              @click="sendMessage"
              :disabled="!currentMessage.trim() || isTyping"
              class="chat-send"
            >
              ➤
            </button>
          </div>
          <div class="quick-actions">
            <button
              v-for="action in quickActions"
              :key="action.id"
              @click="executeQuickAction(action)"
              class="quick-action"
            >
              {{ action.icon }} {{ action.text }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Chat Toggle Button -->
      <button @click="toggleChat" class="chat-toggle" :class="{ 'has-notification': hasNewMessage }">
        <span v-if="!chatOpen" class="chat-icon">💬</span>
        <span v-else class="chat-icon">✕</span>
        <span v-if="hasNewMessage" class="notification-dot"></span>
      </button>
    </div>
    
    <!-- Mobile Bottom Navigation -->
    <div class="mobile-bottom-nav" :class="{ 'visible': showMobileNav }">
      <div class="nav-container">
        <button
          v-for="navItem in bottomNavItems"
          :key="navItem.id"
          class="nav-item"
          :class="{ 'active': currentRoute === navItem.route }"
          @click="navigateTo(navItem)"
        >
          <span class="nav-icon">{{ navItem.icon }}</span>
          <span class="nav-label">{{ navItem.label }}</span>
          <span v-if="navItem.badge" class="nav-badge">{{ navItem.badge }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'FloatingElements',
  data() {
    return {
      chatOpen: false,
      currentMessage: '',
      isTyping: false,
      hasNewMessage: false,
      currentRoute: 'home',
      showMobileNav: false,
      chatMessages: [
        {
          type: 'bot',
          text: 'Hi! I\'m your Sole Assistant. How can I help you find the perfect shoes today?',
          timestamp: Date.now(),
          suggestions: ['Find running shoes', 'Size guide', 'Latest arrivals', 'Track my order']
        }
      ],
      quickActions: [
        { id: 'track', icon: '📦', text: 'Track Order' },
        { id: 'size', icon: '📏', text: 'Size Guide' },
        { id: 'support', icon: '🎧', text: 'Support' },
        { id: 'deals', icon: '🏷️', text: 'Deals' }
      ],
      bottomNavItems: [
        { id: 'home', icon: '🏠', label: 'Home', route: 'home' },
        { id: 'categories', icon: '📂', label: 'Categories', route: 'categories' },
        { id: 'search', icon: '🔍', label: 'Search', route: 'search' },
        { id: 'orders', icon: '📋', label: 'Orders', route: 'orders', badge: null },
        { id: 'profile', icon: '👤', label: 'Profile', route: 'profile' }
      ]
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['cartItemCount'])
  },
  mounted() {
    this.detectMobile()
    this.setupScrollListener()
    this.updateNavBadges()
  },
  methods: {
    toggleChat() {
      this.chatOpen = !this.chatOpen
      if (this.chatOpen) {
        this.hasNewMessage = false
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    async sendMessage() {
      if (!this.currentMessage.trim() || this.isTyping) return
      
      const userMessage = {
        type: 'user',
        text: this.currentMessage,
        timestamp: Date.now()
      }
      
      this.chatMessages.push(userMessage)
      const messageText = this.currentMessage
      this.currentMessage = ''
      
      this.scrollToBottom()
      this.isTyping = true
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = this.generateBotResponse(messageText)
        this.chatMessages.push(botResponse)
        this.isTyping = false
        this.scrollToBottom()
      }, 1500)
    },
    generateBotResponse(userInput) {
      const input = userInput.toLowerCase()
      const timestamp = Date.now()
      
      if (input.includes('size') || input.includes('fit')) {
        return {
          type: 'bot',
          text: 'I can help you find the right size! Our shoes run true to size, but here are some tips:',
          timestamp,
          suggestions: ['Size Chart', 'Size Calculator', 'Fit Guide', 'Contact Expert']
        }
      } else if (input.includes('running') || input.includes('sport')) {
        return {
          type: 'bot',
          text: 'Great choice! Here are some popular running shoes:',
          timestamp,
          products: [
            {
              id: 1,
              name: 'Nike Air Zoom',
              price: 120,
              image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop'
            },
            {
              id: 2,
              name: 'Adidas Ultraboost',
              price: 180,
              image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=100&h=100&fit=crop'
            }
          ]
        }
      } else if (input.includes('track') || input.includes('order')) {
        return {
          type: 'bot',
          text: 'I can help you track your order! Please provide your order number or email address.',
          timestamp
        }
      } else if (input.includes('return') || input.includes('exchange')) {
        return {
          type: 'bot',
          text: 'Our return policy allows 30-day free returns. I can help you start a return or exchange.',
          timestamp,
          suggestions: ['Start Return', 'Exchange Item', 'Return Policy', 'Contact Support']
        }
      } else {
        return {
          type: 'bot',
          text: 'I\'m here to help! I can assist with product recommendations, sizing, orders, and more.',
          timestamp,
          suggestions: ['Product Search', 'Size Help', 'Order Status', 'Return Info']
        }
      }
    },
    selectSuggestion(suggestion) {
      this.currentMessage = suggestion
      this.sendMessage()
    },
    executeQuickAction(action) {
      const responses = {
        track: 'Please enter your order number to track your shipment.',
        size: 'Here\'s our comprehensive size guide to help you find the perfect fit.',
        support: 'Connecting you with our customer support team. How can we help?',
        deals: 'Check out these amazing deals available right now!'
      }
      
      const botMessage = {
        type: 'bot',
        text: responses[action.id],
        timestamp: Date.now()
      }
      
      this.chatMessages.push(botMessage)
      this.scrollToBottom()
    },
    viewProduct(product) {
      this.$emit('view-product', product)
      console.log('View product:', product.name)
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatMessages
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    },
    detectMobile() {
      const isMobile = window.innerWidth <= 768
      this.showMobileNav = isMobile
      
      window.addEventListener('resize', () => {
        this.showMobileNav = window.innerWidth <= 768
      })
    },
    setupScrollListener() {
      let lastScrollY = window.scrollY
      
      window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY
        
        if (this.showMobileNav) {
          // Hide nav when scrolling down, show when scrolling up
          const nav = document.querySelector('.mobile-bottom-nav')
          if (nav) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              nav.style.transform = 'translateY(100%)'
            } else {
              nav.style.transform = 'translateY(0)'
            }
          }
        }
        
        lastScrollY = currentScrollY
      })
    },
    navigateTo(navItem) {
      this.currentRoute = navItem.route
      this.$emit('navigate', navItem.route)
      
      // Handle special navigation
      switch (navItem.route) {
        case 'search':
          this.focusSearchBar()
          break
        case 'categories':
          this.showCategories()
          break
        case 'orders':
          this.showOrders()
          break
        case 'profile':
          this.showProfile()
          break
        default:
          this.goHome()
      }
    },
    updateNavBadges() {
      // Update cart badge in navigation
      const ordersItem = this.bottomNavItems.find(item => item.id === 'orders')
      if (ordersItem) {
        ordersItem.badge = this.cartItemCount > 0 ? this.cartItemCount : null
      }
    },
    focusSearchBar() {
      const searchInput = document.querySelector('.search-input')
      if (searchInput) {
        searchInput.focus()
      }
    },
    showCategories() {
      // Would show categories page
      console.log('Show categories')
    },
    showOrders() {
      // Would show orders page
      console.log('Show orders')
    },
    showProfile() {
      if (this.user.isLoggedIn) {
        console.log('Show profile')
      } else {
        this.$emit('show-auth')
      }
    },
    goHome() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  watch: {
    cartItemCount() {
      this.updateNavBadges()
    }
  }
}
</script>

<style scoped>
.floating-elements {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
}

.floating-elements > * {
  pointer-events: auto;
}

/* Floating Chatbot */
.floating-chatbot {
  position: relative;
  margin: 20px;
}

.chat-container {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.chat-close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.chat-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
}

.message.bot {
  align-self: flex-start;
}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message.bot .message-content {
  background: #f8f9fa;
  color: #333;
}

.message-time {
  font-size: 10px;
  color: #999;
  margin-top: 4px;
  padding: 0 4px;
}

.message.user .message-time {
  text-align: right;
}

.message-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.suggestion-btn {
  padding: 4px 8px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s ease;
}

.suggestion-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.message-products {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.chat-product {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chat-product:hover {
  border-color: #667eea;
  transform: translateY(-1px);
}

.chat-product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
}

.chat-product-info h4 {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 2px;
}

.chat-product-info p {
  font-size: 11px;
  color: #667eea;
  font-weight: 600;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 18px;
  align-self: flex-start;
  max-width: 80%;
}

.typing-dots {
  display: flex;
  gap: 3px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.typing-text {
  font-size: 12px;
  color: #999;
  font-style: italic;
}

.chat-input-container {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.chat-input-wrapper {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.chat-input:focus {
  border-color: #667eea;
}

.chat-send {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.chat-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.chat-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quick-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-action {
  padding: 6px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 15px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s ease;
}

.quick-action:hover {
  background: #e9ecef;
  border-color: #667eea;
}

.chat-toggle {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.chat-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.5);
}

.chat-toggle.has-notification::before {
  content: '';
  position: absolute;
  top: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  background: #ff6b6b;
  border-radius: 50%;
  border: 3px solid white;
  animation: pulse 2s infinite;
}

.notification-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 12px;
  height: 12px;
  background: #ff6b6b;
  border-radius: 50%;
  border: 2px solid white;
}

/* Mobile Bottom Navigation */
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 999;
  transition: transform 0.3s ease;
  display: none;
}

.mobile-bottom-nav.visible {
  display: block;
}

.nav-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0;
  max-width: 500px;
  margin: 0 auto;
}

.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 60px;
}

.nav-item.active .nav-icon {
  transform: scale(1.2);
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
}

.nav-item.active .nav-label {
  color: #667eea;
  font-weight: 600;
}

.nav-icon {
  font-size: 20px;
  transition: all 0.2s ease;
}

.nav-label {
  font-size: 10px;
  color: #666;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-badge {
  position: absolute;
  top: 4px;
  right: 8px;
  background: #ff6b6b;
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .chat-container {
    width: calc(100vw - 40px);
    height: 400px;
    right: 20px;
    bottom: 80px;
  }
  
  .floating-chatbot {
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .chat-container {
    width: calc(100vw - 20px);
    height: 350px;
    right: 10px;
    bottom: 70px;
  }
  
  .floating-chatbot {
    margin: 10px;
  }
  
  .chat-toggle {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .chat-container {
    border: 2px solid #000;
  }
  
  .mobile-bottom-nav {
    border-top: 2px solid #000;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .chat-container {
    animation: none;
  }
  
  .chat-toggle {
    transition: none;
  }
  
  .typing-dots span {
    animation: none;
  }
}
</style>
