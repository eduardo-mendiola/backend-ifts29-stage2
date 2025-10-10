import BaseController from './BaseController.js';
import Client from '../models/ClientModel.js';
import Contact from '../models/ContactModel.js';
import Project from '../models/ProjectModel.js';


class ClientController extends BaseController {
    constructor() {
        super(Client, 'clients', 'CLI-');
    }

    // Sobrescribir getByIdView para incluir contactos
    getByIdView = async (req, res) => {
        try {
            const { id } = req.params;
            const client = await this.model.findById(id); // populate client fields
            if (!client) return res.render('error404', { title: 'Cliente no encontrado' });
            
            const contacts = await Contact.findAll(); // tu BaseModel puede necesitar filter así

              // Filtrar usuarios disponibles (excluir líder y miembros actuales)
            const associatedContact = contacts.filter(contact => {
                const isContanct = contact._id === client._id.toString();
                return isContanct;
            });

            // Traer todos los contactos asociados usando tu método del modelo
            // const contacts = await Contact.findAll({ client_id: id }); // tu BaseModel puede necesitar filter así

            res.render(`${this.viewPath}/show`, {
                title: `Detalles del Cliente`,
                item: { ...client.toObject(), associatedContact }
            });
        } catch (error) {
            console.error('Error al obtener cliente y contactos:', error.message);
            res.render('error500', { title: 'Error del servidor' });
        }
    };
}


export default new ClientController();
