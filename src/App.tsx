import { useState } from "react";
import { AuthenticationProvider } from "./components/Login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-gray-100 w-full h-screen">
      <AuthenticationProvider>
        <div>Authenticated...</div>
      </AuthenticationProvider>
    </div>
  );
}

export default App;
