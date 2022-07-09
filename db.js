const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
const port = 5500;

// Create connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ponditi_overflow',
});

db.connect();

const create_user_tbl = `CREATE TABLE user_tbl(
    user_email varchar(100) PRIMARY KEY NOT NULL ,
    user_pass varchar(100),
    user_name varchar(50),
    img_url varchar(1000),
    job varchar(50),
    study varchar(50),
    location varchar(50)
    );`;

const create_question_tbl = `CREATE TABLE question_tbl(
        question_id varchar(100) PRIMARY KEY NOT NULL,
        question_description varchar(500),
        user_email varchar(50),
        time varchar(20)
        );`;

const create_answer_tbl = `CREATE TABLE answer_tbl(
        answer_id varchar(100) PRIMARY KEY NOT NULL,
        question_id varchar(100),
        answer_description varchar(10000),
        user_email varchar(50),
        time varchar(20)
    );`;

const create_following_tbl = `CREATE TABLE following_tbl(
        followed varchar(100) NOT NULL ,
        follower varchar(100) NOT NULL
        );`;

const create_upvote_tbl = `CREATE TABLE upvote_tbl(
            answer_id varchar(100) NOT NULL ,
            user_email varchar(100) NOT NULL
            );`;

const create_notification_tbl = `CREATE TABLE notification_tbl(
    notification_id varchar(100) NOT NULL ,
    user_email varchar(100) NOT NULL,
    notification_title varchar(100) NOT NULL,
    notification_description varchar(300) NOT NULL,
    answer_id varchar(100) NOT NULL,
    type varchar(100),
    time varchar(300)
);`;

const create_share_tbl = `CREATE TABLE share_tbl(
    user_email varchar(100) NOT NULL ,
    answer_id varchar(100) NOT NULL, 
    time varchar(100)
    );`;

db.query(create_user_tbl, (err, rows, fields) => {
    console.log(err.code);
} )