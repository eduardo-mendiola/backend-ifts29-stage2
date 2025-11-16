import PermissionAwareController from './PermissionAwareController.js';
import DocumentFile from '../models/DocumentFileModel.js';
import Project from '../models/ProjectModel.js';
import Client from '../models/ClientModel.js';
import Employee from '../models/EmployeeModel.js';
import { formatDatesForInput } from '../utils/dateHelpers.js';

const FILE_CATEGORY_LABELS = {
    document: 'Documentos',
    spreadsheet: 'Hojas de Cálculo',
    presentation: 'Presentaciones',
    image: 'Imágenes',
    video: 'Videos',
    audio: 'Audios',
    compressed: 'Comprimidos',
    link: 'Enlaces / URLs',
    other: 'Otros'
};


class DocumentController extends PermissionAwareController {
    constructor() {
        super(DocumentFile, 'document-files', 'document_files', 'DOC-');
    }

    getAllView = async (req, res) => {
        try {
            const userId = req.user?._id || req.session?.user?._id;
            let items;
            
            // Si tiene permiso view_all_document_files, ver todos
            if (this.checkPermission(req, 'view_all_document_files')) {
                items = await this.model.findAll();
            } else {
                // Si no, solo ver sus propios documentos
                items = await this.model.findByUserProjects(userId);
            }
            
            res.render(`${this.viewPath}/index`, {
                title: `Lista de ${this.viewPath}`,
                items: this.formatItems(items),
                FILE_CATEGORY_LABELS
            });
        } catch (error) {
            console.error(`Error al obtener todos en vista (${this.viewPath}):`, error.message);
            res.render('error500', { title: 'Error de servidor' });
        }
    };

    getByIdView = async (req, res) => {
        try {
            const { id } = req.params;
            const documentFile = await this.model.findById(id);
            if (!documentFile) return res.render('error404', { title: 'Documento no encontrado' });

            // Format dates before sending to the view
            const formattedDocumentFile = formatDatesForInput(
                this.formatItem(documentFile),
                ['updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/show`, {
                title: `Ver Documento`,
                item: formattedDocumentFile,
                FILE_CATEGORY_LABELS
            });

        } catch (error) {
            console.error('Error en getByIdView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // View for editing an document
    getEditView = async (req, res) => {
        try {
            const { id } = req.params;
            const documentFile = await this.model.findById(id);
            if (!documentFile) return res.render('error404', { title: 'Documento no encontrado' });

            const projects = await Project.findAll();
            const clients = await Client.findAll();

          
            // Format dates before sending to the view
            const formattedDocumentFile = formatDatesForInput(
                this.formatItem(documentFile),
                ['updated_at', 'created_at']
            );

            res.render(`${this.viewPath}/edit`, {
                title: `Editar Documento`,
                item: formattedDocumentFile,
                projects,
                clients,
                FILE_CATEGORY_LABELS
            });
        } catch (error) {
            console.error('Error en getEditView:', error.message);
            res.status(500).render('error500', { title: 'Error del servidor' });
        }
    };

    // View for creating a new document
    newView = async (req, res) => {
        try {
            const userId = req.user?._id || req.session?.user?._id;
            const currentEmployee = await Employee.model.findOne({ user_id: userId });

            const projects = await Project.findAll();
            const clients = await Client.findAll();

            res.render(`${this.viewPath}/new`, {
                title: `Nuevo Documento`,
                item: {},
                currentEmployee: currentEmployee ? this.formatItem(currentEmployee) : null,
                projects,
                clients,
                FILE_CATEGORY_LABELS
            });
        } catch (error) {
            console.error('Error al abrir formulario de documentos:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };

    createView = async (req, res) => {
        try {
            const userId = req.user?._id || req.session?.user?._id;
            
            // Buscar el empleado asociado al usuario logueado
            const employee = await Employee.model.findOne({ user_id: userId });
            if (!employee) {
                return res.status(400).render('error500', { 
                    title: 'Error', 
                    message: 'No se encontró un empleado asociado al usuario' 
                });
            }
            
            // Asignar automáticamente el uploaded_by del usuario logueado
            const newDocument = { 
                ...req.body, 
                uploaded_by: employee._id 
            };
            
            const createdDocument = await this.model.create(newDocument);

            // Generar el código si aplica
            if (this.codePrefix) {
                const code = this.codeGenerator.generateCodeFromId(createdDocument._id, this.codePrefix);
                await this.model.update(createdDocument._id, { code });
            }

            res.redirect(`/${this.viewPath}/${createdDocument._id}`);
        } catch (error) {
            console.error(`Error al crear ${this.viewPath}:`, error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };

    updateView = async (req, res) => {
        try {
            const { id } = req.params;
            
            // Remover uploaded_by del body para que no se pueda cambiar
            const { uploaded_by, ...updateData } = req.body;
            
            const updatedDocument = await this.model.update(id, updateData);
            if (!updatedDocument) {
                return res.render('error404', { title: `${this.viewPath} no encontrado para actualizar.` });
            }

            res.redirect(`/${this.viewPath}/${id}`);
        } catch (error) {
            console.error(`Error al actualizar ${this.viewPath}:`, error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new DocumentController();
