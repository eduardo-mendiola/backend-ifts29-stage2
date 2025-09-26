class ProjectEntity {
    constructor(id, client_id, name, description, start_date, end_date, budget, billing_type, status, manager_id) {
        this.id = id;                     // Identificador único
        this.client_id = client_id;       // Relación con ClientEntity (empresa)
        this.name = name;                 // Nombre del proyecto
        this.description = description;   // Detalles del proyecto
        this.start_date = start_date;     // Fecha inicio
        this.end_date = end_date;         // Fecha fin
        this.budget = budget;             // Presupuesto asignado
        this.billing_type = billing_type; // Tipo de facturación (fixed, hourly, retainer)
        this.status = status;             // Estado del proyecto
        this.manager_id = manager_id;     // ID del responsable (ej: usuario interno)
    }

    getProjectInfo() {
        return `${this.name} [${this.status}] - Presupuesto: $${this.budget}`;
    }
}

export default ProjectEntity;