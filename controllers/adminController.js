const userModel = require("../models/userModel");

//Get Donar List
const getDonarListController=async(req,res)=>{
    try{
      const donarData=await userModel.find({role:'donar'}).sort({createdAt:-1});

      return res.status(200).send({
        success:true,
        Totalcount:donarData.length,
        message:'Donar list fetched Successfully',
        donarData,
      })
    }catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error in Donar list API",
            error,
        })
    }
};

//Get Hospital List
const getHospitalListController=async(req,res)=>{
    try{
      const hospitalData=await userModel
      .find({role:'hospital'})
      .sort({createdAt:-1});

      return res.status(200).send({
        success:true,
        Totalcount:hospitalData.length,
        message:'Hospital list fetched Successfully',
        hospitalData,
      })
    }catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error in Hospital list API",
            error,
        })
    }
};

//Get org List
const getOrgListController=async(req,res)=>{
    try{
      const orgData=await userModel
      .find({role:'organisation'})
      .sort({createdAt:-1});

      return res.status(200).send({
        success:true,
        Totalcount:orgData.length,
        message:'ORG list fetched Successfully',
        orgData,
      })
    }catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error in ORG list API",
            error,
        })
    }
};

// =======================================

//DELETE DONAR
const deleteDonarController = async (req, res) => {
    try {
      await userModel.findByIdAndDelete(req.params.id);
      return res.status(200).send({
        success: true,
        message: " Record Deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error while deleting ",
        error,
      });
    }
  };

  
  
//Exports
module.exports={getDonarListController,getHospitalListController,getOrgListController,deleteDonarController}