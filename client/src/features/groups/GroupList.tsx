// src/features/groups/GroupList.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../utils/axiosClient";
import { useAuth } from "../../context/Auth";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../../ui/Loader";

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ReactTimeAgo from "react-time-ago";


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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  TimeAgo.addDefaultLocale(en)

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setSelectedImage(file);
    }
  };

  const getImageUrl = (image: unknown) => {
    if (typeof image === "string") return image;
    if (image instanceof File) return URL.createObjectURL(image);
    return "https://fotospark.net/wp-content/plugins/photonic/include/images/placeholder-Sm.png";
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  console.log(groups);
  
  return (
    <>
      
      {isLoading && (
        <div className="h-screen">
          <Loader />
        </div>
      )}

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
                    <span className="text-sm text-gray-700"> 0 Selected </span>

                    <button
                      type="button"
                      className="text-sm text-gray-900 underline underline-offset-4"
                    >
                      Reset
                    </button>
                  </header>

                  <ul className="space-y-1 border-t border-gray-200 p-4">
                    <li>
                      <label
                        htmlFor="FilterInStock"
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id="FilterInStock"
                          className="size-5 rounded-sm border-gray-300"
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {" "}
                          In Stock (5+){" "}
                        </span>
                      </label>
                    </li>

                    <li>
                      <label
                        htmlFor="FilterPreOrder"
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id="FilterPreOrder"
                          className="size-5 rounded-sm border-gray-300"
                        />

                        <span className="text-sm font-medium text-gray-700">
                          {" "}
                          Pre Order (3+){" "}
                        </span>
                      </label>
                    </li>

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
                  </ul>
                  <div className="border-t border-gray-200 p-4">
                    <div className="flex justify-between gap-4">
                      <label
                        htmlFor="FilterPriceFrom"
                        className="flex items-center gap-2"
                      >
                        <span className="text-sm text-gray-600">$</span>

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
                        <span className="text-sm text-gray-600">$</span>

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8 ">
        {groups?.map((group) => (
          <div className="" key={group.id}>
            <article className="overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg">
              <img
                alt={group.name}
                // src={
                //   group.image ||
                //   "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                // }

                src={getImageUrl(group.image)}
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://fotospark.net/wp-content/plugins/photonic/include/images/placeholder-Sm.png")
                }
                className="h-56 w-full object-cover"
              />
              <div className="bg-white p-4 sm:p-6">
                <Link to={`/groups/${group.id}`}>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {/* {new Date(group.created_at).toLocaleDateString("ar-EG")} */}
                      <ReactTimeAgo date={group.created_at} locale="en-US" />

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
                      <button
                        onClick={() => {
                          setSelectedGroup(group);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this group?"
                            )
                          ) {
                            deleteMutation.mutate(group.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 cursor-pointer "
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </div>
        ))}

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
                        onChange={handleImageChange}
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
      </div>
    </>
  );
};

export default GroupList;
