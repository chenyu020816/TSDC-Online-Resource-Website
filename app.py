from flask_cors import CORS
from flask import Flask, send_from_directory, render_template, request, send_file
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from crawler.crawler_ntu_ocw import crawl_ntu_ocw
from crawler.crawler_coursera import crawl_coursera
from crawler.crawler_hahow import crawl_hahow
import os

import utils.database_class as db_cls
from crawler.crawler_coursera import crawl_coursera
from crawler.crawler_hahow import crawl_hahow
from crawler.crawler_ntu_ocw import crawl_ntu_ocw
from utils.database import create_user, login_user
from utils.database_class import db

app = Flask(__name__, static_folder="templates/build")

# CORS
CORS(app)

# config
app.config["CORS_HEADERS"] = "Content-Type"
app.config["PROPAGATE_EXCEPTIONS"] = True

# app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql+pymysql://admin01:tsdc_web@db/tsdc_web' # docker app.py with database
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "mysql+pymysql://admin:tsdc_web@localhost:8001/tsdc_web"
)
# app.config["SQLALCHEMY_DATABASE_URI"] = (
#    "mysql+pymysql://admin:tsdc_web@host.docker.internal:8001/tsdc_web"
# )

db.init_app(app)


# frontend pages route
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


@app.post("/crawl_ntu_ocw")
def crawlNtuOcw():
    return crawl_ntu_ocw()


@app.post("/crawl_coursera")
def crawlCoursera():
    return crawl_coursera()


@app.post("/crawl_hahow")
def crawlHahow():
    return crawl_hahow()


if __name__ == "__main__":
    if os.environ.get("WERKZEUG_RUN_MAIN") != "true":
        with app.app_context():
            db_cls.init_tables(app)
            print(login_user("test0", "test"))
            print(login_user("test0efijefsef", "test1"))
    # create_tables()
    app.run(host="0.0.0.0", port=8000, debug=True)
