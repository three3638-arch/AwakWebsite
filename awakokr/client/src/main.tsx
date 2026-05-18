import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { useAuthStore } from './stores/authStore';
import './index.css';

// 从 localStorage 恢复认证状态
useAuthStore.getState().initialize();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
