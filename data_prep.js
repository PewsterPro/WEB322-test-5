const fs = require("fs");
let students = [];

const Sequelize = require('sequelize');

var sequelize = new Sequelize('sqvigkod', 'sqvigkod', 'YXdifiyCC9jytLkfZcMfgaQNdfvGasNs', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true
   },
   query:{raw: true} // update here, you. Need this
   }); 

   sequelize.authenticate().then(()=> console.log('Connection success.'))
   .catch((err)=>console.log("Unable to connect to DB.", err));

var Student = sequelize.define('Student', {
    StudID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    }, 
    name: Sequelize.STRING,
    program: Sequelize.STRING,
    gpa: Sequelize.FLOAT
})

module.exports.prep = () =>{
    return new Promise((resolve, reject) => {
        sequelize.sync().then((Student) => {
            resolve();
        }).catch((err) => {
            reject("unable to sync the database");
        });
        reject();
    });
}

module.exports.cpa = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Student.findAll({
                where:{
                    program: "CPA"
                }}));
        }).catch((err) => {
            reject("no results returned.");
        });
    });
}

module.exports.highGPA = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Student.findAll({
                where:{
                    gpa: "5"
                }}));
        }).catch((err) => {
            reject("no results returned.");
        });
    });
}

module.exports.allStudent = () =>  {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Student.findAll());
        }).catch((err) => {
            reject("no results returned.");
        });
    });
}

module.exports.addStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for (let x in studentData) {
                if(studentData[x] == ""){
                    studentData[x] = null;
                }
            }
            resolve(Student.create({
                StudID: studentData.StudID,
                name: studentData.name,
                program: studentData.program,
                gpa: studentData.gpa
                }));
            }).catch(() => {
                reject("unable to create employee.");
            });
        }).catch(() => {
            reject("unable to create employee.");
    });
}

function getStudentById(ById) {
    return new Promise((resolve, reject) => {
        let studById = students.filter(student => student.studId == ById.studId)
        if (studById.length == 0) {
            reject("no results returned");
        }
        else {
            resolve(studById);
        }
    });
}
