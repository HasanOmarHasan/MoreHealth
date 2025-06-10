// Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import Button from "../../ui/Button";
import InputItem from "../../ui/InputItem";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Auth";

const Login = () => {
  const navigate = useNavigate();
  const { initializeAuth } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case "email":
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          newErrors.email = "Invalid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        } else {
          delete newErrors.password;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosClient.post("/auth/login", formData);

      localStorage.setItem("authToken", response.data.access);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // setTkn(response.data.Token)
      initializeAuth();
      
      // console.log(response.data.Token);
      // console.log(response, "response");
      if (response.status >= 200 && response.status < 300) {
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Login failed Error message:", error.message);
      } else {
        console.error("Unknown error:", error);
      }
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h2 className="text-center text-2xl font-bold text-blue-600 sm:text-3xl">
          Get started today
        </h2>

        <p className="mx-auto mt-4 max-w-md text-center text-gray-500"></p>
        {/* ... existing layout ... */}

        <form
          onSubmit={handleSubmit}
          className="mt-6 mb-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
        >
          <p className="text-center text-lg font-medium">
            Sign in to your account
          </p>
          <InputItem
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              validateField("email", e.target.value);
            }}
            error={errors.email}
            required
          />
          <InputItem
            name="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              validateField("password", e.target.value);
            }}
            error={errors.password}
            required
          />

          {/* Password input similarly */}

          <Button
            btnType="submit"
            disabled={
              !formData.email ||
              !formData.password ||
              Object.keys(errors).length > 0
            }
            width="w-full"
            isLoading={isSubmitting}
            content="Log in"
          ></Button>
          <div className="flex justify-between">
            <p className=" text-sm text-gray-500">
              No account?
              <Link className="underline" to="/signup/patient">
                Sign up
              </Link>
            </p>
            <p className=" text-sm text-gray-500">
              Forget password?
              <Link className="underline" to="/reset-password">
                Reset password
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
