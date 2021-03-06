import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

routes.post('/classes', classesController.create);

routes.post('/users', classesController.createUser);


routes.get('/classes', classesController.index);

routes.get('/connections', connectionsController.index);

routes.post('/connections', connectionsController.create);

export default routes;