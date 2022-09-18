import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";
import { UserData } from "../types";

export const UserListItem = (props: { user: UserData; bajerPrice: number }) => {
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

  const { user, bajerPrice } = props;

  return (
    <div
      className="flex items-center space-x-4 w-full py-4 border-b"
      key={user.uid}
    >
      <div className="w-1/5">{user.displayName}</div>
      <div className="w-1/5 flex justify-center">{user.bajere}</div>
      <div className="w-1/5 flex justify-center">
        {Math.round(user.bajere * bajerPrice)} kr.
      </div>
      <div className="w-1/5 flex justify-center">
        {Math.round(user.bajere * bajerPrice)} kr.
      </div>
      <div className="w-1/5 flex justify-end">
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
