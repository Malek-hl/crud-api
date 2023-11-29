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
        .then(lists => {
            res.status(200).send(lists);
        })
        .catch(error => {
            console.log(error);
            res.status(500)
        });
});

// Route or endpoints for creating a taskList:

app.post('/tasklists', (req, res) => {
    console.log(req.body);
    let taskListObj = { 'title': req.body.title };
    TaskList(taskListObj).save()
        .then(lists => {
            res.status(201).send(lists);
        })
        .catch(error => {
            console.log(error);
            res.status(500)
        });
});


// Endpoint to get one tasklist by tasklistId: http://localhost:3000/tasklists/6565133e6c2a326525f84bab
app.get(
    '/tasklists/:tasklistId', (req, res) => {
        let tasklistId = req.params.tasklistId;
        TaskList.find({ _id: tasklistId })
            .then(taskList => {
                res.status(200).send(taskList)
            })
            .catch((error) => {
                console.log(error);
                res.status(500)
            });

    }
);

// Put is full update of object
app.put('/tasklists/:tasklistId', (req, res) => {
    TaskList.findOneAndUpdate({ _id: req.params.tasklistId }, { $set: req.body })
        .then(taskList => {
            // taskList = TaskList.findOne({ _id: req.params.taslistId });
            res.status(200).send(taskList)
        })
        .catch(error => {
            console.log(error);
            res.status(500)
        });
});

// Patch is partial update of one field of an object
app.patch('/tasklists/:tasklistId', (req, res) => {
    TaskList.findOneAndUpdate({ _id: req.params.tasklistId }, { $set: req.body })
        .then(taskList => {
            // taskList = TaskList.findOne({ _id: req.params.taslistId });
            res.status(200).send(taskList)
        })
        .catch(error => {
            console.log(error);
            res.status(500)
        });
});

// Delete a taskList by id:
app.delete('/tasklists/:tasklistId', (req, res) => {
    // delete all tasks within the tasklist
    const deleteAllContainingTask = (taskList) => {
        Task.deleteMany({_taskListId: req.params.tasklistId})
        .then(() => {
            return taskList;
        })
        .catch(error => {
            console.log(error);
            res.status(500)
        });
    };
    const responseTaskList = TaskList.findByIdAndDelete(req.params.tasklistId)
        .then(taskList => {
            deleteAllContainingTask(taskList);
        })
        .catch(error => {
            console.log(error);
            res.status(500)
        });
        res.status(200).send(responseTaskList);
});

/* CRUD operattion for task, a task should always belong to a taskList */
// Get all tasks for one tasklist, http://localhost:3000/tasklist/:tasklistId/tasks/:taskId
app.get(('/tasklists/:tasklistId/tasks'), (req, res) => {
    Task.find({ _taskListId: req.params.tasklistId })
        .then(tasks => {
            res.status(200).send(tasks)
        })
        .catch(error => {
            console.log(error);
            res.status(500)
        });
});

// create a task inside a particular tasklist:
app.post('/tasklists/:tasklistId/tasks', (req, res) => {
    let taskObj = { 'title': req.body.title, '_taskListId': req.params.tasklistId };
    Task(taskObj).save()
        .then(task => {
            res.status(201).send(task);
        })
        .catch(error => {
            console.log(error);
            res.status(500)
        });
});

// Get one task inside one taskList:
app.get(('/tasklists/:tasklistId/tasks/:taskId'), (req, res) => {
    Task.findOne({ _taskListId: req.params.tasklistId, _id: req.params.taskId })
        .then(task => {
            res.status(200).send(task)
        })
        .catch(error => {
            console.log(error);
            res.status(500)
        });
});

// Update one task belonging to one taskList:
app.patch('/tasklists/:tasklistId/tasks/:taskId', (req, res) => {
    Task.findOneAndUpdate({ _taskListId: req.params.tasklistId, _id: req.params.taskId }, { $set: req.body })
        .then(task => {
            res.status(200).send(task)
        })
        .catch(error => {
            console.log(error);
            res.status(500)
        });
});


// Delete One task belonging in taskList:
app.delete('/tasklists/:tasklistId/tasks/:taskId', (req, res) => {
    Task.findOneAndDelete({ _taskListId: req.params.tasklistId, _id: req.params.taskId })
        .then(task => {
            res.status(200).send(task)
        })
        .catch(error => {
            console.log(error);
            res.status(500)
        });
});




// http://localhost:3000/tasklist/:tasklistId/tasks/:taskId

app.listen(3000, () => {
    console.log("Server started on port 3000");
});