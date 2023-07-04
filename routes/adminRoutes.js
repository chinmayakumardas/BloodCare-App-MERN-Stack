const express=require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getDonarListController, getHospitalListController, getOrgListController, deleteDonarController } = require('../controllers/adminController')
const adminMiddleware = require('../middlewares/adminMiddleware')

//Router object
const router=express.Router()

//Routes


//GET || Donar list
router.get('/donar-list',authMiddleware,adminMiddleware,getDonarListController)

//GET || Hospital list
router.get('/hospital-list',authMiddleware,adminMiddleware,getHospitalListController)

//GET || Organisation list
router.get('/org-list',authMiddleware,adminMiddleware,getOrgListController)
//=================================

//Delete donar || get
router.delete('/delete-donar/:id',authMiddleware,adminMiddleware,deleteDonarController)

//Export
module.exports=router;