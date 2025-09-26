import BaseController from './BaseController.js'
import Project from '../models/ProjectModel.js'; 

class ProjectController extends BaseController {
    constructor() {
        super(Project, 'project'); 
    }
}

export default new ProjectController();
