// // improve the login and signup actions

// import { URL_LOGIN, URL_SIGNUP } from "../../context/Auth";
// import { redirect } from "react-router-dom";
// import { toast } from "react-toastify";

// export const loginAction = async ({ request }: { request: Request }) => {
//   return handleAuthAction(URL_LOGIN, request, "/dashboard", "Login");
// };

// export const signupAction = async ({ request }: { request: Request }) => {
//   return handleAuthAction(URL_SIGNUP, request, "/login", "Signup");
// };

// const handleAuthAction = async (
//   url: string,
//   request: Request,
//   redirectPath: string,
//   actionName: string
// ) => {
//   const formData = await request.formData();
//   const body = JSON.stringify(Object.fromEntries(formData));

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body,
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       toast.error(data.message || `${actionName} failed`);
//       return { errors: data.errors || data.message };
//     }

//     if (url === URL_LOGIN) {
//       localStorage.setItem("authToken", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//     }

//     toast.success(data.message || `${actionName} successful!`);
//     return redirect(redirectPath);
//   } catch (error) {
//     toast.error(`${actionName} failed. Please try again.`);
//     return { errors: { general: `${actionName} failed` } };
//   }
// };