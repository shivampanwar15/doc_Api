import express from 'express'
import AppointmentController from '../controllers/AppointmentController.js'

const router = express.Router();

router.get('/doctor-availability', AppointmentController.getDetails)



export default router;