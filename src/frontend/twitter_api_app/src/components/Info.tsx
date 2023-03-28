import React, { useEffect, useState } from "react";
import { API } from "../http/api.http";

const Info = () => {
  const [mongoVer, setMongoVer] = useState("");
  const [mongoDebug, setMongoDebug] = useState("");
  const [mongoMaxObjSize, setMongoMaxObjSize] = useState("");

  const [collecSize, setCollecSize] = useState("");
  const [nbObj, setNbObj] = useState("");

  async function fetchInfo() {
    API.get("info")
      .then((resp) => {
        setMongoVer(resp.data.engine_info.version);
        setMongoDebug(JSON.stringify(resp.data.engine_info.debug));
        setMongoMaxObjSize(
          JSON.stringify(resp.data.engine_info.maxBsonObjectSize)
        );
        setCollecSize(JSON.stringify(resp.data.collection_info.size));
        setNbObj(JSON.stringify(resp.data.collection_info.count));
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  return (
    <div>
      <h2 className="underline">Informations moteur :</h2>

      <div className="text-left">
        <table>
          <tbody>
            <tr>
              <th>Moteur</th>
              <td>Mongo v.{mongoVer}</td>
            </tr>
            <tr>
              <th>Debug</th>
              <td>{mongoDebug}</td>
            </tr>
            <tr>
              <th>Max obj. size</th>
              <td>{mongoMaxObjSize}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="underline mt-2">Informations collection :</h2>

      <div className="text-left">
        <table>
          <tbody>
            <tr>
              <th>Nom</th>
              <td>twitter_api</td>
            </tr>
            <tr>
              <th>Taille</th>
              <td>{collecSize}</td>
            </tr>
            <tr>
              <th>Nombre d'objets</th>
              <td>{nbObj}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Info;
