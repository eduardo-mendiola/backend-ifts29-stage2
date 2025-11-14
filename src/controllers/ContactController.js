import PermissionAwareController from './PermissionAwareController.js';
import Contact from '../models/ContactModel.js';
import Client from '../models/ClientModel.js';

class ContactController extends PermissionAwareController {
    constructor() {
        super(Contact, 'contacts', 'contacts', 'CNT-');
    }

    // Sobrescribir getEditView para incluir permisos
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const contact = await this.model.findById(id);
            if (!contact) return res.render('error404', { title: 'Contacto no encontrado' });

            const clients = await Client.findAll();

            const contactOptions = ['Email', 'Télefono fijo', 'Télefono celular', 'Ninguno'];

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Contacto`,
                item: contact,
                clients,
                contactOptions
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };


    // Sobrescribimos newView para incluir listas y enums
    newView = async (req, res) => {
        try {
            const clients = await Client.findAll();

            const contactOptions = ['Email', 'Télefono fijo', 'Télefono celular', 'Ninguno'];

            res.render(`${this.viewPath}/new`, {
                title: `Nuevo Contacto`,
                item: {},
                clients,
                contactOptions
            });
        } catch (error) {
            console.error('Error al abrir formulario de usuario:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };



}

export default new ContactController();
