import BaseController from './BaseController.js';
import { hasPermission } from '../middleware/permissionMiddleware.js';

/**
 * Controlador base con verificación de permisos integrada
 */
class PermissionAwareController extends BaseController {
  constructor(model, viewPath, resourceName, codePrefix = null) {
    super(model, viewPath, codePrefix || resourceName.toUpperCase().substring(0, 3) + '-');
    this.resourceName = resourceName; // ej: 'clients', 'projects', etc.
  }

  /**
   * Verifica si el usuario actual tiene permiso
   */
  checkPermission(req, permission) {
    const user = req.user || req.session?.user;
    return hasPermission(user, permission);
  }

  /**
   * Renderiza error 403 si no tiene permiso
   */
  denyAccess(res) {
    return res.status(403).render('error403', {
      title: 'Acceso Denegado',
      message: 'No tiene permisos suficientes para realizar esta acción'
    });
  }

  /**
   * Lista todos - requiere view_[resource]
   */
  async getAllView(req, res) {
    if (!this.checkPermission(req, `view_${this.resourceName}`)) {
      return this.denyAccess(res);
    }
    return super.getAllView(req, res);
  }

  /**
   * Ver detalle - requiere view_[resource]
   */
  async getByIdView(req, res) {
    if (!this.checkPermission(req, `view_${this.resourceName}`)) {
      return this.denyAccess(res);
    }
    return super.getByIdView(req, res);
  }

  /**
   * Formulario nuevo - requiere create_[resource]
   */
  async newView(req, res) {
    if (!this.checkPermission(req, `create_${this.resourceName}`)) {
      return this.denyAccess(res);
    }
    return super.newView(req, res);
  }

  /**
   * Crear - requiere create_[resource]
   */
  async createView(req, res) {
    if (!this.checkPermission(req, `create_${this.resourceName}`)) {
      return this.denyAccess(res);
    }
    return super.createView(req, res);
  }

  /**
   * Formulario editar - requiere edit_[resource]
   */
  async getEditView(req, res) {
    if (!this.checkPermission(req, `edit_${this.resourceName}`)) {
      return this.denyAccess(res);
    }
    return super.getEditView(req, res);
  }

  /**
   * Actualizar - requiere edit_[resource]
   */
  async updateView(req, res) {
    if (!this.checkPermission(req, `edit_${this.resourceName}`)) {
      return this.denyAccess(res);
    }
    return super.updateView(req, res);
  }

  // API CRUD con permisos
  async getAll(req, res) {
    if (!this.checkPermission(req, `view_${this.resourceName}`)) {
      return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }
    return super.getAll(req, res);
  }

  async getById(req, res) {
    if (!this.checkPermission(req, `view_${this.resourceName}`)) {
      return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }
    return super.getById(req, res);
  }

  async create(req, res) {
    if (!this.checkPermission(req, `create_${this.resourceName}`)) {
      return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }
    return super.create(req, res);
  }

  async update(req, res) {
    if (!this.checkPermission(req, `edit_${this.resourceName}`)) {
      return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }
    return super.update(req, res);
  }

  async patch(req, res) {
    if (!this.checkPermission(req, `edit_${this.resourceName}`)) {
      return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }
    return super.patch(req, res);
  }

  async delete(req, res) {
    if (!this.checkPermission(req, `delete_${this.resourceName}`)) {
      return res.status(403).json({ success: false, message: 'Acceso denegado' });
    }
    return super.delete(req, res);
  }
}

export default PermissionAwareController;
