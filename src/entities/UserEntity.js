class UserEntity {
    constructor(
        id,
        first_name,
        last_name,
        email,
        password_hash,
        phone,
        role_id,
        area_id,
        monthly_salary,
        status,
        created_at = new Date().toISOString(),
        updated_at = new Date().toISOString()
    ) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password_hash = password_hash;
        this.phone = phone;
        this.role_id = role_id;
        this.area_id = area_id;
        this.monthly_salary = monthly_salary;
        this.status = status;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    // Método de user
    getFullName() {
        return `${this.first_name} ${this.last_name}`;
    }
}

export default UserEntity;
