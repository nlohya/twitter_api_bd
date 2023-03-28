import React, { useState } from "react";
import Collector from "./components/Collector";
import Info from "./components/Info";
import List from "./components/List";
import Modal from "./components/Modal";

function App() {
  const [collectModalState, setCollectModalState] = useState(false);
  const [infoModalState, setInfoModalState] = useState(false);

  return (
    <React.Fragment>
      <Modal
        title="Collecter des tweets"
        modalState={collectModalState}
        close={() => {
          setCollectModalState(false);
        }}
      >
        <Collector />
      </Modal>

      <Modal
        title="Informations DB"
        modalState={infoModalState}
        close={() => {
          setInfoModalState(false);
        }}
      >
        <Info />
      </Modal>

      <main className="min-h-screen h-full bg-twitter">
        <header className="w-full p-4 bg-twitter-blue">
          <ul className="flex items-center gap-4 text-white">
            <li>
              <button
                className="border border-white p-2 rounded-lg hover:text-twitter-blue hover:bg-white shadow duration-300"
                onClick={() => {
                  setCollectModalState(true);
                }}
              >
                Collecteur
              </button>
            </li>
            <li>
              <button
                className="border border-white p-2 rounded-lg hover:text-twitter-blue hover:bg-white shadow duration-300"
                onClick={() => {
                  setInfoModalState(true);
                }}
              >
                Informations DB
              </button>
            </li>
          </ul>
        </header>

        <section>
          <List />
        </section>
      </main>
    </React.Fragment>
  );
}

export default App;
