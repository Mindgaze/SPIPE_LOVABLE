import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect, disabled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative overflow-hidden rounded-xl border-2 border-dashed p-12
        transition-all duration-300 cursor-pointer group
        ${isDragging 
          ? "border-primary bg-primary/10 glow-border" 
          : "border-border hover:border-primary/50 hover:bg-secondary/50"
        }
        ${disabled ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      <div className="scan-line absolute inset-0 pointer-events-none opacity-30" />
      
      <label className="flex flex-col items-center gap-4 cursor-pointer">
        <div className={`
          rounded-full p-4 transition-all duration-300
          ${isDragging ? "bg-primary/20" : "bg-secondary group-hover:bg-primary/10"}
        `}>
          <Upload className={`w-8 h-8 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
        </div>
        
        <div className="text-center">
          <p className="text-foreground font-medium text-lg">
            Arraste sua imagem aqui
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            ou clique para selecionar
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <ImageIcon className="w-3 h-3" />
          <span>PNG, JPEG, WEBP • máx. 10 MB</span>
        </div>

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
      </label>
    </div>
  );
}
