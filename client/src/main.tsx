// main.tsx
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./ui/AppLayout/AppLayout";
import Home from "./ui/home/Home";
import Login, { action as loginAction } from "./features/auth/Login";
import "./index.css";
import Error from "./ui/Error";
import Signup, { action as signupAction } from "./features/auth/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./features/profiles/Profile";
import { AuthProvider } from "./context/Auth";
import Groups from "./features/groups/Groups";
import QuestionList from "./features/groups/QuestionList";
import CommentsList from "./features/groups/CommentsList";
// import { loginAction, signupAction } from "./auth-actions";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: "*", element: <Error /> },
      { path: "/", element: <Home /> },
      { path: "/login", action: loginAction, element: <Login /> },
      {
        path: "/Profile",
        element: <Profile />,
        children: [{}],
        loader :()=>{
          if (!localStorage.getItem("authToken")) {
            return redirect("/login");
          }
          return null;
          
        }
      },
      {
        path: "/signup",

        element: <Signup />,
        action: signupAction,
      },
      {
        path: "/groups/*",
        element: <Groups />,
      },
      {
        path: "/groups/:groupId",
        element: <QuestionList />,
      },
      {
        path:"/groups/:groupId/questions/:questionId" ,element:<CommentsList /> ,loader :()=>{
          if (!localStorage.getItem("authToken")) {
            return redirect("/login");
          }
          return null;
          
        }
      },
    ],
  },
]);

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter, Route, Routes } from "react-router";
// import App from "./App.tsx";
// import "./index.css";

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/*" element={<App />} />
//       </Routes>
//     </BrowserRouter>
//   </StrictMode>
// );
