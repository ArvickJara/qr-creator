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
    if (!generatedUrl) return;

    // Crear un contenedor temporal para el QR en blanco y negro
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    document.body.appendChild(tempContainer);

    // Crear el QR en blanco y negro para descarga
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `
      <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" fill="#FFFFFF"/>
      </svg>
    `;
    tempContainer.appendChild(tempDiv);

    // Generar el QR code usando qrcode.react manualmente
    import('qrcode').then((QRCode) => {
      QRCode.default.toCanvas(generatedUrl, {
        errorCorrectionLevel: 'H',
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',  // Negro
          light: '#FFFFFF'  // Blanco
        }
      }, (err: Error | null | undefined, canvas: HTMLCanvasElement) => {
        if (err) {
          toast.error("Error al generar el QR");
          document.body.removeChild(tempContainer);
          return;
        }

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "qr-code.png";
        downloadLink.href = pngFile;
        downloadLink.click();
        toast.success("¡QR descargado!");
        document.body.removeChild(tempContainer);
      });
    });
  }, [generatedUrl]);

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
