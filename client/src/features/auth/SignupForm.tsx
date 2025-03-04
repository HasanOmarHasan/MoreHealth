// Signup.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import InputItem from "./InputItem";
import { toast } from "react-toastify";
import axiosClient from "../../utils/axiosClient";

interface SignupProps {
  userType: "patient" | "doctor";
  endpoint: string;
}

const Signup = ({ userType, endpoint }: SignupProps) => {
  const navigate = useNavigate();
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
    // ...(userType === "doctor" && {
      specialization: "",
      practice_permit: "",
    // }),
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
      case "password":
        if (
          !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            value
          )
        ) {
          newErrors.password =
            "Minimum 8 chars with letter, number & special char";
        } else {
          delete newErrors.password;
        }
        break;
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

    try {
      const payload =
        userType === "doctor"
          ? {
              user: {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                city: formData.city,
                region: formData.region,
                age: Number(formData.age), // Convert to number
                gender: formData.gender,
                medical_insurance: formData.medical_insurance,
              },
              specialization: formData.specialization,
              practice_permit: formData.practice_permit,
            }
          : {...formData};
      const response = await axiosClient.post(endpoint, payload);

      console.log(formData);

        console.log(response)
      if (response.status >= 200 && response.status < 300) {
        toast.success("Signup successful! Please login.");

        navigate("/login");
        //   return redirect("/login");
      }
    } catch (error: any) {
      console.error("Signup Error:", error.response?.data);
      const errorMessage =
        Object.entries(error?.response?.data || {})
          .map(([key, messages]) => {
            const messageList = Array.isArray(messages) ? messages : [messages];
            return `${key}: ${messageList.join(", ")}`;
          })
          .join("; ") || "An unexpected error occurred";

      toast.error(errorMessage || "Signup failed. Please check your inputs.");
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
                placeholder="Egypthian Phone"
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
              <div className="col-span-6 flex gap-4">
                <span className="px-3 text-gray-700 transition-all">
                  Add medical insurance :
                </span>
                <label
                  htmlFor="AcceptConditions"
                  className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500"
                >
                  <input
                    type="checkbox"
                    name="medical_insurance"
                    id="AcceptConditions"
                    className="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
                  />

                  <span className="absolute inset-y-0 start-0 z-10 m-1 inline-flex size-6 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600">
                    <svg
                      data-unchecked-icon
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <svg
                      data-checked-icon
                      xmlns="http://www.w3.org/2000/svg"
                      className="hidden size-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </label>
              </div>
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
            Are you a {userType === "patient" ? "Doctor" : "Patient"}?
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
