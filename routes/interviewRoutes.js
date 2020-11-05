const mysql = require('mysql');
const chalk = require('chalk');

module.exports = (app, mysqlConnection)=> {
    // app.get('/', async (req, res) => {
    //     let f = null;
    //     await new Promise((resolve, reject) => {
    //         values = [["3", "rhythmpaliwal@ib.com", "IB"]];
    //         mysqlConnection.query('insert into users values ?', [values], (err, result) => {
    //             resolve(result);
    //         });
    //     }).then( result => console.log(result)).catch();
    //     res.send(f ? "Done fetching" : "error");
    // });

    app.get('/', async (req, res) => {
        let interviews = {
            details: []
        };
        await new Promise((resolve, reject) => {
            mysqlConnection.query('select * from interview', (err, result) => {
                resolve(result);
            });
        }).then( result => {
            for(row in result) {
                interviews.details.push(result[row]);
            }
        }).catch();
        //var jsonParsed = JSON.parse(interviews);
        //res.json(interviews);
        res.render("Intro.ejs");
    });
    app.get('/set',function(req,res){
        res.render("index.html");
    });

    app.post('/set-interview', async (req, res) => {
        let data_interview = {
            duration: req.body.duration,
            start_time: req.body.start_time 
        };
        let interviewee = req.body.interviewee;
        let interviewer = req.body.interviewer;
        if(interviewer && interviewee) {
            let interviewee_id = null;
            let interviewer_id = null;
            await new Promise((resolve, reject) => {
                mysqlConnection.query(`select u_id from user where email = "${interviewee}"`, (err, result) => {
                    if(err) reject(err);
                    resolve(result);
                });
            }).then( result => {
                if(result.length == 0) {
                    throw "No email found";
                }
                interviewee_id = result[0].u_id;
            }).catch((message) => {
                res.json({error: "No such interviewee email found"});
            });

            await new Promise((resolve, reject) => {
                mysqlConnection.query(`select u_id from user where email = "${interviewer}"`, (err, result) => {
                    if(err) reject(err);
                    resolve(result);
                });
            }).then( result => {
                if(result.length == 0) {
                    throw "No email found";
                }
                interviewer_id = result[0].u_id; 
            }).catch((message) => {
                res.json({error: "No such interviewer email found"});
            });

            await new Promise((resolve, reject) => {
                
                mysqlConnection.query(`select interview_id from interview I where interviewee = ${interviewee_id} and I.start_time <= ${data_interview.start_time} and I.start_time+I.duration >= ${data_interview.start_time}`, (err, result) => {
                    resolve(result);
                });
            }).then( result => {
                if(result && result.length > 0) res.send({error: "Interviewee not free."});
            }).catch();

            await new Promise((resolve, reject) => {
                mysqlConnection.query(`select interview_id from interview I where interviewer = ${interviewer_id} and I.start_time <= ${data_interview.start_time} and I.start_time+I.duration >= ${data_interview.start_time}`, (err, result) => {
                    resolve(result);
                });
            }).then( result => {
                if(result && result.length > 0) res.send({error: "Interviewer not free."});
            }).catch();

            await new Promise((resolve, reject) => {
                let values = [[interviewee_id, interviewer_id, data_interview.start_time, data_interview.duration]];
                mysqlConnection.query('insert into interview(interviewee, interviewer, start_time, duration) values ?', [values], (err, result) => {
                    resolve(result);
                });
            }).then( result => res.send("Done")).catch();
        } else {
            res.json({error: "Please enter two appropriate users."});
        }
    });

    app.post('/update-interview', async (req, res) => {
        let data_interview = {
            duration: req.body.duration,
            start_time: req.body.start_time 
        };
        let id = req.body.id;
        let interviewee = req.body.interviewee;
        let interviewer = req.body.interviewer;
        if(interviewer && interviewee) {
            let interviewee_id = null;
            let interviewer_id = null;
            await new Promise((resolve, reject) => {
                mysqlConnection.query(`select u_id from user where email = "${interviewee}"`, (err, result) => {
                    if(err) reject(err);
                    resolve(result);
                });
            }).then( result => {
                if(result.length == 0) {
                    throw "No email found";
                }
                interviewee_id = result[0].u_id; 
            }).catch((message) => {
                res.json({error: "No such interviewee email found"});
            });

            await new Promise((resolve, reject) => {
                mysqlConnection.query(`select u_id from user where email = "${interviewer}"`, (err, result) => {
                    if(err) reject(err);
                    resolve(result);
                });
            }).then( result => {
                if(result.length == 0) {
                    throw "No email found";
                }
                interviewer_id = result[0].u_id; 
            }).catch((message) => {
                res.json({error: "No such interviewer email found"});
            });

            await new Promise((resolve, reject) => {
                mysqlConnection.query(`select interview_id from interview I where interviewee = ${interviewee_id} and I.start_time <= ${data_interview.start_time} and I.start_time+I.duration >= ${data_interview.start_time} and id <> I.interview_id`, (err, result) => {
                    resolve(result);
                });
            }).then( result => {
                if(result && result.length > 0) res.send({error: "Interviewee not free."});
            }).catch();

            await new Promise((resolve, reject) => {
                mysqlConnection.query(`select interview_id from interview I where interviewer = ${interviewer_id} and I.start_time <= ${data_interview.start_time} and I.start_time+I.duration >= ${data_interview.start_time} and id <> I.interview_id`, (err, result) => {
                    resolve(result);
                });
            }).then( result => {
                if(result && result.length > 0) res.send({error: "Interviewer not free."});
            }).catch();

            await new Promise((resolve, reject) => {
                mysqlConnection.query(`delete from interview where interview_id = ${id}`, (err, result) => {
                    resolve(result);
                });
            }).then().catch();

            await new Promise((resolve, reject) => {
                let values = [[id, interviewee_id, interviewer_id, data_interview.start_time, data_interview.duration]];
                mysqlConnection.query('insert into interview(interview_id, interviewee, interviewer, start_time, duration) values ?', [values], (err, result) => {
                    resolve(result);
                });
            }).then( result => res.send("Done")).catch();
        } else {
            res.json({error: "Please enter two appropriate users."});
        }
    });
};