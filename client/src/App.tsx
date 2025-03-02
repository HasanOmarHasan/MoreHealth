// // main.tsx
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import AppLayout from "./ui/AppLayout/AppLayout";
// import Home from "./ui/home/Home";
// import Login from "./features/auth/Login";
// import Signup, { clientAction } from "./features/auth/Signup";

// const router = createBrowserRouter([
//   {
//     element: <AppLayout />,
//     children: [
//       { path: "/", element: <Home /> },
//       { path: "/login", element: <Login /> },
//       {
//         path: "/signup",
//         element: <Signup />,
//         action: clientAction, // Connect your action here
//       },
//       // Add other routes...
//     ],
//   },
// ]);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );

//////////////////
// // import React from "react";
// import { Routes, Route } from "react-router";
// import Home from "./ui/home/Home";
// import AppLayout from "./ui/AppLayout/AppLayout";
// import Login from "./features/auth/Login";
// import Signup from "./features/auth/Signup";
// import Error from "./ui/Error";
// // import signupAction  from "./features/auth/signupAction";

// export default function App() {
//   return (
//     <Routes>
//       <Route element={<AppLayout />}>
//         <Route path="/" element={<Home />} />
//         <Route path="login" element={<Login />} />
//         <Route path="signup" element={<Signup />} /> 
//         {/* action={signupAction} */}
//         <Route path="*" element={<Error />} />
      
//       </Route>
//     </Routes>
//   );
// }
