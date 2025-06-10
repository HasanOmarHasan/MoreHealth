// signup.tsx
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import Button from "../../ui/Button";
import InputItem from "./InputItem";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const validateField = (name: string, value: string) => {
  switch (name) {
    case "email":
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        return "Invalid email address";
      }
      break;
    case "password":
      if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value)) {
        return "Minimum eight characters, at least one letter, one number and one special character:";
      }
      break;
    case "username":
      if (value.length < 3) {
        return "Username must be at least 3 characters";
      }
      break;
    case "phone":
      if (
        !/^(\+20)?(010|011|012|015)\d{8}$/.test(value) &&
        value.trim() !== ""
      ) {
        return "Invalid Egyptian phone number (011 , 012 , 015 , 010)";
      }
      break;
    case "age":
      if (Number(value) < 18) {
        return "Must be at least 18 years old";
      }
      break;
  }
  return "";
};


interface FormData {
  email: string;
   username: string ;
   
    password: string ;
    phone: string ;
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const requestData = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("http://127.0.0.1:8000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        errors: errorData.errors || {
          general: "Signup failed. Please try again.",
          err: errorData,
        },
      };
    }

    console.log(response);
    if (response.status === 200) {
      toast.success("Signup successful! ");
      return redirect("/login");
    }
  } catch (err) {
    return { errors: { general: "Signup failed.", err } };
  }
}

export default function Signup() {
  const actionData = useActionData() as { errors?: Record<string, string> };
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    phone: "",
    // age: ''
  });

  const errors = { ...actionData?.errors, ...localErrors };
  const allTouched =
    Object.keys(touched).length === Object.keys(formData).length;
  const hasErrors = Object.values(errors).some((error) => error);
  // const isFormValid = allTouched && !hasErrors;

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setLocalErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setLocalErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  useEffect(() => {
    if (actionData?.errors?.general) {
      toast.error(actionData.errors.err.email[0]);
      console.log(actionData.errors);
    }
  }, [actionData]);

  const navigation = useNavigation();
  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting";
  // console.log(navigation.state  , isLoading)
  // console.log(navigation)

  return (
    <section className="bg-white ">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-12 lg:px-16 lg:py-12 xl:col-span-12">
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl text-center ">
              Sign up
            </h1>

            <Form method="POST" className="mt-8 grid grid-cols-6 gap-6">
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
              />
              <InputItem
                name="gender"
                select="Gender :Please select"
                value="male"
                value2="female"
                column="sm:col-span-3"
              />
              <div className="col-span-6 flex gap-4">
                <span className="px-3 text-gray-700 transition-all">Add medical insurance
                  :
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

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <Button
                  content={isLoading ? "" : "Create an account"}
                  btnType="submit"
                  // disabled={!isFormValid}
                  isLoading={isLoading}
                />
                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?
                  <Link to="/login" className="text-gray-700 underline ml-1">
                    Log in
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 p-4">
        <div className="rounded-lg bg-yellow-200 px-4 py-3 text-black shadow-lg">
          <p className="text-center text-sm font-medium">
            Are you a Doctor?
            <Link to="/" className="inline-block underline">
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
}
