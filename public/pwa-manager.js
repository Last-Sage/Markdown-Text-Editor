// PWA Installation and Update Handler
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.swRegistration = null;
    this.isOnline = navigator.onLine;
    this.installButton = null;
    this.updateButton = null;
    
    this.init();
  }

  init() {
    this.createInstallUI();
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupNetworkHandlers();
    this.handleUrlActions();
  }

  createInstallUI() {
    // Create install button
    this.installButton = document.createElement('button');
    this.installButton.className = 'btn btn--outline install-btn';
    this.installButton.innerHTML = '📱 Install App';
    this.installButton.style.display = 'none';
    this.installButton.addEventListener('click', () => this.installApp());

    // Create update button
    this.updateButton = document.createElement('button');
    this.updateButton.className = 'btn btn--primary update-btn';
    this.updateButton.innerHTML = '🔄 Update Available';
    this.updateButton.style.display = 'none';
    this.updateButton.addEventListener('click', () => this.updateApp());

    // Add to actions container
    const actionsContainer = document.querySelector('.actions');
    if (actionsContainer) {
      actionsContainer.appendChild(this.installButton);
      actionsContainer.appendChild(this.updateButton);
    }

    // Add network status indicator
    this.createNetworkIndicator();
  }

  createNetworkIndicator() {
    const networkIndicator = document.createElement('div');
    networkIndicator.className = 'network-status';
    networkIndicator.innerHTML = `
      <span class="status ${this.isOnline ? 'status--success' : 'status--error'}">
        ${this.isOnline ? '🟢 Online' : '🔴 Offline'}
      </span>
    `;
    
    const header = document.querySelector('header .container');
    if (header) {
      header.appendChild(networkIndicator);
    }
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        console.log('[PWA] Registering service worker...');
        this.swRegistration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        });

        console.log('[PWA] Service worker registered:', this.swRegistration);

        // Handle updates
        this.swRegistration.addEventListener('updatefound', () => {
          console.log('[PWA] New service worker version found');
          const newWorker = this.swRegistration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New version available');
              this.showUpdateButton();
            }
          });
        });

        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('[PWA] Controller changed, reloading page');
          window.location.reload();
        });

        // Send message to SW
        if (this.swRegistration.active) {
          this.swRegistration.active.postMessage({ type: 'CLIENT_READY' });
        }

      } catch (error) {
        console.error('[PWA] Service worker registration failed:', error);
      }
    } else {
      console.warn('[PWA] Service workers not supported');
    }
  }

  setupInstallPrompt() {
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWA] Install prompt available');
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      this.hideInstallButton();
      this.showNotification('App installed successfully!', 'success');
    });

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      console.log('[PWA] App running in standalone mode');
      this.hideInstallButton();
    }
  }

  setupNetworkHandlers() {
    window.addEventListener('online', () => {
      console.log('[PWA] Back online');
      this.isOnline = true;
      this.updateNetworkStatus();
      this.showNotification('Back online!', 'success');
    });

    window.addEventListener('offline', () => {
      console.log('[PWA] Gone offline');
      this.isOnline = false;
      this.updateNetworkStatus();
      this.showNotification('You are offline. The app will continue to work!', 'info');
    });
  }

  handleUrlActions() {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    
    if (action === 'new') {
      // Trigger new document
      const event = new CustomEvent('pwa-action', { detail: { action: 'new' } });
      window.dispatchEvent(event);
    } else if (action === 'export') {
      // Trigger export
      const event = new CustomEvent('pwa-action', { detail: { action: 'export' } });
      window.dispatchEvent(event);
    }
  }

  async installApp() {
    if (!this.deferredPrompt) {
      this.showNotification('Install prompt not available', 'error');
      return;
    }

    try {
      console.log('[PWA] Showing install prompt');
      this.deferredPrompt.prompt();
      
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log('[PWA] Install prompt result:', outcome);
      
      if (outcome === 'accepted') {
        this.showNotification('Installing app...', 'info');
      } else {
        this.showNotification('Installation cancelled', 'info');
      }
      
      this.deferredPrompt = null;
      this.hideInstallButton();
    } catch (error) {
      console.error('[PWA] Install error:', error);
      this.showNotification('Installation failed', 'error');
    }
  }

  updateApp() {
    if (this.swRegistration && this.swRegistration.waiting) {
      console.log('[PWA] Updating service worker');
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      this.showNotification('Updating app...', 'info');
      this.hideUpdateButton();
    }
  }

  showInstallButton() {
    if (this.installButton) {
      this.installButton.style.display = 'inline-flex';
    }
  }

  hideInstallButton() {
    if (this.installButton) {
      this.installButton.style.display = 'none';
    }
  }

  showUpdateButton() {
    if (this.updateButton) {
      this.updateButton.style.display = 'inline-flex';
    }
  }

  hideUpdateButton() {
    if (this.updateButton) {
      this.updateButton.style.display = 'none';
    }
  }

  updateNetworkStatus() {
    const indicator = document.querySelector('.network-status .status');
    if (indicator) {
      indicator.className = `status ${this.isOnline ? 'status--success' : 'status--error'}`;
      indicator.textContent = this.isOnline ? '🟢 Online' : '🔴 Offline';
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `pwa-notification status status--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Hide notification after 4 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  // Method to check for updates manually
  async checkForUpdates() {
    if (this.swRegistration) {
      try {
        await this.swRegistration.update();
        console.log('[PWA] Checked for updates');
      } catch (error) {
        console.error('[PWA] Update check failed:', error);
      }
    }
  }
}

// Initialize PWA Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.pwaManager = new PWAManager();
  
  // Check for updates every 30 minutes
  setInterval(() => {
    if (window.pwaManager) {
      window.pwaManager.checkForUpdates();
    }
  }, 30 * 60 * 1000);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PWAManager;
}