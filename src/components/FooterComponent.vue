<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <div class="brand">
            <h3>👟 SoleHub</h3>
            <p>Your ultimate destination for premium footwear. Step into style with confidence.</p>
            <div class="social-links">
              <a href="#" class="social-link">📘</a>
              <a href="#" class="social-link">📷</a>
              <a href="#" class="social-link">🐦</a>
              <a href="#" class="social-link">💼</a>
            </div>
          </div>
        </div>
        
        <div class="footer-section">
          <h4>Shop</h4>
          <ul class="footer-links">
            <li><a href="#">Men's Shoes</a></li>
            <li><a href="#">Women's Shoes</a></li>
            <li><a href="#">Kids' Shoes</a></li>
            <li><a href="#">Sale Items</a></li>
            <li><a href="#">New Arrivals</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Brands</h4>
          <ul class="footer-links">
            <li><a href="#">Nike</a></li>
            <li><a href="#">Adidas</a></li>
            <li><a href="#">Jordan</a></li>
            <li><a href="#">Converse</a></li>
            <li><a href="#">Vans</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Support</h4>
          <ul class="footer-links">
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Size Guide</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Newsletter</h4>
          <p>Get the latest updates on new products and exclusive offers.</p>
          <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
            <input 
              type="email" 
              placeholder="Enter your email"
              v-model="email"
              class="newsletter-input"
            >
            <button type="submit" class="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; 2024 SoleHub. All rights reserved.</p>
          <div class="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  data() {
    return {
      email: ''
    }
  },
  methods: {
    subscribeNewsletter() {
      if (this.email) {
        console.log('Newsletter subscription:', this.email)
        // Would implement newsletter subscription
        this.email = ''
        alert('Thank you for subscribing!')
      }
    }
  }
}
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  margin-top: 80px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 40px;
  padding: 60px 0 40px;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 20px;
  font-weight: 700;
}

.footer-section h3 {
  font-size: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-section h4 {
  font-size: 18px;
  color: #ecf0f1;
}

.brand p {
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 24px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  text-decoration: none;
  font-size: 18px;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 14px;
}

.footer-links a:hover {
  color: #ecf0f1;
}

.newsletter-form {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.newsletter-input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  placeholder-color: #bdc3c7;
}

.newsletter-input::placeholder {
  color: #bdc3c7;
}

.newsletter-btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.newsletter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom p {
  color: #bdc3c7;
  font-size: 14px;
}

.footer-legal {
  display: flex;
  gap: 24px;
}

.footer-legal a {
  color: #bdc3c7;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-legal a:hover {
  color: #ecf0f1;
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 30px;
  }
  
  .footer-section:first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 40px 0 30px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .footer-legal {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-legal {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
