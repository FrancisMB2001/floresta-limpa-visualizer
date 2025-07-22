export async function fetchFuelBreak(stacApiUrl: string, collectionId: string) {
  const response = await fetch(`${stacApiUrl}/collections/${collectionId}/items`);
  const data = await response.json();

  // Assuming each item has a geojson geometry or geojson asset
  return data.features[0]; // You might filter based on metadata
}
