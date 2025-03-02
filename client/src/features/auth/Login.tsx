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
      if (value.length < 6) {
        return "Password must be at least 6 characters";
      }
      break;
  }
  return "";
};

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const requestData = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("http://127.0.0.1:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    
    if (!response.ok) {
      return  {
        errors: {
          ...data.errors,
          general: data.message || "Login failed. Please try again."
        }
      }
    }

    const{user , token} = data
    console.log(data)
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    console.log(user , token )
    // console.log(response);
    if (response.status === 200) {
      toast.success(data.message);
      return redirect("/");
    }
  } catch (err) {
    return { errors: { general: "Login failed.", err } };
  }
}



export default function Login() {
  const actionData = useActionData() as { errors?: Record<string, string> };
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const errors = { ...actionData?.errors, ...localErrors };
  const allTouched =
    Object.keys(touched).length === Object.keys(formData).length;
  const hasErrors = Object.values(errors).some((error) => error);
  const isFormValid = allTouched && !hasErrors;

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
      console.log(actionData.errors.err)
      console.log(actionData.errors)
      toast.error(actionData.errors.general);
    }
  }, [actionData]);

  const navigation = useNavigation();
  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting";

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h2 className="text-center text-2xl font-bold text-blue-600 sm:text-3xl">
          Get started today
        </h2>

        <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati
          sunt dolores deleniti inventore quaerat mollitia?
        </p>

        <Form
          method="POST"
          className="mt-6 mb-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8"
        >
          <p className="text-center text-lg font-medium">
            Sign in to your account
          </p>
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

          <Button
            content={isLoading ? "" : "Log in"}
            btnType="submit"
            disabled={!isFormValid}
            isLoading={isLoading}
            width="w-full"
          />

          <p className="text-center text-sm text-gray-500">
            No account?
            <Link className="underline" to="/signup">
              Sign up
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}
