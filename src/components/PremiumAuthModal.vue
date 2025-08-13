<template>
  <div class="premium-auth-modal" :class="{ open: isVisible }" @click="closeModal">
    <!-- Animated Background -->
    <div class="auth-overlay">
      <div class="floating-shapes">
        <div v-for="i in 6" :key="i" class="shape" :style="getShapeStyle(i)"></div>
      </div>
    </div>
    
    <div class="auth-container" @click.stop>
      <!-- Glassmorphism Header -->
      <div class="auth-header">
        <div class="brand-logo">
          <div class="logo-icon-container">
            <span class="logo-icon">👟</span>
            <div class="logo-glow"></div>
          </div>
          <div class="brand-info">
            <span class="brand-name">Sole Hub</span>
            <span class="brand-tagline">Premium Footwear</span>
          </div>
        </div>
        <button class="close-btn" @click="closeModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Dynamic Progress Flow -->
      <div class="auth-progress" v-if="currentStep > 1">
        <div class="progress-container">
          <div class="progress-track">
            <div 
              class="progress-fill" 
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
            ></div>
          </div>
          <div class="step-indicators">
            <div 
              v-for="(step, index) in stepLabels" 
              :key="index"
              class="step-indicator"
              :class="{ 
                active: index + 1 <= currentStep,
                current: index + 1 === currentStep
              }"
            >
              <div class="step-number">{{ index + 1 }}</div>
              <span class="step-label">{{ step }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Auth Content with Smooth Transitions -->
      <div class="auth-content">
        <!-- Step 1: Welcome & Authentication Choice -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentStep === 1" key="step1" class="auth-step step-welcome">
            <div class="welcome-header">
              <h1 class="welcome-title">
                <span class="title-line">Welcome to</span>
                <span class="title-highlight">Premium Footwear</span>
              </h1>
              <p class="welcome-subtitle">Join thousands of shoe enthusiasts worldwide</p>
            </div>
            
            <!-- Social Login First (Primary Options) -->
            <div class="social-auth-section">
              <h3 class="section-title">Quick Sign In</h3>
              <div class="social-buttons-grid">
                <button @click="socialLogin('google')" class="social-btn google">
                  <div class="social-icon">
                    <svg viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  Continue with Google
                </button>
                
                <button @click="socialLogin('apple')" class="social-btn apple">
                  <div class="social-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </div>
                  Continue with Apple
                </button>
                
                <button @click="socialLogin('facebook')" class="social-btn facebook">
                  <div class="social-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  Continue with Facebook
                </button>
              </div>
            </div>
            
            <!-- Email/Password Option -->
            <div class="divider-section">
              <div class="divider">
                <span>or use email</span>
              </div>
            </div>
            
            <!-- Toggle between Sign In / Sign Up -->
            <div class="auth-mode-toggle">
              <div class="toggle-container">
                <button 
                  :class="{ active: authMode === 'signin' }"
                  @click="setAuthMode('signin')"
                  class="toggle-btn"
                >
                  Sign In
                </button>
                <button 
                  :class="{ active: authMode === 'signup' }"
                  @click="setAuthMode('signup')"
                  class="toggle-btn"
                >
                  Sign Up
                </button>
                <div class="toggle-indicator" :class="{ 'move-right': authMode === 'signup' }"></div>
              </div>
            </div>

            <!-- Dynamic Form Based on Mode -->
            <transition name="form-slide" mode="out-in">
              <!-- Sign In Form -->
              <form v-if="authMode === 'signin'" key="signin" @submit.prevent="handleSignInSubmit" class="auth-form">
                <div class="form-group">
                  <label class="form-label">Email or Phone</label>
                  <div class="input-group">
                    <div class="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <input
                      v-model="signinForm.identifier"
                      type="text"
                      placeholder="Enter your email or phone"
                      class="form-input"
                      :class="{ error: signinErrors.identifier }"
                      required
                    >
                    <div v-if="signinErrors.identifier" class="input-error">
                      {{ signinErrors.identifier }}
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Password</label>
                  <div class="input-group">
                    <div class="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <circle cx="12" cy="16" r="1"></circle>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <input
                      v-model="signinForm.password"
                      :type="showSigninPassword ? 'text' : 'password'"
                      placeholder="Enter your password"
                      class="form-input"
                      :class="{ error: signinErrors.password }"
                      required
                    >
                    <button 
                      type="button"
                      @click="toggleSigninPassword"
                      class="password-toggle"
                    >
                      <svg v-if="showSigninPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <div v-if="signinErrors.password" class="input-error">
                      {{ signinErrors.password }}
                    </div>
                  </div>
                </div>

                <div class="form-options">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="signinForm.remember">
                    <span class="checkmark"></span>
                    Remember me
                  </label>
                  <button type="button" @click="showForgotPassword" class="forgot-link">
                    Forgot Password?
                  </button>
                </div>

                <button type="submit" class="primary-btn" :disabled="signinLoading">
                  <span v-if="signinLoading" class="loading-animation">
                    <div class="spinner"></div>
                  </span>
                  <span v-else class="btn-text">Sign In</span>
                  <div class="btn-ripple"></div>
                </button>
              </form>

              <!-- Sign Up Form -->
              <form v-else key="signup" @submit.prevent="handleSignUpSubmit" class="auth-form">
                <div class="form-row">
                  <div class="form-group half">
                    <label class="form-label">First Name</label>
                    <div class="input-group">
                      <input
                        v-model="signupForm.firstName"
                        type="text"
                        placeholder="First name"
                        class="form-input"
                        :class="{ error: signupErrors.firstName }"
                        required
                      >
                      <div v-if="signupErrors.firstName" class="input-error">
                        {{ signupErrors.firstName }}
                      </div>
                    </div>
                  </div>
                  <div class="form-group half">
                    <label class="form-label">Last Name</label>
                    <div class="input-group">
                      <input
                        v-model="signupForm.lastName"
                        type="text"
                        placeholder="Last name"
                        class="form-input"
                        :class="{ error: signupErrors.lastName }"
                        required
                      >
                      <div v-if="signupErrors.lastName" class="input-error">
                        {{ signupErrors.lastName }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <div class="input-group">
                    <div class="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <input
                      v-model="signupForm.email"
                      type="email"
                      placeholder="Enter your email address"
                      class="form-input"
                      :class="{ error: signupErrors.email, success: emailValid }"
                      required
                    >
                    <div class="input-status">
                      <svg v-if="emailValid" class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20,6 9,17 4,12"></polyline>
                      </svg>
                    </div>
                    <div v-if="signupErrors.email" class="input-error">
                      {{ signupErrors.email }}
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Phone Number</label>
                  <div class="input-group">
                    <div class="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <input
                      v-model="signupForm.phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      class="form-input"
                      :class="{ error: signupErrors.phone }"
                      required
                    >
                    <div v-if="signupErrors.phone" class="input-error">
                      {{ signupErrors.phone }}
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Create Password</label>
                  <div class="input-group">
                    <div class="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <circle cx="12" cy="16" r="1"></circle>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                    <input
                      v-model="signupForm.password"
                      :type="showSignupPassword ? 'text' : 'password'"
                      placeholder="Create a strong password"
                      class="form-input"
                      :class="{ error: signupErrors.password }"
                      required
                      minlength="8"
                    >
                    <button 
                      type="button"
                      @click="toggleSignupPassword"
                      class="password-toggle"
                    >
                      <svg v-if="showSignupPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    <div v-if="signupErrors.password" class="input-error">
                      {{ signupErrors.password }}
                    </div>
                  </div>
                  
                  <!-- Password Strength Indicator -->
                  <div class="password-strength" v-if="signupForm.password">
                    <div class="strength-bar">
                      <div class="strength-fill" :class="passwordStrength"></div>
                    </div>
                    <div class="strength-requirements">
                      <div class="requirement" :class="{ met: hasMinLength }">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        At least 8 characters
                      </div>
                      <div class="requirement" :class="{ met: hasUppercase }">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        One uppercase letter
                      </div>
                      <div class="requirement" :class="{ met: hasNumber }">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        One number
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="checkbox-label terms-agreement">
                    <input type="checkbox" v-model="signupForm.agreeTerms" required>
                    <span class="checkmark"></span>
                    I agree to the <a href="#" class="terms-link">Terms of Service</a> and <a href="#" class="terms-link">Privacy Policy</a>
                  </label>
                </div>

                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="signupForm.marketing">
                    <span class="checkmark"></span>
                    Send me exclusive offers and updates
                  </label>
                </div>

                <button type="submit" class="primary-btn" :disabled="signupLoading || !signupForm.agreeTerms || !isFormValid">
                  <span v-if="signupLoading" class="loading-animation">
                    <div class="spinner"></div>
                  </span>
                  <span v-else class="btn-text">Create Account</span>
                  <div class="btn-ripple"></div>
                </button>
              </form>
            </transition>
          </div>
        </transition>

        <!-- Step 2: OTP Verification -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentStep === 2" key="step2" class="auth-step step-otp">
            <div class="step-header">
              <div class="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                  <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"></path>
                  <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"></path>
                </svg>
              </div>
              <h2>Verify Your {{ otpMethod === 'email' ? 'Email' : 'Phone' }}</h2>
              <p>We've sent a 6-digit verification code to</p>
              <div class="contact-display">{{ maskedContact }}</div>
            </div>
            
            <div class="otp-container">
              <div class="otp-inputs">
                <input
                  v-for="(digit, index) in otpDigits"
                  :key="index"
                  :ref="`otp-${index}`"
                  v-model="otpDigits[index]"
                  @input="handleOtpInput(index, $event)"
                  @keydown="handleOtpKeydown(index, $event)"
                  @paste="handleOtpPaste($event)"
                  type="text"
                  maxlength="1"
                  class="otp-input"
                  :class="{ error: otpError }"
                >
              </div>
              <div v-if="otpError" class="otp-error">{{ otpError }}</div>
            </div>
            
            <div class="otp-actions">
              <button 
                @click="resendOtp" 
                class="resend-btn"
                :disabled="resendCooldown > 0"
              >
                <svg v-if="resendCooldown <= 0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="23,4 23,10 17,10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
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
              <span v-if="otpVerifying" class="loading-animation">
                <div class="spinner"></div>
              </span>
              <span v-else class="btn-text">Verify Code</span>
              <div class="btn-ripple"></div>
            </button>
          </div>
        </transition>

        <!-- Step 3: Security Setup -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentStep === 3" key="step3" class="auth-step step-security">
            <div class="step-header">
              <div class="step-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h2>Secure Your Account</h2>
              <p>Choose your preferred security method for two-factor authentication</p>
            </div>
            
            <div class="security-options">
              <div 
                class="security-option"
                :class="{ selected: selectedSecurity === 'authenticator' }"
                @click="selectSecurity('authenticator')"
              >
                <div class="security-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="M7 15h10M7 11h4"></path>
                  </svg>
                </div>
                <div class="security-content">
                  <h3>Authenticator App</h3>
                  <p>Use Google Authenticator, Authy, or similar apps</p>
                  <div class="security-badge recommended">Recommended</div>
                </div>
                <div class="security-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </div>
              </div>
              
              <div 
                class="security-option"
                :class="{ selected: selectedSecurity === 'sms' }"
                @click="selectSecurity('sms')"
              >
                <div class="security-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div class="security-content">
                  <h3>SMS Messages</h3>
                  <p>Receive verification codes via text message</p>
                </div>
                <div class="security-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </div>
              </div>
              
              <div 
                class="security-option skip-option"
                @click="skipSecurity"
              >
                <div class="security-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12,5 19,12 12,19"></polyline>
                  </svg>
                </div>
                <div class="security-content">
                  <h3>Skip for Now</h3>
                  <p>You can enable this later in your account settings</p>
                </div>
              </div>
            </div>
            
            <button 
              v-if="selectedSecurity"
              @click="setupSecurity" 
              class="primary-btn"
              :disabled="securitySetupLoading"
            >
              <span v-if="securitySetupLoading" class="loading-animation">
                <div class="spinner"></div>
              </span>
              <span v-else class="btn-text">{{ selectedSecurity === 'skip' ? 'Continue' : 'Setup Security' }}</span>
              <div class="btn-ripple"></div>
            </button>
          </div>
        </transition>

        <!-- Step 4: Success -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="currentStep === 4" key="step4" class="auth-step step-success">
            <div class="success-container">
              <div class="success-animation">
                <div class="success-circle">
                  <svg class="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </div>
                <div class="success-particles">
                  <div v-for="i in 8" :key="i" class="particle" :style="getParticleStyle(i)"></div>
                </div>
              </div>
              
              <div class="success-content">
                <h2>{{ authMode === 'signup' ? 'Welcome to Sole Hub!' : 'Welcome Back!' }}</h2>
                <p v-if="authMode === 'signup'">Your account has been created successfully. You're now part of our premium footwear community.</p>
                <p v-else>You're successfully signed in. Ready to explore the latest collections?</p>
              </div>
              
              <div class="success-stats">
                <div class="stat">
                  <div class="stat-number">50K+</div>
                  <div class="stat-label">Happy Customers</div>
                </div>
                <div class="stat">
                  <div class="stat-number">100+</div>
                  <div class="stat-label">Premium Brands</div>
                </div>
                <div class="stat">
                  <div class="stat-number">24/7</div>
                  <div class="stat-label">Support</div>
                </div>
              </div>
              
              <div class="success-actions">
                <button @click="completeAuth" class="primary-btn">
                  <span class="btn-text">Start Shopping</span>
                  <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12,5 19,12 12,19"></polyline>
                  </svg>
                  <div class="btn-ripple"></div>
                </button>
                <button @click="exploreProfile" class="secondary-btn">
                  <span class="btn-text">Setup Profile</span>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PremiumAuthModal',
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
        agreeTerms: false,
        marketing: false
      },
      
      // Validation errors
      signinErrors: {},
      signupErrors: {},
      
      // OTP verification
      otpDigits: ['', '', '', '', '', ''],
      otpMethod: 'email',
      otpError: '',
      resendCooldown: 0,
      
      // Security setup
      selectedSecurity: null,
      
      // UI state
      showSigninPassword: false,
      showSignupPassword: false,
      signinLoading: false,
      signupLoading: false,
      otpVerifying: false,
      securitySetupLoading: false,
      
      // Step labels for progress
      stepLabels: ['Account', 'Verify', 'Security', 'Complete']
    }
  },
  computed: {
    isVisible() {
      return this.visible
    },
    
    // Email validation
    emailValid() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(this.signupForm.email)
    },
    
    // Password strength
    passwordStrength() {
      const password = this.signupForm.password
      if (password.length < 6) return 'weak'
      if (password.length < 8) return 'medium'
      if (this.hasMinLength && this.hasUppercase && this.hasNumber) return 'strong'
      return 'medium'
    },
    
    hasMinLength() {
      return this.signupForm.password.length >= 8
    },
    
    hasUppercase() {
      return /[A-Z]/.test(this.signupForm.password)
    },
    
    hasNumber() {
      return /\d/.test(this.signupForm.password)
    },
    
    isFormValid() {
      return this.signupForm.firstName &&
             this.signupForm.lastName &&
             this.emailValid &&
             this.signupForm.phone &&
             this.hasMinLength &&
             this.hasUppercase &&
             this.hasNumber
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
      this.signupForm = { firstName: '', lastName: '', email: '', phone: '', password: '', agreeTerms: false, marketing: false }
      this.signinErrors = {}
      this.signupErrors = {}
      this.otpDigits = ['', '', '', '', '', '']
      this.otpError = ''
      this.selectedSecurity = null
    },
    
    setAuthMode(mode) {
      this.authMode = mode
      this.signinErrors = {}
      this.signupErrors = {}
    },
    
    toggleSigninPassword() {
      this.showSigninPassword = !this.showSigninPassword
    },
    
    toggleSignupPassword() {
      this.showSignupPassword = !this.showSignupPassword
    },
    
    validateSigninForm() {
      this.signinErrors = {}
      
      if (!this.signinForm.identifier) {
        this.signinErrors.identifier = 'Email or phone is required'
      }
      
      if (!this.signinForm.password) {
        this.signinErrors.password = 'Password is required'
      }
      
      return Object.keys(this.signinErrors).length === 0
    },
    
    validateSignupForm() {
      this.signupErrors = {}
      
      if (!this.signupForm.firstName) {
        this.signupErrors.firstName = 'First name is required'
      }
      
      if (!this.signupForm.lastName) {
        this.signupErrors.lastName = 'Last name is required'
      }
      
      if (!this.signupForm.email) {
        this.signupErrors.email = 'Email is required'
      } else if (!this.emailValid) {
        this.signupErrors.email = 'Please enter a valid email'
      }
      
      if (!this.signupForm.phone) {
        this.signupErrors.phone = 'Phone number is required'
      }
      
      if (!this.signupForm.password) {
        this.signupErrors.password = 'Password is required'
      } else if (!this.isFormValid) {
        this.signupErrors.password = 'Password does not meet requirements'
      }
      
      return Object.keys(this.signupErrors).length === 0
    },
    
    async handleSignInSubmit() {
      if (!this.validateSigninForm()) return
      
      this.signinLoading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Skip to success for demo
        this.currentStep = 4
        
        this.$emit('signin-success', {
          name: 'Demo User',
          email: this.signinForm.identifier
        })
      } catch (error) {
        console.error('Sign in error:', error)
        this.signinErrors.password = 'Invalid credentials'
      } finally {
        this.signinLoading = false
      }
    },
    
    async handleSignUpSubmit() {
      if (!this.validateSignupForm()) return
      
      this.signupLoading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Move to OTP verification
        this.currentStep = 2
        this.startResendCooldown()
        
      } catch (error) {
        console.error('Sign up error:', error)
        this.signupErrors.email = 'Email already exists'
      } finally {
        this.signupLoading = false
      }
    },
    
    // OTP handling
    handleOtpInput(index, event) {
      const value = event.target.value.replace(/[^0-9]/g, '')
      this.otpDigits[index] = value
      this.otpError = ''
      
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
    
    handleOtpPaste(event) {
      event.preventDefault()
      const paste = (event.clipboardData || window.clipboardData).getData('text')
      const digits = paste.replace(/[^0-9]/g, '').slice(0, 6).split('')
      
      digits.forEach((digit, index) => {
        if (index < 6) {
          this.otpDigits[index] = digit
        }
      })
      
      if (digits.length === 6) {
        setTimeout(() => this.verifyOtp(), 500)
      }
    },
    
    async verifyOtp() {
      this.otpVerifying = true
      this.otpError = ''
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Simulate validation
        const otpCode = this.otpDigits.join('')
        if (otpCode === '123456') {
          if (this.authMode === 'signup') {
            this.currentStep = 3 // Go to security setup
          } else {
            this.currentStep = 4 // Go to success
          }
        } else {
          this.otpError = 'Invalid verification code. Please try again.'
          this.otpDigits = ['', '', '', '', '', '']
          this.$refs['otp-0'][0].focus()
        }
        
      } catch (error) {
        console.error('OTP verification error:', error)
        this.otpError = 'Verification failed. Please try again.'
      } finally {
        this.otpVerifying = false
      }
    },
    
    resendOtp() {
      if (this.resendCooldown > 0) return
      
      console.log('Resending OTP')
      this.otpDigits = ['', '', '', '', '', '']
      this.otpError = ''
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
      this.otpError = ''
    },
    
    // Security setup
    selectSecurity(type) {
      this.selectedSecurity = type
    },
    
    skipSecurity() {
      this.selectedSecurity = 'skip'
      this.currentStep = 4
    },
    
    async setupSecurity() {
      this.securitySetupLoading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        this.currentStep = 4
      } catch (error) {
        console.error('Security setup error:', error)
      } finally {
        this.securitySetupLoading = false
      }
    },
    
    // Social login
    async socialLogin(provider) {
      console.log(`Social login with ${provider}`)
      this.$emit('social-login', provider)
      
      // Simulate social login success
      setTimeout(() => {
        this.currentStep = 4
        this.$emit('signin-success', {
          name: 'Social User',
          email: `user@${provider}.com`
        })
      }, 1000)
    },
    
    // Complete authentication
    completeAuth() {
      if (this.authMode === 'signup') {
        this.$emit('signup-success', this.signupForm)
      } else {
        this.$emit('signin-success', { name: 'Demo User', email: this.signinForm.identifier })
      }
      this.closeModal()
    },
    
    exploreProfile() {
      this.completeAuth()
      // Navigate to profile setup
      console.log('Navigate to profile setup')
    },
    
    showForgotPassword() {
      console.log('Show forgot password')
      // Implement forgot password flow
    },
    
    // Animation helpers
    getShapeStyle(index) {
      const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
      const sizes = [40, 60, 30, 50, 35, 45]
      const positions = [
        { top: '10%', left: '10%' },
        { top: '20%', right: '15%' },
        { bottom: '30%', left: '5%' },
        { top: '60%', right: '10%' },
        { bottom: '15%', left: '20%' },
        { top: '40%', right: '5%' }
      ]
      
      return {
        width: `${sizes[index - 1]}px`,
        height: `${sizes[index - 1]}px`,
        backgroundColor: colors[index - 1],
        ...positions[index - 1],
        animationDelay: `${index * 0.5}s`
      }
    },
    
    getParticleStyle(index) {
      const angle = (index / 8) * 360
      const distance = 60 + (index * 10)
      const x = Math.cos(angle * Math.PI / 180) * distance
      const y = Math.sin(angle * Math.PI / 180) * distance
      
      return {
        transform: `translate(${x}px, ${y}px)`,
        animationDelay: `${index * 0.1}s`
      }
    }
  }
}
</script>

<style scoped>
/* Base Modal Styles */
.premium-auth-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-auth-modal.open {
  visibility: visible;
  opacity: 1;
}

/* Animated Background */
.auth-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(102, 126, 234, 0.95) 0%, 
    rgba(118, 75, 162, 0.95) 25%,
    rgba(240, 147, 251, 0.95) 50%,
    rgba(245, 87, 108, 0.95) 75%,
    rgba(79, 172, 254, 0.95) 100%);
  backdrop-filter: blur(20px);
  overflow: hidden;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* Glassmorphism Container */
.auth-container {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: 95vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  overflow: hidden;
  margin: 20px;
  transform: scale(0.8) translateY(40px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-auth-modal.open .auth-container {
  transform: scale(1) translateY(0);
}

/* Enhanced Header */
.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  font-size: 28px;
  z-index: 2;
  position: relative;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  opacity: 0.2;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
  100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.4; }
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 20px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  font-size: 11px;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

/* Dynamic Progress */
.auth-progress {
  padding: 24px 32px 0;
}

.progress-container {
  margin-bottom: 32px;
}

.progress-track {
  height: 6px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: progressShimmer 2s ease-in-out infinite;
}

@keyframes progressShimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.step-indicators {
  display: flex;
  justify-content: space-between;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.1);
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step-indicator.active .step-number {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: scale(1.1);
}

.step-indicator.current .step-number {
  animation: pulse 2s ease-in-out infinite;
}

.step-label {
  font-size: 11px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.step-indicator.active .step-label {
  color: #667eea;
}

/* Content Area */
.auth-content {
  padding: 0 32px 32px;
  overflow-y: auto;
  max-height: calc(95vh - 200px);
}

/* Welcome Step */
.step-welcome {
  text-align: center;
}

.welcome-header {
  margin-bottom: 40px;
}

.welcome-title {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;
  line-height: 1.2;
}

.title-line {
  display: block;
  color: #333;
}

.title-highlight {
  display: block;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* Social Authentication */
.social-auth-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  text-align: left;
}

.social-buttons-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.social-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background: white;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.social-btn:hover {
  border-color: rgba(102, 126, 234, 0.3);
  background: rgba(102, 126, 234, 0.02);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.social-btn.google:hover {
  border-color: #4285F4;
  background: rgba(66, 133, 244, 0.02);
}

.social-btn.apple:hover {
  border-color: #000;
  background: rgba(0, 0, 0, 0.02);
}

.social-btn.facebook:hover {
  border-color: #1877f2;
  background: rgba(24, 119, 242, 0.02);
}

.social-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon svg {
  width: 20px;
  height: 20px;
}

/* Divider */
.divider-section {
  margin: 32px 0;
}

.divider {
  position: relative;
  text-align: center;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
}

.divider span {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 16px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

/* Auth Mode Toggle */
.auth-mode-toggle {
  margin-bottom: 32px;
}

.toggle-container {
  position: relative;
  display: flex;
  background: rgba(102, 126, 234, 0.08);
  border-radius: 12px;
  padding: 4px;
}

.toggle-btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  background: none;
  color: #666;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.toggle-btn.active {
  color: white;
}

.toggle-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.toggle-indicator.move-right {
  transform: translateX(100%);
}

/* Form Styles */
.auth-form {
  text-align: left;
}

.form-group {
  margin-bottom: 24px;
}

.form-group.half {
  flex: 1;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.input-group {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  z-index: 2;
}

.input-icon svg {
  width: 18px;
  height: 18px;
}

.form-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #ff4757;
  background: rgba(255, 71, 87, 0.02);
}

.form-input.success {
  border-color: #2ed573;
  background: rgba(46, 213, 115, 0.02);
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.password-toggle:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.password-toggle svg {
  width: 18px;
  height: 18px;
}

.input-status {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}

.success-icon {
  width: 18px;
  height: 18px;
  color: #2ed573;
}

.input-error {
  color: #ff4757;
  font-size: 12px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Password Strength */
.password-strength {
  margin-top: 12px;
}

.strength-bar {
  height: 4px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  width: 33%;
  background: #ff4757;
}

.strength-fill.medium {
  width: 66%;
  background: #ffa502;
}

.strength-fill.strong {
  width: 100%;
  background: #2ed573;
}

.strength-requirements {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.requirement {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #999;
  transition: all 0.3s ease;
}

.requirement.met {
  color: #2ed573;
}

.requirement svg {
  width: 12px;
  height: 12px;
  opacity: 0.3;
}

.requirement.met svg {
  opacity: 1;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.terms-agreement {
  margin-bottom: 16px;
}

.terms-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.terms-link:hover {
  text-decoration: underline;
}

.forgot-link {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* Primary Button */
.primary-btn {
  width: 100%;
  padding: 18px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.primary-btn:active {
  transform: translateY(0);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-ripple {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.primary-btn:active .btn-ripple {
  opacity: 1;
}

.loading-animation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* OTP Step */
.step-otp {
  text-align: center;
}

.step-header {
  margin-bottom: 32px;
}

.step-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
}

.step-icon svg {
  width: 28px;
  height: 28px;
}

.step-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.step-header p {
  color: #666;
  margin-bottom: 12px;
}

.contact-display {
  font-weight: 600;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-block;
}

.otp-container {
  margin-bottom: 32px;
}

.otp-inputs {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.otp-input {
  width: 56px;
  height: 64px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  outline: none;
}

.otp-input:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: scale(1.05);
}

.otp-input.error {
  border-color: #ff4757;
  background: rgba(255, 71, 87, 0.02);
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.otp-error {
  color: #ff4757;
  font-size: 14px;
  margin-top: 8px;
}

.otp-actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 16px;
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
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.resend-btn:hover,
.change-method-btn:hover {
  color: #5a67d8;
}

.resend-btn:disabled {
  color: #999;
  cursor: not-allowed;
  text-decoration: none;
}

.resend-btn svg {
  width: 14px;
  height: 14px;
}

/* Security Step */
.step-security {
  text-align: center;
}

.security-options {
  margin: 32px 0;
  text-align: left;
}

.security-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.5);
}

.security-option:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.02);
  transform: translateY(-2px);
}

.security-option.selected {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.security-option.skip-option {
  border-style: dashed;
  opacity: 0.7;
}

.security-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.security-icon svg {
  width: 24px;
  height: 24px;
}

.security-content {
  flex: 1;
}

.security-content h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #333;
}

.security-content p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.security-badge {
  background: linear-gradient(135deg, #2ed573, #17c0eb);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 6px;
  display: inline-block;
}

.security-check {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #2ed573;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.security-option.selected .security-check {
  opacity: 1;
}

.security-check svg {
  width: 16px;
  height: 16px;
}

/* Success Step */
.step-success {
  text-align: center;
}

.success-container {
  padding: 20px 0;
}

.success-animation {
  position: relative;
  margin-bottom: 32px;
}

.success-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #2ed573, #17c0eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 32px;
  animation: successScale 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
}

@keyframes successScale {
  0% { transform: scale(0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.success-icon {
  width: 48px;
  height: 48px;
  color: white;
  stroke-width: 3;
}

.success-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #ffd93d;
  border-radius: 50%;
  animation: particleFloat 2s ease-out infinite;
}

@keyframes particleFloat {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(var(--x, 0), var(--y, 0)) scale(0);
  }
}

.success-content h2 {
  font-size: 28px;
  font-weight: 800;
  color: #333;
  margin-bottom: 12px;
}

.success-content p {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 32px;
}

.success-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 16px;
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 800;
  color: #667eea;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.secondary-btn {
  width: 100%;
  padding: 16px 24px;
  border: 2px solid #667eea;
  border-radius: 12px;
  background: transparent;
  color: #667eea;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.form-slide-enter-active,
.form-slide-leave-active {
  transition: all 0.3s ease;
}

.form-slide-enter {
  opacity: 0;
  transform: translateY(20px);
}

.form-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-container {
    margin: 10px;
    max-height: 98vh;
  }
  
  .auth-header {
    padding: 20px 24px;
  }
  
  .auth-content {
    padding: 0 24px 24px;
  }
  
  .auth-progress {
    padding: 20px 24px 0;
  }
  
  .welcome-title {
    font-size: 28px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .otp-inputs {
    gap: 8px;
  }
  
  .otp-input {
    width: 48px;
    height: 56px;
    font-size: 20px;
  }
  
  .security-option {
    padding: 16px;
  }
  
  .success-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .otp-actions {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .auth-container {
    margin: 5px;
    border-radius: 20px;
  }
  
  .brand-name {
    font-size: 18px;
  }
  
  .welcome-title {
    font-size: 24px;
  }
  
  .social-buttons-grid {
    gap: 10px;
  }
  
  .social-btn {
    padding: 14px 16px;
    font-size: 15px;
  }
  
  .form-input {
    padding: 14px 14px 14px 44px;
    font-size: 15px;
  }
  
  .primary-btn {
    padding: 16px 20px;
    font-size: 15px;
  }
  
  .step-indicators {
    display: none;
  }
}
</style>
