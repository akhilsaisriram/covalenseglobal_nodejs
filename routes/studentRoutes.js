const express = require('express');
const {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentByNameAndPhone
} = require('../controllers/studentController');

const router = express.Router();

router.get('/', getStudents);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.post('/find', getStudentByNameAndPhone);

module.exports = router;
