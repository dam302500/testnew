// TimeLocal - Application JavaScript pour Hostinger
(function() {
    'use strict';
    
    // ⚠️ CONFIGURATION A MODIFIER
    // Remplacez YOUR_API_URL par l'URL de votre API Railway/Render
    const CONFIG = {
        API_BASE: 'https://YOUR_API_URL', // 🔧 CHANGEZ CETTE URL !
        VERSION: '2.0.0',
        LOCAL_API: '/app' // Fallback local
    };
    
    // Détection de l'environnement
    const isProduction = window.location.hostname !== 'localhost';
    const API_URL = isProduction ? CONFIG.API_BASE : CONFIG.LOCAL_API;
    
    // État de l'application
    let appState = {
        apiConnected: false,
        apiUrl: API_URL,
        lastHealthCheck: null
    };
    
    // Utility functions
    const utils = {
        // Smooth scroll to element
        scrollTo: function(element) {
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        },
        
        // Debounce function
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Show loading state on button
        showLoading: function(button) {
            if (!button) return () => {};
            
            const originalHTML = button.innerHTML;
            button.innerHTML = '<span class="loading"></span> Connexion...';
            button.disabled = true;
            
            return function hideLoading() {
                button.innerHTML = originalHTML;
                button.disabled = false;
            };
        },
        
        // API call helper with error handling
        apiCall: async function(endpoint, options = {}) {
            const url = `${API_URL}${endpoint}`;
            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include' // Pour les cookies de session
            };
            
            const finalOptions = { ...defaultOptions, ...options };
            
            try {
                console.log(`🌐 API Call: ${finalOptions.method || 'GET'} ${url}`);
                
                const response = await fetch(url, finalOptions);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log(`✅ API Response:`, data);
                    return data;
                }
                
                return await response.text();
            } catch (error) {
                console.error(`❌ API Error:`, error);
                throw error;
            }
        },
        
        // Format numbers with animation
        animateNumber: function(element, target, duration = 2000) {
            const start = 0;
            const startTime = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (target - start) * easeOutCubic);
                
                element.textContent = current;
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        }
    };
    
    // Status indicator management
    const statusIndicator = {
        element: null,
        
        init: function() {
            this.element = document.getElementById('status-indicator');
        },
        
        show: function(status, message) {
            if (!this.element) return;
            
            this.element.className = `status-indicator ${status}`;
            this.element.querySelector('#status-text').textContent = message;
            this.element.classList.remove('hidden');
            
            // Auto-hide after 5 seconds for success, 10 seconds for error
            const hideDelay = status === 'online' ? 5000 : 10000;
            setTimeout(() => this.hide(), hideDelay);
        },
        
        hide: function() {
            if (!this.element) return;
            this.element.classList.add('hidden');
        }
    };
    
    // API connectivity management
    const apiManager = {
        // Check API connectivity
        checkConnectivity: async function() {
            try {
                statusIndicator.show('checking', '🔄 Vérification de l\'API...');
                
                const response = await utils.apiCall('/health');
                
                if (response && response.status === 'healthy') {
                    appState.apiConnected = true;
                    appState.lastHealthCheck = new Date();
                    
                    console.log('✅ API connectivity: OK');
                    statusIndicator.show('online', '🟢 API connectée');
                    
                    return true;
                } else {
                    throw new Error('Invalid health response');
                }
            } catch (error) {
                appState.apiConnected = false;
                console.warn('⚠️ API connectivity failed:', error);
                
                if (error.message.includes('Failed to fetch')) {
                    statusIndicator.show('offline', '🔴 API non disponible - Vérifiez la configuration');
                } else {
                    statusIndicator.show('offline', '🔴 Erreur de connexion API');
                }
                
                return false;
            }
        },
        
        // Test API with detailed info
        testAPI: async function() {
            try {
                const testResponse = await utils.apiCall('/test');
                console.log('🧪 API Test successful:', testResponse);
                return testResponse;
            } catch (error) {
                console.error('🧪 API Test failed:', error);
                throw error;
            }
        }
    };
    
    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });
    
    function initializeApp() {
        console.log(`🚀 TimeLocal v${CONFIG.VERSION} initializing...`);
        console.log(`🌐 API URL: ${API_URL}`);
        
        // Initialize components
        statusIndicator.init();
        initSmoothScrolling();
        initAppAccess();
        initAnimations();
        initStatsAnimation();
        
        // Check API connectivity
        setTimeout(() => {
            apiManager.checkConnectivity();
        }, 1000);
        
        // Periodic health check (every 5 minutes)
        setInterval(() => {
            if (appState.apiConnected) {
                apiManager.checkConnectivity();
            }
        }, 5 * 60 * 1000);
        
        console.log(`✅ TimeLocal initialized successfully`);
    }
    
    // Smooth scrolling for internal links
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    utils.scrollTo(targetElement);
                }
            });
        });
    }
    
    // App access functionality
    function initAppAccess() {
        const appButton = document.getElementById('app-button');
        
        if (appButton) {
            appButton.addEventListener('click', async function(e) {
                e.preventDefault();
                
                const hideLoading = utils.showLoading(this);
                
                try {
                    // First check if API is configured
                    if (CONFIG.API_BASE === 'https://YOUR_API_URL') {
                        alert('⚠️ Configuration requise !\n\nVeuillez configurer l\'URL de l\'API dans le fichier JavaScript avant d\'utiliser l\'application.');
                        return;
                    }
                    
                    // Check API connectivity
                    console.log('🔍 Checking API before redirect...');
                    const isConnected = await apiManager.checkConnectivity();
                    
                    if (isConnected) {
                        // Test API functionality
                        await apiManager.testAPI();
                        
                        console.log('✅ Redirecting to app...');
                        // Redirect to the app
                        window.location.href = '/app';
                    } else {
                        throw new Error('API not available');
                    }
                } catch (error) {
                    console.error('❌ App access error:', error);
                    
                    let message = 'Erreur de connexion à l\'application.';
                    
                    if (error.message.includes('Failed to fetch')) {
                        message = '🔧 Configuration requise !\n\n' +
                                 'L\'API n\'est pas accessible. Vérifiez :\n' +
                                 '1. L\'URL de l\'API dans le code JavaScript\n' +
                                 '2. Le fichier .htaccess\n' +
                                 '3. Que votre API est bien déployée';
                    } else if (error.message.includes('404')) {
                        message = 'L\'API n\'est pas encore déployée ou l\'URL est incorrecte.';
                    }
                    
                    alert(message);
                } finally {
                    hideLoading();
                }
            });
        }
    }
    
    // Initialize animations on scroll
    function initAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    
                    // Trigger stats animation
                    if (entry.target.classList.contains('stats')) {
                        animateStats();
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.feature, .stat, .testimonial, .step, .stats');
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Stats number animation
    function initStatsAnimation() {
        // Will be triggered by intersection observer
    }
    
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat .number');
        
        statNumbers.forEach(element => {
            const target = parseInt(element.dataset.target) || parseInt(element.textContent);
            if (target > 0) {
                utils.animateNumber(element, target, 2000);
            }
        });
    }
    
    // Performance monitoring
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.fetchStart;
            console.log(`⚡ Page load time: ${loadTime}ms`);
            
            // Log performance if slow
            if (loadTime > 3000) {
                console.warn(`⚠️ Slow page load: ${loadTime}ms`);
            }
        }
    });
    
    // Error handling
    window.addEventListener('error', function(e) {
        console.error('🚨 Global error:', e.error);
        
        // Could send to error reporting service in production
        if (isProduction) {
            // Example: sendErrorToService(e.error);
        }
    });
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('🚨 Unhandled promise rejection:', e.reason);
        e.preventDefault(); // Prevent default browser behavior
    });
    
    // Expose utilities for debugging
    window.TimeLocal = {
        utils: utils,
        config: CONFIG,
        version: CONFIG.VERSION,
        apiUrl: API_URL,
        state: appState,
        api: apiManager,
        status: statusIndicator
    };
    
    // Development helpers
    if (!isProduction) {
        console.log('🔧 Development mode - TimeLocal object available in console');
        console.log('💡 Try: TimeLocal.api.checkConnectivity()');
        console.log('💡 Try: TimeLocal.api.testAPI()');
    }
})();