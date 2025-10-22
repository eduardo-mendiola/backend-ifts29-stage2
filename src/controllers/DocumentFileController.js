import BaseController from './BaseController.js';
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


class DocumentController extends BaseController {
    constructor() {
        super(DocumentFile, 'document-files', 'DOC-');
    }

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
            const employees = await Employee.findAll();
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
                employees,
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

            const projects = await Project.findAll();
            const employees = await Employee.findAll();
            const clients = await Client.findAll();

            res.render(`${this.viewPath}/new`, {
                title: `Nuevo Documento`,
                item: {},
                projects,
                employees,
                clients,
                FILE_CATEGORY_LABELS
            });
        } catch (error) {
            console.error('Error al abrir formulario de documentos:', error.message);
            res.status(500).render('error500', { title: 'Error de servidor' });
        }
    };
}

export default new DocumentController();
