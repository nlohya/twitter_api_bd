import uvicorn
from fastapi import FastAPI
from pytwitter import Api
import time
from database import DB
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from pydantic import BaseModel
import requests

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = Api(bearer_token=os.getenv('BEARER'))

def get_url(path):
   return "/api/v1" + path

@app.get(get_url("/"))
async def index():
   return {"status": "on"}


@app.get(get_url("/collect"))
async def _():
   collected_amount = 0

   search = api.search_tweets("retraite", tweet_fields=["author_id", "lang", "created_at", "possibly_sensitive", "public_metrics"])
   for twi in range(len(search.data)):
        tweet = search.data[twi]

        if (DB.get_collection().find_one({
            "tweet_id": tweet.id
        })): continue

        user = api.get_user(user_id=tweet.author_id).data

        DB.get_collection().insert_one({
            "tweet_id": tweet.id,
            "author_id": tweet.author_id,
            "author": user.name,
            "lang": tweet.lang,
            "date": tweet.created_at,
            "prob_sensitive": tweet.possibly_sensitive,
            "metrics": {
                "like": tweet.public_metrics.like_count,
                "rt": tweet.public_metrics.retweet_count,
                "reply": tweet.public_metrics.reply_count
            },
            "text": tweet.text
        })
        collected_amount += 1
        print("Collected tweet : " + tweet.id)
        time.sleep(0.3)

   return {"collected_amount" : collected_amount}

@app.get(get_url("/info"))
async def _():
   engine_info = DB.get_database().command("buildinfo")
   collection_info = DB.get_database().command("collstats", "twitter_api")
   return {"engine_info": engine_info, "collection_info": collection_info}

@app.get(get_url("/tweets/db"))
async def _():
   tw_list = []
   tweets = DB.get_collection().aggregate([ { "$sample": { "size": 10 } } ])
   for tweet in tweets:

      tw_list.append({
            "tweet_id": tweet["tweet_id"],
            "author_id": tweet["author_id"],
            "author": tweet["author"],
            "lang": tweet["lang"],
            "date": tweet["date"],
            "prob_sensitive": tweet["prob_sensitive"],
            "metrics": {
                "like": tweet["metrics"]["like"],
                "rt": tweet["metrics"]["rt"],
                "reply": tweet["metrics"]["reply"]
            },
            "text": tweet["text"]
        })

   return {"tweets" : tw_list}

@app.get(get_url("/tweets/recent"))
async def _():

   tw_list = []

   search = api.search_tweets("retraite", tweet_fields=["author_id", "lang", "created_at", "possibly_sensitive", "public_metrics"])
   for twi in range(len(search.data)):
      tweet = search.data[twi]

      user = api.get_user(user_id=tweet.author_id).data

      for tw in tw_list:
         if tw["tweet_id"] == tweet.id or tw["text"] == tweet.text:
            continue

      tw_list.append({
         "tweet_id": tweet.id,
         "author_id": tweet.author_id,
         "author": user.name,
         "lang": tweet.lang,
         "date": tweet.created_at,
         "prob_sensitive": tweet.possibly_sensitive,
         "metrics": {
               "like": tweet.public_metrics.like_count,
               "rt": tweet.public_metrics.retweet_count,
               "reply": tweet.public_metrics.reply_count
         },
         "text": tweet.text
      })
      time.sleep(0.3)
   
   return {"tweets" : tw_list}

class AnalyzeBody(BaseModel):
   text: str

@app.post(get_url("/analyze"))
async def _(body: AnalyzeBody):

   resp = requests.get(
      "https://api-free.deepl.com/v2/translate",
      params={ 
         "auth_key": os.getenv('DEEPL_TOKEN'), 
         "target_lang": "en", 
         "text": body.text, 
      }, 
   )

   translated = resp.json()

   sid = SentimentIntensityAnalyzer()
   ss = sid.polarity_scores(translated["translations"][0]["text"])

   return {"result": ss}



if __name__ == "__main__":
   uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)