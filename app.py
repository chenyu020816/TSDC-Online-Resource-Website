from flask_cors import CORS
from flask import Flask, send_from_directory, render_template, request, send_file
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from crawler.crawler_ntu_ocw import crawl_ntu_ocw
from crawler.crawler_coursera import crawl_coursera
from crawler.crawler_hahow import crawl_hahow
import os

app = Flask(__name__, static_folder='templates/build')

# CORS
CORS(app)

# config
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['PROPAGATE_EXCEPTIONS'] = True

# app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql+pymysql://admin01:tsdc_web@db/tsdc_web' # docker app.py with database
# app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql+pymysql://admin01:tsdc_web@localhost:8001/tsdc_web' # docker only database, app.py local
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "mysql+pymysql://admin:tsdc_web@host.docker.internal:8001/tsdc_web"
)

db = SQLAlchemy(app)

# frontend pages route
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(80), nullable=False)

    def __init__(self, username, password, role):
        self.username = username
        self.password = password
        self.role = role

    def __repr__(self):
        return "<User %r>" % self.username


def create_tables():
    with app.app_context():
        if not inspect(db.engine).has_table("users"):
            db.create_all()
            admin = User(username="admin", password="I3aIO0GapcxfT7WP", role="admin")
            user01 = User(username="user01", password="T5Do9EAtQAqTtfR4O", role="user")

            db.session.add(admin)
            db.session.add(user01)
            db.session.commit()

@app.post('/crawl_ntu_ocw')
def crawlNtuOcw(): return crawl_ntu_ocw()

@app.post('/crawl_coursera')
def crawlCoursera(): return crawl_coursera()

@app.post('/crawl_hahow')
def crawlHahow(): return crawl_hahow()

if __name__ == "__main__":
    # create_tables()
    app.run(host="0.0.0.0", port=8000, debug=True)
