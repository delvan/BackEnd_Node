
import  {Request, Response} from 'express' 
import db from '../database/connection';

export default class ConnectionsController{
    
    async index(request: Request, response: Response){
        const totalConnection =  await db('connections_total').count('* as total');

       const {total} = totalConnection[0];

       return response.json({ total });
    }

    async create(request: Request, response: Response){

        const user_id = request.body;
        await db('connections_total').insert(user_id);

        console.log(user_id);

        response.status(201).send();
    }

}