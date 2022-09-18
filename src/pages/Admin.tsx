import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { UserListItem } from "../components/UserListItem";
import { Config, UserData } from "../types";

const Admin = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [bajerPrice, setBajerPrice] = useState(10);
  const [pctMarkup, setPctMarkup] = useState(10);

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

  const opdaterPris = async (pris: number) => {
    setBajerPrice(pris);
  };

  const opdaterMarkUp = async (markUp: number) => {
    setPctMarkup(markUp);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center pt-20">
      <div className="w-1/2 flex flex-col items-center mb-10 border space-y-4 py-4">
        <div className="flex items-center ">
          <div className="w-1/2 flex">Hvad koster en bajer?</div>
          <input
            className="w-1/3 flex"
            type="number"
            value={bajerPrice}
            onChange={(e) => opdaterPris(e.target.value as unknown as number)}
          />
          kr.
        </div>
        <div className="flex items-center ">
          <div className="w-1/2 flex">Procenttillæg</div>
          <input
            className="w-1/3 flex"
            type="number"
            value={pctMarkup}
            onChange={(e) => {
              opdaterMarkUp(e.target.value as unknown as number);
            }}
          />{" "}
          %
        </div>
      </div>
      <div className="w-full lg:w-1/2 px-8">
        <div className="flex space-x-4 font-bold border-b">
          <div className="w-1/5">Navn</div>
          <div className="w-1/5 flex justify-center">Bajere</div>
          <div className="w-1/5 flex justify-center">Skylder</div>
          <div className="w-1/5 flex justify-center">Total</div>
          <div className="w-1/5"></div>
        </div>
        <div className="">
          {users.map((user) => {
            return (
              <UserListItem
                key={user.uid}
                user={user}
                bajerPrice={bajerPrice * (1 + pctMarkup / 100)}
              />
            );
          })}{" "}
        </div>
      </div>

      <Link to={"/"} className="bg-blue-500 rounded px-4 py-2 mt-4 text-white">
        Tilbage til start
      </Link>
    </div>
  );
};

export default Admin;
