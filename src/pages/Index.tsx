import { useState } from "react";
import { Heart, Book, MessageCircle, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";

type Mode = "emotional" | "study" | "support" | "productivity" | "casual";

const modes = [
  {
    id: "emotional" as Mode,
    name: "Emotional Support",
    icon: Heart,
    description: "Talk about your feelings",
    color: "bg-primary",
  },
  {
    id: "study" as Mode,
    name: "Study Helper",
    icon: Book,
    description: "Learn and understand",
    color: "bg-secondary",
  },
  {
    id: "support" as Mode,
    name: "Customer Support",
    icon: MessageCircle,
    description: "Get help with issues",
    color: "bg-accent",
  },
  {
    id: "productivity" as Mode,
    name: "Productivity",
    icon: CheckCircle,
    description: "Stay on track",
    color: "bg-primary",
  },
  {
    id: "casual" as Mode,
    name: "Just Chat",
    icon: Sparkles,
    description: "Friendly conversation",
    color: "bg-secondary",
  },
];

const Index = () => {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

  if (selectedMode) {
    return (
      <ChatInterface
        mode={selectedMode}
        onBack={() => setSelectedMode(null)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-radial relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-warm opacity-5 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-warm mb-6 shadow-card">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-warm bg-clip-text text-transparent">
            Hi, I'm YUNO
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your warm, caring AI companion here to support you in whatever you need — 
            from study help to emotional support, productivity tips to friendly chats.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            What can I help you with today?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <Card
                  key={mode.id}
                  className="p-6 cursor-pointer hover:shadow-card transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50 animate-slide-in group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${mode.color} text-white transition-transform group-hover:scale-110`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{mode.name}</h3>
                      <p className="text-sm text-muted-foreground">{mode.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <Card className="p-8 bg-gradient-to-br from-card to-muted/20 shadow-card animate-fade-in">
          <h3 className="text-xl font-semibold mb-4 text-center">Why you'll love chatting with me</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-medium mb-2">Emotionally Aware</h4>
              <p className="text-sm text-muted-foreground">I understand how you feel and respond with genuine care</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-3">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <h4 className="font-medium mb-2">Always Here</h4>
              <p className="text-sm text-muted-foreground">Day or night, I'm ready to chat and support you</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-3">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-medium mb-2">Multi-Talented</h4>
              <p className="text-sm text-muted-foreground">From study help to productivity — I've got your back</p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Index;
