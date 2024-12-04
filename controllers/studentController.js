const Student = require('../models/Student');
const {
    validateNameAndPhone,
    validateDob,
    validateClass,
    validateFeePaid,
} = require('./validation');

// Get all students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        if (students.length === 0) {
            return res.status(204).json({ message: "No students found" }); // 204 No Content
        }
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new student
const createStudent = async (req, res) => {
    const { name, phone, dob, studentClass, feePaid } = req.body;

    // Validate inputs
    const namePhoneValidation = validateNameAndPhone(name, phone);
    if (!namePhoneValidation.isValid) {
        return res.status(400).json({ message: namePhoneValidation.message });
    }

    const dobValidation = validateDob(dob);
    if (!dobValidation.isValid) {
        return res.status(400).json({ message: dobValidation.message });
    }

    const classValidation = validateClass(studentClass);
    if (!classValidation.isValid) {
        return res.status(400).json({ message: classValidation.message });
    }

    const feePaidValidation = validateFeePaid(feePaid);
    if (!feePaidValidation.isValid) {
        return res.status(400).json({ message: feePaidValidation.message });
    }

    try {
        const existingStudent = await Student.findOne({ phone, name });
        if (existingStudent) {
            return res.status(409).json({ message: "Student with this phone number and name already exists" });
        }

        const newStudent = new Student({
            name,
            phone,
            dob: new Date(dob), // Ensure dob is stored as a valid Date object
            studentClass,
            feePaid: feePaid || false, // Default to false if not provided
        });

        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update student by ID
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, phone, dob, studentClass, feePaid } = req.body;

    if (!name && !phone && !dob && !studentClass && feePaid === undefined) {
        return res.status(400).json({ message: "At least one field (name, phone, dob, class, feePaid) must be provided for update" });
    }

    const phoneValidation = validateNameAndPhone(name, phone);
    if (phone && !phoneValidation.isValid) {
        return res.status(400).json({ message: phoneValidation.message });
    }

    const dobValidation = validateDob(dob);
    if (dob && !dobValidation.isValid) {
        return res.status(400).json({ message: dobValidation.message });
    }

    const classValidation = validateClass(studentClass);
    if (studentClass && !classValidation.isValid) {
        return res.status(400).json({ message: classValidation.message });
    }

    const feePaidValidation = validateFeePaid(feePaid);
    if (feePaid !== undefined && !feePaidValidation.isValid) {
        return res.status(400).json({ message: feePaidValidation.message });
    }

    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            {
                name,
                phone,
                dob: dob ? new Date(dob) : undefined,
                studentClass,
                feePaid: feePaid !== undefined ? feePaid : undefined,
            },
            { new: true, runValidators: true } 
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete student by ID
const deleteStudent = async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a student by name and phone
const getStudentByNameAndPhone = async (req, res) => {
    const { name, phone } = req.body;

    // Validate that at least one of the parameters is provided
    if (!name && !phone) {
        return res.status(400).json({ message: "At least one of name or phone is required" });
    }

    try {
        // Build a query object to include both name and phone if they are provided
        const query = {};
        if (name) query.name = name;
        if (phone) query.phone = phone;

        // If both name and phone are provided, find the student matching both conditions
        const student = await Student.find(query);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentByNameAndPhone,
};
