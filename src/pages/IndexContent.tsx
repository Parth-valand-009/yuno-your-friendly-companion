import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChatInterface } from "@/components/ChatInterface";
import { Heart, BookOpen, HelpCircle, Target, MessageCircle, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ConversationSidebar } from "@/components/ConversationSidebar";

type Mode = "emotional" | "study" | "support" | "productivity" | "casual";

const modes = [
  {
    id: "emotional" as Mode,
    title: "Emotional Support",
    description: "Talk about your feelings",
    icon: Heart,
  },
  {
    id: "study" as Mode,
    title: "Study Helper",
    description: "Learn and understand",
    icon: BookOpen,
  },
  {
    id: "support" as Mode,
    title: "Customer Support",
    description: "Get help with issues",
    icon: HelpCircle,
  },
  {
    id: "productivity" as Mode,
    title: "Productivity",
    description: "Stay on track",
    icon: Target,
  },
  {
    id: "casual" as Mode,
    title: "Just Chat",
    description: "Friendly conversation",
    icon: MessageCircle,
  },
];

const IndexContent = () => {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "See you next time!",
    });
  };

  const handleSelectConversation = (conversationId: string, mode: string) => {
    setSelectedConversationId(conversationId);
    setSelectedMode(mode as Mode);
  };

  const handleNewChat = () => {
    setSelectedMode(null);
    setSelectedConversationId(null);
  };

  const handleBack = () => {
    setSelectedMode(null);
    setSelectedConversationId(null);
  };

  if (selectedMode) {
    return (
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-h-screen w-full">
          <ConversationSidebar
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            currentConversationId={selectedConversationId}
          />
          <div className="flex-1 flex flex-col">
            <ChatInterface
              mode={selectedMode}
              onBack={handleBack}
              existingConversationId={selectedConversationId}
            />
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1" />
            <div className="flex-1 flex justify-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
                <span className="text-4xl">🌸</span>
              </div>
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            YUNO
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Your Personal AI Companion
          </p>
          {user && (
            <p className="text-sm text-muted-foreground">
              Welcome back! Your conversations are saved and ready.
            </p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-6">
            How can I help you today?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {modes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <Card
                  key={mode.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">{mode.title}</h3>
                        <p className="text-sm text-muted-foreground">{mode.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default IndexContent;
