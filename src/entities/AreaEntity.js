class AreaEntity {
    constructor(id, name_area, created_at = new Date().toISOString(), updated_at = new Date().toISOString()) {
        this.id = id;
        this.name_area = name_area;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

export default AreaEntity;
