/**
 * N8N Webhook Service - Trigger email notifications and workflows
 */

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 
  'https://crownconsultinggroup.app.n8n.cloud/webhook/call-completed';

/**
 * Trigger email notification workflow when a call is completed
 */
export async function triggerCallCompletedEmail(callId: string): Promise<boolean> {
  // Skip email in development (CORS issues)
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    console.log('📧 [DEV MODE] Email notification skipped (would send for call:', callId, ')');
    console.info('ℹ️ Email will work in production. CORS prevents browser → N8N calls in dev.');
    return true; // Return true to not block the UI
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        call_id: callId
      }),
      mode: 'cors',
    });

    if (!response.ok) {
      console.warn('⚠️ N8N webhook response not OK:', response.status, response.statusText);
      return false;
    }

    const result = await response.json();
    console.log('✅ Email notification triggered successfully:', result);
    return true;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn('⚠️ Email notification blocked (CORS)');
    } else {
      console.error('❌ Unexpected error triggering email notification:', error);
    }
    return false;
  }
}

/**
 * Trigger email notification with retry logic
 */
export async function triggerCallCompletedEmailWithRetry(
  callId: string, 
  maxRetries: number = 3
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const success = await triggerCallCompletedEmail(callId);
    
    if (success) {
      return true;
    }
    
    if (attempt < maxRetries) {
      console.log(`Retrying email notification... (${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
    }
  }
  
  console.error('Failed to trigger email notification after', maxRetries, 'attempts');
  return false;
}
