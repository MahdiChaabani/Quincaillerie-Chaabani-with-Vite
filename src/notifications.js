// Custom notification function
export function showNotification(message, type = 'info') {
  // Play notification sound
  playNotificationSound(type);
  
  // Remove existing notification
  const existingNotification = document.querySelector('.custom-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `custom-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fa-solid ${type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i> <i class="fa-solid fa-arrow-turn-down"></i>
      <span>${message}</span> 
      <button class="close-notification" onclick="this.parentElement.parentElement.remove()">
        <i class="fa-solid fa-times"></i>
      </button>
    </div>
  `;

  // Add to body
  document.body.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 4000);
}

// Play notification sound
function playNotificationSound(type) {
  try {
    // Create audio context for better browser support
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'warning') {
      // Warning sound - two short beeps
      playBeep(audioContext, 800, 0.1, 0.1);
      setTimeout(() => playBeep(audioContext, 600, 0.1, 0.1), 150);
    } else {
      // Success/info sound - single pleasant beep
      playBeep(audioContext, 1000, 0.2, 0.1);
    }
  } catch (error) {
    console.log('Audio not supported');
  }
}

// Generate beep sound
function playBeep(audioContext, frequency, duration, volume) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// Add notification styles to head (run immediately when module loads)
if (!document.querySelector('#notification-styles')) {
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    .custom-notification {
      position: fixed;
      top: 20px;
      right: 35%;
      z-index: 9999;
      background-color: #fbedb8ff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-left: 4px solid #ff0400ff;
      animation: slideIn 0.3s ease;
      max-width: 450px;
    }
    .custom-notification.warning {
      border-left-color: #ff0000ff;
    }
    .custom-notification .notification-content {
      padding: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .custom-notification .notification-content i:first-child {
      color: #ff0000ff;
      font-size: 18px;
    }
    .custom-notification .notification-content span {
      flex: 1;
      color: #000000ff;
      font-weight: 500;
    }
    .custom-notification .close-notification {
      background: none;
      border: none;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 20px;
      height: 20px;
    }
    .custom-notification .close-notification:hover {
      color: #666;
    }
    @keyframes slideIn {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}