const { contextBridge, ipcRenderer, shell } = require('electron');
const Store = require('electron-store');

const store = new Store({
  name: 'exnet-config',
  defaults: {
    serverUrl: null,
    rememberUrl: true
  }
});

contextBridge.exposeInMainWorld('exnetDesktop', {
  getVersion: () => process.env.npm_package_version || '1.0.0',
  
  getServerUrl: () => store.get('serverUrl'),
  
  disconnect: () => ipcRenderer.send('disconnect-server'),
  
  openSettings: () => ipcRenderer.send('open-settings'),
  
  openExternal: (url) => shell.openExternal(url),
  
  showNotification: (title, body) => {
    new Notification(title, { body });
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .exnet-desktop-badge {
      position: fixed;
      bottom: 10px;
      right: 10px;
      background-color: rgba(15, 76, 129, 0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 9999;
      font-family: sans-serif;
      transition: opacity 0.3s;
    }
    
    .exnet-desktop-badge:hover {
      opacity: 0.8;
    }
    
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;
  document.head.appendChild(style);
  
  setTimeout(() => {
    const badge = document.createElement('div');
    badge.className = 'exnet-desktop-badge';
    badge.textContent = `Exnet Desktop v${window.exnetDesktop.getVersion()}`;
    badge.title = `Conectado a: ${window.exnetDesktop.getServerUrl()}`;
    
    badge.addEventListener('click', () => {
      if (confirm('¿Deseas desconectarte de este servidor?')) {
        window.exnetDesktop.disconnect();
      }
    });
    
    document.body.appendChild(badge);
  }, 2000);
});