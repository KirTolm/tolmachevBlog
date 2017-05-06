drop table if exists post;
create table post (
    id integer primary key autoincrement,
    title text not null,
    text text not null,
    content text,
    datetime text not null
    );