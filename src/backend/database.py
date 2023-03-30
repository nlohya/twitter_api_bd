from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

class Database():
    def __init__(self, db_url) -> None:
        try:
            self.client = MongoClient(db_url)
        except Exception as e:
            print("Error : " + e)

    def get_database(self):
        return self.client["twitter_api"]

    def get_collection(self):
        return self.get_database()["twitter_api"]
        
DB = Database(os.getenv('MONGO_URL'))