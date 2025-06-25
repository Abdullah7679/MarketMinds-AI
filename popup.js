// Popup script for extension settings
document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.sync.get([
    'isEnabled',
    'aiPersonality', 
    'notifications',
    'geminiApiKey'
  ], function(result) {
    document.getElementById('enableWidget').checked = result.isEnabled !== false;
    document.getElementById('aiPersonality').value = result.aiPersonality || 'professional';
    document.getElementById('enableNotifications').checked = result.notifications !== false;
    if (result.geminiApiKey) {
      document.getElementById('geminiApiKey').value = result.geminiApiKey;
    }
  });
  
  // Save settings when changed
  document.getElementById('enableWidget').addEventListener('change', function() {
    chrome.storage.sync.set({
      isEnabled: this.checked
    });
    updateStatus();
  });
  
  document.getElementById('aiPersonality').addEventListener('change', function() {
    chrome.storage.sync.set({
      aiPersonality: this.value
    });
  });
  
  document.getElementById('enableNotifications').addEventListener('change', function() {
    chrome.storage.sync.set({
      notifications: this.checked
    });
  });
  
  document.getElementById('geminiApiKey').addEventListener('change', function() {
    chrome.storage.sync.set({
      geminiApiKey: this.value
    });
  });
  
  function updateStatus() {
    const isEnabled = document.getElementById('enableWidget').checked;
    const status = document.getElementById('status');
    
    if (isEnabled) {
      status.textContent = 'Widget Active - Ready to Trade';
      status.style.borderColor = '#00D4FF';
    } else {
      status.textContent = 'Widget Disabled';
      status.style.borderColor = '#FF10F0';
    }
  }
});
