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

// home route
app.get('/', (req, res) => {
    res.send('Server is running at port ' + port);
});

// Signup route
app.post('/signup', (req, res) => {
    const user = req.body;

    const create_user_tbl = `CREATE TABLE user_tbl(
          user_email varchar(100) PRIMARY KEY NOT NULL ,
          user_pass varchar(100),
          user_name varchar(50),
          img_url varchar(1000),
          job varchar(50),
          study varchar(50),
          location varchar(50)
          );`;

    const insert_user_tbl = `INSERT INTO user_tbl(user_email, user_pass, user_name, img_url)
          VALUES ('${user.user_email}', '${user.user_pass}', '${user.user_name}', '${user.img_url}');`;

    db.query(insert_user_tbl, (err, rows, fields) => {
        if (err?.errno === 1146) {
            // Creating user_tbl if it doesn't exist
            console.log(err.code);
            db.query(create_user_tbl, (err, rows, fields) => {
                if (err) {
                    console.error(err.code);
                    res.send(false);
                }
                console.log('user_tbl created successfully!');
            });

            // Insertig user data into user_tbl
            db.query(insert_user_tbl, (err, rows, fields) => {
                if (err) {
                    console.error(err.code);
                    res.send(false);
                } else {
                    console.log(
                        'inserted user data into user_tbl after creating user_tbl'
                    );
                    res.send(true);
                }
            });
        } else {
            console.log('Inserted user data into user_tbl');
            res.send(true);
        }
    });
});

// Login route
app.post('/login', (req, res) => {
    const requestedUser = req.body;

    let user;
    const fetch_user = `SELECT * FROM user_tbl 
    WHERE user_email = '${requestedUser.user_email}';`;
    db.query(fetch_user, (err, rows, fields) => {
        if (err) {
            console.log('Error from /login: ', err);
        } else {
            user = rows[0];
            if (requestedUser.user_pass === user?.user_pass) {
                res.json(user);
            } else {
                res.send(false);
            }
        }
    });
});

// Update profile
app.post('/updateprofile', (req, res) => {
    const { user_email, job, study, location } = req.body;

    // const user_email = 'mdshahidulridoy@gmail.com', job = 'googler', study = 'buet', location = 'new york city';

    const update_profile = `UPDATE user_tbl
    SET job = '${job}', study = '${study}', location = '${location}'
    WHERE user_email = '${user_email}'`;

    db.query(update_profile, (err, rows, fields) => {
        if (err) {
            console.log('Error from update profile: ' + err.code);
            res.send(false);
        } else {
            res.send(true);
        }
    });
});

// Question route
app.post('/createquestion', (req, res) => {
    const questionInfo = req.body;

    const create_question_tbl = `CREATE TABLE question_tbl(
      question_id varchar(100) PRIMARY KEY NOT NULL,
      question_description varchar(200),
      user_email varchar(50),
      time varchar(20)
      );`;

    // const questionInfo = {
    //     question_description: `What is the purpose of the weird platform ponditi-overflow? `,
    //     user_email: 'mdshahidulridoy@gmail.com',
    // };

    const insert_question_tbl = `INSERT INTO question_tbl(question_id, question_description, user_email, time)
  VALUES ('${Date.now()}', '${questionInfo.question_description}', '${
        questionInfo.user_email
    }', '${new Date().toLocaleTimeString()}')`;

    db.query(insert_question_tbl, (err, rows, fields) => {
        if (err?.errno === 1146) {
            // Creating question_tbl if it doesn't exist
            console.log(err.code);
            db.query(create_question_tbl, (err, rows, fields) => {
                if (err) {
                    console.error(err.code);
                    res.send(false);
                }
                console.log('question_tbl created successfully!');
            });

            // Insertig question data into question_tbl
            db.query(insert_question_tbl, (err, rows, fields) => {
                if (err) {
                    console.error(err.code);
                    res.send(false);
                } else {
                    console.log(
                        'inserted question data into question_tbl after creating question_tbl'
                    );
                    res.send(true);
                }
            });
        } else {
            console.log('Inserted question data into question_tbl');
            res.send(true);
        }
    });
});

// Answer route
app.post('/createanswer', (req, res) => {
    const answerInfo = req.body;

    const create_answer_tbl = `CREATE TABLE answer_tbl(
      answer_id varchar(100) PRIMARY KEY NOT NULL,
      question_id varchar(100),
      answer_description varchar(10000),
      user_email varchar(50),
      time varchar(20)
    );`;

    // const answerInfo = {
    //     question_id: '1656879636929',
    //     answer_description: `This is an awesome platform for learning and earning `,
    //     user_email: 'mdshahidulridoy@gmail.com',
    // };

    const insert_answer_tbl = `INSERT INTO answer_tbl(answer_id, question_id, answer_description, user_email, time)
VALUES ('${Date.now()}', '${answerInfo.question_id}', '${
        answerInfo.answer_description
    }', '${answerInfo.user_email}', '${new Date().toLocaleTimeString()}')`;

    db.query(insert_answer_tbl, (err, rows, fields) => {
        if (err?.errno === 1146) {
            // Creating answer_tbl if it doesn't exist
            console.log(err.code);
            db.query(create_answer_tbl, (err, rows, fields) => {
                if (err) {
                    console.error(err.code);
                    res.send(false);
                }
                console.log('answer_tbl created successfully!');
            });

            // Insertig answer data into answer_tbl
            db.query(insert_answer_tbl, (err, rows, fields) => {
                if (err) {
                    console.error(err.code);
                    res.send(false);
                } else {
                    console.log(
                        'inserted answer data into answer_tbl after creating answer_tbl'
                    );
                    res.send(true);
                }
            });
        } else {
            console.log('Inserted answer data into answer_tbl');
            res.send(true);
        }
    });
});

// Get user specific questions
app.get('/getuserquestions/:user_email', (req, res) => {
    const user_email = req.params.user_email;

    // const user_email = 'mdshahidulridoy@gmail.com';

    const get_user_questions = `SELECT question_id, question_description, time
    FROM question_tbl
    NATURAL JOIN user_tbl
    WHERE user_email = '${user_email}'`;

    db.query(get_user_questions, (err, rows, fields) => {
        if (err) {
            console.error(err.code);
        } else {
            res.send(rows);
        }
    });
});

// Get all questions
app.get('/getallquestions', (req, res) => {
    const get_all_questions = `SELECT user_email, question_id, question_description, user_name, time
    FROM question_tbl
    NATURAL JOIN user_tbl`;
    db.query(get_all_questions, (err, rows, fields) => {
        if (err) {
            console.error(err.code);
        } else {
            res.send(rows);
        }
    });
});

// Get user specific answers
app.get('/getuseranswers/:user_email', (req, res) => {
    let user_email = req.params.user_email;
    const get_user_answers = `SELECT question_description, question_tbl.question_id, answer_description, answer_id, answer_tbl.time, img_url
  FROM question_tbl, answer_tbl, user_tbl
  WHERE question_tbl.question_id = answer_tbl.question_id and answer_tbl.user_email = user_tbl.user_email and user_tbl.user_email = '${user_email}'`;

    db.query(get_user_answers, (err, rows, fields) => {
        if (err) {
            console.error(err.code);
        } else {
            res.send(rows);
        }
    });
});

// Get all answers
app.get('/getallanswers', (req, res) => {
    const get_all_answers = `SELECT answer_tbl.user_email, question_description, question_tbl.question_id, answer_description, answer_id, answer_tbl.time, user_name, img_url
  FROM question_tbl, answer_tbl, user_tbl
  WHERE question_tbl.question_id = answer_tbl.question_id and answer_tbl.user_email = user_tbl.user_email`;
    db.query(get_all_answers, (err, rows, fields) => {
        if (err) {
            console.error(err.code);
        } else {
            res.send(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`Ponditi overflow listening on port ${port}`);
});
