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

// ---------------------------------------- Helpers--------------------------------
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

// Total 16 colors
const tagColors = [
    { name: 'blue', code: 'rgb(185 28 28)' },
    { name: 'orange', code: 'rgb(194 65 12)' },
    { name: 'amber', code: 'rgb(180 83 9)' },
    { name: 'yellow', code: 'rgb(161 98 7)' },
    { name: 'lime', code: 'rgb(77 124 15)' },
    { name: 'green', code: 'rgb(21 128 61)' },
    { name: 'emerald', code: 'rgb(4 120 87)' },
    { name: 'teal', code: 'rgb(15 118 110)' },
    { name: 'cyan', code: 'rgb(14 116 144)' },
    { name: 'blue', code: 'rgb(29 78 216)' },
    { name: 'indigo', code: 'rgb(67 56 202)' },
    { name: 'violet', code: 'rgb(109 40 217)' },
    { name: 'purple', code: 'rgb(126 34 206)' },
    { name: 'fuchsia', code: 'rgb(162 28 175)' },
    { name: 'pink', code: 'rgb(190 24 93)' },
    { name: 'rose', code: 'rgb(190 18 60)' },
];

// ---------------------------------------- API routes --------------------------------

// home route
app.get('/', (req, res) => {
    res.send('Server is running at port ' + port);
});

// ---------------------------------------- Authentication --------------------------------

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
                    const fetch_user_query = `SELECT * FROM user_tbl 
    WHERE user_email = '${user.user_email}';`;

                    db.query(fetch_user_query, (err, rows, fields) => {
                        if (err) {
                            console.log('Error fetching data: ', err.code);
                            res.send(false);
                        } else {
                            delete rows[0].user_pass;
                            res.send(rows[0]);
                        }
                    });
                }
            });
        } else {
            const fetch_user_query = `SELECT * FROM user_tbl 
    WHERE user_email = '${user.user_email}';`;

            db.query(fetch_user_query, (err, rows, fields) => {
                if (err) {
                    console.log('Error fetching data: ', err.code);
                    res.send(false);
                } else {
                    delete rows[0].user_pass;
                    res.send(rows[0]);
                }
            });
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
                delete user.user_pass;
                res.json(user);
            } else {
                res.send(false);
            }
        }
    });
});

app.post('/sociallogin', (req, res) => {
    const { user_email, user_name, img_url } = req.body;
    // const user_email = 'mdshahidulridoy@gmail.co';
    // const user_name = 'Md Shahidul Islam';
    // const img_url = '';

    // queries
    const fetch_user_query = `SELECT * FROM user_tbl 
    WHERE user_email = '${user_email}';`;

    const create_user_tbl = `CREATE TABLE user_tbl(
                    user_email varchar(100) PRIMARY KEY NOT NULL ,
                    user_pass varchar(100),
                    user_name varchar(50),
                    img_url varchar(1000),
                    job varchar(50),
                    study varchar(50),
                    location varchar(50)
                    );`;

    const insert_user_tbl = `INSERT INTO user_tbl(user_email, user_name, img_url)
                    VALUES ('${user_email}', '${user_name}', '${img_url}');`;

    db.query(fetch_user_query, (err, rows, fields) => {
        if (err?.code) {
            console.log('Error fetching data: ', err.code);
            res.send(false);
        } else {
            const str = JSON.stringify(rows);
            if (str === '[]') {
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
                                const fetch_user_query = `SELECT * FROM user_tbl 
                                    WHERE user_email = '${user_email}';`;

                                db.query(
                                    fetch_user_query,
                                    (err, rows, fields) => {
                                        if (err) {
                                            console.log(
                                                'Error fetching data: ',
                                                err.code
                                            );
                                            res.send(false);
                                        } else {
                                            delete rows[0].user_pass;
                                            res.send(rows[0]);
                                        }
                                    }
                                );
                            }
                        });
                    } else {
                        db.query(fetch_user_query, (err, rows, fields) => {
                            if (err) {
                                console.log('Error fetching data: ', err.code);
                                res.send(false);
                            } else {
                                delete rows[0].user_pass;
                                res.send(rows[0]);
                            }
                        });
                    }
                });
            } else {
                delete rows[0].user_pass;
                res.send(rows[0]);
            }
        }
    });
});

// ---------------------------------------- User table --------------------------------

app.get('/profile/:user_email', (req, res) => {
    const user_email = req.params.user_email;

    const fetch_user_query = `SELECT * FROM user_tbl 
    WHERE user_email = '${user_email}';`;

    db.query(fetch_user_query, (err, rows, fields) => {
        if (err?.code) {
            console.log('Error fetching data: ', err.code);
            res.send(false);
        } else {
            delete rows[0]?.user_pass;
            res.send(rows[0]);
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
            const fetch_user = `SELECT * FROM user_tbl 
                WHERE user_email = '${user_email}';`;
            db.query(fetch_user, (err, rows, fields) => {
                if (err) {
                    console.log('Error from fetch user: ' + err.code);
                } else {
                    delete rows[0].user_pass;
                    res.send(rows[0]);
                }
            });
        }
    });
});

// ---------------------------------------- Question table --------------------------------

// Question route
app.post('/createquestion', (req, res) => {
    const questionInfo = req.body;
    const d = new Date();
    const dateTime = `${
        months[d.getMonth()]
    } ${d.getDay()} at ${d.toLocaleTimeString()}`;

    const create_question_tbl = `CREATE TABLE question_tbl(
      question_id varchar(100) PRIMARY KEY NOT NULL,
      question_description varchar(500),
      user_email varchar(50),
      time varchar(20),
      tags varchar(500)
      );`;

    let color_values_query = `VALUES(${questionInfo.tags[0]}, ${
        tagColors[Math.floor(Math.random() * 16)]
    })`;

    questionInfo.tags.forEach((tag, index) => {
        if (index) {
            color_values_query += `, (tag, ${
                tagColors[Math.floor(Math.random() * 16)]
            })`;
        }
    });

    const insert_tags_tbl = `
        INSERT INTO tags_tbl(tag_name, tag_color) 
        ${color_values_query}
    `;

    db.query(insert_tags_tbl, (err, rows, fields) => {
        if (err) {
            console.log('Error while inserting tags!');
        }
    });

    // const questionInfo = {
    //     question_description: `What is the purpose of the weird platform ponditi-overflow? `,
    //     user_email: 'mdshahidulridoy@gmail.com',
    // };

    const insert_question_tbl = `INSERT INTO question_tbl(question_id, question_description, user_email, time, tags)
  VALUES ('${Date.now()}', '${questionInfo.question_description}', '${
        questionInfo.user_email
    }', '${dateTime}', '${questionInfo.tags.join()}')`;

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

// Get user specific questions
app.get('/getuserquestions/:user_email', (req, res) => {
    const user_email = req.params.user_email;

    // const user_email = 'mdshahidulridoy@gmail.com';

    const get_user_questions = `SELECT question_id, question_description, time, tags
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

// get the info about a question
app.get('/question/:question_id', (req, res) => {
    const question_id = req.params.question_id;

    const query = `
        SELECT * 
        FROM question_tbl
        WHERE question_id = ${question_id};  
    `;

    db.query(query, (err, rows, fields) => {
        if (err) {
            console.error(err.code);
        } else {
            res.send(rows[0]);
        }
    });
});

// ---------------------------------------- Answers table --------------------------------

// Answer route
app.post('/createanswer', (req, res) => {
    const answerInfo = req.body;
    const d = new Date();
    const dateTime = `${
        months[d.getMonth()]
    } ${d.getDay()} at ${d.toLocaleTimeString()}`;

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
    const answerId = Date.now();

    const insert_answer_tbl = `INSERT INTO answer_tbl(answer_id, question_id, answer_description, user_email, time)
        VALUES ('${answerId}', '${answerInfo.question_id}', '${
        answerInfo.answer_description
    }', '${answerInfo.user_email}', '${dateTime}')`;

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
                    res.send(`${answerId}`);
                }
            });
        } else {
            console.log('Inserted answer data into answer_tbl');
            res.send(`${answerId}`);
        }
    });
});

// Get user specific answers
app.get('/getuseranswers/:user_email', (req, res) => {
    let user_email = req.params.user_email;
    const get_user_answers = `SELECT *
  FROM question_tbl, answer_tbl, user_tbl
  WHERE question_tbl.question_id = answer_tbl.question_id and answer_tbl.user_email = user_tbl.user_email and user_tbl.user_email = '${user_email}'`;

    db.query(get_user_answers, (err, rows, fields) => {
        if (err) {
            console.error(err.code);
        } else {
            rows.forEach((row) => {
                delete row.user_pass;
            });
            res.send(rows);
        }
    });
});

// Get all answers
app.get('/getallanswers', (req, res) => {
    const get_all_answers = `SELECT answer_tbl.user_email, question_description, question_tbl.question_id, answer_description, answer_id, answer_tbl.time, user_name, img_url, job
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

// get all the answers on a specific question
app.get('/answers/:question_id', (req, res) => {
    const question_id = req.params.question_id;

    const query = `
        SELECT * 
        FROM answer_tbl
        NATURAL JOIN user_tbl
        WHERE question_id = ${question_id};  
    `;

    db.query(query, (err, rows, fields) => {
        if (err) {
            console.error(err.code);
        } else {
            rows.forEach((row) => {
                delete row.user_pass;
            });
            res.send(rows);
        }
    });
});

// get a specific answer Os-Traveller
app.get('/answer/:answer_id', (req, res) => {
    const answer_id = req.params.answer_id;

    const query = `
        SELECT * 
        FROM answer_tbl, user_tbl, question_tbl
        WHERE answer_tbl.answer_id = ${answer_id} AND answer_tbl.user_email = user_tbl.user_email AND answer_tbl.question_id = question_tbl.question_id;  
    `;

    db.query(query, (err, rows, fields) => {
        if (err) {
            console.error(err.code);
        } else {
            rows.forEach((row) => {
                delete row.user_pass;
            });
            res.send(rows);
        }
    });
});

app.delete('/answers/:answer_id', (req, res) => {
    const answer_id = req.params.answer_id;

    const query = `
        DELETE FROM answer_tbl
        WHERE answer_id = '${answer_id}'
    `;

    db.query(query, (err, rows, fields) => {
        if (err) {
            console.error('Error from answer delete: ', err);
            res.send(false);
        } else {
            res.send(true);
        }
    });
});

// ---------------------------------- Following table --------------------------------

// write following table
app.post('/modifyfollower', (req, res) => {
    const { followed, follower, mode } = req.body;

    // const followed = 'shahid';
    // const follower = 'faisal';

    const create_following_tbl = `CREATE TABLE following_tbl(
        followed varchar(100) NOT NULL ,
        follower varchar(100) NOT NULL
        );`;

    const insert_following_tbl = `INSERT INTO following_tbl(followed, follower)
        VALUES ('${followed}', '${follower}')`;

    const delete_following = `
        DELETE FROM following_tbl
        WHERE followed = '${followed}' and follower = '${follower}';
    `;

    if (mode === 'add') {
        db.query(insert_following_tbl, (err, rows, fields) => {
            if (err?.errno === 1146) {
                // Creating following_tbl if it doesn't exist
                console.log(err.code);
                db.query(create_following_tbl, (err, rows, fields) => {
                    if (err) {
                        console.error(err.code);
                        res.send(false);
                    }
                    console.log('following_tbl created successfully!');
                });

                // Insertig following data into following_tbl
                db.query(insert_following_tbl, (err, rows, fields) => {
                    if (err) {
                        console.error(err.code);
                        res.send(false);
                    } else {
                        console.log(
                            'inserted following data into following_tbl after creating following_tbl'
                        );

                        res.send(true);
                    }
                });
            } else {
                res.send(true);
            }
        });
    } else if (mode === 'delete') {
        db.query(delete_following, (err, rows, fields) => {
            if (err) {
                console.log('Error from deleting following: ', err);
                res.send(false);
            } else {
                res.send(true);
            }
        });
    }
});

// get followers api from following_tbl
app.get('/followers/:user_email', (req, res) => {
    const user_email = req.params.user_email;
    const get_followers_query = `
    SELECT follower
    FROM following_tbl
    WHERE followed = '${user_email}';
    `;

    db.query(get_followers_query, (err, rows, fields) => {
        if (err) {
            console.log('Error from getting followers query: ', err);
        } else {
            if (rows.length === 0) {
                res.send({});
            } else {
                const followers = {};
                rows.forEach((row) => {
                    followers[row.follower] = true;
                });
                res.send(followers);
            }
        }
    });
});

// get followings api from following_tbl
app.get('/followings/:user_email', (req, res) => {
    const user_email = req.params.user_email;
    const get_followings_query = `
    SELECT followed
    FROM following_tbl
    WHERE follower = '${user_email}';
    `;

    db.query(get_followings_query, (err, rows, fields) => {
        if (err) {
            console.log('Error from getting followings query: ', err);
        } else {
            if (rows.length === 0) {
                res.send({});
            } else {
                const followings = {};
                rows.forEach((row) => {
                    followings[row.followed] = true;
                });
                res.send(followings);
            }
        }
    });
});

// ---------------------------------- Upvote table --------------------------------

// write following table
app.post('/createupvote', (req, res) => {
    const { answer_id, user_email, mode } = req.body;

    // const answer_id = 11111111;
    // const user_email = 'mdshahidulridoy@gmail.com';
    // const mode = 'delete';

    const create_upvote_tbl = `CREATE TABLE upvote_tbl(
        answer_id varchar(100) NOT NULL ,
        user_email varchar(100) NOT NULL
        );`;

    const insert_upvote_tbl = `INSERT INTO upvote_tbl(answer_id, user_email)
        VALUES ('${answer_id}', '${user_email}')`;

    const delete_upvote_tbl = `
        DELETE FROM upvote_tbl
        WHERE user_email = '${user_email}' and answer_id = '${answer_id}'
    `;

    if (mode === 'add') {
        db.query(insert_upvote_tbl, (err, rows, fields) => {
            if (err?.errno === 1146) {
                // Creating upvote_tbl if it doesn't exist
                console.log(err.code);
                db.query(create_upvote_tbl, (err, rows, fields) => {
                    if (err) {
                        console.error(err.code);
                        res.send(false);
                    }
                    console.log('upvote_tbl created successfully!');
                });

                // Insertig upvote data into upvote_tbl
                db.query(insert_upvote_tbl, (err, rows, fields) => {
                    if (err) {
                        console.error(err.code);
                        res.send(false);
                    } else {
                        console.log(
                            'inserted upvote data into upvote_tbl after creating upvote_tbl'
                        );
                        res.send(true);
                    }
                });
            } else {
                res.send(true);
            }
        });
    } else if (mode === 'delete') {
        db.query(delete_upvote_tbl, (err, rows, fields) => {
            if (err) {
                console.log('From delete upvote: ' + err.code);
                res.send(false);
            } else {
                res.send(true);
            }
        });
    }
});

// get all people who upvoted on an answer

app.get('/upvoters/:answer_id', (req, res) => {
    const answer_id = req.params.answer_id;

    const get_upvoters_query = `
    SELECT user_email, user_name, img_url
    FROM upvote_tbl
    NATURAL JOIN user_tbl
    WHERE answer_id = '${answer_id}';
    `;

    db.query(get_upvoters_query, (err, rows, fields) => {
        if (err) {
            console.log('Error from getting upvoters query: ', err);
        } else {
            if (rows.length === 0) {
                res.send({});
            } else {
                const upvoters = {};
                rows.forEach((row) => {
                    upvoters[row.user_email] = {
                        user_name: row.user_name,
                        img_url: row.img_url,
                    };
                });
                res.send(upvoters);
            }
        }
    });
});

// ---------------------------------- Notifications table --------------------------------
// write notification table
app.post('/createnotification', (req, res) => {
    const { provoker, receiver, mode, answer_id, seen } = req.body;
    const d = new Date();
    const dateTime = `${
        months[d.getMonth()]
    } ${d.getDay()} at ${d.toLocaleTimeString()}`;

    // const provoker = 'faisal@gmail.com';
    // const receiver = 'shahid@gmail.com';
    // const mode = 'upvote';
    // const answer_id = '1657381487822';
    // const seen = false;

    const create_notification_tbl = `CREATE TABLE notification_tbl(
        notification_id varchar(100) NOT NULL ,
        provoker varchar(100) NOT NULL,
        receiver varchar(100) NOT NULL,
        mode varchar(10) NOT NULL,
        answer_id varchar(100) NOT NULL,
        seen varchar(10),
        time varchar(300)
        );`;

    const insert_notification_tbl = `INSERT INTO notification_tbl(notification_id, provoker, receiver, mode, answer_id, seen, time)
        VALUES ('${Date.now()}', '${provoker}', '${receiver}' ,'${mode}', '${answer_id}', '${seen}', '${dateTime}')`;

    db.query(insert_notification_tbl, (err, rows, fields) => {
        if (err?.errno === 1146) {
            // Creating notification_tbl if it doesn't exist
            console.log(err.code);
            db.query(create_notification_tbl, (err, rows, fields) => {
                if (err) {
                    console.error(err.code);
                    res.send(false);
                }
                console.log('notification_tbl created successfully!');
            });

            // Insertig notification data into notification_tbl
            db.query(insert_notification_tbl, (err, rows, fields) => {
                if (err) {
                    console.error(err.code);
                    res.send(false);
                } else {
                    console.log(
                        'inserted notification data into notification_tbl after creating notification_tbl'
                    );
                    res.send(true);
                }
            });
        } else {
            res.send(true);
        }
    });
});

// Get all the notifications
app.get('/getnotifications/:user_email', (req, res) => {
    const user_email = req.params.user_email;

    const get_notifications_query = `
    SELECT *
    FROM notification_tbl
    WHERE receiver = '${user_email}';
    `;

    db.query(get_notifications_query, (err, rows, fields) => {
        if (err) {
            console.log('Error from getting notifications query: ', err);
        } else {
            if (rows.length === 0) {
                res.send([]);
                // if no response send empty array  -- Os-Traveller
            } else {
                res.send(rows);
            }
        }
    });
});

app.post('/updatenotificationstatus', (req, res) => {
    const { notification_ids } = req.body;

    // const notification_ids = [23, 34, 1657448174291, 466];

    let str = notification_ids[0];

    notification_ids.forEach((id, index) => {
        index > 0 && (str += `, ${id}`);
    });

    const update_notifications_query = `
        UPDATE notification_tbl
        SET seen = 'true'
        WHERE notification_id IN (${str})
    `;

    db.query(update_notifications_query, (err, rows, fields) => {
        if (err) {
            console.log('Error from update_notifications_query: ', err);
            res.send(false);
        } else {
            res.send(true);
        }
    });
});

// Get unseen notification api
app.get('/newnotifications/:user_email', (req, res) => {
    const user_email = req.params.user_email;

    const get_notifications_query = `
    SELECT *
    FROM notification_tbl
    WHERE receiver = '${user_email}' AND seen = 'false';
    `;

    db.query(get_notifications_query, (err, rows, fields) => {
        if (err) {
            console.log('Error from getting notifications query: ', err);
        } else {
            if (rows.length === 0) {
                res.send([]);
                // if no response send empty array  -- Os-Traveller
            } else {
                res.send(rows);
            }
        }
    });
});

// ---------------------------------- Share table --------------------------------

// write share table
app.post('/createshare', (req, res) => {
    const { user_email, answer_id } = req.body;
    const d = new Date();
    const dateTime = `${
        months[d.getMonth()]
    } ${d.getDay()} at ${d.toLocaleTimeString()}`;

    // const user_email = 'mdshahidulridoy@gmail.com';
    // const answer_id = `1656879810929`;

    const create_share_tbl = `CREATE TABLE share_tbl(
        user_email varchar(100) NOT NULL ,
        answer_id varchar(100) NOT NULL, 
        time varchar(100)
        );`;

    const insert_share_tbl = `INSERT INTO share_tbl(user_email, answer_id, time)
        VALUES ('${user_email}', '${answer_id}', '${dateTime}')`;

    db.query(insert_share_tbl, (err, rows, fields) => {
        if (err?.errno === 1146) {
            // Creating share_tbl if it doesn't exist
            console.log(err.code);
            db.query(create_share_tbl, (err, rows, fields) => {
                if (err) {
                    console.error(err.code);
                    res.send(false);
                }
                console.log('share_tbl created successfully!');
            });

            // Insertig share data into share_tbl
            db.query(insert_share_tbl, (err, rows, fields) => {
                if (err) {
                    console.error(err.code);
                    res.send(false);
                } else {
                    console.log(
                        'inserted share data into share_tbl after creating share_tbl'
                    );

                    res.send(true);
                }
            });
        } else {
            res.send(true);
        }
    });
});

// get shares api from following_tbl
app.get('/shares/:user_email', (req, res) => {
    const user_email = req.params.user_email;

    const get_shares_query = `
        SELECT answer_tbl.question_id, question_tbl.question_description, answer_tbl.answer_id, answer_tbl.answer_description, answer_tbl.user_email, answer_tbl.time, user_tbl.user_name, user_tbl.img_url, user_tbl.job
        FROM share_tbl, answer_tbl, question_tbl, user_tbl
        WHERE share_tbl.user_email = '${user_email}' and share_tbl.answer_id = answer_tbl.answer_id and answer_tbl.question_id = question_tbl.question_id and answer_tbl.user_email = user_tbl.user_email
    `;

    db.query(get_shares_query, (err, rows, fields) => {
        if (err) {
            console.log('Error from getting shares query: ', err);
        } else {
            if (rows.length === 0) {
                res.send([]);
            } else {
                res.send(rows);
            }
        }
    });
});

// get all the shares of an answer

app.get('/sharers/:answer_id', (req, res) => {
    const answer_id = req.params.answer_id;

    const get_shares_query = `
    SELECT user_email
    FROM share_tbl
    WHERE answer_id = '${answer_id}';
    `;

    db.query(get_shares_query, (err, rows, fields) => {
        if (err) {
            console.log('Error from getting shares query: ', err);
        } else {
            if (rows.length === 0) {
                res.send({});
            } else {
                const shares = {};
                rows.forEach((row) => {
                    shares[row.user_email] = true;
                });
                res.send(shares);
            }
        }
    });
});

// ---------------------------------- Searching --------------------------------
app.get('/search/users/:str', (req, res) => {
    const str = req.params.str;
    const keywords = str.split('*');

    // Making query for user search
    let user_compare = `user_name LIKE "%${keywords[0]}%"`;

    keywords.forEach((keyword) => {
        keyword !== '' && (user_compare += ` OR user_name LIKE "%${keyword}%"`);
    });

    const user_search_query = `
        SELECT *
        FROM user_tbl
        WHERE ${user_compare};
    `;

    // Performing search on user_tbl
    db.query(user_search_query, (err, rows, fields) => {
        if (err) {
            console.log('Error from user search: ' + err);
        } else {
            rows.forEach((row) => {
                delete row.user_pass;
            });
            res.send(rows);
        }
    });
});

app.get('/search/questions/:str', (req, res) => {
    const str = req.params.str;
    const keywords = str.split('*');

    // Making query for question search
    let ques_compare = `question_description LIKE "%${keywords[0]}%"`;

    keywords.forEach((keyword) => {
        keyword !== '' &&
            (ques_compare += ` OR question_description LIKE "%${keyword}%"`);
    });

    const ques_search_query = `
        SELECT *
        FROM question_tbl
        WHERE ${ques_compare};
    `;

    // Performing search on ques_tbl
    db.query(ques_search_query, (err, rows, fields) => {
        if (err) {
            console.log('Error from question search: ' + err);
        } else {
            res.send(rows);
        }
    });
});

// Tag tble
app.get('/tags', (req, res) => {
    const tags_query = `
    SELECT *
    FROM tags_tbl
  `;
    db.query(tags_query, (err, rows, fields) => {
        if (err) {
            console.log('Error from get tags: ' + err);
        } else {
            res.send(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`Ponditi overflow listening on port ${port}`);
});
