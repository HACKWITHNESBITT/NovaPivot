import os
from pymongo import MongoClient
import bcrypt
from datetime import datetime
from bson import ObjectId

client = MongoClient(os.getenv('MONGODB_URI'))
db = client.novapivot
users_collection = db.users

class User:
    @staticmethod
    def create(email, password, name):
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = {
            'email': email,
            'password_hash': hashed.decode('utf-8'),
            'name': name,
            'created_at': datetime.utcnow()
        }
        result = users_collection.insert_one(user)
        return str(result.inserted_id)

    @staticmethod
    def find_by_email(email):
        return users_collection.find_one({'email': email})

    @staticmethod
    def find_by_reset_token(token):
        return users_collection.find_one({'reset_token': token, 'reset_token_expiry': {'$gt': datetime.utcnow()}})

    @staticmethod
    def update_reset_token(email, token, expiry):
        users_collection.update_one({'email': email}, {'$set': {'reset_token': token, 'reset_token_expiry': expiry}})

    @staticmethod
    def update_password(user_id, hashed_password):
        users_collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'password_hash': hashed_password}})

    @staticmethod
    def to_public_json(user):
        return {
            'id': str(user['_id']),
            'email': user['email'],
            'name': user['name']
        }
