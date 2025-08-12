<template>
  <div class="enhanced-auth-modal" :class="{ open: isVisible }" @click="closeModal">
    <div class="auth-overlay"></div>
    <div class="auth-container" @click.stop>
      <!-- Header -->
      <div class="auth-header">
        <div class="brand-logo">
          <span class="logo-icon">👟</span>
          <span class="brand-name">Sole Hub</span>
        </div>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <!-- Auth Steps Progress -->
      <div class="auth-progress" v-if="currentStep > 1">
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
          ></div>
        </div>
        <div class="step-labels">
          <span 
            v-for="(step, index) in stepLabels" 
            :key="index"
            :class="{ active: index + 1 <= currentStep }"
          >
            {{ step }}
          </span>
        </div>
      </div>

      <!-- Auth Content -->
      <div class="auth-content">
        <!-- Step 1: Sign In/Sign Up Choice -->
        <div v-if="currentStep === 1" class="auth-step step-choice">
          <div class="step-header">
            <h2>Welcome to Sole Hub</h2>
            <p>Sign in to your account or create a new one</p>
          </div>
          
          <div class="auth-tabs">
            <button 
              :class="{ active: authMode === 'signin' }"
              @click="setAuthMode('signin')"
              class="tab-btn"
            >
              Sign In
            </button>
            <button 
              :class="{ active: authMode === 'signup' }"
              @click="setAuthMode('signup')"
              class="tab-btn"
            >
              Sign Up
            </button>
            <div class="tab-indicator" :class="{ 'move-right': authMode === 'signup' }"></div>
          </div>

          <!-- Sign In Form -->
          <form v-show="authMode === 'signin'" @submit.prevent="handleSignInSubmit" class="auth-form">
            <div class="form-group">
              <label>Email or Phone</label>
              <div class="input-wrapper">
                <input
                  v-model="signinForm.identifier"
                  type="text"
                  placeholder="Enter email or phone number"
                  class="form-input"
                  required
                >
                <span class="input-icon">📧</span>
              </div>
            </div>

            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <input
                  v-model="signinForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="form-input"
                  required
                >
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                >
                  {{ showPassword ? '👁️' : '🙈' }}
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" v-model="signinForm.remember">
                <span class="checkmark"></span>
                Remember me
              </label>
              <button type="button" @click="showForgotPassword" class="forgot-link">
                Forgot Password?
              </button>
            </div>

            <button type="submit" class="primary-btn" :disabled="signinLoading">
              <span v-if="signinLoading" class="loading-spinner"></span>
              {{ signinLoading ? 'Signing In...' : 'Sign In' }}
            </button>
          </form>

          <!-- Sign Up Form -->
          <form v-show="authMode === 'signup'" @submit.prevent="handleSignUpSubmit" class="auth-form">
            <div class="form-row">
              <div class="form-group half">
                <label>First Name</label>
                <input
                  v-model="signupForm.firstName"
                  type="text"
                  placeholder="First name"
                  class="form-input"
                  required
                >
              </div>
              <div class="form-group half">
                <label>Last Name</label>
                <input
                  v-model="signupForm.lastName"
                  type="text"
                  placeholder="Last name"
                  class="form-input"
                  required
                >
              </div>
            </div>

            <div class="form-group">
              <label>Email</label>
              <div class="input-wrapper">
                <input
                  v-model="signupForm.email"
                  type="email"
                  placeholder="Enter your email"
                  class="form-input"
                  required
                >
                <span class="input-icon">📧</span>
              </div>
            </div>

            <div class="form-group">
              <label>Phone Number</label>
              <div class="input-wrapper">
                <input
                  v-model="signupForm.phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  class="form-input"
                  required
                >
                <span class="input-icon">📱</span>
              </div>
            </div>

            <div class="form-group">
              <label>Password</label>
              <div class="input-wrapper">
                <input
                  v-model="signupForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Create a password"
                  class="form-input"
                  required
                  minlength="8"
                >
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                >
                  {{ showPassword ? '👁️' : '🙈' }}
                </button>
              </div>
              <div class="password-strength">
                <div class="strength-bar">
                  <div class="strength-fill" :class="passwordStrength"></div>
                </div>
                <span class="strength-text">{{ passwordStrengthText }}</span>
              </div>
            </div>

            <div class="form-options">
              <label class="terms-checkbox">
                <input type="checkbox" v-model="signupForm.agreeTerms" required>
                <span class="checkmark"></span>
                I agree to the <a href="#" class="terms-link">Terms</a> and <a href="#" class="terms-link">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" class="primary-btn" :disabled="signupLoading || !signupForm.agreeTerms">
              <span v-if="signupLoading" class="loading-spinner"></span>
              {{ signupLoading ? 'Creating Account...' : 'Create Account' }}
            </button>
          </form>

          <!-- Social Login -->
          <div class="social-login">
            <div class="divider"><span>or continue with</span></div>
            <div class="social-buttons">
              <button @click="socialLogin('google')" class="social-btn google">
                <span class="social-icon">G</span> Google
              </button>
              <button @click="socialLogin('apple')" class="social-btn apple">
                <span class="social-icon">🍎</span> Apple
              </button>
            </div>
          </div>
        </div>

        <!-- Step 2: OTP Verification -->
        <div v-if="currentStep === 2" class="auth-step step-otp">
          <div class="step-header">
            <h2>Verify Your {{ otpMethod === 'email' ? 'Email' : 'Phone' }}</h2>
            <p>We've sent a verification code to {{ maskedContact }}</p>
          </div>
          
          <div class="otp-input-container">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :ref="`otp-${index}`"
              v-model="otpDigits[index]"
              @input="handleOtpInput(index, $event)"
              @keydown="handleOtpKeydown(index, $event)"
              type="text"
              maxlength="1"
              class="otp-input"
            >
          </div>
          
          <div class="otp-actions">
            <button 
              @click="resendOtp" 
              class="resend-btn"
              :disabled="resendCooldown > 0"
            >
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code' }}
            </button>
            <button 
              @click="changeOtpMethod" 
              class="change-method-btn"
            >
              Use {{ otpMethod === 'email' ? 'Phone' : 'Email' }} Instead
            </button>
          </div>
          
          <button 
            @click="verifyOtp" 
            class="primary-btn"
            :disabled="!isOtpComplete || otpVerifying"
          >
            <span v-if="otpVerifying" class="loading-spinner"></span>
            {{ otpVerifying ? 'Verifying...' : 'Verify Code' }}
          </button>
        </div>

        <!-- Step 3: MFA Setup (for new accounts) -->
        <div v-if="currentStep === 3" class="auth-step step-mfa">
          <div class="step-header">
            <h2>Secure Your Account</h2>
            <p>Set up two-factor authentication for enhanced security</p>
          </div>
          
          <div class="mfa-options">
            <div 
              class="mfa-option"
              :class="{ selected: selectedMfa === 'app' }"
              @click="selectMfa('app')"
            >
              <div class="mfa-icon">📱</div>
              <div class="mfa-content">
                <h3>Authenticator App</h3>
                <p>Use Google Authenticator or similar app</p>
              </div>
              <div class="mfa-check">{{ selectedMfa === 'app' ? '✓' : '' }}</div>
            </div>
            
            <div 
              class="mfa-option"
              :class="{ selected: selectedMfa === 'sms' }"
              @click="selectMfa('sms')"
            >
              <div class="mfa-icon">💬</div>
              <div class="mfa-content">
                <h3>SMS Messages</h3>
                <p>Receive codes via text message</p>
              </div>
              <div class="mfa-check">{{ selectedMfa === 'sms' ? '✓' : '' }}</div>
            </div>
            
            <div 
              class="mfa-option skip"
              @click="skipMfa"
            >
              <div class="mfa-icon">⏭��</div>
              <div class="mfa-content">
                <h3>Skip for Now</h3>
                <p>You can set this up later in settings</p>
              </div>
            </div>
          </div>
          
          <button 
            v-if="selectedMfa"
            @click="setupMfa" 
            class="primary-btn"
            :disabled="mfaSetupLoading"
          >
            <span v-if="mfaSetupLoading" class="loading-spinner"></span>
            {{ mfaSetupLoading ? 'Setting up...' : 'Continue' }}
          </button>
        </div>

        <!-- Step 4: Success -->
        <div v-if="currentStep === 4" class="auth-step step-success">
          <div class="success-animation">
            <div class="success-icon">✅</div>
            <h2>Welcome to Sole Hub!</h2>
            <p v-if="authMode === 'signup'">Your account has been created successfully</p>
            <p v-else>You're now signed in</p>
          </div>
          
          <div class="success-actions">
            <button @click="completeAuth" class="primary-btn">
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnhancedAuthModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // Flow control
      currentStep: 1,
      totalSteps: 4,
      authMode: 'signin',
      
      // Form data
      signinForm: {
        identifier: '',
        password: '',
        remember: false
      },
      signupForm: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        agreeTerms: false
      },
      
      // OTP verification
      otpDigits: ['', '', '', '', '', ''],
      otpMethod: 'email',
      resendCooldown: 0,
      
      // MFA setup
      selectedMfa: null,
      
      // UI state
      showPassword: false,
      signinLoading: false,
      signupLoading: false,
      otpVerifying: false,
      mfaSetupLoading: false,
      
      // Step labels for progress
      stepLabels: ['Account', 'Verify', 'Security', 'Complete']
    }
  },
  computed: {
    isVisible() {
      return this.visible
    },
    passwordStrength() {
      const password = this.signupForm.password
      if (password.length < 6) return 'weak'
      if (password.length < 8) return 'medium'
      if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'strong'
      return 'medium'
    },
    passwordStrengthText() {
      return this.passwordStrength.charAt(0).toUpperCase() + this.passwordStrength.slice(1)
    },
    maskedContact() {
      if (this.otpMethod === 'email') {
        const email = this.signupForm.email || this.signinForm.identifier
        return email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      } else {
        const phone = this.signupForm.phone || this.signinForm.identifier
        return phone.replace(/(.{3})(.*)(.{2})/, '$1***$3')
      }
    },
    isOtpComplete() {
      return this.otpDigits.every(digit => digit !== '')
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
      this.resetForm()
    },
    resetForm() {
      this.currentStep = 1
      this.authMode = 'signin'
      this.signinForm = { identifier: '', password: '', remember: false }
      this.signupForm = { firstName: '', lastName: '', email: '', phone: '', password: '', agreeTerms: false }
      this.otpDigits = ['', '', '', '', '', '']
      this.selectedMfa = null
    },
    setAuthMode(mode) {
      this.authMode = mode
    },
    async handleSignInSubmit() {
      this.signinLoading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Skip OTP for demo, go to success
        this.currentStep = 4
        
        this.$emit('signin-success', {
          name: 'Demo User',
          email: this.signinForm.identifier
        })
      } catch (error) {
        console.error('Sign in error:', error)
      } finally {
        this.signinLoading = false
      }
    },
    async handleSignUpSubmit() {
      this.signupLoading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Move to OTP verification
        this.currentStep = 2
        this.startResendCooldown()
        
      } catch (error) {
        console.error('Sign up error:', error)
      } finally {
        this.signupLoading = false
      }
    },
    handleOtpInput(index, event) {
      const value = event.target.value
      if (value && index < 5) {
        this.$refs[`otp-${index + 1}`][0].focus()
      }
      
      if (this.isOtpComplete) {
        setTimeout(() => this.verifyOtp(), 500)
      }
    },
    handleOtpKeydown(index, event) {
      if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
        this.$refs[`otp-${index - 1}`][0].focus()
      }
    },
    async verifyOtp() {
      this.otpVerifying = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (this.authMode === 'signup') {
          this.currentStep = 3 // Go to MFA setup
        } else {
          this.currentStep = 4 // Go to success
        }
        
      } catch (error) {
        console.error('OTP verification error:', error)
      } finally {
        this.otpVerifying = false
      }
    },
    resendOtp() {
      if (this.resendCooldown > 0) return
      
      console.log('Resending OTP')
      this.startResendCooldown()
    },
    startResendCooldown() {
      this.resendCooldown = 30
      const countdown = setInterval(() => {
        this.resendCooldown--
        if (this.resendCooldown <= 0) {
          clearInterval(countdown)
        }
      }, 1000)
    },
    changeOtpMethod() {
      this.otpMethod = this.otpMethod === 'email' ? 'phone' : 'email'
      this.otpDigits = ['', '', '', '', '', '']
    },
    selectMfa(type) {
      this.selectedMfa = type
    },
    skipMfa() {
      this.currentStep = 4
    },
    async setupMfa() {
      this.mfaSetupLoading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        this.currentStep = 4
      } catch (error) {
        console.error('MFA setup error:', error)
      } finally {
        this.mfaSetupLoading = false
      }
    },
    completeAuth() {
      if (this.authMode === 'signup') {
        this.$emit('signup-success', this.signupForm)
      } else {
        this.$emit('signin-success', { name: 'Demo User', email: this.signinForm.identifier })
      }
      this.closeModal()
    },
    async socialLogin(provider) {
      console.log(`Social login with ${provider}`)
      this.$emit('social-login', provider)
    },
    showForgotPassword() {
      console.log('Show forgot password')
    }
  }
}
</script>

<style scoped>
/* Base modal styles - inheriting from AuthModal but enhanced */
.enhanced-auth-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.enhanced-auth-modal.open {
  visibility: visible;
  opacity: 1;
}

.auth-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
  backdrop-filter: blur(10px);
}

.auth-container {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  margin: 20px;
  transform: scale(0.9);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.enhanced-auth-modal.open .auth-container {
  transform: scale(1);
}

/* Progress indicator */
.auth-progress {
  padding: 20px 32px 0;
}

.progress-bar {
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.step-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.step-labels span.active {
  color: #667eea;
}

/* OTP Input */
.otp-input-container {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 32px 0;
}

.otp-input {
  width: 50px;
  height: 60px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  outline: none;
  transition: all 0.2s ease;
}

.otp-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.otp-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.resend-btn,
.change-method-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  text-decoration: underline;
}

.resend-btn:disabled {
  color: #999;
  cursor: not-allowed;
  text-decoration: none;
}

/* MFA Options */
.mfa-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 32px 0;
}

.mfa-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mfa-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.mfa-option.selected {
  border-color: #667eea;
  background: #f8f9ff;
}

.mfa-option.skip {
  border-style: dashed;
  opacity: 0.7;
}

.mfa-icon {
  font-size: 28px;
  width: 40px;
  text-align: center;
}

.mfa-content {
  flex: 1;
}

.mfa-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}

.mfa-content p {
  font-size: 14px;
  color: #666;
}

.mfa-check {
  font-size: 20px;
  color: #28a745;
  font-weight: bold;
}

/* Success Animation */
.success-animation {
  text-align: center;
  padding: 40px 0;
}

.success-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: successBounce 0.6s ease;
}

@keyframes successBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.success-animation h2 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

.success-animation p {
  color: #666;
  font-size: 16px;
}

.success-actions {
  margin-top: 32px;
}

/* Inherit other styles from AuthModal */
.auth-header,
.brand-logo,
.close-btn,
.auth-tabs,
.tab-btn,
.tab-indicator,
.auth-content,
.auth-form,
.form-group,
.form-row,
.input-wrapper,
.form-input,
.password-toggle,
.form-options,
.remember-me,
.terms-checkbox,
.checkmark,
.primary-btn,
.social-login,
.social-buttons,
.social-btn,
.loading-spinner {
  /* Inherit styles from AuthModal component */
}

/* Add enhanced focus styles */
.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Enhanced button styles */
.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .auth-container {
    margin: 10px;
    max-height: 95vh;
  }
  
  .auth-progress {
    padding: 16px 24px 0;
  }
  
  .auth-content {
    padding: 24px;
  }
  
  .otp-input {
    width: 45px;
    height: 55px;
    font-size: 20px;
  }
  
  .otp-input-container {
    gap: 8px;
  }
}
</style>
