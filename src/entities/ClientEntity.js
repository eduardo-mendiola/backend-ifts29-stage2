class ClientEntity {
    constructor(
        id, 
        name, 
        contact_name, 
        email, 
        phone, 
        address, 
        is_active,
        created_at = new Date().toISOString(),
        updated_at = new Date().toISOString()
    ) {
        this.id = id;
        this.name = name;
        this.contact_name = contact_name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.is_active = is_active;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    getFullName() {
        return `${this.name} (${this.contact_name})`;
    }
}

export default ClientEntity;
