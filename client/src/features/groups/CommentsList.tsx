// src/features/comments/CommentsList.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../services/axiosClient";
import { useAuth } from "../../context/Auth";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useState } from "react";
import Loader from "../../ui/Loader";
import { useParams } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import "../../utils/timeAgoConfig";
import verify from "../../assets/img/Verified_Badge.svg";
// import { q } from "motion/react-client";

interface Comment {
  id: number;
  content: string;
  question: number;
  user: {
    id: number;
    username: string;
    avatar?: string;
    type?: string;
    verify_Doctor?: boolean;
  };
  created_at: string;
  updated_at: string;
  upvotes: number[];
  replies: Comment[];
  parent: number | null;
  is_edited: boolean;
}

interface Question {
  id: number;
  title: string;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
  };
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

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", numericQuestionId],
    queryFn: () =>
      axiosClient
        .get(`groups/questions/${numericQuestionId}/comments/`)
        .then((res) => res.data),
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
      queryClient.invalidateQueries({queryKey : ["comments", numericQuestionId]});
      setNewComment("");
      setReplyingTo(null);
    },
    onError: () => toast.error("Failed to post comment"),
  });

  const updateComment = useMutation({
    mutationFn: (data: { id: number; content: string }) =>
      axiosClient.patch(`groups/comments/${data.id}/`, {
        content: data.content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey :["comments", numericQuestionId]});
      setEditingId(null);
      toast.success("Comment update");
    },
    onError: () => toast.error("Failed to update comment"),
  });

  const deleteComment = useMutation({
    mutationFn: (id: number) => axiosClient.delete(`groups/comments/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ["comments", numericQuestionId]});
      toast.success("Comment deleted");
    },
    onError: () => toast.error("Failed to delete comment"),
  });

  const upvoteComment = useMutation({
    mutationFn: (id: number) =>
      axiosClient.post(`/groups/upvote/comment/${id}/`),
    onSuccess: () =>
      queryClient.invalidateQueries({queryKey : ["comments", numericQuestionId]}),
  });

  const renderComment = (comment: Comment, depth = 0) => {
    const isOwner = user?.id === comment.user.id;
    const isEditingCurrent = editingId === comment.id;

    console.log(comments);

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`ml-${depth * 8} mt-4`}
        style={{ marginLeft: `${depth * 2}rem` }} // Fallback for dynamic spacing
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
                  <ReactTimeAgo date={new Date(comment.created_at)} locale="en-US" />
                </span>
                {/* {comment.is_edited && (
                  <span className="text-xs italic text-gray-500">(edited)</span>
                )} */}
                {new Date(comment?.updated_at).getTime() >
                  new Date(comment?.created_at).getTime() && (
                  <span className="text-xs text-gray-500 ml-2 italic">
                    (edited at{" "}
                    {<ReactTimeAgo date={new Date(comment.updated_at)} locale="en-US" />})
                  </span>
                )}

                {comment.user?.type === "doctor" && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Doctor
                  </span>
                )}
                {comment.user?.verify_Doctor && (
                  <span className="  py-0.5 ">
                    
                    <img src={verify} alt="verify" width={20}  />
                  </span>
                )}
              </div>

              {/* Comment Body */}
              {isEditingCurrent ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  rows={3}
                  autoFocus
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

                {isOwner && (
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
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this comment?"
                          )
                        ) {
                          deleteComment.mutate(comment.id);
                        }
                      }}
                      className="text-sm text-gray-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              {/* Edit/Save Controls */}
              {isEditingCurrent && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateComment.mutate({
                        id: comment.id,
                        content: editContent,
                      })
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    disabled={updateComment.isPending }
                  >
                    {updateComment.isPending  ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full p-2 border rounded-lg"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => createComment.mutate(newComment)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      disabled={createComment.isPending }
                    >
                      {createComment.isPending  ? "Posting..." : "Post Reply"}
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

              {/* Nested Replies */}
              <div className="mt-2 space-y-4">
                {comment.replies.map((reply) =>
                  renderComment(reply, depth + 1)
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const {
    data: question,
    // isLoading: isQuestionLoading,
    // isError: isQuestionError
  } = useQuery<Question>({
    queryKey: ["question", numericQuestionId],
    queryFn: () =>
      axiosClient
        .get(`groups/questions/${numericQuestionId}/`)
        .then((res) => res.data),
    enabled: !!numericQuestionId,
  });

  if (!numericQuestionId) return <div>Select a question first</div>;
  if (isLoading) return <Loader />;

  return (
    <>
      <div className="max-w-3xl mx-auto py-8">
        {question && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Asked by {question.user.username}</span>
              <span>•</span>
              <ReactTimeAgo date={new Date(question.created_at)} locale="en-US" />
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">
          Discussion ({comments?.length || 0})
        </h2>

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
              disabled={createComment.isPending }
            >
              {createComment.isPending  ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments
            ?.filter((c) => c.parent === null)
            .map((comment) => renderComment(comment))}
        </div>
      </div>
    </>
  );
};

export default CommentsList;
