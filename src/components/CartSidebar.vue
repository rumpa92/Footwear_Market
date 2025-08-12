<template>
  <div class="cart-sidebar" :class="{ open: isOpen }">
    <div class="cart-overlay" @click="closeCart"></div>
    <div class="cart-content">
      <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button class="close-btn" @click="closeCart">✕</button>
      </div>
      
      <div v-if="cart.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started</p>
        <button class="btn btn-primary" @click="closeCart">
          Continue Shopping
        </button>
      </div>
      
      <div v-else class="cart-items">
        <div class="cart-scroll">
          <div 
            v-for="item in cart" 
            :key="item.cartId"
            class="cart-item"
          >
            <div class="item-image">
              <img :src="item.image" :alt="item.name">
            </div>
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <p class="item-brand">{{ item.brand }}</p>
              <div class="item-specs">
                <span>Size: {{ item.size }}</span>
                <span>Color: {{ item.color }}</span>
              </div>
              <div class="item-price">${{ item.price }}</div>
            </div>
            <div class="item-controls">
              <div class="quantity-controls">
                <button 
                  class="qty-btn"
                  @click="updateQuantity(item.cartId, item.quantity - 1)"
                >-</button>
                <span class="quantity">{{ item.quantity }}</span>
                <button 
                  class="qty-btn"
                  @click="updateQuantity(item.cartId, item.quantity + 1)"
                >+</button>
              </div>
              <button 
                class="remove-btn"
                @click="removeItem(item.cartId)"
              >🗑️</button>
            </div>
          </div>
        </div>
        
        <div class="cart-footer">
          <div class="cart-summary">
            <div class="summary-row">
              <span>Subtotal ({{ cartItemCount }} items)</span>
              <span class="total-amount">${{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span class="shipping">{{ cartTotal >= 100 ? 'FREE' : '$9.99' }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span class="total-amount">${{ finalTotal.toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="cart-actions">
            <button class="btn btn-secondary" @click="clearCart">
              Clear Cart
            </button>
            <button class="btn btn-primary checkout-btn">
              Checkout
            </button>
          </div>
          
          <div class="shipping-info">
            <div v-if="cartTotal < 100" class="shipping-notice">
              🚚 Add ${{ (100 - cartTotal).toFixed(2) }} more for free shipping
            </div>
            <div v-else class="free-shipping">
              ✅ You qualify for free shipping!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CartSidebar',
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['cartTotal', 'cartItemCount']),
    finalTotal() {
      const shipping = this.cartTotal >= 100 ? 0 : 9.99
      return this.cartTotal + shipping
    }
  },
  mounted() {
    // Listen for cart toggle events
    document.addEventListener('click', (e) => {
      if (e.target.closest('.cart-btn')) {
        this.isOpen = !this.isOpen
      }
    })
  },
  methods: {
    closeCart() {
      this.isOpen = false
    },
    updateQuantity(cartId, quantity) {
      this.$store.dispatch('updateCartQuantity', { cartId, quantity })
    },
    removeItem(cartId) {
      this.$store.dispatch('removeFromCart', cartId)
    },
    clearCart() {
      this.$store.dispatch('clearCart')
    }
  }
}
</script>

<style scoped>
.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease;
}

.cart-sidebar.open {
  visibility: visible;
  opacity: 1;
}

.cart-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
}

.cart-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.cart-sidebar.open .cart-content {
  transform: translateX(0);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #f0f0f0;
}

.cart-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background-color: #f8f9fa;
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-cart h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.empty-cart p {
  color: #666;
  margin-bottom: 24px;
}

.cart-items {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cart-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}

.item-brand {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.item-specs {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.item-specs span {
  font-size: 12px;
  color: #666;
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  padding: 4px;
}

.qty-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.2s ease;
}

.qty-btn:hover {
  background: #e9ecef;
}

.quantity {
  min-width: 20px;
  text-align: center;
  font-weight: 600;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.remove-btn:hover {
  background: #fff5f5;
}

.cart-footer {
  border-top: 2px solid #f0f0f0;
  padding: 24px;
}

.cart-summary {
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
  margin-top: 12px;
}

.total-amount {
  font-weight: 600;
  color: #333;
}

.shipping {
  color: #28a745;
  font-weight: 600;
}

.cart-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.cart-actions .btn {
  flex: 1;
  padding: 12px;
  font-size: 14px;
}

.checkout-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.shipping-info {
  text-align: center;
  font-size: 12px;
}

.shipping-notice {
  color: #ff6b6b;
  font-weight: 600;
}

.free-shipping {
  color: #28a745;
  font-weight: 600;
}

@media (max-width: 480px) {
  .cart-content {
    width: 100%;
  }
  
  .cart-item {
    padding: 12px 16px;
  }
  
  .cart-header,
  .cart-footer {
    padding: 20px 16px;
  }
}
</style>
