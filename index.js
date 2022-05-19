const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// export the model so that we use it
const TodoTask = require("./models/TodoTask");
const req = require('express/lib/request');
const res = require('express/lib/response');

dotenv.config();

// code to access the css
app.use('/static', express.static('public'));

// Urlencoded to extract the data from the form by and adds it to the body property of the request.
app.use(express.urlencoded({ extended: true }));

// connection to database
// mongoose.set('useFindAndModify', false); -> deprecated
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log('Connected to db!');
    app.listen(3000, () => console.log('Server up and running'));
});

// view engine configuration
app.set('view engine', 'ejs');

// post method (CRUD : Create)
app
    .post('/', async (req, res) => {
        const todoTask = new TodoTask({
            content: req.body.content
        });
        try {
            await todoTask.save();
            res.redirect('/');
        } catch (err) {
            res.redirect('/');
        }
    });

// get method used to pass information to the browser (CRUD : Read)
app
    .get('/', (req, res) => {
        TodoTask.find({}, (err, tasks) => {
            res.render('todo.ejs', { todoTasks: tasks });
        });
    });

// update method (CRUD : Update) => findByIdAndUpdate
app
    .route('/edit/:id')
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render('todoEdit.ejs', { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect('/');
        });
    });

// delete method (CRUD : Delete) => findByIdAndRemove.
app
    .route('/remove/:id')
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.send(500, err);
            res.redirect('/');
        });
    });
