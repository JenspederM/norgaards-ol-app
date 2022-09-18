import { AuthenticationProvider } from "./components/AuththenticationProvider";
import Beerlist from "./components/Home";

function App() {
  return (
    <div className="bg-gray-100 w-full h-screen">
      <AuthenticationProvider>
        <Beerlist />
      </AuthenticationProvider>
    </div>
  );
}

export default App;
