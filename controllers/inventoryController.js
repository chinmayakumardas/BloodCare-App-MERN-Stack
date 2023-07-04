const mongoose = require("mongoose");

const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");
// CREATE INVENTORY
const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    // if (inventoryType === "in" && user.role !== "donar") {
    //   throw new Error("Not a donar account");
    // }

    // if (inventoryType === "out" && user.role !== "hospital") {
    //   throw new Error("Not a hospital");
    // }

   if(req.body.inventoryType== "out"){
    const requestedBloodGroup=req.body.bloodGroup;
    const requestedQuantityOfBlood =req.body.quantity;
    const organisation=new mongoose.Types.ObjectId(req.body.userId);
    //calculate blood quantity
    const totalInOfRequestedBlood=await inventoryModel.aggregate([
      {
        $match:{
          organisation,
          inventoryType:"in",
          bloodGroup:requestedBloodGroup,
        },
      },
      {
          $group:{
            _id:"$bloodGroup",
            total:{$sum:"$quantity"},
          },
        },
    ]);
   // console.log('Total in',totalInOfRequestedBlood);
  const totalIn=totalInOfRequestedBlood[0]?.total || 0;
    //calculate out blood quantity
    const totalOutOfRequestedBloodGroup=await inventoryModel.aggregate([
      {
          $match:{
            organisation,
            inventoryType:"out",
            bloodGroup:requestedBloodGroup,
          },
      },
      {
        $group:{
          _id:"$bloodGroup",
          total:{$sum:"$quantity"},
        },
      },
    ]);
    const totalOut=totalOutOfRequestedBloodGroup[0]?.total || 0;
//in & out calc
const availableQuantityOfBloodGroup=totalIn-totalOut;
//quantity validation
if(availableQuantityOfBloodGroup < requestedQuantityOfBlood){
  return res.status(500).send({
    success:false,
    message:`only ${availableQuantityOfBloodGroup} ML of ${requestedBloodGroup.toUpperCase() }is available `
  });
}
req.body.hospital=user?._id;
   } else {
    req.body.donar=user?._id;
   }
    //save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "New Blood Reocrd Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Create Inventory API",
      error,
    });
  }
};
// GET ALL BLOOD RECORS
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Inventory",
      error,
    });
  }
};

// get 
const getHospitalsController=async(req,res)=>{
  try{
   const organisation=req.body.userId;
    //Get hospital ID
    const hospitalId=await inventoryModel.distinct('hospital',{organisation});
    //FIND HOSPITAL
    const hospitals=await userModel.find({
     _id:{$in:hospitalId},
   });
     return res.status(200).send({
       success:true,
       messaage:"Hospital Data Fetched Successfully",
      hospitals,
     });
  }catch(error){
   console.log(error);
   return res.status(500).send({
     success:false,
     message:'Error in get Hospital API',
     error,
   })
  }
} ;

// get donar records
const getDonarsController=async (req,res)=>{
   try{
    const organisation=req.body.userId;
    //find donars
    const donarId=await inventoryModel.distinct('donar',{
      organisation,
    });
    //console.log(donarId);
    const donars=await userModel.find({_id:{$in:donarId}})
    return res.status(200).send({
      success:true,
      messaage:"Donar Reacord featched Successfully",
      donars,

    });
  }
  catch(error){
     console.log(error)
    return res.status(500).send({
      success:false,
      messaage:'Error in Donar records',
      error,
    })
   }
};



//get ORG for hospital
const getOrganisationForHospitalController=async(req,res)=>{
    try{
      const hospital=req.body.userId;
      const orgId=await inventoryModel.distinct('organisation',{hospital})
      //find ORG 
      const organisations=await userModel.find({
        _id:{$in:orgId}
      })
      return res.status(200).send({
        success:true,
        message:"Hospital Org data fwetched Successfully",
        organisations,

      });
    }
    catch(error){
      console.log(error);
      return res.status(500).send({
        success:false,
        message:'Error in Hospital ORG API',
        error,
      });
    }
};
//get ORG Profiles
const getOrganisationController=async(req,res)=>{
  try{
    const donar=req.body.userId;
    const orgId=await inventoryModel.distinct('organisation',{donar})
    //find ORG 
    const organisations=await userModel.find({
      _id:{$in:orgId}
    })
    return res.status(200).send({
      success:true,
      message:" Org data fetched Successfully",
      organisations,

    });
  }
  catch(error){
    console.log(error);
    return res.status(500).send({
      success:false,
      message:'Error in  ORG API',
      error,
    });
  }
};

// GET Hospital  BLOOD RECORS
const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get hospital consumer  records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get consumer inventory Inventory",
      error,
    });
  }
};

//Get blood records of 5
const getRecentInventoryController=async(req,res)=>{
  try{
    const inventory=await inventoryModel.find({
      organisation:req.body.userId
    }).limit(3).sort({createdAt:-1})
    return res.status(200).send({
      success:true,
      messaage:'Recent Inventory Data',
      inventory,
    });
  }catch(error){
    console.log(error)
    return res.status(500).send({
      success:false,
      messaage:'Error in Recent inventory API',
      error,
    })
  }
}

module.exports = { 
  createInventoryController,
  getDonarsController, 
  getInventoryController,
  getHospitalsController,
getOrganisationController,
getOrganisationForHospitalController,
getInventoryHospitalController,
getRecentInventoryController };