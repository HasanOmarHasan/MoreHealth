// src/features/chat/ChatDashboard.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient, { startChat } from "../../../services/axiosClient";
import { useAuth } from "../../../context/Auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../../ui/Loader";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ReactTimeAgo from "react-time-ago";

import "../../../utils/timeAgoConfig";
import Messages from "./Messages";

interface ChatRoom {
  id: number;
  participants: Array<{
    id: number;
    username: string;
    email: string;
  }>;
  created_at: string;
  is_private: boolean;
  other_user: {
    id: number;
    username: string;
  } | null;
}

interface Friend {
  id: number;
  sender: { id: number; username: string };
  receiver: { id: number; username: string };
  status: string;
  created_at: string;
}

interface FriendRequest  {
  id: number;
  sender: { id: number; username: string };
  receiver: { id: number; username: string };
  status: string;
  created_at: string;
}


const Chat = () => {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState(0);
  // const [userId, setuserId] = useState(undefined);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"chats" | "friends" | "requests">(
    "chats"
  );

  // Fetch data
  const { data: chatRooms, isLoading: roomsLoading } = useQuery<ChatRoom[]>({
    queryKey: ["chatRooms"],
    queryFn: () => axiosClient.get("/chat/chat-rooms/").then((res) => res.data),
  });

  const { data: friends, isLoading: friendsLoading } = useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: () => axiosClient.get("/chat/friends/").then((res) => res.data),
  });

  const { data: friendRequests, isPending: requestsLoading } = useQuery<
    FriendRequest[]
  >({
    queryKey: ["friendRequests"],
    queryFn: () =>
      axiosClient.get("/chat/friend-requests/").then((res) => res.data),
  });

  // Friend request actions
  const handleFriendRequest = useMutation({
    mutationFn: ({
      requestId,
      action,
    }: {
      requestId: number;
      action: "accept" | "reject";
    }) => axiosClient.patch(`/chat/friend-requests/${requestId}/`, { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      toast.success("Request updated");
    },
    onError: () => toast.error("Failed to update request"),
  });

  console.log();
  // Start Chat Mutation
  const startChatMutation = useMutation({
    mutationFn: (userId: number) => startChat(userId),
    onSuccess: (data) => {
      console.log(data.data.room_id);
      window.location.replace(`/profile/Messages/${data.data.room_id}`);
      toast.success("Chat started successfully!");
      // console.log(data);
      // toast.success(data.data);
    },

    onError: (error) => {
      console.log(error);
      toast.error("Failed to start chat");
    },
  });

  if (roomsLoading || friendsLoading || requestsLoading) return <Loader />;

  console.log(roomId);
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left sidebar */}
      <div className="w-96 border-r bg-white">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>

          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab("chats")}
              className={`pb-2 px-4 ${
                activeTab === "chats"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Chats
            </button>
            <button
              onClick={() => setActiveTab("friends")}
              className={`pb-2 px-4 ${
                activeTab === "friends"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`pb-2 px-4 ${
                activeTab === "requests"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              Requests
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-140px)]">
          {activeTab === "chats" && (
            <>
              {/* {console.log(chatRooms)} */}
              {chatRooms?.map((room) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 border-b hover:bg-gray-50 transition-colors"
                >
                  <Link
                    onClick={() => setRoomId(room.id)}
                    to={`/profile/messages/${room.id}`}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {room.is_private
                          ? room.other_user?.username
                          : `Group (${room.participants.length})`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {room.participants
                          .filter((p) => p.id !== user?.id)
                          .map((p) => p.username)
                          .join(", ")}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      <ReactTimeAgo
                        date={new Date(room.created_at)}
                        locale="en-US"
                        timeStyle="twitter"
                      />
                    </span>
                  </Link>
                </motion.div>
              ))}
              {chatRooms?.length === 0 && (
                <div className="p-4 text-gray-500">No chats yet</div>
              )}
            </>
          )}

          {activeTab === "friends" && (
            <>
              {friends?.map((friend) => {
                const otherUser =
                  friend.sender.id === user?.id
                    ? friend.receiver
                    : friend.sender;
                return (
                  <div
                    key={friend.id}
                    className="p-4 border-b hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {otherUser.username[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold">{otherUser.username}</h3>
                        <p className="text-sm text-gray-500">Friends</p>
                      </div>
                    </div>
                    {/* {console.log(otherUser)} */}
                    <button
                      // to={`profile/messages/${roomId}`}
                      // to={`/messages/${findPrivateChatId(otherUser.id)}`}
                      onClick={() => {
                        startChatMutation.mutate(otherUser.id);
                        // setuserId(otherUser.id);
                      }}
                      disabled={
                        startChatMutation.isPending || startChatMutation.isError
                      }
                      className="p-2 hover:bg-gray-200 rounded-full"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
              {friends?.length === 0 && (
                <div className="p-4 text-gray-500">No friends yet</div>
              )}
            </>
          )}

          {activeTab === "requests" && (
            <>
              {friendRequests?.map((request) => (
                <div
                  key={request.id}
                  className="p-4 border-b hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {request.sender.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {request.sender.username}
                      </h3>
                      <p className="text-sm text-gray-500">Friend request</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleFriendRequest.mutate({
                          requestId: request.id,
                          action: "accept",
                        })
                      }
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleFriendRequest.mutate({
                          requestId: request.id,
                          action: "reject",
                        })
                      }
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {friendRequests?.length === 0 && (
                <div className="p-4 text-gray-500">No pending requests</div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right content area */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">
            {activeTab === "chats" && "Your Conversations"}
            {activeTab === "friends" && "Friends List"}
            {activeTab === "requests" && "Friend Requests"}
          </h2>

          {activeTab === "friends" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Add New Friends</h3>
              {/* Add friend search/functionality here */}
            </div>
          )}

          {activeTab === "chats" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Start New Chat</h3>
              {/* New chat functionality here */}
              <Messages />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to find private chat ID
// const findPrivateChatId = (userId: number, chatRooms?: ChatRoom[]) => {
//   if (!chatRooms) return null;
//   const room = chatRooms.find(
//     (r) => r.is_private && r.other_user?.id === userId
//   );
//   return room?.id;
// };

export default Chat;
