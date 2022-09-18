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
      <form className="w-full max-w-sm border pt-4 mb-10">
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-700 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Prisen for en bajer
            </label>
          </div>
          <div className="md:w-1/2">
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-700 sm:text-sm">Kr.</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                className="block w-full rounded-md border-gray-300 pl-9 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
                aria-describedby="price-currency"
                value={bajerPrice}
                onChange={(e) => opdaterPris(Number(e.target.value))}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                  DKK
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/2">
            <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
              Procent mark-up
            </label>
          </div>
          <div className="md:w-1/2">
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                name="price"
                id="price"
                className="block w-full rounded-md border-gray-300 pl-9 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
                aria-describedby="price-currency"
                value={pctMarkup}
                onChange={(e) => opdaterMarkUp(Number(e.target.value))}
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
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
