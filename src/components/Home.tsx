import { doc, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useUser } from "./AuththenticationProvider";
import { Link } from "react-router-dom";

type Props = {};

const _countdown = 1000 * 4;

const Beerlist = () => {
  const [user] = useUser();
  const [beercount, setBeercount] = useState(0);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!user) return;
    return onSnapshot(doc(db, "users", user.fbUser.uid), (snap) => {
      const userData = snap.data();
      setBeercount(userData?.bajere ?? 0);
    });
  }, []);

  const onBuyBeer = (amount: number) => {
    if (!user) return;
    updateDoc(doc(db, "users", user.fbUser.uid), {
      bajere: increment(amount),
    });
  };

  const [newlyboughtbeer, setNewlyboughtbeer] = useState(0);
  useEffect(() => {
    if (newlyboughtbeer > 0) {
      setCountdown(_countdown);
      const timeout = setTimeout(() => {
        onBuyBeer(newlyboughtbeer);
        setNewlyboughtbeer(0);
      }, _countdown);
      return () => clearTimeout(timeout);
    }
  }, [newlyboughtbeer]);

  useEffect(() => {
    if (countdown > 0) {
      const timeout = setTimeout(() => {
        setCountdown(countdown - 1000);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [countdown]);

  return (
    <div className="w-full h-screen flex flex-col items-center pt-20">
      <div className="py-4 flex flex-col items-center">
        <div className="font-bold text-xl mb-2">
          Hej {user?.userData.displayName}!
        </div>
        <div>du har købt</div>
        <div className="text-4xl">
          <CountUpTo to={beercount} /> bajer{beercount !== 1 ? "e" : ""}
        </div>
      </div>

      <button
        onClick={() => setNewlyboughtbeer((p) => p + 1)}
        className="px-2 py-1 font-bold bg-green-500 text-white rounded"
      >
        Køb en bajer
      </button>

      {newlyboughtbeer > 0 && (
        <div className="flex flex-col items-center pt-8">
          <div>
            Du har {countdown / 1000} sekunder til at fortryde dit køb af
          </div>
          <div>
            {newlyboughtbeer} bajer{newlyboughtbeer === 1 ? "" : "e"}
          </div>
          <button className="underline" onClick={() => setNewlyboughtbeer(0)}>
            Det er lidt for meget for mig..
          </button>
        </div>
      )}
      {user?.userData.isAdmin && (
        <div className="pt-20 ">
          <Link
            to={"/admin"}
            className="bg-blue-500 rounded px-4 py-2 text-white"
          >
            hold styr på bajerregnskabet
          </Link>
        </div>
      )}
    </div>
  );
};

export default Beerlist;

// Incrementally count up to a number everytime it changes, and return the current value
const CountUpTo = (props: { to: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const delay = 500 / (props.to - count);
    if (count >= props.to) return;
    const timeout = setTimeout(() => {
      setCount((p) => p + 1);
    }, delay);
    return () => clearTimeout(timeout);
  }, [count, props.to]);
  return <>{count}</>;
};
