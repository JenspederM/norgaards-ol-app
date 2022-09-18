import React, { Children, PropsWithChildren, useEffect, useState } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { app } from "../firebase";

const provider = new GoogleAuthProvider();

export const AuthenticationProvider = (props: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      {loading ? <div>Loading...</div> : user ? props.children : <Login />}
    </div>
  );
};

export const Login = () => {
  const authWithGoogle = () => {
    const auth = getAuth(app);
    signInWithPopup(auth, provider);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="p-4 rounded border bg-white space-y-4 ">
        <div className="text-lg">Login</div>

        <div>
          <button
            className="bg-blue-500 text-sm font-medium text-white p-2 rounded"
            onClick={() => authWithGoogle()}
          >
            Log me in, I want øl
          </button>
        </div>
      </div>
    </div>
  );
};
