
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, page = 1, per_page = 15 } = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const apiKey = Deno.env.get('PEXELS_API_KEY')
    if (!apiKey) {
      console.error("Pexels API key not found")
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log("Searching Pexels videos for:", query)

    const pexelsUrl = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}`

    const response = await fetch(pexelsUrl, {
      headers: {
        'Authorization': apiKey,
        'User-Agent': 'VideoEditor/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`Pexels API failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Transform Pexels video response to our format
    const videos = data.videos.map((video: any) => ({
      id: video.id,
      url: video.video_files[0]?.link || '',
      thumbnail: video.image,
      title: video.tags || query,
      duration: `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, '0')}`,
      photographer: video.user.name,
      photographer_url: video.user.url,
      pexels_url: video.url
    }))

    console.log(`Found ${videos.length} videos from Pexels`)

    return new Response(
      JSON.stringify({ 
        videos,
        total_results: data.total_results,
        page: data.page,
        per_page: data.per_page,
        next_page: data.next_page
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in search-videos:', error)
    return new Response(
      JSON.stringify({ error: error.message || "Failed to search videos" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
