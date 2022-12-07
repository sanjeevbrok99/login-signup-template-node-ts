import { Request, Response, Router } from 'express' 
import auth from './auth'     
import user from './userRoute'        

const routes = Router();     
routes.get('/', (req, res) => 
  res.send( 
    'This is  a basic Authentication using TypeScript, Node.js, TypeORM and Mysql',
  ), 
) 
routes.use("/auth", auth);     
routes.use("/user", user); 

export default routes; 