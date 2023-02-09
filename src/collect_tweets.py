from pymongo import MongoClient
from pytwitter import Api
import os
from dotenv import load_dotenv
import time

load_dotenv()

def get_database():
 
   # Provide the mongodb atlas url to connect python to mongodb using pymongo
   CONNECTION_STRING = "mongodb://localhost:27017"
 
   # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
   client = MongoClient(CONNECTION_STRING)
 
   # Create the database for our example (we will use the same database throughout the tutorial
   return client['twitter_api']

db = get_database()
collection = db["twitter_api"]


api = Api(bearer_token=os.getenv('BEARER'))


while True:

    search = api.search_tweets("retraite", tweet_fields=["author_id", "lang", "created_at", "possibly_sensitive", "public_metrics"])

    for twi in range(len(search.data)):
        tweet = search.data[twi]

        if (collection.find_one({
            "tweet_id": tweet.id
        })): continue

        collection.insert_one({
            "tweet_id": tweet.id,
            "author_id": tweet.author_id,
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
        print("Collected tweet : " + tweet.id)
    
    time.sleep(10)
    
