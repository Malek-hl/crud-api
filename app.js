const express = require('express');
const app = express();
const mongoose = require('./database/mongoose');

const TaskList = require('./database/models/taskList');
const Task = require('./database/models/task');



/*
CORS : Cross Origin Request Security
Backend : http://localhost:3000
Frontend : http://localhost:4200
*/

// 3rd party library, app.use(cors());
// Add headers:
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});
// Example of middleware:
app.use(express.json());  //3rd party body parser 

// Routes  of REST API Endpoints or RESTFUL webservices Endpoints:
/*
TaskList - Create, Update, ReadTaskListById, ReadAllTaskList
Task - Create, Update, ReadTaskById, ReadAllTask
*/

// Routes or API endpoints for TaskList model
// Get All TaskLists
// http://localhost:3000/tasklists => [{ TaskList }, {TaskList}]

app.get('/tasklists', (req, res) => {
    TaskList.find({})
        .then( lists => {
            res.status(200).send(lists);
        })
        .catch(error  => {
            console.log(error);
            res.status(500)
        });
});

// Route or endpoints for creating a taskList:

app.post('/tasklists', (req, res) => {

    console.log(req.body);
    let taskListObj = { 'title': req.body.title };
    TaskList(taskListObj).save()
        .then( lists => {
            res.status(201).send(lists);
        })
        .catch( error => {
            console.log(error);
            res.status(500)
        });
});


// Endpoint to get one tasklist by tasklistId: http://localhost:3000/tasklists/6565133e6c2a326525f84bab
app.get(
    '/tasklists/:tasklistId', (req, res) => {
        let tasklistId = req.params.tasklistId;
        TaskList.find({ _id: tasklistId })
            .then( taskList => {
                res.status(200).send(taskList)
            })
            .catch((error) => {
                console.log(error);
                res.status(500)
            });

    }
);

// Put is full update of object
app.put('/tasklists/:taslistId', (req, res) => {
    TaskList.findOneAndUpdate({ _id: req.params.taslistId }, { $set: req.body})
        .then( taskList => {
            // taskList = TaskList.findOne({ _id: req.params.taslistId });
            res.status(200).send(taskList)
        })
        .catch( error => {
            console.log(error);
            res.status(500)
        });
});

// Patch is partial update of one field of an object
app.patch('/tasklists/:taslistId', (req, res) => {
    TaskList.findOneAndUpdate({ _id: req.params.taslistId }, { $set: req.body })
        .then( taskList => {
            // taskList = TaskList.findOne({ _id: req.params.taslistId });
            res.status(200).send(taskList)
        })
        .catch( error  => {
            console.log(error);
            res.status(500)
        });
});

// Delete a taskList by id:
app.delete('/tasklists/:taslistId', (req, res) => {
    TaskList.findByIdAndDelete(req.params.taslistId)
        .then( taskList => {
            res.status(200).send(taskList)
        })
        .catch( error  => {
            console.log(error);
            res.status(500)
        });
});
app.listen(3000, () => {
    console.log("Server started on port 3000");
});