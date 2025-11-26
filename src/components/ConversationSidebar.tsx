import { useEffect, useState } from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Conversation = {
  id: string;
  title: string;
  mode: string;
  created_at: string;
  updated_at: string;
};

interface ConversationSidebarProps {
  onSelectConversation: (conversationId: string, mode: string) => void;
  onNewChat: () => void;
  currentConversationId: string | null;
}

export function ConversationSidebar({
  onSelectConversation,
  onNewChat,
  currentConversationId,
}: ConversationSidebarProps) {
  const { state } = useSidebar();
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const isCollapsed = state === "collapsed";

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("user_id", user?.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

      if (error) throw error;

      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      toast({
        title: "Deleted",
        description: "Conversation deleted successfully",
      });

      if (currentConversationId === conversationId) {
        onNewChat();
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {!isCollapsed && (
          <div className="p-4 border-b">
            <Button
              onClick={onNewChat}
              className="w-full gap-2"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
        )}

        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <SidebarMenu>
                {isLoading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : conversations.length === 0 ? (
                  !isCollapsed && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No conversations yet
                    </div>
                  )
                ) : (
                  conversations.map((conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <SidebarMenuButton
                        onClick={() =>
                          onSelectConversation(conversation.id, conversation.mode)
                        }
                        className={`w-full justify-start gap-2 group relative ${
                          currentConversationId === conversation.id
                            ? "bg-accent text-accent-foreground"
                            : ""
                        }`}
                      >
                        <MessageSquare className="h-4 w-4 shrink-0" />
                        {!isCollapsed && (
                          <>
                            <div className="flex-1 overflow-hidden">
                              <div className="truncate text-sm font-medium">
                                {conversation.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(conversation.updated_at)}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => handleDelete(e, conversation.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
