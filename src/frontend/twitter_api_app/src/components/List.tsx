import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { API } from "../http/api.http";
import Loader from "../assets/icons/Loader";
import Modal from "./Modal";

type Tweet = {
  tweet_id: string;
  author: string;
  date: string;
  text: string;
  metrics: {
    like: string;
    rt: string;
    reply: string;
  };
};

const List = () => {
  const [tweets, setTweets] = useState([]);
  const [currentSource, setCurrentSource] = useState("recent");
  const [loading, setLoading] = useState(false);

  const [saModalState, setSaModalState] = useState(false);
  const [currentTweet, setCurrentTweet] = useState("");
  const [currentSaResult, setCurrentSaResult] = useState({
    negative: 0,
    neutral: 0,
    positive: 0,
    compound: 0,
  });

  const [spinnerW, setSpinnerW] = useState(0);

  function handleRecentRadio() {
    setCurrentSource("recent");
  }

  function handleDbRadio() {
    setCurrentSource("db");
  }

  async function fetchTweets() {
    setTweets([]);
    setLoading(true);
    API.get(`tweets/${currentSource}`)
      .then((resp) => {
        setTweets(resp.data.tweets);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }

  function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
    fetchTweets();
  }

  function sentimentAnalysis() {
    setSpinnerW(24);
    API.post("analyze", {
      text: currentTweet,
    })
      .then((resp) => {
        setCurrentSaResult({
          negative: resp.data.result.neg,
          neutral: resp.data.result.neu,
          positive: resp.data.result.pos,
          compound: resp.data.result.compound,
        });
        setSpinnerW(0);
      })
      .catch((err) => console.error(err));
  }

  function getTextColor(ratio: number) {
    if (ratio == 0) return "text-orange-400";
    else if (ratio < 0) return "text-red-400";
    else return "text-green-400";
  }

  return (
    <React.Fragment>
      <Modal
        title="Analyse de sentiment"
        modalState={saModalState}
        close={() => {
          setSaModalState(false);
          setCurrentSaResult({
            negative: 0,
            neutral: 0,
            positive: 0,
            compound: 0,
          });
        }}
      >
        <p className="max-w-md">{currentTweet}</p>
        <button
          onClick={sentimentAnalysis}
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
        <p className="mt-2">Résultat :</p>
        <table>
          <tbody>
            <tr>
              <th>Ratio négatif</th>
              <td className={`${getTextColor(currentSaResult.negative)}`}>
                {currentSaResult.negative}
              </td>
            </tr>
            <tr>
              <th>Ratio neutre</th>
              <td className={`${getTextColor(currentSaResult.neutral)}`}>
                {currentSaResult.neutral}
              </td>
            </tr>
            <tr>
              <th>Ratio positif</th>
              <td className={`${getTextColor(currentSaResult.positive)}`}>
                {currentSaResult.positive}
              </td>
            </tr>
            <tr>
              <th>Combinaison</th>
              <td className={`${getTextColor(currentSaResult.compound)}`}>
                {currentSaResult.compound}
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>

      <div className="container max-w-2xl mx-auto text-white px-4">
        <h2 className="text-4xl text-center text-white px-4 py-16">
          Liste des tweets
        </h2>

        <form onSubmit={handleFormSubmit}>
          <h3 className="text-xl">Source des tweets</h3>
          <div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="source"
                value="recent"
                onChange={handleRecentRadio}
                checked={currentSource === "recent"}
              />
              <p>Tweets récents</p>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                name="source"
                value="db"
                onChange={handleDbRadio}
                checked={currentSource === "db"}
              />
              <p>Tweets aléatoires depuis la base de données</p>
            </div>
          </div>
          <input
            type="submit"
            value="Sauvegarder"
            className="bg-twitter-blue p-2 text-white rounded-lg mt-2 hover:cursor-pointer"
          />
        </form>

        {!loading && (
          <div>
            {tweets.map((tweet: Tweet) => (
              <div
                key={tweet.tweet_id}
                className="my-4 bg-twitter-blue border-white border-2 p-4 mx-auto rounded-lg shadow-xl block duration-200"
              >
                <p className="font-bold">
                  Date : {new Date(tweet.date).toLocaleDateString("fr-FR")}
                </p>
                <p className="font-bold">Auteur : {tweet.author}</p>
                <p>Tweet : {tweet.text}</p>
                <div className="flex items-center justify-between gap-4 mt-2">
                  <ul className="mt-2 flex items-center gap-4 bg-white rounded-lg p-1 text-black px-2">
                    <li>👍 {tweet.metrics.like}</li>
                    <li>🔁 {tweet.metrics.rt}</li>
                    <li>🗨️ {tweet.metrics.reply}</li>
                  </ul>
                  <button
                    className="bg-twitter px-2 p-1 rounded-lg"
                    onClick={() => {
                      setCurrentTweet(tweet.text);
                      setSaModalState(true);
                    }}
                  >
                    Analyse de sentiments
                  </button>
                  <a
                    href={`https://twitter.com/i/status/${tweet.tweet_id}`}
                    target="_blank"
                    className="hover:underline underline-offset-4"
                  >
                    Voir le tweet ➡️
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 mt-4">
            <div className="rotate-spinner origin-center w-fit">
              <Loader width={24} height={24} />
            </div>
            <p>Chargement...</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default List;
