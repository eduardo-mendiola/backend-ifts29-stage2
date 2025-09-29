class TaskEntity {
    constructor(
        id,
        title,
        description,
        priority,
        status,
        assigned_to,
        estimated_hours,
        due_date = new Date().toISOString(),
        created_at = new Date().toISOString()
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.assigned_to = assigned_to;
        this.estimated_hours = estimated_hours;
        this.due_date = due_date;
        this.created_at = created_at;
    }

}

export default TaskEntity;
