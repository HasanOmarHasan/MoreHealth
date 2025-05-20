
// features/auth/ResetPassword.tsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosClient from "../../services/axiosClient";
import { toast } from "react-toastify";
import InputItem from "../../ui/InputItem";
import Button from "../../ui/Button";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");

  const [new_password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Token verification
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Changed to GET request for token validation
          await axiosClient.get(`/auth/reset-password/?token=${token}`);
          setIsTokenValid(true);
        } catch (error) {
          setIsTokenValid(false);
          toast.error("Invalid or expired reset token");
        }
      }
    };
    verifyToken();
  }, [token]);

  // Send reset email mutation
  const sendEmailMutation = useMutation({
    mutationFn: (email: string) =>
      axiosClient.post("/auth/forgot-password/", { email }),
    onSuccess: () => {
      setIsEmailSent(true);
      toast.success("Reset instructions sent to your email");
    },
    onError: () => {
      // Generic success message even if email doesn't exist
      setIsEmailSent(true);
    },
  });

  console.log(token, new_password, {
    token,
    new_password,
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: ({
      token,
      new_password,
    }: {
      token: string;
      new_password: string;
    }) =>
      axiosClient.post("/auth/reset-password/", {
        token,
        new_password,
      }),
    onSuccess: (e) => {
      console.log(e.data.message || "Password reset successful");
      toast.success(e.data.message);
      navigate("/login");
    },
    onError: (error: any) => {
   
      const errorMessages = error.response?.data?.message;
      if (Array.isArray(errorMessages)) {
        const formattedError = errorMessages.join(" ");
        console.log(formattedError);
        toast.error(formattedError);
      } else {
        toast.error(error.response?.data?.message || "Password reset failed");
      }
    },
  });

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    sendEmailMutation.mutate(email);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }
    if (new_password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    // console.log(token, password)
    resetPasswordMutation.mutate({ token, new_password });
  };

  console.log(token);
  if (token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        {isTokenValid ? (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <InputItem
              name="new_password"
              type="password"
              placeholder="New Password"
              required
              value={new_password}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <InputItem
              name="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              btnType="submit"
              content={
                resetPasswordMutation.isPending
                  ? "Resetting..."
                  : "Reset Password"
              }
              disabled={
                resetPasswordMutation.isPending ||
                !new_password ||
                new_password !== confirmPassword
              }
              width="w-full"
            />
          </form>
        ) : (
          <p className="text-red-500 text-center">Invalid reset link</p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      
      // className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
      className="mx-auto max-w-md p-6 bg-white rounded-lg shadow-md  sm:px-6 lg:px-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEmailSent ? "Check Your Email" : "Reset Password"}
      </h2>

      {!isEmailSent ? (
        <form onSubmit={handleSendEmail} className="space-y-4">
          <InputItem
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            btnType="submit"
            content={
              sendEmailMutation.isPending ? "Sending..." : "Send Reset Link"
            }
            disabled={sendEmailMutation.isPending}
            width="w-full"
          />
        </form>
      ) : (
        <div className="text-center space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600">
            If an account exists for {email}, we've sent instructions to reset
            your password.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ResetPassword;
