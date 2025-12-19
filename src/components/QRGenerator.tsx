import { useState, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Link2, Sparkles, QrCode } from "lucide-react";
import { toast } from "sonner";

const QRGenerator = () => {
  const [url, setUrl] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(() => {
    if (!url.trim()) {
      toast.error("Por favor, ingresa un enlace válido");
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }

    setGeneratedUrl(finalUrl);
    toast.success("¡QR generado exitosamente!");
  }, [url]);

  const handleDownload = useCallback(() => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = "#0a0f1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 400, 400);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qr-code.png";
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("¡QR descargado!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="glass-card p-6 space-y-4 glow-effect">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Link2 className="w-4 h-4" />
          <span className="text-sm font-medium">Ingresa tu enlace</span>
        </div>
        
        <div className="relative">
          <Input
            type="text"
            placeholder="https://ejemplo.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-14 pl-4 pr-4 text-lg bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50 transition-all duration-300"
          />
        </div>

        <Button 
          onClick={handleGenerate}
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generar QR
        </Button>
      </div>

      {/* QR Display Section */}
      {generatedUrl && (
        <div className="glass-card p-8 space-y-6 animate-scale-in">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary">
              <QrCode className="w-5 h-5" />
              <span className="font-semibold">Tu código QR</span>
            </div>
            <p className="text-sm text-muted-foreground truncate max-w-xs mx-auto">
              {generatedUrl}
            </p>
          </div>

          <div 
            ref={qrRef}
            className="flex justify-center animate-float"
          >
            <div className="p-6 bg-secondary/30 rounded-2xl glow-border">
              <QRCodeSVG
                value={generatedUrl}
                size={200}
                bgColor="transparent"
                fgColor="hsl(186, 100%, 50%)"
                level="H"
                includeMargin={false}
              />
            </div>
          </div>

          <Button 
            onClick={handleDownload}
            variant="outline"
            className="w-full h-12 text-base font-semibold border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
          >
            <Download className="w-5 h-5 mr-2" />
            Descargar PNG
          </Button>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
