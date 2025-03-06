// src/features/questions/QuestionList.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient, { addFriend, startChat } from "../../utils/axiosClient";
import { useAuth } from "../../context/Auth";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../ui/Loader";

import ReactTimeAgo from "react-time-ago";

import  '../../utils/timeAgoConfig';


interface Question {
  id?: number;
  title: string;
  content: string;
  creator?: { id: number };
  upvotes: number;
  created_at: string;
  tags: string[];
  group: number;
}

const QuestionList = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions", groupId, debouncedSearchTerm],
    queryFn: () =>
      axiosClient
        .get(`/groups/${groupId}/questions/`, {
          params: { search: debouncedSearchTerm },
        })
        .then((res) => res.data),
    enabled: !!groupId,
  });

  const HeartIcon = ({ filled }: { filled: boolean }) => (
    <motion.svg
      className={`w-6 h-6 ${filled ? "text-red-500" : "text-gray-400"}`}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      initial={false}
      animate={{ scale: filled ? 1.2 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <svg
        className={`w-6 h-6 ${
          filled ? "text-red-500" : "text-gray-400"
        } transition-colors`}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </motion.svg>
  );

  const createMutation = useMutation({
    mutationFn: (newQuestion: { title: string; content: string }) =>
      axiosClient.post(`/groups/${groupId}/questions/`, newQuestion),
    onSuccess: () => {
      queryClient.invalidateQueries(["questions", groupId]);
      toast.success("Question created successfully!");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to create question");
      console.error("Creation error:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: { id: number; title: string; content: string }) =>
      axiosClient.patch(`/groups/questions/${updatedData.id}/`, {
        title: updatedData.title,
        content: updatedData.content,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["questions", groupId]);
      toast.success("Question updated successfully!");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update question");
      console.error("Update error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (questionId: number) =>
      axiosClient.delete(`/groups/questions/${questionId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(["questions", groupId]);
      toast.success("Question deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete question");
      console.error("Delete error:", error);
    },
  });

  // groups/upvote/comment/10/
  // const upvoteMutation = useMutation({
  //   mutationFn: (questionId: number) =>
  //     axiosClient.post(`/groups/upvote/question/${questionId}/`),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["questions", groupId]);
  //   },
  // });
  const upvoteMutation = useMutation({
    mutationFn: (questionId: number) =>
      axiosClient.post(`/groups/upvote/question/${questionId}/`),
    onMutate: async (questionId) => {
      await queryClient.cancelQueries(["questions", groupId]);

      const previousQuestions = queryClient.getQueryData<Question[]>([
        "questions",
        groupId,
      ]);

      queryClient.setQueryData<Question[]>(["questions", groupId], (old) =>
        old?.map((question) =>
          question.id === questionId
            ? {
                ...question,
                has_upvoted: !question.has_upvoted,
                upvotes: question.has_upvoted
                  ? question.upvotes.filter((id) => id !== user?.id)
                  : ([...question.upvotes, user?.id].filter(
                      Boolean
                    ) as number[]),
              }
            : question
        )
      );

      return { previousQuestions };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["questions", groupId],
        context?.previousQuestions
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["questions", groupId]);
    },
  });

  // Add Friend Mutation
  const addFriendMutation = useMutation({
    mutationFn: (userId: number) => addFriend(userId),
    onSuccess: (data) => {
      // console.log(data)
      
      toast.success(`Friend request sent successfully! the state is ${data.data.status}`);
    },

    onError: (error) => {
      console.log(error)
      // toast.error("Failed to send friend request");
      toast.error(error.response?.data?.detail);
    
    },
  });

  // Start Chat Mutation
  const startChatMutation = useMutation({
    mutationFn: (userId: number) => startChat(userId),
    onSuccess: (data) => {
      
      navigate(`/profile/Messages/${data.data.room_id}`);
      toast.success("Chat started successfully!");
      console.log(data)
      // toast.success(data.data);
    },
  
    onError: (error) => {
      console.log(error)
      toast.error("Failed to start chat");
    },
  });

  const handleUpvote = (questionId: number) => {
    upvoteMutation.mutate(questionId);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const questionData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    };

    if (selectedQuestion) {
      updateMutation.mutate({ ...selectedQuestion, ...questionData });
    } else {
      createMutation.mutate(questionData);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  if (!groupId) return <div>No group selected</div>;

  console.log(questions);
  // console.log(questions[0]?.members);

  //   let members = [];
  //   questions.length !== 0 && members = questions[0]?.members

  //  console.log(members)

  return (
    <>
      {isLoading ? (
        <div className="h-screen">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center py-8 gap-8">
            <div className="md:w-auto">
              <input
                type="search"
                placeholder="Search questions..."
                // className="px-4 py-2 rounded-lg border"
                className="sm:max-w-xs px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setSelectedQuestion(null);
                setIsModalOpen(true);
              }}
              className="sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Ask Question
            </button>
          </div>
          {/* empity  statement */}
          {/* {questions?.length === 0 && <p className="text-gray-600 font-bold"> No questions yet start add one  </p>} */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2">
              {!isLoading && questions.length === 0 && (
  <div className="col-span-full py-12 text-center">
    <div className="max-w-md mx-auto">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
      
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        {debouncedSearchTerm ? (
          <>No questions found for "{debouncedSearchTerm}"</>
        ) : (
          <>No questions yet</>
        )}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {debouncedSearchTerm
          ? "Try adjusting your search "
          : "Get started by creating a new question"}
      </p>
      <div className="mt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create question
        </button>
      </div>
    </div>
  </div>
)}
              <div className="space-y-6 h-screen">
                {questions?.map((question) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between">
                      <button
                        onClick={() => handleUpvote(question.id)}
                        className="flex flex-col items-center mr-4 group relative"
                        disabled={upvoteMutation.isLoading}
                      >
                        <HeartIcon filled={question.has_upvoted} />
                        <span
                          className={`text-sm mt-1 ${
                            question.has_upveted
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {question.upvotes.length}
                        </span>
                      </button>

                      {/* Question Content */}
                      <div className="flex-1">
                        <Link
                          to={`/groups/${groupId}/questions/${question.id}`}
                          className="block"
                        >
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {question.title}
                          </h3>
                          <p className="mt-2 text-gray-600 line-clamp-3">
                            {question.content}
                          </p>
                        </Link>

                        <div className="mt-4 flex items-center text-sm text-gray-500">
                          <span className="mr-4">
                            Asked{" "}
                            {/* {new Date(question.created_at).toLocaleDateString(
                        "ar-eg"
                      )} */}
                            <ReactTimeAgo
                              date={question.created_at}
                              locale="en-US"
                            />
                          </span>
                          {question.user?.id === user?.id && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                              Your question
                            </span>
                          )}
                          <span>@{question?.user?.username} </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {question.user?.id === user?.id && (
                        <div className="flex flex-col items-center ml-4 space-y-2">
                          <button
                            onClick={() => {
                              setSelectedQuestion(question);
                              setIsModalOpen(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-blue-600 transition-colors"
                            title="Edit"
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
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this question?"
                                )
                              ) {
                                deleteMutation.mutate(question.id);
                              }
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-red-600 transition-colors"
                            title="Delete"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Create/Edit Modal */}
              {isModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                  onClick={() => setIsModalOpen(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-xl p-6 w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-2xl font-bold mb-4">
                      {selectedQuestion ? "Edit Question" : "Ask New Question"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Title
                          </label>
                          <input
                            name="title"
                            defaultValue={selectedQuestion?.title || ""}
                            className="w-full px-4 py-2 border rounded-lg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Content
                          </label>
                          <textarea
                            name="content"
                            defaultValue={selectedQuestion?.content || ""}
                            className="w-full px-4 py-2 border rounded-lg h-32"
                            required
                          />
                        </div>
                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={
                              createMutation.isLoading ||
                              updateMutation.isLoading
                            }
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                          >
                            {selectedQuestion
                              ? "Save Changes"
                              : "Post Question"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </div>

            <div className="rounded-lg bg-gray-200 text-center px-4">
              <h2 className="text-xl font-bold my-4 text-gray-800">
                Group Members
              </h2>
              <div className="space-y-4">
                {questions[0]?.members?.map((member) => (
                  <div
                    key={member.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          {member.username}
                          {member.type === "doctor" && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Verified Doctor
                            </span>
                          )}
                        </h3>
                        {member.specialization && (
                          <p className="text-sm text-gray-600 mt-1 text-start ">
                            ( {member.specialization} )
                          </p>
                        )}
                      </div>

                      {(member.id !== user?.id && member.type === "doctor")
                      // {( member.type === "doctor")
                        && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => addFriendMutation.mutate(member.id)}
                            disabled={addFriendMutation.isLoading}
                            className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 text-green-700"
                            data-tooltip="Add Friend"
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
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() => startChatMutation.mutate(member.id)}
                            disabled={startChatMutation.isLoading}
                            className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 "
                            data-tooltip="Start Chat"
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
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default QuestionList;
