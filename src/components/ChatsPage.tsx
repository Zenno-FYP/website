import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { ArrowLeft, Search, Send, Paperclip, Mic, Smile, MoreVertical, MessageCircle } from "lucide-react";

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  message: string;
  time: string;
  isOnline: boolean;
  avatar: string;
  unreadCount?: number;
}

interface Message {
  id: number;
  contactId: number;
  text: string;
  time: string;
  isSent: boolean;
  isRead: boolean;
}

interface ChatsPageProps {
  theme: 'light' | 'dark';
  onBack: () => void;
  initialContacts: Contact[];
  selectedContactId?: number;
}

export function ChatsPage({ theme, onBack, initialContacts, selectedContactId }: ChatsPageProps) {
  const [selectedContact, setSelectedContact] = useState<number | null>(selectedContactId || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  // Mock messages data
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, contactId: 1, text: "Hey! I found a bug in the authentication flow.", time: "10:30 AM", isSent: false, isRead: true },
    { id: 2, contactId: 1, text: "Can you take a look?", time: "10:30 AM", isSent: false, isRead: true },
    { id: 3, contactId: 1, text: "Sure! Let me check it out. Can you share the error logs?", time: "10:32 AM", isSent: true, isRead: true },
    { id: 4, contactId: 1, text: "Here's the screenshot", time: "10:33 AM", isSent: false, isRead: true },
    { id: 5, contactId: 1, text: "I see the issue. Working on the fix now.", time: "10:35 AM", isSent: true, isRead: true },
    { id: 6, contactId: 2, text: "The dashboard redesign looks great!", time: "Yesterday", isSent: false, isRead: true },
    { id: 7, contactId: 2, text: "Thanks! Should we add more animations?", time: "Yesterday", isSent: true, isRead: true },
    { id: 8, contactId: 3, text: "Database optimization complete", time: "2 days ago", isSent: false, isRead: true },
    { id: 9, contactId: 4, text: "Need help with the API integration", time: "3 days ago", isSent: false, isRead: true },
  ]);

  const filteredContacts = initialContacts.filter(contact =>
    `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: messages.length + 1,
      contactId: selectedContact,
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      isRead: false,
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  const selectedContactData = initialContacts.find(c => c.id === selectedContact);
  const contactMessages = messages.filter(m => m.contactId === selectedContact);

  return (
    <div className="fixed inset-0 z-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle grid pattern overlay */}
        {theme === 'dark' && (
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        )}
        
        {/* Gradient overlays */}
        <div className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#1a1a2e]/30 via-transparent to-transparent'
            : ''
        }`}></div>
        
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-600/15 to-blue-600/8' 
            : 'bg-gradient-to-br from-purple-400/8 to-purple-300/4'
        }`}></div>
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-purple-600/15 to-[#7C4DFF]/8' 
            : 'bg-gradient-to-br from-purple-400/8 to-purple-300/4'
        }`} style={{ animationDelay: '2s' }}></div>
        
        {/* Diagonal accent */}
        {theme === 'dark' && (
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-600/5 to-transparent rotate-12 transform translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
          </div>
        )}
      </div>

      {/* Main Chat Container */}
      <div className={`h-full w-full flex flex-col shadow-2xl backdrop-blur-2xl relative z-10 ${
        theme === 'dark'
          ? 'bg-[#121218]/95'
          : 'bg-white/95'
      }`}>
        {/* Header with Back Button */}
        <div className={`flex-shrink-0 px-8 py-4 border-b backdrop-blur-xl ${
          theme === 'dark' ? 'border-white/10 bg-[#0f0f14]/50' : 'border-gray-200 bg-white/50'
        }`}>
          <Button
            variant="ghost"
            onClick={onBack}
            className={`rounded-xl transition-all ${
              theme === 'dark'
                ? 'hover:bg-white/10 text-gray-300 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Contacts */}
          <div className={`w-96 border-r flex flex-col ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}>
            {/* Sidebar Header */}
            <div className={`p-4 border-b ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}>
              <h2 className={`mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Chats
              </h2>
              {/* Search Bar */}
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 rounded-xl ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-400'
                      : 'bg-gray-50 border-gray-200 placeholder:text-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Contacts List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all mb-1 shadow-sm ${
                      selectedContact === contact.id
                        ? theme === 'dark'
                          ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/10 border border-purple-500/30 shadow-md'
                          : 'bg-gradient-to-br from-purple-100 to-blue-50 border border-purple-300 shadow-md'
                        : theme === 'dark'
                        ? 'hover:bg-white/5 hover:shadow-md'
                        : 'hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={contact.avatar} alt={contact.firstName} />
                          <AvatarFallback className="bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white">
                            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 ${
                          theme === 'dark' ? 'border-[#121218]' : 'border-white'
                        } ${
                          contact.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className={`text-xs flex-shrink-0 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {contact.time}
                          </p>
                        </div>
                        <p className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {contact.message}
                        </p>
                      </div>
                      {contact.unreadCount && (
                        <div className="flex-shrink-0">
                          <div className="w-5 h-5 rounded-full bg-[#5B6FD8] flex items-center justify-center">
                            <span className="text-white text-xs">{contact.unreadCount}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Side - Chat Area */}
          {selectedContact && selectedContactData ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className={`flex-shrink-0 p-4 border-b flex items-center justify-between ${
                theme === 'dark' ? 'border-white/10' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedContactData.avatar} alt={selectedContactData.firstName} />
                      <AvatarFallback className="bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white">
                        {selectedContactData.firstName.charAt(0)}{selectedContactData.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                      theme === 'dark' ? 'border-[#121218]' : 'border-white'
                    } ${
                      selectedContactData.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></span>
                  </div>
                  <div>
                    <h3 className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                      {selectedContactData.firstName} {selectedContactData.lastName}
                    </h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedContactData.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-xl ${
                    theme === 'dark'
                      ? 'hover:bg-white/10 text-gray-400'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-6">
                  <div className="space-y-4">
                    {contactMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                            message.isSent
                              ? 'bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] text-white rounded-br-md'
                              : theme === 'dark'
                              ? 'bg-white/10 text-white rounded-bl-md'
                              : 'bg-gray-100 text-gray-900 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm mb-1">{message.text}</p>
                          <p className={`text-xs ${
                            message.isSent
                              ? 'text-white/70'
                              : theme === 'dark'
                              ? 'text-gray-400'
                              : 'text-gray-500'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Input Area */}
              <div className={`flex-shrink-0 p-4 border-t ${
                theme === 'dark' ? 'border-white/10' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-xl flex-shrink-0 ${
                      theme === 'dark'
                        ? 'hover:bg-white/10 text-gray-400 hover:text-purple-400'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-[#5B6FD8]'
                    }`}
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-xl flex-shrink-0 ${
                      theme === 'dark'
                        ? 'hover:bg-white/10 text-gray-400 hover:text-purple-400'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-[#5B6FD8]'
                    }`}
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className={`flex-1 rounded-xl ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-400'
                        : 'bg-gray-50 border-gray-200 placeholder:text-gray-500'
                    }`}
                  />
                  {messageText.trim() ? (
                    <Button
                      onClick={handleSendMessage}
                      className="rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#5B6FD8] hover:from-[#6B3FEE] hover:to-[#4A5FC7] text-white shadow-lg flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsRecording(!isRecording)}
                      className={`rounded-xl flex-shrink-0 ${
                        isRecording
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : theme === 'dark'
                          ? 'hover:bg-white/10 text-gray-400 hover:text-purple-400'
                          : 'hover:bg-gray-100 text-gray-600 hover:text-[#5B6FD8]'
                      }`}
                    >
                      <Mic className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                }`}>
                  <MessageCircle className={`w-12 h-12 ${
                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                  }`} />
                </div>
                <h3 className={`mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Select a chat to start messaging
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  Choose a contact from the list to view conversation
                  </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
