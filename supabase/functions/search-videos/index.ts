
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
    const { query, page = 1, per_page = 20 } = await req.json()

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

    console.log("Searching Pexels videos for:", query, "page:", page)

    const pexelsUrl = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}&orientation=all&size=all`

    const response = await fetch(pexelsUrl, {
      headers: {
        'Authorization': apiKey,
        'User-Agent': 'VideoEditor/1.0'
      }
    })

    if (!response.ok) {
      console.error(`Pexels API failed: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error("Error response:", errorText)
      throw new Error(`Pexels API failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Transform Pexels video response to our format with multiple quality options
    const videos = data.videos.map((video: any) => {
      // Get video files sorted by quality
      const videoFiles = video.video_files.sort((a: any, b: any) => b.width - a.width)
      
      return {
        id: video.id,
        url: videoFiles[0]?.link || '', // Best quality
        urls: {
          hd: videoFiles.find((f: any) => f.quality === 'hd')?.link || videoFiles[0]?.link,
          sd: videoFiles.find((f: any) => f.quality === 'sd')?.link || videoFiles[0]?.link,
          original: videoFiles[0]?.link
        },
        thumbnail: video.image,
        title: video.tags || `Video by ${video.user.name}`,
        duration: video.duration || 0,
        width: video.width || videoFiles[0]?.width,
        height: video.height || videoFiles[0]?.height,
        photographer: video.user.name,
        photographer_url: video.user.url,
        pexels_url: video.url
      }
    })

    console.log(`Found ${videos.length} videos from Pexels`)

    return new Response(
      JSON.stringify({ 
        videos,
        total_results: data.total_results,
        page: data.page,
        per_page: data.per_page,
        next_page: data.next_page,
        prev_page: data.prev_page
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
