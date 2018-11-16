from flask import Flask, render_template, url_for, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db/main.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

#  Have tried to make SQLAlchemy in another .py file but it calls errors with connection to app


class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(240), nullable=False)
    completed = db.Column(db.Boolean, nullable=False)


db.init_app(app)


def get_tasks():  # function that forms list with tasks data from database
    data = list()
    for row in Tasks.query.all():
        data.append({'id': row.id,
                     'text': row.text,
                     'completed': row.completed})
    return data


@app.route('/')  # index function that renders web-page
def index():
    return render_template('index.html')


@app.route('/task', methods=['GET'])  # function that return all tasks in database
def get_task():
    return jsonify(get_tasks())


@app.route('/task', methods=['POST'])  # main handle function
def post_task():
    dict_data = eval(request.data.decode('utf-8'))  # firstly get and decode data from request
    if dict_data['action']['action'] == 'add' and dict_data['data']['text'] != '':  # add task
        task = Tasks(text=dict_data['data']['text'], completed=False)
        db.session.add(task)
        db.session.commit()
    elif dict_data['action']['action'] == 'complete':  # change status of task
        task = Tasks.query.filter_by(id=int(dict_data['data']['id'])).first()
        if task.completed:  # change status on opposite value
            task.completed = False
        else:
            task.completed = True
        db.session.commit()
    elif dict_data['action']['action'] == 'delete':  # delete task
        task = Tasks.query.filter_by(id=int(dict_data['data']['id'])).first()
        db.session.delete(task)
        db.session.commit()
    elif dict_data['action']['action'] == 'change':  # change tasks text
        task = Tasks.query.filter_by(id=int(dict_data['data']['id'])).first()
        task.text = dict_data['data']['text']
        db.session.commit()
    return jsonify(get_tasks())


if __name__ == '__main__':
    app.debug = True
    app.run(host='localhost', port='8080')
