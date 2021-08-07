import {Request, Response} from 'express';
import converHourToMinutes from "../utils/convertHourToMinutes";
import db from "../database/connection";



interface ScheduleItem{
    week_day: number;
    from: string;
    to: string;
  
  }

export default class ClassesController{

    async createUser(request: Request, response: Response){

        const {
            name, 
            avatar, 
            whatsapp, 
            bio, 
            subject, 
            cost, 
            schedule
        } = request.body;


    
        const trx = await db.transaction();
    
        try {
        
        const insertdUsersIds = await trx('users').insert({
           name, 
           avatar, 
           whatsapp, 
           bio, 
         });

         trx.commit();

         return response.status(201).send();
        }catch (err) {
    
            await trx.rollback();
            return response.status(400).json({
              err: 'Erro inesperado na criação do user',
            })
          }
    }
    
  //filtar
    async index(request: Request, response: Response){
        const filters = request.query;

        const week_day = filters.week_day as string;
        const subject = filters.subject as string;
        const time = filters.time as string;



        if(!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
                error: 'Erro ao buscar as classes',
            })
        }

        const timeInMinutes = converHourToMinutes(time);

        const classes = await  db('classes')

        .whereExists(function (){
            this.select('class_schedule.*')
            .from('class_schedule')
            .whereRaw('`class_schedule`.`class_id`= `classes`.`id`')
            .whereRaw('`class_schedule`.`week_day`= ??', [Number(week_day)])
            .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
            .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            
        })
        .where('classes.subject', '=', subject)
        .join('users', 'classes.user_id', '=', 'users.id')
        .select(['classes.*', 'users.*']);

        return response.json(classes);
    }

    //Criar classe
    async create(request: Request, response: Response){

        const {
            name, 
            avatar, 
            whatsapp, 
            bio, 
            subject, 
            cost, 
            schedule,
            user_id
        } = request.body;


    
        const trx = await db.transaction();
    
        try {
        
        const insertdUsersIds = await trx('users').insert({
           name, 
           avatar, 
           whatsapp, 
           bio, 
         });

         

        const user_id =insertdUsersIds[0];
       
        const insertedClassesIds = await trx('classes').insert({
          subject,
          cost,
          user_id,
         
         });
       
         const class_id = insertedClassesIds[0];
       
         const classSchedule = schedule.map((scheduleItem: ScheduleItem )=>{
           return {
             class_id,
             week_day: scheduleItem.week_day,
             from: converHourToMinutes(scheduleItem.from),
             to: converHourToMinutes(scheduleItem.to)
           };
         })
         
       
         await trx('class_schedule').insert(classSchedule);
       
         trx.commit();
         
           return response.status(201).json();
    
        } catch (err) {
    
          await trx.rollback();
          return response.status(400).json({
            err: 'Erro inesperado na criação da classe',
          })
        }

        
    
    }

   
}