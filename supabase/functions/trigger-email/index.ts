import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { call_id } = await req.json()
    
    if (!call_id) {
      return new Response(
        JSON.stringify({ error: 'call_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call N8N webhook from backend (no CORS issues!)
    const n8nResponse = await fetch('https://crownconsultinggroup.app.n8n.cloud/webhook/call-completed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ call_id })
    })

    if (!n8nResponse.ok) {
      throw new Error(`N8N webhook failed: ${n8nResponse.status}`)
    }

    const result = await n8nResponse.json()

    return new Response(
      JSON.stringify({ success: true, result }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
