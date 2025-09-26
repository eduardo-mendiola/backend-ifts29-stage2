class ClientEntity {
    constructor(id, name, contact_name, email, phone, address, status) {
        this.id = id;
        this.name = name;
        this.contact_name = contact_name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.status = status;
    }

    getFullName() {
        return `${this.name} (${this.contact_name})`;
    }
}

export default ClientEntity;
