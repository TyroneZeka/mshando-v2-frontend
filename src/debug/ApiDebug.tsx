import { useEffect } from 'react';
import { API_CONFIG } from '../services/api';

export default function ApiDebug() {
  useEffect(() => {
    console.log('API Configuration:', API_CONFIG);
    console.log('Environment Variables:', {
      VITE_USER_SERVICE_URL: import.meta.env.VITE_USER_SERVICE_URL,
      VITE_TASK_SERVICE_URL: import.meta.env.VITE_TASK_SERVICE_URL,
      VITE_BIDDING_SERVICE_URL: import.meta.env.VITE_BIDDING_SERVICE_URL,
      VITE_PAYMENT_SERVICE_URL: import.meta.env.VITE_PAYMENT_SERVICE_URL,
      VITE_NOTIFICATION_SERVICE_URL: import.meta.env.VITE_NOTIFICATION_SERVICE_URL,
    });
    
    // Test API connectivity
    fetch(`${API_CONFIG.USER_SERVICE_URL}/auth/test`, { method: 'OPTIONS' })
      .then(response => {
        console.log('API Gateway connectivity test:', response.status);
      })
      .catch(error => {
        console.error('API Gateway connectivity error:', error);
      });
  }, []);

  return null;
}
