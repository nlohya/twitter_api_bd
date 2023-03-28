import React, {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { API } from "../http/api.http";
import Loader from "../assets/icons/Loader";

type Tweet = {
  tweet_id: string;
  date: string;
  text: string;
};

const List = () => {
  const [tweets, setTweets] = useState([]);
  const [currentSource, setCurrentSource] = useState("recent");
  const [loading, setLoading] = useState(false);

  function handleRecentRadio() {
    setCurrentSource("recent");
  }

  function handleDbRadio() {
    setCurrentSource("db");
  }

  async function fetchTweets() {
    setTweets([]);
    API.get(`tweets/${currentSource}`)
      .then((resp) => {
        if (resp.data.tweets.length == 0) setLoading(false);
        setTweets(resp.data.tweets);
        console.log(resp.data.tweets);
      })
      .catch((err) => console.error(err));
  }

  function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
    fetchTweets();
  }

  useEffect(() => {
    if (tweets.length > 0) setLoading(false);
    else setLoading(true);
  }, [tweets]);

  return (
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
            <a
              href={`https://twitter.com/i/status/${tweet.tweet_id}`}
              target="_blank"
              key={tweet.tweet_id}
              className="my-4 bg-twitter-blue border-white border-2 p-4 mx-auto rounded-lg shadow-xl block hover:scale-105 duration-200 hover:my-5"
            >
              <p className="font-bold">
                Date : {new Date(tweet.date).toLocaleDateString("fr-FR")}
              </p>
              <p>Tweet : {tweet.text}</p>
            </a>
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
  );
};

export default List;
