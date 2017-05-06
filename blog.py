# -*- coding: utf-8 -*-
import sqlite3
import os
from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config.from_object(__name__)
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'blog.db'),
    DEBUG=True,
    SECRET_KEY='wf00i)&r7trs8cop52avqi=cf5udcc+tz8*dylx*7y5-l=5#a&',
    USERNAME='kirtolmachev',
    PASSWORD='KirTolm00t',
    UPLOAD_FOLDER = 'static/uploaded/',
    ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif']),
))
app.config.from_envvar('BLOG_SETTINGS', silent=True)

def connect_db():
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

@app.route('/')
def list():
    db = get_db()
    cur = db.execute('select id, title, text, content, datetime from post order by id desc')
    entries = cur.fetchall()
    return render_template('list.html', entries=entries)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

@app.route('/add', methods=['POST'])
def add_entry():
    if not session.get('logged_in'):
        abort(401)
    filepath = None
    file = request.files['content']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
    db = get_db()
    db.execute('insert into post (title, text, content, datetime) values (?, ?, ?, ?)', [request.form['title'], request.form['text'], filepath, request.form['datetime']])
    db.commit()
    flash('New entry was successfully posted')
    return redirect(url_for('list'))

@app.route('/delete/<int:post_id>', methods=['GET'])
def delete_entry(post_id):
    if not session.get('logged_in'):
        abort(401)
    db = get_db()
    db.execute('delete from post where id=?', (post_id,))
    db.commit()
    flash('The entry was deleted')
    return redirect(url_for('list'))

@app.route('/edit/<int:post_id>', methods=['POST'])
def edit_entry(post_id):
    if not session.get('logged_in'):
        abort(401)
    filepath = None
    file = request.files['editImg']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
    db = get_db()
    if filepath == None:
        db.execute('update post set title = ?, text=? where id=?', [request.form['title'], request.form['text'], post_id])
    else:
        db.execute('update post set title = ?, text=?, content=? where id=?', [request.form['title'], request.form['text'], filepath, post_id])
    db.commit()
    flash('The entry was edited')
    return redirect(url_for('list'))

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    error = None
    if request.method == 'POST':
        if request.form['username'] != app.config['USERNAME']:
            error = 'Invalid username'
        elif request.form['password'] != app.config['PASSWORD']:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('list'))
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    if not session.get('logged_in'):
        abort(401)
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('list'))

if __name__ == '__main__':
    app.run()