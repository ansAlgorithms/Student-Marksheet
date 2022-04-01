const Student = require('../models/stud'); //importing stud.js file

module.exports = {
    register : async(req,res) => {
        //res.json({message:"deep"})
      // Checking for existing student
      const rollExist = await Student.findOne({RollNo: req.body.roll_no});
      if(rollExist) return res.status(400).json({message:'Roll No already exists.'});
      
      // Creating data for new student
      user = new Student({
          FirstName: req.body.first_name,
          LastName: req.body.last_name,
          Age: req.body.age,
          RollNo: req.body.roll_no
      });
      try{
          const savedUser = await user.save();
          res.status(300).json({New_Student: savedUser});
      }catch(err){
          res.status(400).json({message: err});
          console.log(err);
      }
  },
  data : (req,res) =>{
    Student.find()
    .then(result =>{
        res.status(200).json({
            No_of_Student: result.length,
            Student_List: result
        });
    })
    .catch(err=>{
        res.json({error:err})
    })
  },
  delete : async (req, res) => {
    
    // Checking for non-existing student
    const rollExist = await Student.findOne({ RollNo: req.params.roll });
    if (!rollExist) return res.status(400).json({ message: 'Roll No not found !' });
    
    // Deletion of particular data from database 
    Student.deleteOne({ RollNo: req.params.roll })
      .then((result) => {
        res.status(200).json({ message: "successfully deleted", result: result });
      })
      .catch((err) => {
        res.status(500).json({
          message: "something went wrong",
          error: err,
        });
      });
  },
  update : (req,res)=>{
    Student.findOneAndUpdate({_id:req.params.id},{
        $set:{
            FirstName: req.body.first_name,
            LastName: req.body.last_name,
            Age: req.body.age,
            RollNo: req.body.roll_no
        }
    })
    .then(() => {
        res.status(200).json({ message: "successfully updated",Updated_data:req.body});
    })
    .catch((err) => {
        res.status(500).json({
          message: "something went wrong",
          error: err,
        });
    });
  },
  aggregate : async(req,res)=>{
    const stud = await Student.findOne({ FirstName: req.params.name });
    
    Student.aggregate([
        {
            $match: {
                "RollNo": mongoose.Types.RollNo(stud.RollNo)
            }
        },
        {
          $lookup: {
            from: "users",
            localField: "req.params.name",
            foreignField: "req.params.RollNo",
            as: "subs",
          },
        },
        // Deconstructs the array field from the
        // input document to output a document
        // for each element
        {
          $unwind: "$subs",
        },
      ])
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(error);
          res.json({error:err});
        });
  }
}