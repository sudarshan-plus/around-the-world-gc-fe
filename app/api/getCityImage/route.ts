export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
  
    if (!city) {
      return Response.json({ error: "City name is required" }, { status: 400 });
    }
  
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeSearchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${city}&inputtype=textquery&fields=photos,place_id&key=${apiKey}`;
  
    try {
      const placeResponse = await fetch(placeSearchUrl);
      const placeData = await placeResponse.json();
  
      if (!placeData.candidates || placeData.candidates.length === 0) {
        return Response.json({ error: "No image found for this city" }, { status: 404 });
      }
  
      const photoReference = placeData.candidates[0]?.photos?.[0]?.photo_reference;
      if (!photoReference) {
        return Response.json({ error: "No image available" }, { status: 404 });
      }
  
      const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${apiKey}`;
  
      return Response.json({ imageUrl });
    } catch (error) {
      return Response.json({ error: "Failed to fetch city image" }, { status: 500 });
    }
  }
  