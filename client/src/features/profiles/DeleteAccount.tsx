// features/profiles/DeleteAccount.tsx
import { useState, useCallback } from "react";
import { useAuth } from "../../context/Auth";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import DangerButton from "../../ui/DangerButton";
import InputItem from "../../ui/InputItem";
import Modal from "../../ui/Modal";

const DeleteAccount = () => {
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmationText, setConfirmationText] = useState("");

  const deleteMutation = useMutation({
    mutationFn: async (password: string) => {
      return axiosClient.delete("/auth/delete-account/", {
        data: { password },
      });
    },
    onSuccess: () => {
      toast.success("Account permanently deleted");
      logout();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Deletion failed. Please try again."
      );
    },
  });

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => {
    setShowModal(false);
    setPassword("");
    setConfirmationText("");
  }, []);

  const handleDelete = useCallback(() => {
    if (confirmationText === "DELETE MY ACCOUNT") {
      deleteMutation.mutate(password);
    }
  }, [confirmationText, password, deleteMutation]);

  return (
    <>
      <div className="mt-8 p-6 border border-red-200 bg-red-50 rounded-lg ">
        <h3 className="text-xl font-bold text-red-800 mb-4">
          Dangerous Actions
        </h3>
        <div className="space-y-2 mb-6">
          <p className="text-red-700 font-medium">Permanent Account Deletion</p>
          <p className="text-red-600 text-sm">Deleting your account will:</p>
          <ul className="list-disc list-inside text-red-600 text-sm space-y-1 ">
            <li>Permanently remove all your data</li>
            <li>Delete all your content and history</li>
            <li>Cancel any active subscriptions</li>
            <li>Remove access to all services immediately</li>
          </ul>
        </div>
        <DangerButton onClick={openModal}>
          Delete Account Permanently
        </DangerButton>
      </div>

      <AnimatePresence>
        {showModal && (
          <Modal onClose={closeModal}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-6 rounded-lg max-w-md w-full"
            >
              <h4 className="text-2xl font-bold text-red-700 mb-4">
                Confirm Account Deletion
              </h4>

              <div className="space-y-4">
                <div className="text-red-600 space-y-2">
                  <p className="font-medium">This action will:</p>
                  <ul className="list-disc list-inside pl-4">
                    <li>Permanently remove all your data</li>
                    <li>Delete all associated content</li>
                    <li>Cannot be undone or recovered</li>
                  </ul>
                </div>

                <InputItem
                  name="password"
                  type="password"
                  placeholder="Current Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <InputItem
                  name="confirmation"
                  type="text"
                  placeholder="Type 'DELETE MY ACCOUNT'"
                  required
                  value={confirmationText}
                  onChange={(e) =>
                    setConfirmationText(e.target.value.toUpperCase())
                  }
                />

                <div className="flex gap-4 justify-end mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <DangerButton
                    onClick={handleDelete}
                    disabled={
                      confirmationText !== "DELETE MY ACCOUNT" ||
                      !password ||
                      deleteMutation.isPending
                    }
                    isLoading={deleteMutation.isPending}
                  >
                    Confirm Permanent Deletion
                  </DangerButton>
                </div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeleteAccount;
