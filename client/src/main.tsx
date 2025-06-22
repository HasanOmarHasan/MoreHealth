// main.tsx
import ReactDOM from "react-dom/client";
import { Analytics } from '@vercel/analytics/react';
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./ui/AppLayout/AppLayout";
import Home from "./ui/home/Home";
import "./index.css";
import Error from "./ui/Error";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./features/profiles/Profile";
import { AuthProvider } from "./context/Auth";
import Groups from "./features/groups/Groups";
import QuestionList from "./features/groups/QuestionList";
import CommentsList from "./features/groups/CommentsList";
import Chat from "./features/profiles/Chat/Chat";
import Messages from "./features/profiles/Chat/Messages";

import Login from "./features/auth/Login";
import SignupForm from "./features/auth/SignupForm";
import General from "./features/profiles/General";
import Account from "./features/profiles/Account";
import DeleteAccount from "./features/profiles/DeleteAccount";
import ResetPassword from "./features/profiles/ResetPassword";
import Services from "./features/AI Services/Services";
import AiChat from "./features/AI Services/Ai-Chat";
import Symptom from "./features/AI Services/Symptom";
import AboutPage from "./ui/AppLayout/About";


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      { path: "*", element: <Error /> },
      { path: "/", element: <Home /> },
      {
        path: "/login", element: <Login />, 
        loader: () => {
          if (localStorage.getItem("authToken")) {
            return redirect("/");
          }
          return null;
        },
       },
      {
        path: "/Profile/",
        element: <Profile />,
        children: [
          { path: "chat-room", element: <Chat /> },
          { path: "messages/:roomId/", element: <Messages /> },
          { path: "General", element: <General /> },
          { path: "Account", element: <Account /> },
          { path: "delete", element: <DeleteAccount /> },
          { path: "reset-password", element: <ResetPassword /> },
        ],
        loader: () => {
          if (!localStorage.getItem("authToken")) {
            return redirect("/login");
          }
          return null;
        },
      },

      {
        path: "/signup/patient",
        element: <SignupForm userType="patient" endpoint="/auth/signup" />,
        loader: () => {
          if (localStorage.getItem("authToken")) {
            return redirect("/");
          }
          return null;
        },
      },
      {
        path: "/signup/doctor",
        element: (
          <SignupForm userType="doctor" endpoint="/auth/signup-doctor" />
        ),
        loader: () => {
          if (localStorage.getItem("authToken")) {
            return redirect("/");
          }
          return null;
        },
      },
      {
        element: <Services/>,
        path: "/services",
        loader: () => {
          if (!localStorage.getItem("authToken")) {
            return redirect("/login");
          }
          return null;
        },
      },
      {
        element: <AiChat/>,
        path: "/services/ai-chat",
        loader: () => {
          if (!localStorage.getItem("authToken")) {
            return redirect("/login");
          }
          return null;
        },
      },
      {
        element: <Symptom/>,
        path: "/services/symptom-checker",
        loader: () => {
          if (!localStorage.getItem("authToken")) {
            return redirect("/login");
          }
          return null;
        },
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
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/groups/:groupId/questions/:questionId",
        element: <CommentsList />,
        loader: () => {
          if (!localStorage.getItem("authToken")) {
            return redirect("/login");
          }
          return null;
        },
      },
      { path: "reset-password", element: <ResetPassword /> },
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
        <Analytics />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
