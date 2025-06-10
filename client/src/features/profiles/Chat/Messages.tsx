// src/features/chat/Messages.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../../services/axiosClient";
import { useAuth } from "../../../context/Auth";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../ui/Loader";
import ReactTimeAgo from "react-time-ago";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import "../../../utils/timeAgoConfig";

interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    username: string;
    email: string;
  };
  timestamp: string;
}
type MessageContext = {
  previousMessages?: Message[];
};

const Messages = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // console.log(user)
  // Fetch messages
  const { data: messages , isPending   } = useQuery<Message[]>({
    queryKey: ["messages", roomId],
    queryFn: () =>
      axiosClient.get(`/chat/messages/${roomId}/`).then((res) => res.data),
    refetchInterval: 5000, // Poll every 5 seconds
    enabled: !!roomId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) =>
      axiosClient.post(`/chat/messages/${roomId}/`, { content }),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["messages", roomId] });

      const previousMessages = queryClient.getQueryData<Message[]>([
        "messages",
        roomId,
      ]);

      // Optimistic update
      queryClient.setQueryData<Message[]>(["messages", roomId], (old) => [
        ...(old || []),
        {
          id: Date.now(), // Temporary ID
          content,
          sender: user!,
          timestamp: new Date().toISOString(),
        },
      ]);

      return { previousMessages } as MessageContext;
    },
    // onError: (err, context : MessageContext | undefined) => {
    //   queryClient.setQueryData(["messages", roomId], context?.previousMessages);
    //   console.log(err);
    //   toast.error("Failed to send message");
    // },

    onError: (err, newMessage, context: MessageContext | undefined) => {
      // Use type-safe access to previousMessages
      console.log(newMessage)
    if (context?.previousMessages) {
      queryClient.setQueryData(
        ["messages", roomId],
        context.previousMessages
      );
    }
    console.log(err);
    toast.error("Failed to send message");
  },
    // onSuccess: () => {
    // //   queryClient.invalidateQueries(["messages", roomId]);
    // }
    onSettled: () => {
      queryClient.invalidateQueries({queryKey :["messages", roomId]});
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessageMutation.mutate(newMessage.trim());
    setNewMessage("");
  };

  if (!roomId) return <div className="p-4 text-red-500">No chat selected</div>;
  if (isPending ) return <Loader />;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Chat Room </h2>
        {/* <h2 className="text-xl font-semibold">Chat Room #{roomId}</h2> */}
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              message.sender.id === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender.id === user?.id
                  ? "bg-blue-500 text-white"
                  : "bg-white border"
              }`}
            >
              {/* <div className="text-xs">
                {message.sender.username}
              </div> */}
              <div className="text-sm break-words">{message.content}</div>
              <div
                className={`text-xs mt-1 ${
                  message.sender.id === user?.id
                    ? "text-blue-100"
                    : "text-gray-500"
                }`}
              >
                <ReactTimeAgo
                  date={new Date(message.timestamp)}
                  locale="en-US"
                  timeStyle="twitter"
                />
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="bg-white p-4 border-t">
        
        <div className="flex gap-2">
        <button
            type="submit"
            disabled={!newMessage.trim() || sendMessageMutation.isPending }
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-5 h-5 rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sendMessageMutation.isPending }
          />
          
        </div>
      </form>
    </div>
  );
};

export default Messages;
