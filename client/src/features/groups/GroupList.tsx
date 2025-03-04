// src/features/groups/GroupList.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../utils/axiosClient";
import { useAuth } from "../../context/Auth";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../ui/Loader";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";

import imgLandscape from "../../assets/img/img-landscape.svg";

interface Group {
  id: number;
  name: string;
  description: string;
  creator: { id: number };
  members: Array<{ id: number }>;
  tags: string[];
  created_at: string;
  image?: string | File;
}

const GroupList = ({ onSelect }: { onSelect: (groupId: number) => void }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  TimeAgo.addDefaultLocale(en);

  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups", debouncedSearchTerm],
    // queryFn: () => axiosClient.get("/groups/").then((res) => res.data),
    queryFn: () =>
      axiosClient
        .get("/groups/", {
          params: {
            search: debouncedSearchTerm,
          },
        })
        .then((res) => res.data),
  });

  // Example of updated useMutation syntax
  const joinMutation = useMutation({
    mutationFn: (groupId: number) =>
      axiosClient.post(`/groups/${groupId}/join/`),
    onSuccess(data) {
      toast.success(data.data.status);
      queryClient.invalidateQueries(["groups"]);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const createMutation = useMutation({
    mutationFn: (newGroup: { name: string; description: string }) =>
      axiosClient.post("/groups/", newGroup),
    onSuccess: () => {
      queryClient.invalidateQueries(["groups"]);
      toast.success("Group created successfully!");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to create group");
      console.error("Creation error:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: {
      id: number;
      name: string;
      description: string;
      // tags: string[];
    }) =>
      // mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      axiosClient.patch(`/groups/${updatedData.id}/`, {
        name: updatedData.name,
        description: updatedData.description,
        // tags: updatedData.tags,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries(["groups"]); // Uncomment this
      toast.success("Group updated successfully!");
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update group");
      console.error("Update error:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (groupId: number) => axiosClient.delete(`/groups/${groupId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(["groups"]); // Uncomment this
      toast.success("Group deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete group");
      console.error("Delete error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const groupData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      // tags: formData.get("tags") as string[] ,
    };

    if (selectedGroup) {
      updateMutation.mutate({
        id: selectedGroup.id,
        name: groupData.name,
        description: groupData.description,
        // tags : groupData.tags
      });
    } else {
      createMutation.mutate(groupData);
    }
  };

  ////////////////////////////////
  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files?.[0]) {
  //     const file = e.target.files[0];
  //     if (!file.type.startsWith("image/")) {
  //       toast.error("Please upload an image file");
  //       return;
  //     }
  //     setSelectedImage(file);
  //   }
  // };

  // const getImageUrl = (image: unknown) => {
  //   if (typeof image === "string") return image;
  //   if (image instanceof File) return URL.createObjectURL(image);
  //   return "https://fotospark.net/wp-content/plugins/photonic/include/images/placeholder-Sm.png";
  // };

  ///////////////////
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  console.log(groups);
  console.log(user);

  return (
    <>
      {isLoading ? (
        <div className="h-screen">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center py-8 gap-8">
            <div className="flex gap-8  ">
              <div className="relative">
                <details className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600">
                    <span className="text-sm font-medium"> Filter </span>

                    <span className="transition group-open:-rotate-180">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </span>
                  </summary>

                  <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
                    <div className="w-96 rounded-sm border border-gray-200 bg-white">
                      <header className="flex items-center justify-between p-4">
                        <span className="text-sm text-gray-700">
                          {" "}
                          0 Selected{" "}
                        </span>

                        <button
                          type="button"
                          className="text-sm text-gray-900 underline underline-offset-4"
                        >
                          Reset
                        </button>
                      </header>

                      {/* <ul className="space-y-1 border-t border-gray-200 p-4">


                        <li>
                          <label
                            htmlFor="FilterOutOfStock"
                            className="inline-flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              id="FilterOutOfStock"
                              className="size-5 rounded-sm border-gray-300"
                            />

                            <span className="text-sm font-medium text-gray-700">
                              {" "}
                              Out of Stock (10+){" "}
                            </span>
                          </label>
                        </li>
                      </ul> */}
                      <div className="border-t border-gray-200 p-4">
                        <div className="flex justify-between gap-4">
                          members
                          <label
                            htmlFor="FilterPriceFrom"
                            className="flex items-center gap-2"
                          >
                            <span className="text-sm text-gray-600"></span>

                            <input
                              type="number"
                              id="FilterPriceFrom"
                              placeholder="From"
                              className="w-full rounded-md border-gray-200 shadow-xs sm:text-sm"
                            />
                          </label>
                          <label
                            htmlFor="FilterPriceTo"
                            className="flex items-center gap-2"
                          >
                            <span className="text-sm text-gray-600"></span>

                            <input
                              type="number"
                              id="FilterPriceTo"
                              placeholder="To"
                              className="w-full rounded-md border-gray-200 shadow-xs sm:text-sm"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>
            <div className=" md:w-auto">
              <input
                type="search"
                placeholder="Search ..."
                className=" px-4 py-2 rounded-lg border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                setSelectedGroup(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create New Group
            </button>
          </div>

          {!isLoading && groups.length === 0 && (
            <div className="col-span-full py-12 text-center h-screen">
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
                    <>No groups found for "{debouncedSearchTerm}"</>
                  ) : (
                    <>No groups yet</>
                  )}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {debouncedSearchTerm
                    ? "Try adjusting your search or filters"
                    : "Get started by creating a new group"}
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
                    Create Group
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isLoading && groups.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 ">
                {groups?.map((group) => (
                  <div className="" key={group.id}>
                    <article className="overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg">
                      <img
                        alt={group.name}
                        // src={
                        //   group.image ||
                        //   {imgLandscape}
                        // }
                        src={imgLandscape}
                        // src={getImageUrl(group.image)}

                        className="h-56 w-full "
                      />
                      <div className="bg-white p-4 sm:p-6">
                        <Link to={`/groups/${group.id}`}>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">
                              {/* {new Date(group.created_at).toLocaleDateString("ar-EG")} */}
                              <ReactTimeAgo
                                date={group.created_at}
                                locale="en-US"
                              />
                            </span>
                            <span className="text-gray-500">
                              {group.members.length} members
                            </span>
                          </div>

                          <h3
                            className="mt-0.5 text-lg text-gray-900"
                            onClick={() => onSelect(group.id)}
                          >
                            {group.name}
                          </h3>

                          <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
                            {group.description}
                          </p>
                        </Link>

                        {group.tags.length > 0 && (
                          <div className="flex gap-2">
                            {group.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-gray-100 px-2 py-1 rounded text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-2 flex justify-between items-center">
                          <button
                            onClick={() => joinMutation.mutate(group.id)}
                            className={`px-4 py-2 rounded-lg ${
                              group.members.some((m) => m.id === user?.id)
                                ? "bg-gray-200 text-gray-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {group.members.some((m) => m.id === user?.id)
                              ? "Joined"
                              : "Join"}
                          </button>

                          {user?.id === group.creator.id && (
                            <div className="flex gap-2">
                              {/* delet and update btn  */}
                              <button
                                onClick={() => {
                                  setSelectedGroup(group);
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
                                    deleteMutation.mutate(group.id);
                                  }
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-red-600 transition-colors"
                                title="Archive"
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
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
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
              {selectedGroup ? "Edit Group" : "Create New Group"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Group Name
                  </label>
                  <input
                    name="name"
                    defaultValue={selectedGroup?.name || ""}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={selectedGroup?.description || ""}
                    className="w-full px-4 py-2 border rounded-lg h-32"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    tags Name
                  </label>
                  <input
                    name="tags"
                    defaultValue={selectedGroup?.tags || ""}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Group Image
                    </label>
                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      // onChange={handleImageChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
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
                      createMutation.isLoading || updateMutation.isLoading
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {selectedGroup ? "Save Changes" : "Create Group"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default GroupList;
