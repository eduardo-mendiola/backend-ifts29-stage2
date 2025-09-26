class RoleEntity {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    getDisplayName() {
        return `${this.name}: ${this.description}`;
    }
}

export default RoleEntity;
