import { Download, RotateCcw, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProtectResult } from "@/lib/steganography";

interface ResultCardProps {
  originalPreview: string;
  result: ProtectResult;
  onReset: () => void;
}

export function ResultCard({ originalPreview, result, onReset }: ResultCardProps) {
  const resultUrl = URL.createObjectURL(result.blob);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "protected.png";
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Success banner */}
      <div className="flex items-center gap-3 rounded-lg bg-accent/10 border border-accent/30 px-4 py-3">
        <CheckCircle className="w-5 h-5 text-accent shrink-0" />
        <div>
          <p className="text-accent font-medium text-sm">Proteção aplicada com sucesso</p>
          <p className="text-muted-foreground text-xs font-mono mt-0.5">
            {result.width}×{result.height}px • payload: {result.payloadSize} bytes • LSB embedding
          </p>
        </div>
      </div>

      {/* Image comparison */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Original</p>
          <div className="rounded-lg border border-border overflow-hidden bg-secondary/30">
            <img src={originalPreview} alt="Original" className="w-full h-48 object-contain" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-accent font-mono uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3" /> Protegida
          </p>
          <div className="rounded-lg border border-accent/30 overflow-hidden bg-secondary/30 glow-border">
            <img src={resultUrl} alt="Protegida" className="w-full h-48 object-contain" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleDownload} className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
          <Download className="w-4 h-4" />
          Download PNG
        </Button>
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Nova imagem
        </Button>
      </div>
    </div>
  );
}
