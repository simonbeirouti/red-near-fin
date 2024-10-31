// @ts-nocheck
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { useEffect, useState } from "react";

interface LayerPositionSelectProps {
  totalLayers: number;
  folderIndex: number;
  onOrderChange: (newPosition: string) => void;
  disabled?: boolean;
}

export function LayerPositionSelect({
  totalLayers,
  folderIndex,
  onOrderChange,
  disabled
}: LayerPositionSelectProps) {
  const [selectedValue, setSelectedValue] = useState(`${folderIndex}`);

  useEffect(() => {
    setSelectedValue(`${folderIndex}`);
  }, [folderIndex]);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onOrderChange(newValue);
  };

  return (
    <Select 
      value={selectedValue}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue>
          Layer {parseInt(selectedValue) + 1}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: totalLayers }, (_, i) => (
          <SelectItem 
            key={i} 
            value={`${i}`}
            className={parseInt(selectedValue) === i ? "bg-accent" : ""}
          >
            Layer {i + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
