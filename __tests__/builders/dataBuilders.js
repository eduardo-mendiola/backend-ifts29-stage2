/**
 * Builder Pattern for Test Data
 */

import mongoose from 'mongoose';

/**
 * Builder para crear proyectos de prueba
 */
export class ProjectBuilder {
  constructor() {
    // Valores por defecto 
    this.project = {
      name: 'Test Project',
      description: 'Test project description',
      client_id: new mongoose.Types.ObjectId(),
      project_manager: new mongoose.Types.ObjectId(),
      budget: 10000,
      billing_type: 'fixed',
      status: 'pending',
      start_date: new Date(),
      teams: []
    };
  }

  withName(name) {
    this.project.name = name;
    return this;
  }

  withDescription(description) {
    this.project.description = description;
    return this;
  }

  withClient(clientId) {
    this.project.client_id = clientId;
    return this;
  }

  withManager(managerId) {
    this.project.project_manager = managerId;
    return this;
  }

  withBudget(budget) {
    this.project.budget = budget;
    return this;
  }

  withBillingType(type) {
    this.project.billing_type = type;
    return this;
  }

  pending() {
    this.project.status = 'pending';
    return this;
  }

  inProgress() {
    this.project.status = 'in_progress';
    return this;
  }

  completed() {
    this.project.status = 'completed';
    return this;
  }

  withStartDate(date) {
    this.project.start_date = date;
    return this;
  }

  withEndDate(date) {
    this.project.end_date = date;
    return this;
  }

  withTeams(teamIds) {
    this.project.teams = teamIds.map(id => ({ team_id: id }));
    return this;
  }

  withCode(code) {
    this.project.code = code;
    return this;
  }

  build() {
    return { ...this.project };
  }

  // Helper para crear sin ciertos campos (testing de validaciones)
  buildWithout(...fields) {
    const project = { ...this.project };
    fields.forEach(field => delete project[field]);
    return project;
  }
}

/**
 * Builder para crear clientes de prueba
 */
export class ClientBuilder {
  constructor() {
    this.client = {
      name: 'Test Client',
      email: 'client@test.com',
      phone: '1234567890',
      address: 'Test Address 123',
      tax_id: 'TAX123456',
      status: 'active'
    };
  }

  withName(name) {
    this.client.name = name;
    return this;
  }

  withEmail(email) {
    this.client.email = email;
    return this;
  }

  withPhone(phone) {
    this.client.phone = phone;
    return this;
  }

  withAddress(address) {
    this.client.address = address;
    return this;
  }

  withTaxId(taxId) {
    this.client.tax_id = taxId;
    return this;
  }

  active() {
    this.client.status = 'active';
    return this;
  }

  inactive() {
    this.client.status = 'inactive';
    return this;
  }

  build() {
    return { ...this.client };
  }

  buildWithout(...fields) {
    const client = { ...this.client };
    fields.forEach(field => delete client[field]);
    return client;
  }
}

/**
 * Builder para crear empleados de prueba
 */
export class EmployeeBuilder {
  constructor() {
    this.employee = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@test.com',
      phone: '1234567890',
      hire_date: new Date(),
      position_id: new mongoose.Types.ObjectId(),
      salary: 50000,
      status: 'active'
    };
  }

  withFirstName(firstName) {
    this.employee.first_name = firstName;
    return this;
  }

  withLastName(lastName) {
    this.employee.last_name = lastName;
    return this;
  }

  withEmail(email) {
    this.employee.email = email;
    return this;
  }

  withPhone(phone) {
    this.employee.phone = phone;
    return this;
  }

  withPosition(positionId) {
    this.employee.position_id = positionId;
    return this;
  }

  withSalary(salary) {
    this.employee.salary = salary;
    return this;
  }

  active() {
    this.employee.status = 'active';
    return this;
  }

  inactive() {
    this.employee.status = 'inactive';
    return this;
  }

  build() {
    return { ...this.employee };
  }

  buildWithout(...fields) {
    const employee = { ...this.employee };
    fields.forEach(field => delete employee[field]);
    return employee;
  }
}

/**
 * Builder para crear tareas de prueba
 */
export class TaskBuilder {
  constructor() {
    this.task = {
      title: 'Test Task',
      description: 'Test task description',
      project_id: new mongoose.Types.ObjectId(),
      assigned_to: new mongoose.Types.ObjectId(),
      status: 'pending',
      priority: 'medium',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
    };
  }

  withTitle(title) {
    this.task.title = title;
    return this;
  }

  withDescription(description) {
    this.task.description = description;
    return this;
  }

  withProject(projectId) {
    this.task.project_id = projectId;
    return this;
  }

  assignedTo(employeeId) {
    this.task.assigned_to = employeeId;
    return this;
  }

  pending() {
    this.task.status = 'pending';
    return this;
  }

  inProgress() {
    this.task.status = 'in_progress';
    return this;
  }

  completed() {
    this.task.status = 'completed';
    return this;
  }

  withPriority(priority) {
    this.task.priority = priority;
    return this;
  }

  withDueDate(date) {
    this.task.due_date = date;
    return this;
  }

  build() {
    return { ...this.task };
  }

  buildWithout(...fields) {
    const task = { ...this.task };
    fields.forEach(field => delete task[field]);
    return task;
  }
}
