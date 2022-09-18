import { AuthenticationProvider } from "./components/AuththenticationProvider";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Admin } from "./pages/Admin";

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
    <div className="bg-gradient-to-b from-white to-green-200 w-full h-screen">
      <AuthenticationProvider>
        <RouterProvider router={router} />
      </AuthenticationProvider>
    </div>
  );
}

export default App;
