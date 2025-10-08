import BaseController from './BaseController.js';
import Contact from '../models/ContactModel.js';
import Client from '../models/ClientModel.js';

class ContactController extends BaseController {
    constructor() {
        super(Contact, 'contacts', 'CON-');
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


    // getByIdView = async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const contact = await this.model.findById(id);
    //         if (!contact) return res.render('error404', { title: 'Contacto no encontrado' });

    //         const clients = await Client.findAll();


    //         res.render(`${this.viewPath}/show`, {
    //             title: `Contacto: ${contact.full_name}`,
    //             item: contact,
    //             clients
    //         });
    //     } catch (error) {
    //         console.error('Error en getShowView:', error.message);
    //         res.status(500).render('error500', { title: 'Error del servidor' });
    //     }
    // };




}

export default new ContactController();
