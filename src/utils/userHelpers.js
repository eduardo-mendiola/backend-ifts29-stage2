export function filterManagers(users) {
    if (!Array.isArray(users)) return [];

    const managerRoles = ['Gerente de Proyecto', 'Administrador', 'CEO'];

    return users.filter(user =>
        user.is_active &&                     // solo activos
        user.role_id &&
        managerRoles.includes(user.role_id.name)
    );
}

