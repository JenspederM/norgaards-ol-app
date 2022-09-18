import { AuthenticationProvider } from "./components/AuththenticationProvider";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import { Admin } from "./components/Admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);

function App() {
  return (
    <div className="bg-gray-100 w-full h-screen">
      <AuthenticationProvider>
        <RouterProvider router={router} />
      </AuthenticationProvider>
    </div>
  );
}

export default App;
