const router = require('express').Router()
const Student = require('../models/stud')
const Subject = require('../models/sub')

router.get('/:first_name', async(req,res)=>{
    const tempStudent = await Student.findOne({FirstName: req.params.first_name})
    const tempMarks = await Subject.findOne({RollNo: tempStudent.RollNo})
    res.json({Student_Data : tempStudent, Marksheet :tempMarks});
})
module.exports = router;