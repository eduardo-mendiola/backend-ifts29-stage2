const validateClientInput = (req, res, next) => {
    const { name, contact_name, email } = req.body;
    if (!name || !contact_name || !email) {
        return res.status(400).json({ message: 'Nombre de la empresa, el nombre del contacto y el email son campos obligatorios.' });
    }
    // Falan agregar validaciones mas complejas como para el email
    next(); 
};

const validateProjectInput = (req, res, next) => {
    const { client_id, name, start_date, end_date, budget, billing_type, status, manager_id } = req.body;

    if (!client_id || !name || !start_date || !end_date || !budget || !billing_type || !status || !manager_id) {
        return res.status(400).json({
            message: 'client_id, name, start_date, end_date, budget, billing_type, status y manager_id son campos obligatorios.'
        });
    }

    // Validación de fechas (ejemplo simple)
    if (new Date(start_date) > new Date(end_date)) {
        return res.status(400).json({
            message: 'La fecha de inicio no puede ser mayor a la fecha de fin.'
        });
    }

    // Validación del presupuesto
    if (isNaN(budget) ||  budget <= 0) {
        return res.status(400).json({
            message: 'El presupuesto debe ser un número mayor que 0.'
        });
    }

    // Validación de billing_type
    const validBillingTypes = ['fixed', 'hourly', 'retainer'];
    if (!validBillingTypes.includes(billing_type)) {
        return res.status(400).json({
            message:  `El tipo de facturación debe ser uno de: ${validBillingTypes.join(', ')}.`
        });
    }

    // Validación de status
    const validStatus = ['planned', 'in_progress', 'on_hold', 'completed', 'cancelled'];
    if (!validStatus.includes(status)) {
        return res.status(400).json({
            message: `El estado debe ser uno de: ${validStatus.join(', ')}.`
        });
    }

    next();
};



export {
    validateClientInput,
    // validateUserInput,
    // validateRoleInput,
    validateProjectInput
};

