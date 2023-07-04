const express=require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController, getInventoryController, getDonarsController, getHospitalsController,getOrganisationController, getOrganisationForHospitalController, getInventoryHospitalController, getRecentInventoryController } = require('../controllers/inventoryController');

const router=express.Router();
//routes
//add inventory || post
router.post("/create-inventory",authMiddleware,createInventoryController);

//get All blood records
router.get("/get-inventory",authMiddleware,getInventoryController);

//get Recent  blood records
router.get("/get-recent-inventory",authMiddleware,getRecentInventoryController);


//get Hospital blood records
router.post("/get-inventory-hospital",authMiddleware,getInventoryHospitalController);




//get Donar records
router.get("/get-donars",authMiddleware,getDonarsController);

//get Hospital records
router.get("/get-hospitals",authMiddleware,getHospitalsController);

//get Organisation records
router.get("/get-organisation",authMiddleware,getOrganisationController);

//get Organisation for hospital records
router.get("/get-organisation-for-hospital",authMiddleware,getOrganisationForHospitalController);



module.exports=router;