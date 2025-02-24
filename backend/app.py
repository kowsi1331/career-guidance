from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config
from routes import auth

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)

app.register_blueprint(auth)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
