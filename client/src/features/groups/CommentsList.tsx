// src/features/comments/CommentsList.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../utils/axiosClient";
import { useAuth } from "../../context/Auth";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useState } from "react";
import Loader from "../../ui/Loader";
import { useParams } from "react-router-dom";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ReactTimeAgo from "react-time-ago";

interface Comment {
  id: number;
  content: string;
  question: number;
  user: {
    id: number;
    username: string;
    avatar?: string;
  };
  created_at: string;
  upvotes: number[];
  replies: Comment[];
  parent: number | null;
}

const CommentsList = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const numericQuestionId = parseInt(questionId || "", 10);
  TimeAgo.addDefaultLocale(en)

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", numericQuestionId],
    queryFn: () =>
      axiosClient.get(`groups/questions/${numericQuestionId}/comments/`).then((res) => res.data),
    enabled: !!numericQuestionId,
  });
 
  const createComment = useMutation({
    mutationFn: (content: string) =>
      axiosClient.post(`groups/questions/${numericQuestionId}/comments/`, {
        content,
        question: numericQuestionId,
        parent: replyingTo,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", numericQuestionId]);
      setNewComment("");
      setReplyingTo(null);
    },
    onError: () => toast.error("Failed to post comment"),
  });

  const updateComment = useMutation({
    mutationFn: (data: { id: number; content: string }) =>
      axiosClient.patch(`/comments/${data.id}/`, { content: data.content }),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", numericQuestionId]);
      setEditingId(null);
    },
  });

  const deleteComment = useMutation({
    mutationFn: (id: number) => axiosClient.delete(`/comments/${id}/`),
    onSuccess: () => queryClient.invalidateQueries(["comments", numericQuestionId]),
  });

  const upvoteComment = useMutation({
    mutationFn: (id: number) => axiosClient.post(`/groups/upvote/comment/${id}/`),
    onSuccess: () => queryClient.invalidateQueries(["comments", numericQuestionId]),
  });

  const renderComment = (comment: Comment, depth = 0) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`ml-${depth * 8} mt-4`}
    >
      <div className="flex gap-3 group">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-600">
              {comment.user.username[0].toUpperCase()}
            </span>
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            {/* Comment Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-900">
                {comment.user.username}
              </span>
              <span className="text-sm text-gray-500">
                {/* <TimeAgo date={comment.created_at} /> */}
                <ReactTimeAgo date={comment.created_at} locale="en-US" />
                
              </span>
            </div>

            {/* Comment Body */}
            {editingId === comment.id ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded-lg"
                rows={3}
              />
            ) : (
              <p className="text-gray-800">{comment.content}</p>
            )}

            {/* Comment Actions */}
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => upvoteComment.mutate(comment.id)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
              >
                <svg
                  className={`w-4 h-4 ${
                    comment.upvotes.includes(user?.id || -1) 
                      ? "text-red-500 fill-current"
                      : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                {comment.upvotes.length}
              </button>

              <button
                onClick={() => {
                  setReplyingTo(comment.id);
                  setEditingId(null);
                }}
                className="text-sm text-gray-500 hover:text-blue-600"
              >
                Reply
              </button>

              {user?.id === comment.user.id && (
                <>
                  <button
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditContent(comment.content);
                    }}
                    className="text-sm text-gray-500 hover:text-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteComment.mutate(comment.id)}
                    className="text-sm text-gray-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <div className="mt-4 pl-4 border-l-2 border-gray-200">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full p-2 border rounded-lg"
                  rows={2}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => createComment.mutate(newComment)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={createComment.isLoading}
                  >
                    {createComment.isLoading ? "Posting..." : "Post Reply"}
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Edit Form */}
            {editingId === comment.id && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => updateComment.mutate({
                    id: comment.id,
                    content: editContent,
                  })}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  disabled={updateComment.isLoading}
                >
                  {updateComment.isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Nested Replies */}
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (!numericQuestionId) return <div>Select a question first</div>;
  if (isLoading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Discussion ({comments?.length || 0})</h2>

      {/* Main Comment Form */}
      <div className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() => createComment.mutate(newComment)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={createComment.isLoading}
          >
            {createComment.isLoading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments?.filter(c => c.parent === null).map(comment => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentsList;