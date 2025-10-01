class BaseController {
    constructor(model, viewPath) {
        this.model = model;
        this.viewPath = viewPath;
    }

    formatItem = (item) => {
        if (!item) return null;
        const obj = item.toObject ? item.toObject() : { ...item };

        const formatted = {
            id: obj._id.toString(),
            ...obj
        };

        delete formatted._id;
        delete formatted.__v;

        return formatted;
    };

    formatItems = (items) => items.map(this.formatItem);

    // || API REST ||

    create = async (req, res) => {
        try {
            const newItem = await this.model.create(req.body);
            res.status(201).json(this.formatItem(newItem));
        } catch (error) {
            console.error('Error al crear:', error.message);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error interno del servidor al crear.' });
        }
    };

    getAll = async (req, res) => {
        try {
            const items = await this.model.findAll();
            res.status(200).json(this.formatItems(items));
        } catch (error) {
            console.error('Error al obtener todos:', error.message);
            res.status(500).json({ message: 'Error interno del servidor al obtener todos.' });
        }
    };

    getById = async (req, res) => {
        try {
            const { id } = req.params;
            const item = await this.model.findById(id);
            if (!item) return res.status(404).json({ message: 'No encontrado.' });
            res.status(200).json(this.formatItem(item));
        } catch (error) {
            console.error('Error al obtener por ID:', error.message);
            res.status(500).json({ message: 'Error interno del servidor al obtener por ID.' });
        }
    };

    update = async (req, res) => {
        try {
            const { id } = req.params;
            const updatedItem = await this.model.update(id, req.body);
            if (!updatedItem) return res.status(404).json({ message: 'No encontrado para actualizar.' });
            res.status(200).json(this.formatItem(updatedItem));
        } catch (error) {
            console.error('Error al actualizar:', error.message);
            res.status(500).json({ message: 'Error interno del servidor al actualizar.' });
        }
    };

    patch = async (req, res) => {
        try {
            const { id } = req.params;
            const updatedItem = await this.model.patch(id, req.body);
            if (!updatedItem) return res.status(404).json({ message: 'No encontrado para actualizar.' });
            res.status(200).json(this.formatItem(updatedItem));
        } catch (error) {
            console.error('Error al actualizar:', error.message);
            res.status(500).json({ message: 'Error interno del servidor al actualizar.' });
        }
    };

    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await this.model.delete(id);
            if (!deleted) return res.status(404).json({ message: 'No encontrado o no se pudo eliminar.' });
            res.status(204).send();
        } catch (error) {
            console.error('Error al eliminar:', error.message);
            res.status(500).json({ message: 'Error interno del servidor al eliminar.' });
        }
    };

    // || VISTAS PUG ||

    getAllView = async (req, res) => {
        try {
            const items = await this.model.findAll();
            res.render(`${this.viewPath}/index`, {
                title: `Lista de ${this.viewPath}`,
                items: this.formatItems(items)
            });
        } catch (error) {
            console.error(`Error al obtener todos en vista (${this.viewPath}):`, error.message);
            res.render('error500', { title: 'Error de servidor' });
        }
    };

    getByIdView = async (req, res) => {
        try {
            const { id } = req.params;
            const item = await this.model.findById(id);
            if (!item) return res.render('error404', { title: `${this.viewPath} no encontrado.` });

            const formattedItem = this.formatItem(item);

            if (req.originalUrl.includes('/edit')) {
                res.render(`${this.viewPath}/new`, {
                    title: `Editar ${this.viewPath}`,
                    item: formattedItem
                });
            } else {
                res.render(`${this.viewPath}/show`, {
                    title: `Detalles del ${this.viewPath}`,
                    item: formattedItem
                });
            }
        } catch (error) {
            console.error(`Error al obtener por ID en vista (${this.viewPath}):`, error.message);
            res.render('error500', { title: 'Error de servidor' });
        }
    };

    createView = async (req, res) => {
        try {
            const newItem = await this.model.create(req.body);
            res.redirect(`/${this.viewPath}/${newItem._id}`);
        } catch (error) {
            console.error(`Error al crear ${this.viewPath}:`, error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };

    newView = async (req, res) => {
        try {
            res.render(`${this.viewPath}/new`, {
                title: `Nuevo ${this.viewPath}`,
                item: {}
            });
        } catch (error) {
            console.error(`Error al abrir formulario (${this.viewPath}):`, error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };

    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const item = await this.model.findById(id);
            if (!item) return res.render('error404', { title: `${this.viewPath} no encontrado.` });

            res.render(`${this.viewPath}/edit`, {
                title: `Editar ${this.viewPath}`,
                item: this.formatItem(item)
            });
        } catch (error) {
            console.error(`Error al obtener ${this.viewPath} para editar:`, error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };

    updateView = async (req, res) => {
        try {
            const { id } = req.params;
            const updatedItem = await this.model.update(id, req.body);
            if (!updatedItem) return res.render('error404', { title: `${this.viewPath} no encontrado para actualizar.` });
            res.redirect(`/${this.viewPath}/${id}`);
        } catch (error) {
            console.error(`Error al actualizar ${this.viewPath}:`, error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default BaseController;
