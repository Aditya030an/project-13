const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController.js');

const router = express.Router();

router.get('/getTask', getTasks);
router.post('/createTask', createTask);
router.put('/updateTask/:id', updateTask);
router.delete('/deleteTask/:id', deleteTask);

module.exports = router;
