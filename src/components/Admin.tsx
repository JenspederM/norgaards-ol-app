import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { UserData } from "./AuththenticationProvider";

export const Admin = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (querySnapshot) => {
      const userData: UserData[] = [];
      querySnapshot.forEach((doc) => {
        userData.push(doc.data() as UserData);
      });
      setUsers(userData);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center pt-20">
      <div className="w-full lg:w-1/2 px-8">
        <div className="flex space-x-4 font-bold border-b">
          <div className="w-1/4">Navn</div>
          <div className="w-1/4 flex justify-center">Bajere</div>
          <div className="w-1/4 flex justify-center">Total</div>
          <div className="w-1/4"></div>
        </div>
        <div className="">
          {users.map((user) => {
            return <UserListItem key={user.uid} user={user} />;
          })}{" "}
        </div>
      </div>

      <Link to={"/"} className="bg-blue-500 rounded px-4 py-2 mt-4 text-white">
        Back to home
      </Link>
    </div>
  );
};

const UserListItem = (props: { user: UserData }) => {
  const [loading, setLoading] = useState(false);

  const handleReset = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    setLoading(true);
    updateDoc(docRef, { bajere: 0 })
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const { user } = props;
  return (
    <div
      className="flex items-center space-x-4 w-full py-4 border-b"
      key={user.uid}
    >
      <div className="w-1/4">{user.displayName}</div>
      <div className="w-1/4 flex justify-center">{user.bajere}</div>
      <div className="w-1/4 flex justify-center">{user.bajere * 10}</div>
      <div className="w-1/4 flex justify-end">
        <button
          className="bg-red-300 px-4 py-1 rounded"
          onClick={() => handleReset(user.uid)}
        >
          {loading ? "Loading..." : "Nulstil"}
        </button>
      </div>
    </div>
  );
};
