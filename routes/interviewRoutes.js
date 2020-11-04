const mysql = require('mysql');
const chalk = require('chalk');

module.exports = (app, mysqlConnection)=> {
    app.get('/', async (req, res) => {
        let f = null;
        await new Promise((resolve, reject) => {
            values = [[ "rhythmpall@ib.com"]];
            mysqlConnection.query('insert into users(email) values ?', [values], (err, result) => {
                resolve(result);
            });
        }).then( result => console.log(result)).catch();
        res.send(f ? "Done fetching" : "error");
    });

    app.get('/show-interview', async (req, res) => {
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
        res.json(interviews);
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
                mysqlConnection.query(`select id from user where email = ${interviewee}`, (err, result) => {
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
                mysqlConnection.query(`select id from user where email = ${interviewer}`, (err, result) => {
                    if(err) reject(err);
                    resolve(result);
                });
            }).then( result => {
                if(result.length == 0) {
                    throw "No email found";
                }
                interviewer_id = result[0].id; 
            }).catch((message) => {
                res.json({error: "No such interviewer email found"});
            });

            await new Promise((resolve, reject) => {
                let values = [[data_interview.start_time, data_interview.duration]];
                mysqlConnection.query(`insert into interview(start_time, duration) values ?`, [values], (err, result) => {
                    resolve(result);
                });
            }).then( result => {
                res.send("Done");
            }).catch();
        } else {
            res.json({error: "Please enter two appropriate users."});
        }
    });

   //app.post('/update-interview', async (req, res) => {});
};