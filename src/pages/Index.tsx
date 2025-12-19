import QRGenerator from "@/components/QRGenerator";
import { QrCode } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16 space-y-6 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-foreground">Genera tu </span>
            <span className="gradient-text">código QR</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
            Convierte cualquier enlace en un código QR descargable en segundos
          </p>
        </header>

        {/* Main Generator */}
        <main>
          <QRGenerator />
        </main>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <p className="text-sm text-muted-foreground/60">
            Rápido, gratuito y sin límites
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
