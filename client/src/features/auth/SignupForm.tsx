// Signup.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import InputItem from "../../ui/InputItem";
import { toast } from "react-toastify";
import axiosClient from "../../services/axiosClient";
import { useAuth } from "../../context/Auth";
import axios from "axios";

interface SignupProps {
  userType: "patient" | "doctor";
  endpoint: string;
}
interface BackendErrorResponse {
  message?: string;
  errors?: Record<string, string>;
  error?: string;
}

const Signup = ({ userType, endpoint }: SignupProps) => {
  const navigate = useNavigate();
  const { initializeAuth } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    region: "",
    age: "",
    gender: "male",
    medical_insurance: false,
    specialization: "",
    practice_permit: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
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
      case "password": {
        const requirements = [];
        if (value.length < 8) requirements.push("8+ characters");
        if (!/[a-z]/.test(value)) requirements.push("lowercase letter");
        if (!/[A-Z]/.test(value)) requirements.push("uppercase letter");
        if (!/[0-9]/.test(value)) requirements.push("number");
        if (!/[!@#$%^&*]/.test(value)) requirements.push("special character");

        if (requirements.length > 0) {
          newErrors.password = `Needs: ${requirements.join(", ")}`;
        } else {
          delete newErrors.password;
        }
        break;
      }
      // if (
      //   !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
      //     value
      //   )
      // ) {
      //   newErrors.password =
      //     "Minimum 8 chars with letter, number & special char";
      // } else {
      //   delete newErrors.password;
      // }
      // break;
      case "phone":
        if (!/^(\+20)?(010|011|012|015)\d{8}$/.test(value)) {
          newErrors.phone = "Invalid Egyptian phone number";
        } else {
          delete newErrors.phone;
        }
        break;
      case "age":
        if (Number(value) < 18) {
          newErrors.age = "Must be at least 18 years old";
        } else {
          delete newErrors.age;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      city: formData.city,
      region: formData.region,
      age: Number(formData.age), // Ensure conversion to number
      gender: formData.gender,
      medical_insurance: formData.medical_insurance,
    };
    try {
      const payload =
        userType === "doctor"
          ? {
              user: user,
              specialization: formData.specialization,
              practice_permit: formData.practice_permit,
            }
          : { ...formData };
      console.log(payload, " payload ");
      const response = await axiosClient.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response);
      if (response.status >= 200 && response.status < 300) {
        toast.success("Signup successful! Please login.");
        if (userType === "doctor") {
          navigate("/login");
        } else {
          localStorage.setItem("authToken", response.data.access);
          localStorage.setItem("user", JSON.stringify(response.data.user));

          initializeAuth();
          navigate("/");
        }

        // return userType === "doctor" ?  redirect("/login") : navigate("/");
      }
      // } catch (error: unknown) {
      //   const errorMessage =
      //     error instanceof Error
      //       ? error.message
      //       : "Signup failed. Please check your inputs.";
      //   console.log(error, "all error");
      //   console.log(errorMessage, "error massage ");

      //   toast.error("Signup failed. Please check your inputs.");
      // } finally {
      //   setIsSubmitting(false);
      // }
    } catch (error: unknown) {
      let errorMessage = "Signup failed. Please check your inputs.";
      const fieldErrors: Record<string, string> = {};

      if (axios.isAxiosError<BackendErrorResponse>(error)) {
        const serverError = error;

        // Log detailed error for debugging
        console.error("Signup Error:", {
          status: serverError.response?.status,
          data: serverError.response?.data,
          config: serverError.config,
        });

        // Handle different error response formats
        if (serverError.response?.data?.errors) {
          // Field-specific errors
          Object.entries(serverError.response.data.errors).forEach(
            ([field, message]) => {
              fieldErrors[field] = message;
            }
          );
          setErrors(fieldErrors);
        } else if (serverError.response?.data?.message) {
          // General error message
          errorMessage = serverError.response.data.message;
        } else if (serverError.response?.data?.error) {
          // Alternative error field
          errorMessage = serverError.response.data.error;
        }

        // Handle specific HTTP status codes
        switch (serverError.response?.status) {
          case 400:
            errorMessage = "Invalid request data";
            break;
          case 409:
            errorMessage = "User already exists";
            break;
          case 422:
            errorMessage = "Validation failed";
            break;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Only show toast if there are no field-specific errors
      if (Object.keys(fieldErrors).length === 0) {
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredFields = ["username", "email", "password", "phone", "age"];
  const isValid =
    requiredFields.every((field) => formData[field as keyof typeof formData]) &&
    Object.keys(errors).length === 0;

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-12 lg:px-16 lg:py-12 xl:col-span-12">
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl text-center ">
              Sign up as a {userType}
            </h1>
            <form
              onSubmit={handleSubmit}
              className="mt-8 grid grid-cols-6 gap-6"
            >
              <InputItem
                name="username"
                placeholder="User Name"
                type="text"
                error={touched.username ? errors.username : ""}
                onBlur={handleBlur}
                onChange={handleChange}
                required={true}
              />
              <InputItem
                name="email"
                placeholder="Email"
                type="email"
                error={touched.email ? errors.email : ""}
                onBlur={handleBlur}
                onChange={handleChange}
                required={true}
              />
              <InputItem
                name="password"
                placeholder="Password"
                type="password"
                error={touched.password ? errors.password : ""}
                onBlur={handleBlur}
                onChange={handleChange}
                required={true}
              />
              <InputItem
                name="phone"
                placeholder="Egyptian Phone"
                type="text"
                error={touched.phone ? errors.phone : ""}
                onBlur={handleBlur}
                onChange={handleChange}
                required={true}
              />
              <InputItem
                name="city"
                placeholder="City"
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                column="sm:col-span-3"
              />
              <InputItem
                name="region"
                placeholder="region"
                type="text"
                onBlur={handleBlur}
                onChange={handleChange}
                column="sm:col-span-3"
              />
              <InputItem
                name="age"
                placeholder="Age"
                type="number"
                onBlur={handleBlur}
                onChange={handleChange}
                column="sm:col-span-3"
                error={touched.age ? errors.age : ""}
              />
              <InputItem
                name="gender"
                select="Gender :Please select"
                value="male"
                value2="female"
                column="sm:col-span-3"
              />

              {userType === "doctor" && (
                <>
                  <InputItem
                    name="specialization"
                    placeholder="specialization"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required={true}
                  />
                  <InputItem
                    name="practice_permit"
                    placeholder="Practice Permit Number"
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required={true}
                  />
                </>
              )}

              <div className="col-span-6">
                <label htmlFor="MarketingAccept" className="flex gap-4">
                  <input
                    type="checkbox"
                    id="MarketingAccept"
                    name="marketing_accept"
                    className="size-5 rounded-md border-gray-200 bg-white shadow-xs"
                  />

                  <span className="text-sm text-gray-700">
                    I want to receive emails about events, product updates and
                    company announcements.
                  </span>
                </label>
              </div>

              <div className="col-span-6">
                <p className="text-sm text-gray-500">
                  By creating an account, you agree to our
                  <Link to="#" className="text-gray-700 underline">
                    {" "}
                    terms and conditions{" "}
                  </Link>
                  and
                  <Link to="#" className="text-gray-700 underline">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>

              {/* Add other fields similarly */}

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <Button
                  btnType="submit"
                  disabled={!isValid || isSubmitting}
                  isLoading={isSubmitting}
                  content={`Create ${userType} account`}
                ></Button>
                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?
                  <Link to="/login" className="text-gray-700 underline ml-1">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 p-4">
        <div className="rounded-lg bg-yellow-200 px-4 py-3 text-black shadow-lg">
          <p className="text-center text-sm font-medium">
            Are you a {userType === "patient" ? "Doctor  " : "Patient  "}?
            <Link
              to={`/signup/${userType === "patient" ? "doctor" : "patient"}`}
              className="inline-block underline"
            >
              {" "}
              Signup her{" "}
              <svg
                className="size-5 rtl:rotate-180 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
