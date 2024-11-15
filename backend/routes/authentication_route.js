import app from 'express'
import { handleSignupPersonal } from '../controllers/authentication_controller.js';
const authenticationRouter=app.Router()

// signup user with personal a/c
authenticationRouter.post("/personal", handleSignupPersonal)

export default authenticationRouter;
