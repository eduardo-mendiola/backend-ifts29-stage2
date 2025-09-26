class ProjectEntity {
    constructor(id, client_id, name, description, start_date, end_date, budget, billing_type, status, manager_id) {
        this.id = id;                     
        this.client_id = client_id;       
        this.name = name;                 
        this.description = description;   
        this.start_date = start_date;     
        this.end_date = end_date;         
        this.budget = budget;             
        this.billing_type = billing_type; 
        this.status = status;             
        this.manager_id = manager_id;     
    }

    getProjectInfo() {
        return `${this.name} [${this.status}] - Presupuesto: $${this.budget}`;
    }
}

export default ProjectEntity;