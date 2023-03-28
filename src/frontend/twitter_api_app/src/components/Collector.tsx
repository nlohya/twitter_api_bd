import React, { useEffect, useState } from "react";
import Loader from "../assets/icons/Loader";
import { API } from "../http/api.http";

const Collector = () => {
  const [collectedAmount, setCollectedAmount] = useState("...");
  const [spinnerW, setSpinnerW] = useState(0);

  async function collectTweets() {
    setSpinnerW(24);
    setCollectedAmount("...");
    API.get("collect")
      .then((resp) => {
        setCollectedAmount(resp.data.collected_amount);
        setSpinnerW(0);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <p className="max-w-[300px] leading-tight text-sm italic">
        Note: un délai de 300ms est présent entre chaque requête pour éviter un
        bannissement temporaire.
      </p>
      <button
        onClick={collectTweets}
        className="w-full bg-twitter-blue p-2 rounded-lg text-white flex items-center text-center justify-center mt-2"
      >
        <div
          className={`${
            spinnerW ? "mx-2" : "mx-0"
          } duration-300 rotate-spinner`}
        >
          <Loader width={spinnerW} height={24} />
        </div>
        <p className="w-fit">Lancer</p>
      </button>
      <p>Quantité de tweets collectés: {collectedAmount}</p>
    </div>
  );
};

export default Collector;
