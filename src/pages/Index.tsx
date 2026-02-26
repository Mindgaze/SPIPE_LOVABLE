import { useState, useCallback } from "react";
import { Shield, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/UploadZone";
import { ResultCard } from "@/components/ResultCard";
import { protectImage, validateImage, type ProtectResult } from "@/lib/steganography";
import { toast } from "sonner";

type AppState = "idle" | "preview" | "processing" | "done";

const Index = () => {
  const [state, setState] = useState<AppState>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ProtectResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onFileSelect = useCallback((selectedFile: File) => {
    const validationError = validateImage(selectedFile);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setState("preview");
    setError(null);
  }, []);

  const onProtect = useCallback(async () => {
    if (!file) return;
    setState("processing");
    setError(null);
    try {
      const protectedResult = await protectImage(file);
      setResult(protectedResult);
      setState("done");
      toast.success("Imagem protegida com sucesso!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setState("preview");
    }
  }, [file]);

  const onReset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setState("idle");
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="scan-line fixed inset-0 pointer-events-none opacity-20" />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <Shield className="w-10 h-10 text-primary" />
              <div className="absolute inset-0 w-10 h-10 text-primary animate-pulse-glow opacity-50">
                <Shield className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              SPIPE <span className="text-primary glow-text">Shield</span>
            </h1>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Proteja suas imagens contra IA generativa com esteganografia adversarial LSB
          </p>
        </div>

        {/* Main card */}
        <div className="w-full max-w-xl">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-primary/5 shield-gradient">
            {state === "idle" && (
              <UploadZone onFileSelect={onFileSelect} />
            )}

            {state === "preview" && preview && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border overflow-hidden bg-secondary/30">
                  <img src={preview} alt="Preview" className="w-full h-64 object-contain" />
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={onProtect} className="flex-1 gap-2">
                    <Shield className="w-4 h-4" />
                    Proteger Imagem
                  </Button>
                  <Button onClick={onReset} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {state === "processing" && (
              <div className="flex flex-col items-center gap-4 py-12">
                <div className="relative">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-foreground font-medium">Aplicando proteção...</p>
                  <p className="text-muted-foreground text-xs font-mono mt-1">LSB embedding em progresso</p>
                </div>
              </div>
            )}

            {state === "done" && result && preview && (
              <ResultCard
                originalPreview={preview}
                result={result}
                onReset={onReset}
              />
            )}
          </div>

          {/* Footer info */}
          <p className="text-center text-xs text-muted-foreground mt-6 font-mono">
            Processamento 100% local • Nenhuma imagem é enviada a servidores
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
