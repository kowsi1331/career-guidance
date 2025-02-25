from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
from flask import Flask
from flask_mysqldb import MySQL
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
mysql = MySQL(app)

