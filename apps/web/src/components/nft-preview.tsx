// @ts-nocheck
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@repo/ui/button";

interface LayerImage {
  path: string;
  filename: string;
}

interface Layer {
  id: string;
  name: string;
  images: LayerImage[];
  order: number;
}

interface NFTPreviewProps {
  layerFolders: Layer[];
  isLocked?: boolean;
  className?: string;
  onComplete?: (layers: Array<{ url: string; order: number }>) => void;
}

export function NFTPreview({ 
  layerFolders, 
  isLocked = false,
  className = "",
  onComplete
}: NFTPreviewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLayers, setSelectedLayers] = useState<Array<{ url: string; order: number }>>([]);
  
  const sortedLayers = [...layerFolders].sort((a, b) => a.order - b.order);
  const currentLayer = sortedLayers[currentStep];

  const handleSelectImage = (imagePath: string) => {
    const newLayer = {
      url: imagePath,
      order: currentLayer.order
    };

    setSelectedLayers(prev => [...prev, newLayer]);

    if (currentStep < sortedLayers.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // All layers selected
      onComplete?.(selectedLayers);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={`relative w-[450px] h-[450px] mx-auto bg-transparent border-gray-300 rounded-md ${className}`}>
        {/* Show previously selected layers */}
        {selectedLayers.map((layer, index) => (
          <Image
            key={index}
            src={layer.url}
            alt={`Layer ${layer.order + 1}`}
            width={500}
            height={500}
            className="absolute top-0 left-0 w-full h-full object-contain rounded-md"
            style={{ zIndex: layer.order }}
          />
        ))}
      </div>

      {!isLocked && currentLayer && (
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-4">
            Select {currentLayer.name} (Step {currentStep + 1} of {sortedLayers.length})
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {currentLayer.images.map((image, index) => (
              <Button
                key={index}
                variant="outline"
                className="p-2 hover:bg-gray-100"
                onClick={() => handleSelectImage(image.path)}
              >
                <Image
                  src={image.path}
                  alt={image.filename}
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
