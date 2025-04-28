
import { cn } from "@/lib/utils";

type AdSize = "banner" | "sidebar" | "leaderboard" | "rectangle" | "custom";

type AdPlaceholderProps = {
  size: AdSize;
  className?: string;
  height?: number;
  width?: number;
  id?: string;
};

const sizeMap = {
  banner: { width: 970, height: 250, label: "970 x 250" },
  sidebar: { width: 300, height: 600, label: "300 x 600" },
  leaderboard: { width: 728, height: 90, label: "728 x 90" },
  rectangle: { width: 300, height: 250, label: "300 x 250" },
  custom: { width: 0, height: 0, label: "Custom" },
};

export default function AdPlaceholder({ 
  size, 
  className, 
  height, 
  width, 
  id 
}: AdPlaceholderProps) {
  const adDimensions = sizeMap[size];
  const adHeight = height || adDimensions.height;
  const adWidth = width || adDimensions.width;
  const adLabel = size === "custom" && (height || width) 
    ? `${adWidth} x ${adHeight}`
    : adDimensions.label;

  return (
    <div 
      id={id}
      data-ad-placeholder={size} 
      className={cn(
        "ad-placeholder rounded-lg p-4 flex items-center justify-center border border-dashed border-muted-foreground/20",
        className
      )}
      style={{ height: adHeight ? `${adHeight}px` : "auto" }}
    >
      <div className="text-center">
        <p className="font-medium">Anúncio</p>
        <p className="text-sm text-muted-foreground">{adLabel}</p>
      </div>
    </div>
  );
}
