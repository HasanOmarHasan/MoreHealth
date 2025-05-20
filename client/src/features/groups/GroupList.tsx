import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "../../services/axiosClient";
import { useAuth } from "../../context/Auth";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Loader from "../../ui/Loader";

import ReactTimeAgo from "react-time-ago";

import "../../utils/timeAgoConfig";

// import imgLandscape from "../../assets/img/img-landscape.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [filters, setFilters] = useState({
    search: "",
    createdAfter: null as Date | null,
    createdBefore: null as Date | null,
    minMembers: "",
    creator: "",
    member: "",
    myGroups: false,
    name: "",
    nameContains: "",
    ordering: "-members_count",
  });

  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups", filters],
    // queryFn: () => axiosClient.get("/groups/").then((res) => res.data),

    queryFn: () => {
      const params = new URLSearchParams();

      // Build query parameters
      if (filters.search) params.append("search", filters.search);
      if (filters.createdAfter)
        params.append(
          "created_after",
          filters.createdAfter.toISOString().split("T")[0]
        );
      if (filters.createdBefore)
        params.append(
          "created_before",
          filters.createdBefore.toISOString().split("T")[0]
        );
      if (filters.minMembers) params.append("min_members", filters.minMembers); // done
      if (filters.creator) params.append("creator", filters.creator); //
      if (filters.member) params.append("member", filters.member); //
      if (filters.name) params.append("name", filters.name); //
      if (filters.myGroups) params.append("my_groups", "true");
      if (filters.nameContains)
        params.append("name__icontains", filters.nameContains);
      if (filters.ordering) params.append("ordering", filters.ordering);

      return axiosClient.get("/groups/", { params }).then((res) => res.data);
    },
    keepPreviousData: true,
  });
  const handleFilterChange = (field: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

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
      image: string;
      // tags: string[];
    }) =>
     
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
      image: formData.get("image") as string,
      // tags: formData.get("tags") as string[] ,
    };

    if (selectedGroup) {
      updateMutation.mutate({
        id: selectedGroup.id,
        name: groupData.name,
        description: groupData.description,
        image: groupData.image,
        // tags : groupData.tags
      });
    } else {
      createMutation.mutate(groupData);
    }
  };

  ////////////////////////////////
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  console.log(groups);
  // console.log(user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        summaryRef.current &&
        !summaryRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="h-screen">
          <Loader />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
            <div className="flex gap-8">
              <div className="relative" ref={filterRef}>
                <details
                  className="group [&_summary::-webkit-details-marker]:hidden "
                  open={isFilterOpen}
                >
                  <summary
                    className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
                    ref={summaryRef}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsFilterOpen(!isFilterOpen);
                    }}
                  >
                    <span className="text-sm font-medium">Filter & Sort</span>
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
                          {`${[
                            filters.createdAfter ? 1 : 0,
                            filters.createdBefore ? 1 : 0,
                            filters.myGroups ? 1 : 0,
                            filters.nameContains ? 1 : 0,
                            filters.minMembers ? 1 : 0,
                            filters.ordering !== "-members_count" ? 1 : 0,
                          ].reduce((a, b) => a + b)} Selected`}
                        </span>
                        <button
                          type="button"
                          className="text-sm text-gray-900 underline underline-offset-4"
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              createdAfter: null,
                              createdBefore: null,
                              myGroups: false,
                              nameContains: "",
                              minMembers: "",
                              ordering: "-members_count",
                            }))
                          }
                        >
                          Reset
                        </button>
                      </header>

                      <div className="border-t border-gray-200 p-4 space-y-4">
                        {/* Date Range */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Date Range
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <DatePicker
                              selected={filters.createdAfter}
                              onChange={(date) =>
                                handleFilterChange("createdAfter", date)
                              }
                              placeholderText="Start date"
                              className="w-full p-2 border rounded-md text-sm"
                            />
                            <DatePicker
                              selected={filters.createdBefore}
                              onChange={(date) =>
                                handleFilterChange("createdBefore", date)
                              }
                              placeholderText="End date"
                              className="w-full p-2 border rounded-md text-sm"
                            />
                          </div>
                        </div>

                        {/* Name Contains */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Group Name Contains
                          </label>
                          <input
                            type="text"
                            value={filters.nameContains}
                            onChange={(e) =>
                              handleFilterChange("nameContains", e.target.value)
                            }
                            className="w-full p-2 border rounded-md text-sm"
                            placeholder="Search group names..."
                          />
                        </div>

                        {/* My Groups */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filters.myGroups}
                            onChange={(e) =>
                              handleFilterChange("myGroups", e.target.checked)
                            }
                            className="h-4 w-4"
                          />
                          <label className="text-sm">Show Only My Groups</label>
                        </div>

                        {/* Sorting */}
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Sort By
                          </label>
                          <select
                            value={filters.ordering}
                            onChange={(e) =>
                              handleFilterChange("ordering", e.target.value)
                            }
                            className="w-full p-2 border rounded-md text-sm"
                          >
                            <option value="-members_count">Most Members</option>
                            <option value="-created_at">Newest First</option>
                            <option value="created_at">Oldest First</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="-name">Name (Z-A)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            {/* Search Input */}
            <div>
              <input
                type="search"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Search 🔎... Creator usernames,Group names,Desc, etc."
              />
            </div>

            {/* create new  */}
            <button
              onClick={() => {
                setSelectedGroup(null);
                setIsModalOpen(true);
              }}
              className="sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2  m-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Group
            </button>
          </div>

          {!isLoading && groups?.length === 0 && (
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
              <div
                className={`space-y-6   ${groups?.length <= 4 && "h-screen"}`}
              >
                <div
                  className={` gap-4  grid  grid-cols-1 lg:grid-cols-3 lg:gap-8 md:grid-cols-2`}
                >
                  {groups?.map((group) => (
                    <div key={group.id}>
                      <article className="overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg">
                        {/* <img
                        alt={group.name}
                        src={
                          group.image ||
                          imgLandscape
                        }
                        // src={`${group.image === null ? imgLandscape : group.image}`}
                        // src={getImageUrl(group.image)}

                        className="h-56 w-full "
                      /> */}
                        <div className="bg-white p-4 sm:p-6">
                          <Link to={`/groups/${group.id}`}>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500">
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
                              {new Date(group?.updated_at).getTime() >
                                new Date(group?.created_at).getTime() && (
                                <span className="text-xs text-gray-500 ml-2 italic">
                                  (edited at{" "}
                                  {
                                    <ReactTimeAgo
                                      date={group.updated_at}
                                      locale="en-US"
                                    />
                                  }
                                  )
                                </span>
                              )}
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
                            <div className="">
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
                            </div>

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
