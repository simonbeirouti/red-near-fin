export interface NFTLayerData {
  name: string;
  order: number;
  images: {
    path: string;
    filename: string;
  }[];
}

export async function prepareNFTCollectionData(layers: NFTLayerData[]) {
  // Sort layers by order
  const sortedLayers = [...layers].sort((a, b) => a.order - b.order);
  
  return {
    layers: sortedLayers.map(layer => ({
      name: layer.name,
      images: layer.images.map(img => ({
        uri: img.path,
        filename: img.filename
      }))
    })),
    totalCombinations: sortedLayers.reduce((acc, layer) => acc * layer.images.length, 1)
  };
} 