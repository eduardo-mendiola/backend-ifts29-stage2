# Tecnicatura Superior en Desarrollo de Software  
## 2° Entrega de Proyecto Parcial: Desarrollo Backend con MongoDB  
### Caso 2: ClickWave  

**Materia:** Desarrollo de Sistemas Web (Back End)  
**Profesor:** Emir Eliezer Garcia Ontiveros  
**Comisión:** A  
**Alumno:** Mendiola, Eduardo E.  
**Fecha de la Entrega:** 24-10-2025  

---

## Para ejecutar el proyecto (¡Importante la conexión a MongoDB!):  
1. Clonar el repositorio.  
2. Instalar dependencias con `npm install`.  
3. Crear un archivo `.env` en la raíz del proyecto para la configuración de la base de datos.  

### Contenido Mínimo del `.env`:  
```bash
# Puerto donde se ejecutará la aplicación
PORT=3000

# URI de conexión a MongoDB (local o Atlas)
MONGO_URI="mongodb://localhost:27017/clickwavedb" 
# o MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/..."
````

4. Ejecutar la aplicación con `npm run dev` (o `npm start`).

---

## Índice

## Índice

1. [Introducción del Caso](#1-introducción-del-caso)  
   1.1 [Propósito del Sistema](#11-propósito-del-sistema)  
   1.2 [Contexto Empresarial](#12-contexto-empresarial)  
       1.2.1 [Descripción General de ClickWave](#121-descripción-general-de-clickwave)  
       1.2.2 [Problemáticas Detectadas (Etapa 1)](#122-problemáticas-detectadas-etapa-1)  
   1.3 [Objetivos del Sistema](#13-objetivos-del-sistema)  
   1.4 [Arquitectura Técnica del Sistema](#14-arquitectura-técnica-del-sistema)  
       1.4.1 [Definiciones Técnicas y Tecnologías](#141-definiciones-técnicas-y-tecnologías)  

2. [Rol y Responsabilidades](#2-rol-y-responsabilidades)  
   2.1 [Configuración y Creación de la Base de Datos MongoDB](#21-configuración-y-creación-de-la-base-de-datos-mongodb)  
   2.2 [Refactorización de Clases y Controladores](#22-refactorización-de-clases-y-controladores)  
   2.3 [Módulos de Contabilidad, Cobranzas y Documentación](#23-módulos-de-contabilidad-cobranzas-y-documentación)  
   2.4 [Ampliación del Dominio y Refactorización de Entidades](#24-ampliación-del-dominio-y-refactorización-de-entidades)  
   2.5 [Refactorización y Ampliación de Vistas (Pug + Bootstrap)](#25-refactorización-y-ampliación-de-vistas-pug--bootstrap)  
   2.6 [Mantenimiento de Repositorio y Documentación](#26-mantenimiento-de-repositorio-y-documentación)  
   2.7 [Despliegue y Mantenimiento de Infraestructura en la Nube](#27-despliegue-y-mantenimiento-de-infraestructura-en-la-nube)  

3. [Descripción Técnica del Sistema](#3-descripción-técnica-del-sistema)  
   3.1 [Introducción a la Arquitectura y Componentes Principales](#31-introducción-a-la-arquitectura-y-componentes-principales)  
       3.1.1 [Componentes Tecnológicos](#311-componentes-tecnológicos)  
       3.1.2 [Estructura Arquitectónica: El Patrón MVC](#312-estructura-arquitectónica-el-patrón-mvc)  
   3.2 [Diseño Arquitectónico Detallado](#32-diseño-arquitectónico-detallado)  
       3.2.1 [El Enfoque MVC Monolítico](#321-el-enfoque-mvc-monolítico)  
       3.2.2 [Estructura y Organización de Carpetas](#322-estructura-y-organización-de-carpetas)  
       3.2.3 [Entidades y Modelos del Sistema](#323-entidades-y-modelos-del-sistema)  
       3.2.4 [Interacción entre Capas](#324-interacción-entre-capas)  
       3.2.5 [Integración de Componentes y Flujo de Dependencias](#325-integración-de-componentes-y-flujo-de-dependencias)  
   3.3 [Modelo de Dominio y Persistencia](#33-modelo-de-dominio-y-persistencia)  
   3.4 [Flujos de Datos Operacionales](#34-flujos-de-datos-operacionales)  
       3.4.1 [Flujo de Lectura (De la Base de Datos a la Vista)](#341-flujo-de-lectura-de-la-base-de-datos-a-la-vista)  
       3.4.2 [Flujo de Escritura (De la Interfaz a la Base de Datos)](#342-flujo-de-escritura-de-la-interfaz-a-la-base-de-datos)  
   3.5 [Implementación de la Lógica de Negocio](#35-implementación-de-la-lógica-de-negocio)  
       3.5.1 [Ubicación de las Reglas de Negocio](#351-ubicación-de-las-reglas-de-negocio)  
       3.5.2 [Reglas de Negocio Clave Implementadas](#352-reglas-de-negocio-clave-implementadas)  
   3.6 [Interacción entre Módulos (usando MongoDB y Mongoose)](#36-interacción-entre-módulos-usando-mongodb-y-mongoose)  

4. [Cómo ejecutar este proyecto](#4-cómo-ejecutar-este-proyecto)  
   4.1 [Clonar el repositorio](#41-clonar-el-repositorio)  
   4.2 [Instalar las dependencias](#42-instalar-las-dependencias)  
   4.3 [Configurar MongoDB](#43-configurar-mongodb)  
   4.4 [Variables de entorno](#44-variables-de-entorno)  
   4.5 [Ejecutar la aplicación](#45-ejecutar-la-aplicación)  
   4.6 [Abrir la aplicación en el navegador](#46-abrir-la-aplicación-en-el-navegador)  

5. [Documentación de Interfaces y Funcionalidades](#5-documentación-de-interfaces-y-funcionalidades)  
   5.1 [Menú y navegación entre módulos](#51-menú-y-navegación-entre-módulos)  
   5.2 [Patrón CRUD general (un ejemplo completo)](#52-patrón-crud-general-un-ejemplo-completo)  
   5.3 [Casos especiales por módulo](#53-casos-especiales-por-módulo)  
       5.3.1 [Usuarios y Empleados (filtros de selección)](#531-usuarios-y-empleados-filtros-de-selección)  
       5.3.2 [Roles (opciones de permisos)](#532-roles-opciones-de-permisos)  
       5.3.3 [Proyectos (selección de equipos)](#533-proyectos-selección-de-equipos)  
       5.3.4 [Equipos (selección miembros y asignación de roles)](#534-equipos-selección-miembros-y-asignación-de-roles)  
       5.3.5 [Presupuesto (carga de ítems y cálculo de impuestos y descuentos)](#535-presupuesto-carga-de-ítems-y-cálculo-de-impuestos-y-descuentos)  
       5.3.6 [Facturas (editar, eliminar y anular)](#536-facturas-editar-eliminar-y-anular)  
       5.3.7 [Facturas (carga de ítems extras)](#537-facturas-carga-de-ítems-extras)  
       5.3.8 [Facturas (generar e imprimir factura)](#538-facturas-generar-e-imprimir-factura)  

6. [Uso de IAs](#6-uso-de-ias)  
   6.1 [Modelos](#61-modelos)  
   6.2 [Prompts](#62-prompts)  

7. [Bibliografía y Fuentes](#7-bibliografía-y-fuentes)
 

---

## 1. Introducción del Caso

El sistema **ClickWave** es una aplicación de gestión interna diseñada para optimizar la administración de Usuarios (User), Clientes (Client), y la estructura interna de la compañía (definición de Roles y Áreas).

La primera etapa se enfocó en la construcción de una API RESTful con persistencia basada en archivos JSON.

Esta segunda etapa se centra en la refactorización profunda del backend, reemplazando la persistencia por una base de datos documental **MongoDB**, mejorando la robustez y escalabilidad, y actualizando la interfaz administrativa con vistas **Pug**.

### 1.1 Propósito del Sistema

El presente documento describe el Sistema de Gestión de Proyectos desarrollado para ClickWave, una consultora de marketing digital, con el objetivo de optimizar la gestión interna de proyectos y mejorar la eficiencia operativa. La propuesta tecnológica busca transformar procesos informales en flujos de trabajo estandarizados, medibles y trazables, facilitando la centralización de información y la toma de decisiones basada en datos confiables.

### 1.2 Contexto Empresarial

#### 1.2.1 Descripción General de ClickWave

ClickWave fue fundada en 2020 con el propósito de brindar servicios de marketing digital a pequeñas y medianas empresas (PyMEs). Comenzó como un proyecto remoto de un equipo reducido y actualmente cuenta con 12 empleados organizados en distintas áreas: gestión de campañas publicitarias, diseño gráfico, análisis de datos y desarrollo de contenidos digitales.  
Su modalidad de trabajo es híbrida, combinando presencia en oficina y trabajo remoto, lo que permite atender clientes locales e internacionales, aunque mantiene desafíos internos asociados a la informalidad de procesos y la ausencia de roles claramente definidos.

#### 1.2.2 Problemáticas Detectadas (Etapa 1)

- **Falta de control formal de tiempos:** dificulta la justificación de costos y el cálculo de rentabilidad de los proyectos.  
- **Roles y responsabilidades poco definidos:** provoca desorganización, sobrecarga de trabajo y seguimiento ineficiente.  
- **Limitaciones en evaluación de desempeño y análisis financiero:** impide una evaluación objetiva del rendimiento y retrasa informes financieros precisos.

### 1.3 Objetivos del Sistema

- Formalizar la gestión de proyectos y tareas, centralizando la información y garantizando trazabilidad.  
- Registrar y controlar el tiempo dedicado a cada proyecto para analizar rentabilidad y justificar costos.  
- Generar reportes detallados y paneles de control gerenciales.  
- Integrar la gestión de proyectos con contabilidad y facturación, optimizando procesos financieros.

### 1.4 Arquitectura Técnica del Sistema
El sistema fue desarrollado con un stack **JavaScript**: Node.js como entorno de ejecución y Express.js como framework web. La arquitectura sigue el patrón **MVC** (**Modelo-Vista-Controlador**), permitiendo:
- Separación clara de responsabilidades entre presentación, lógica de negocio y acceso a datos.  
- Facilitar mantenibilidad, escalabilidad y comprensión del código.  
- Garantizar un flujo de información seguro y centralizado entre usuarios, proyectos y tareas.
- Cuenta con una capa de persistencia implementada sobre una base de datos documental (**MongoDB**), utilizando **Mongoose** para la definición de esquemas, validación de datos y gestión eficiente de las operaciones CRUD.

#### 1.4.1 Definiciones Técnicas y Tecnologías

| Componente   | Tecnología            | Descripción                                |
| ------------ | --------------------- | ------------------------------------------ |
| Backend      | Node.js, Express      | API RESTful y gestión de rutas             |
| Persistencia | MongoDB Atlas / Local | Base de datos NoSQL documental             |
| ODM          | Mongoose              | Definición de esquemas y CRUD estructurado |
| Vistas       | Pug                   | Motor de plantillas dinámicas              |
| Estilos      | Bootstrap             | Framework CSS responsive                   |

---


## 2. Rol y Responsabilidades

### **Mendiola, Eduardo E.**
**Rol:** Desarrollador de Aplicaciones Web: Backend con Node.js / Mongoose, Refactorización de Vistas (Pug) y Operaciones Cloud.

**Responsabilidades y tareas:**

En esta etapa, el foco principal estuvo en la migración de la aplicación desde un sistema de persistencia basado en archivos JSON hacia una base de datos documental en **MongoDB**, utilizando **Mongoose** como ODM. Esto implicó tanto refactorización de clases y controladores como la adaptación de las vistas y plantillas para trabajar de forma coherente con la nueva lógica de persistencia.

### Configuración y Creación de la Base de Datos MongoDB

## 2.1 Configuración y Creación de la Base de Datos MongoDB

**Instalación y Configuración de Mongoose:**  
Integración de la librería mongoose mediante npm para gestionar la conexión y la definición de esquemas de datos, garantizando un mapeo consistente entre los documentos de MongoDB y las entidades de la aplicación.

**Conexión a MongoDB:**  
Desarrollo de un módulo de conexión centralizado, `db.js`, encargado de gestionar la conexión a MongoDB mediante variables de entorno (archivo `.env`), permitiendo mantener la configuración desacoplada y portable entre entornos locales y de producción.

**Modelado de Esquemas con Mongoose:**

- Definición de schemas para entidades principales como User, Employee, Client, Contact, Role, Area, Task, Invoice, Estimate, etc., estableciendo validaciones, índices y relaciones entre colecciones.
- Inclusión de timestamps automáticos (`createdAt`, `updatedAt`) y campos únicos cuando correspondía (ejemplo: email en usuarios).
- Implementación de validaciones integradas (`required`, `minLength`, `unique`, etc.) para asegurar la integridad de los datos.

## 2.2 Refactorización de Clases y Controladores

**Migración de BaseModel a Mongoose:**  
Adaptación de la lógica CRUD genérica, reemplazando operaciones sobre archivos JSON por métodos nativos de Mongoose (`create`, `find`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`).

**Refactorización de Controladores:**

- Actualización de `UserController`, `ClientController` y `RoleController` para utilizar directamente los modelos de Mongoose en lugar de las clases previas basadas en JSON.
- Implementación de un sistema de manejo de errores estandarizado con `try/catch` y respuestas claras para errores de validación o conexión a base de datos.

**Actualización de Middlewares:**  
Adaptación del middleware de validación para trabajar en conjunto con los errores arrojados por Mongoose (ejemplo: duplicados o campos requeridos).

## 2.3 Módulos de Contabilidad, Cobranzas y Documentación

**Módulo de Facturación (Invoices):**

- Creación del modelo, controlador, rutas y vistas Pug (`index`, `show`, `new`, `edit`).
- Implementación de un modelo Counter para la generación secuencial y única del número de factura.
- Desarrollo de la lógica de previsualización para impresión de facturas.
- Incorporación de la funcionalidad de cancelación de facturas mediante una ruta y controlador específicos, complementada con un modal de confirmación de Bootstrap en la vista.

**Módulo de Recibos y Pagos (Receipts & Payments):**

- Implementación de la entidad Receipts (Recibos) con modelo, controlador y vistas CRUD (`index`, `show`, `edit`, `new`) para el seguimiento de pagos de facturas.
- Desarrollo del modelo, controlador y vistas de Payments (Pagos) para la creación y visualización de transacciones.
- Refactorización del flujo de pago para actualizar el estado de los recibos y facturas automáticamente tras la creación de un pago.
- Ajuste en la plantilla `new.pug` para el campo `transaction_id` de pagos.

**Módulo de Estimaciones (Estimates):**

- Creación de la entidad, modelo, controlador y vistas (`index`, `show`, `edit`, `new`) para la gestión de cotizaciones.
- Desarrollo de lógica de controlador y vistas para el manejo dinámico de ítems en las estimaciones.
- Implementación del cálculo de la fecha de vencimiento (`due date`) basado en la fecha de creación.

**Módulo de Gastos (Expenses y Expense Categories):**

- Inclusión de la entidad Expense Categories (Categorías de Gastos) con su modelo, controlador, rutas y vistas Pug.
- Implementación de la entidad Expenses (Gastos) con su modelo, controlador, rutas y vistas.

**Document Files:**  
Creación de la entidad Document Files con la implementación completa de su lógica CRUD (modelo, controlador, rutas y vistas).

## 2.4 Ampliación del Dominio y Refactorización de Entidades

**Estandarización de Campos:**

- Adición del campo `code` a todas las entidades y desarrollo de una función para la generación automática de códigos desde el ID.
- Refactorización para reemplazar el campo `status` por el campo booleano `is_active` para una gestión de estado más clara.
- Normalización de los campos de estado para otras entidades.

**Entidades de Personal (User, Position, Role):**

- Implementación de la entidad Position (Cargo) con su CRUD completo y la integración en las vistas de usuario.
- Separación conceptual y actualización de referencias entre las entidades Employee y User.
- Inclusión de los campos `username` y `dni` en la entidad User, con generación de valores por defecto en el formulario de creación.

**Entidades de Proyectos (Project, Team, Team Roles, Task):**

- Implementación de la entidad Team Roles para una estructura de base de datos normalizada en la gestión de equipos.
- Actualización de la vista de edición de proyectos para reemplazar la selección de un manager único por la asignación de un equipo completo.

**Manejo de Clientes y Contactos:**

- Inclusión de la entidad Contact con su lógica CRUD y vistas asociadas.
- Actualización de las vistas y controladores de Client para mostrar los contactos asociados y otros detalles completos del cliente.

## 2.5 Refactorización y Ampliación de Vistas (Pug + Bootstrap)

**Refactorización de Navegación y Estilo:**

- Rediseño del Sidebar con menús colapsables (collapsible menus), scroll vertical independiente, actualización de estilos, colores e iconos, y corrección de tamaño del logo.
- Mejora de la navegación en vistas de detalle, incluyendo un botón (Volver) en todas las páginas `show.pug`.
- Ajuste del estilo de botones para una mayor consistencia visual y mejor respuesta al hover.

**Estabilidad y Usabilidad:**

- Implementación de manejo seguro de datos (`safe data handling` y `null checks`) en las plantillas Pug de User (`index`, `show`, `edit`, `new`) para prevenir errores en tiempo de ejecución.
- Corrección de un error en el menú desplegable (`dropdown menu bug`) en la sección de usuario.
- Estandarización de las plantillas de formulario (`form.pug`) y de listados de entidades.
- Inclusión de numeración de filas en todas las tablas de listado (`list.pug`).
- Implementación de `tabindex` en los formularios para mejorar la navegación por teclado.

**Manejo de Errores Global:**

- Adición de un middleware global para el manejo de errores 404 y 500, con sus respectivas vistas Pug actualizadas.

## 2.6 Mantenimiento de Repositorio y Documentación

**Owner y Maintainer del repositorio GitHub:**

- Creación del Repositorio en GitHub: Gestión de la inicialización y configuración del repositorio de control de versiones en GitHub para el proyecto, facilitando el seguimiento de los cambios.
- Seguimiento en GitHub: Administración de commits específicos para cada fase de la migración, manteniendo la trazabilidad de los cambios y asegurando la claridad en la evolución del proyecto.

**Actualización del README:**  
Documentación de los cambios realizados en la migración a MongoDB, incluyendo las instrucciones para configurar la conexión a la base de datos.

**Capturas de Pantalla y Ejemplos:**  
Inclusión de nuevas evidencias visuales de operaciones CRUD sobre MongoDB, tanto desde Postman como desde las vistas Pug.

## 2.7 Despliegue y Mantenimiento de Infraestructura en la Nube

**Migración a MongoDB Atlas:**  
Configuración inicial de la base de datos en la plataforma cloud MongoDB Atlas para asegurar la escalabilidad, alta disponibilidad y accesibilidad del entorno de producción.

**Configuración de Conexión a la Nube:**  
Actualización de la configuración de la aplicación para utilizar la cadena de conexión de MongoDB Atlas (configurándolo en las variables de entorno), reemplazando la conexión local previa.

**Despliegue Continuo (CD) en Render:**  
Configuración del proyecto para el despliegue automático en la plataforma Render, enlazando el repositorio de GitHub y definiendo los parámetros de construcción y puesta en marcha del servidor Node.js.

**Mantenimiento Operacional y Actualizaciones:**

- **Monitoreo y Actualización de DB Atlas:** Tarea continua para monitorear el estado y rendimiento de la base de datos en MongoDB Atlas y garantizar la integridad de la información.
- **Gestión del Deploy:** Mantenimiento del entorno de Render para asegurar que la aplicación esté siempre operativa y que las actualizaciones automáticas reflejen la última versión estable del código en el repositorio.


---

# 3. Descripción Técnica del Sistema

**Resumen Ejecutivo:**  
Este sistema fue concebido y desarrollado sobre un stack tecnológico basado en Node.js, con el objetivo de proporcionar una solución integral para la gestión de proyectos, clientes, facturación y recursos. La arquitectura se fundamenta en el patrón Model-View-Controller (MVC) dentro de un enfoque monolítico, una decisión estratégica que priorizó la velocidad de desarrollo y la entrega rápida de un producto funcional y cohesivo. A continuación, se detallan los componentes clave, la estructura de capas, los flujos de datos y la implementación de la lógica de negocio que definen el estado actual del sistema.

## 3.1 Introducción a la Arquitectura y Componentes Principales

La base del sistema se ha construido para ser robusta y fácil de entender, permitiendo una evolución controlada. A continuación se describen los elementos tecnológicos y estructurales que lo componen.

### 3.1.1 Componentes Tecnológicos

- **Entorno de Ejecución y Framework:** El sistema opera sobre Node.js utilizando el framework Express.js, que gestiona el enrutamiento, el middleware y el ciclo de vida de las peticiones HTTP. El punto de entrada es `server.js`, mientras que `app.js` centraliza la configuración global de la aplicación.
- **Capa de Persistencia:** La interacción con la base de datos se gestiona a través de Mongoose, un ODM (Object Data Modeling) para MongoDB. Esta herramienta facilita la definición de esquemas de datos, validaciones y la gestión de relaciones entre las distintas entidades del dominio.
- **Capa de Presentación:** Para el renderizado de vistas en el servidor (SSR), se utiliza el motor de plantillas Pug, que permite generar HTML dinámico de manera eficiente. La interfaz se apoya en Bootstrap para un diseño responsivo y consistente.

### 3.1.2 Estructura Arquitectónica: El Patrón MVC

- **Modelos (Model):** Representan las entidades de negocio y la lógica de acceso a datos. Cada modelo de Mongoose (ProjectModel, ClientModel, etc.) encapsula el esquema de la base de datos, las validaciones y las relaciones.
- **Vistas (View):** Componen la interfaz de usuario. Las plantillas Pug son responsables de presentar los datos al usuario final de una manera clara y estructurada.
- **Controladores (Controller):** Actúan como el núcleo de la lógica de la aplicación, orquestando la interacción entre los Modelos y las Vistas. Reciben las peticiones del usuario, interactúan con la capa de persistencia para obtener o modificar datos y, finalmente, seleccionan la vista adecuada para responder.

## 3.2 Diseño Arquitectónico Detallado

La elección de un enfoque monolítico y la implementación del patrón MVC han modelado la forma en que los componentes interactúan y cómo se estructura el flujo de trabajo interno.

### 3.2.1 El Enfoque MVC Monolítico

Se optó por una arquitectura monolítica para consolidar toda la funcionalidad en una única base de código. Este enfoque simplifica el despliegue y las pruebas iniciales, y fomenta una alta cohesión entre los distintos módulos del dominio (proyectos, facturación, clientes). Dentro de esta estructura, los controladores han sido diseñados para ser el centro de la lógica de orquestación, asumiendo la responsabilidad de procesar las entradas del usuario, aplicar reglas de negocio y preparar los datos para la presentación.

### 3.2.2 Estructura y Organización de Carpetas

El sistema se organiza en la carpeta `src/`, que contiene subdirectorios para `controllers`, `models`, `routes`, `utils` y `config`. Esta estructura facilita la localización de los elementos funcionales y separa las responsabilidades de manera lógica, aunque la lógica de negocio está parcialmente combinada con la presentación y persistencia.

Las vistas se encuentran en el directorio `views/`, donde cada entidad tiene su propia sección de plantillas Pug, incluyendo layouts generales y específicos, así como plantillas para manejo de errores y formularios CRUD.

### 3.2.3 Entidades y Modelos del Sistema

A continuación se describen todas las entidades del sistema y su funcionalidad principal, reflejando la estructura de datos, relaciones y propósitos dentro de la plataforma.

- **BaseModel:** Capa base genérica sobre Mongoose que centraliza operaciones CRUD (`create`, `findAll`, `findById`, `update`, `patch`, `delete`) y soporta populate configurable. Proporciona consistencia y reutilización para todos los modelos que la extienden.
- **AreaModel:** Representa las áreas organizacionales de la empresa. Contiene campos como `code`, `name_area`, `description` e `is_active`. Permite gestionar las unidades de la empresa y sus estados activos o inactivos.
- **ClientModel:** Modela clientes, ya sean personas o empresas. Incluye datos de identificación, dirección (`address`) y facturación (`billing_info`). Posee virtuals para acceder a contactos y proyectos asociados, y soporta consultas con populate.
- **ContactModel:** Representa contactos individuales de un cliente, con vinculación mediante `client_id`. Incluye email único y campos de rol/departamento, facilitando la gestión de relaciones CRM.
- **Counter:** Utilidad genérica para gestionar secuencias (`_id`, `sequence_value`) en la persistencia. Es un modelo de soporte que no forma parte del dominio funcional.
- **DocumentFileModel:** Maneja archivos y documentos asociados a proyectos. Campos relevantes: `project_id`, `uploaded_by`, `title`, `file_url` y `category` (enum). Permite populate de proyecto y empleado responsable.
- **EmployeeModel:** Representa empleados del sistema, relacionados con un User, Area, Position y supervisor. Incluye datos personales, salariales y estado de actividad. Posee virtual `full_name` y permite consultas anidadas para obtener información completa de usuario y roles.
- **EstimateModel:** Modela presupuestos de proyectos, con atributos como `items` (description, amount), `subtotal`, descuentos, impuestos, `total` y `currency`. Se vincula a Project y Client mediante populate.
- **ExpenseCategoryModel:** Define categorías de gastos dentro del sistema. Contiene `code`, `name` y `description` para clasificación de los gastos.
- **ExpenseModel:** Registra gastos asociados a proyectos y empleados, indicando categoría, monto, currency, fecha, método de pago y estado (`pending/approved/rejected`). Permite populate para referencias a Project, Employee y ExpenseCategory.
- **InvoiceModel:** Gestiona facturas derivadas de presupuestos, incluyendo tipo (A/B/C/E), número, fechas, line items, descuentos, impuestos, totales, pagos y estado. Contiene virtual `project_name` y soporte de populate profundo para acceder a cliente y proyecto.
- **PaymentModel:** Registra pagos recibidos sobre facturas. Incluye `invoice_number`, `transaction_id`, `payment_date`, método, currency, amount, description y estado (`success/cancelled`).
- **PositionModel:** Define cargos o posiciones dentro de la organización. Campos: `code`, `name`, `description`. CRUD simple.
- **ProjectModel:** Representa proyectos con relaciones a Client y Employee (`project_manager`), fechas, budget, tipo de facturación (`hourly/fixed`), status y equipos (`teams`). Permite populate de cliente, manager y líder de cada equipo.
- **ReceiptModel:** Almacena comprobantes de cobro, referenciando Invoice y mediante populate anidado accediendo a Estimate, Project y Client.
- **RoleModel:** Define roles del sistema, incluyendo permisos. Campos: `code`, `name`, `description`, `permissions` [String]. Proporciona métodos auxiliares para obtener roles con permisos y validar duplicados.
- **TaskModel:** Modela tareas de proyectos. Relaciona Project y Employee (`assigned_to`), con campos `title`, `description`, `priority`, `status`, `estimated_hours`, `due_date` y `time_entries_ids`. Soporta populate de time entries y empleados.
- **TeamModel:** Representa equipos de trabajo con líder (`team_leader`) y miembros, incluyendo su rol dentro del equipo (`team_role_id`). Soporta populate anidado de líder y miembros con roles y datos de usuario.
- **TeamRoleModel:** Define roles dentro de equipos (p.ej., Dev, QA, PM). Campos: `code`, `name`, `description`. Incluye métodos para validación de duplicados.
- **TimeEntryModel:** Registra el tiempo trabajado por empleados en tareas, vinculando Employee y Task (y mediante populate, Project). Campos: `date`, `hours_worked`, `description`, `billable`, `approved`, `approved_by`, `supervisor_comment`.
- **UserModel:** Representa usuarios del sistema para acceso y autenticación. Campos: `username`, `password_hash`, `email`, `role_id`, `last_login`, `is_active`, `code`. Permite populate de role_id para obtener información completa de permisos y rol del usuario.

### 3.2.4 Interacción entre Capas

El flujo de información entre las capas está definido:

1. Una petición HTTP llega al enrutador de Express, que la dirige al método correspondiente en un Controlador.
2. El Controlador procesa la petición, interactuando con uno o varios Modelos para realizar operaciones de base de datos (lectura, escritura, actualización). Mongoose, a través de su función populate, se utiliza de forma extensiva para cargar datos relacionados y construir un grafo de objetos completo.
3. Una vez que los datos están listos, el Controlador los pasa a una Vista Pug.
4. La Vista renderiza el HTML final y lo devuelve como respuesta al cliente.
5. Por ejemplo, en el caso de `ProjectController.createView`, el controlador recibe los datos del formulario, los procesa para crear una nueva instancia de `ProjectModel`, invoca al CodeGenerator para asignar un identificador de negocio y, finalmente, redirige al usuario a la vista del proyecto recién creado.

### 3.2.5 Integración de Componentes y Flujo de Dependencias

La arquitectura presenta una integración directa entre sus componentes, diseñada para la eficiencia:

- **Vistas y Modelos:** Las vistas Pug están diseñadas para consumir directamente los objetos de Mongoose enriquecidos por populate. Esto permite renderizar información relacional compleja (como el nombre del cliente de un proyecto) de forma directa, simplificando la lógica en la capa de presentación.
- **Controladores e Infraestructura:** Los controladores dependen directamente de los modelos de Mongoose, lo que permite un acceso rápido y tipado a la capa de datos, acelerando el desarrollo de nuevas funcionalidades CRUD.

## 3.3 Modelo de Dominio y Persistencia

El corazón del sistema es su modelo de dominio, que representa las entidades de negocio y sus interrelaciones.

- **Entidad ProjectModel:** Es la entidad central del sistema. Representa un proyecto y mantiene relaciones con Client, Employee (como project_manager) y Team. Las vistas de detalle de un proyecto se construyen utilizando populate anidado para cargar toda la información relevante de una sola vez.
- **Entidad EstimateModel:** Modela un presupuesto o estimación. Se vincula a un Project y contiene una lista de ítems con sus costos. Utiliza campos virtuales de Mongoose para exponer datos relacionados, como el nombre del cliente (`clientName`), de forma conveniente.
- **Entidades de Facturación (InvoiceModel, ReceiptModel, ExpenseModel):** Forman el núcleo del subsistema de facturación. Un Invoice (factura) se genera a partir de un Estimate. Un Receipt (recibo) se asocia a una factura para registrar un pago. Los Expense (gastos) se asocian a proyectos para llevar un control de costos. Estas entidades utilizan populate de forma intensiva para trazar la relación completa desde el recibo hasta el cliente final.

## 3.4 Flujos de Datos Operacionales

Los flujos de datos describen cómo la información se mueve a través del sistema durante las operaciones comunes.

### 3.4.1 Flujo de Lectura (De la Base de Datos a la Vista)

1. El usuario solicita ver el detalle de un documento.
2. El controlador (`DocumentController.getByIdView`) recibe la petición.
3. Invoca al modelo `DocumentFileModel.findById()` con la configuración de populate necesaria para cargar datos del proyecto y del empleado que lo subió.
4. Una función utilitaria (`formatDatesForInput`) prepara las fechas para su correcta visualización.
5. Los datos formateados se pasan a la vista `show.pug`, que renderiza la página de detalle.

### 3.4.2 Flujo de Escritura (De la Interfaz a la Base de Datos)

1. El usuario envía un formulario HTML para actualizar un proyecto.
2. El middleware `method-override` transforma la petición POST en una PUT.
3. El controlador (`ProjectController.updateView`) recibe los datos del formulario.
4. Convierte los identificadores de texto a ObjectId de MongoDB, construye las estructuras de datos necesarias (como el array `teams`) y llama al método `this.model.update()`.
5. Tras la actualización, redirige al usuario a la vista del proyecto actualizado.

## 3.5 Implementación de la Lógica de Negocio

La lógica que gobierna las operaciones y reglas del sistema está implementada de manera pragmática para facilitar su desarrollo y mantenimiento inicial.

### 3.5.1 Ubicación de las Reglas de Negocio

La mayor parte de la lógica de negocio reside en los Controladores. Esta decisión de diseño centraliza en un único lugar la validación de datos de entrada, la orquestación de llamadas a los modelos, la transformación de datos y la ejecución de reglas específicas, como la generación de códigos únicos tras la creación de una entidad. El `BaseController` abstrae la lógica CRUD más común, mientras que los controladores específicos la extienden con reglas particulares de cada entidad.

### 3.5.2 Reglas de Negocio Clave Implementadas

- **Generación de Códigos Únicos:** Todas las entidades principales poseen un código único de negocio (`code`), generado por un servicio `CodeGenerator` después de la creación del registro en la base de datos.
- **Asignación de Roles:** Se aplican reglas como la asignación obligatoria de un Project Manager a cada proyecto.
- **Mapeo de Estados y Tipos:** El sistema gestiona un conjunto de estados y tipos a través de enumeraciones en los modelos Mongoose (p.ej., `status` en proyectos, `billing_type`, etc.), asegurando la consistencia de los datos.

---

## 3.6. Interacción entre Módulos (usando MongoDB y Mongoose)

- El archivo `server.js` arranca el servidor Express y asegura que la conexión a MongoDB esté establecida correctamente mediante Mongoose, además de cargar las variables de entorno.
- Una petición HTTP (por ejemplo, `POST /api/clients`) llega al servidor Express configurado en `app.js` (iniciado por `server.js`).
- `app.js` dirige la petición a la ruta correspondiente (por ejemplo, `clientRoutes.js`).
- La ruta puede aplicar un middleware de validación (por ejemplo, `validateClientInput`) para verificar los datos de la petición.
- Si la validación es exitosa, la petición se pasa al método del controlador (por ejemplo, `clientController.create`) asociado a esa ruta y verbo HTTP.
- El método del controlador (que extiende `BaseController`) invoca la operación correspondiente en su **modelo de Mongoose** asociado (por ejemplo, `ClientModel.create`).
- El modelo, definido mediante **Mongoose schemas**, se encarga de interactuar directamente con la colección de MongoDB, realizando operaciones de creación, lectura, actualización o eliminación de documentos. Mongoose maneja automáticamente la generación de IDs únicos (`_id`) y la validación de esquema.
- El resultado de la operación se devuelve desde el modelo al controlador.
- Finalmente, el controlador construye una respuesta HTTP (con un código de estado y datos en formato JSON) y la envía de vuelta al cliente.


---
## 4. Cómo ejecutar este proyecto

Este proyecto es una aplicación en **Node.js** y **Express**, que utiliza **MongoDB** para la gestión de datos mediante **Mongoose**. Para ejecutarlo localmente, sigue estos pasos:

### 4.1. Clonar el repositorio:

```bash
git clone https://github.com/eduardo-mendiola/backend-ifts29-stage2
cd primer_entrega_crud
```

### 4.2. Instalar las dependencias:

```bash
npm install
```

Esto instalará todas las dependencias necesarias que están listadas en `package.json`, incluyendo **Mongoose**.

### 4.3. Configurar MongoDB

1. Asegúrate de tener un servidor MongoDB en funcionamiento (local o en la nube, por ejemplo **MongoDB Atlas**).
2. Copia la URL de conexión de tu base de datos. Por ejemplo:

```
mongodb+srv://usuario:contraseña@cluster0.mongodb.net/nombreDB?retryWrites=true&w=majority
```

### 4.4. Variables de entorno

Crea un archivo llamado `.env` en la raíz del proyecto y agrega tus variables de entorno, incluyendo la conexión a MongoDB:

```env
PORT=3000
MONGO_URI=mongodb+srv://usuario:contraseña@cluster0.mongodb.net/nombreDB
OTRA_VARIABLE=valor
```

### 4.5. Ejecutar la aplicación

* Para desarrollo (se reinicia automáticamente al modificar archivos):

```bash
npm run dev
```

* Para producción:

```bash
npm start
```

### 4.6. Abrir la aplicación en el navegador

El servidor se ejecutará en el puerto definido en tu archivo `.env`.
Si no has definido un puerto, por defecto será `http://localhost:3000`.

> ⚠️ Nota: La primera vez que ejecutes la aplicación, Mongoose creará automáticamente las colecciones necesarias según los modelos definidos en tu proyecto.


---

# 5. Documentación de Interfaces y Funcionalidades

## 5.1 Menú y navegación entre módulos

**Descripción:**  
Esta sección muestra la estructura principal de la aplicación y cómo se accede a cada módulo. La navegación está centrada en una sidebar con menús desplegables, que agrupa las 19 entidades en 6 bloques principales:

- **Usuarios:** incluye Usuarios y Empleados.
- **Clientes y Contactos:** incluye Clientes y Contactos.
- **Organización:** incluye Roles, Cargos y Áreas.
- **Actividades:** incluye Proyectos, Tareas, Registro de Actividades y Documentos.
- **Equipos:** incluye Equipos y Roles de Equipo.
- **Contabilidad:** incluye Presupuestos, Gastos, Categorías de Gastos, Facturas, Cobros y Pagos.

Además, la pantalla de inicio (**Dashboard**) proporciona accesos rápidos a los módulos más utilizados, permitiendo ir directamente a Empleados, Proyectos y Clientes, facilitando la navegación y agilizando el trabajo diario.  
Esta estructura asegura que los usuarios puedan localizar rápidamente cualquier módulo o entidad dentro del sistema, manteniendo la coherencia y eficiencia en la experiencia de uso.

**Ejemplo visual de la navegación:**  
![Menú y navegación](assets/screenshots/menu_navegacion.png)

---

## 5.2 Patrón CRUD general (un ejemplo completo)

**Descripción:**  
Se presenta un caso representativo del patrón CRUD que se aplica de manera consistente en la mayoría de las entidades del sistema, evitando mostrar todas las pantallas repetitivas.

- **Index:** Muestra el listado de elementos de la entidad, incluyendo una barra de búsqueda por código para localizar rápidamente registros. Cada fila incluye opciones por documento: Ver, Editar y Eliminar.  

  ![Index](assets/screenshots/crud_index.png)

- **Ver (Show):** Resume toda la información de la entidad y, si es necesario, muestra datos relacionados. Incluye botones de navegación para volver al listado o editar el registro directamente.  

  ![Show](assets/screenshots/crud_show.png)

- **Editar (Edit):** Permite modificar la información del registro, respetando la lógica de negocio y validaciones específicas de cada entidad.  

  ![Edit](assets/screenshots/crud_edit.png)

- **Eliminar (Delete):** Abre un modal de confirmación antes de proceder, asegurando que la acción no se realice accidentalmente.  

  ![Delete](assets/screenshots/crud_delete.png)

- **Nuevo (New):** Permite crear un registro con los campos requeridos y aplicando la lógica de negocio correspondiente.  

  ![New](assets/screenshots/crud_new.png)

Este patrón uniforme garantiza consistencia en la experiencia del usuario y facilita la comprensión y gestión de todas las entidades del sistema.

---

## 5.3 Casos especiales por módulo

### 5.3.1 Usuarios y Empleados (filtros de selección)

**Descripción:**  
Demuestra la funcionalidad de filtros y búsqueda avanzada para seleccionar usuarios o empleados de manera eficiente.  

![Usuarios y Empleados](assets/screenshots/filtros_usuarios_empleados.png)

![Usuarios y Empleados](assets/screenshots/filtros_usuarios_empleados2.png)

---

### 5.3.2 Roles (opciones de permisos)

**Descripción:**  
Muestra la gestión de roles y la configuración de permisos específicos para cada tipo de usuario.  

![Roles](assets/screenshots/roles_permisos.png)

---

### 5.3.3 Proyectos (selección de equipos)

**Descripción:**  
Ejemplo de cómo se asignan equipos a proyectos, permitiendo la selección múltiple de equipos de trabajo.  

![Proyectos](assets/screenshots/proyectos_equipos.png)

---

### 5.3.4 Equipos (selección miembros y asignación de roles)

**Descripción:**  
Pantalla de gestión de equipos con selección de miembros y asignación de roles dentro del equipo.  

![Equipos](assets/screenshots/equipos_miembros_roles.png)

---

### 5.3.5 Presupuesto (carga de ítems y cálculo de impuestos y descuentos)

**Descripción:**  
Destaca la funcionalidad de ingreso de ítems, aplicación automática de impuestos y descuentos, y cálculo final del presupuesto.  

![Presupuesto](assets/screenshots/presupuesto_items.png)

---

### 5.3.6 Facturas (editar, eliminar y anular)

**Descripción:**  
Esta pantalla muestra las acciones disponibles sobre las facturas según su estado, reflejando las restricciones de negocio:

- **Edición:** Solo las facturas en estado de edición pueden ser modificadas.
- **Eliminación:** Solo las facturas en estado de edición pueden eliminarse, ya que aún no se les ha asignado un número de factura.
- **Anulación:** Las facturas en estado generada pueden anularse, pero no eliminarse.
- **Restricciones completas:** Las facturas en estado pagada no se pueden eliminar ni anular.
- **Impresión:** Las facturas en estado Pagada, Generada o Anulada pueden imprimirse.  

![Facturas](assets/screenshots/facturas_acciones.png)

---

### 5.3.7 Facturas (carga de ítems extras)

**Descripción:**  
Ejemplo de cómo agregar ítems adicionales a una factura ya creada, reflejando flexibilidad en la gestión.  

![Facturas Ítems Extras](assets/screenshots/facturas_items_extras.png)

---

### 5.3.8 Facturas (generar e imprimir factura)

**Descripción:**  
Esta pantalla permite gestionar la generación e impresión de facturas a partir de la información ya cargada:

- **Generación:** Se muestra una previsualización de la factura con toda la información cargada previamente. El usuario debe confirmar para que se asigne el número de factura, cambiando su estado a Generada.
- **Impresión:** Las facturas en estado Generada, Pagada o Anulada pueden imprimirse en formato físico o PDF, asegurando que cumplan con los requisitos legales y contables. Además, las facturas en estado Pagada o Anulada muestran claramente su respectivo sello o etiqueta indicando “PAGADA” o “ANULADA”, para reflejar su situación en el documento impreso.  

Este flujo garantiza que solo las facturas completas y validadas sean emitidas oficialmente, preservando la integridad de los documentos contables.  

![Facturas Generar e Imprimir](assets/screenshots/facturas_generar_imprimir.png)

![Facturas Generar e Imprimir](assets/screenshots/facturas_generar_imprimir2.png)

![Facturas Generar e Imprimir](assets/screenshots/facturas_generar_imprimir3.png)



# 6. Uso de IAs

## 6.1 Modelos

Durante el desarrollo de este proyecto se emplearon herramientas de Inteligencia Artificial (IA) para mejorar la eficiencia en la codificación, la comprensión teórica y la elaboración de documentación.  

Se utilizaron específicamente:

- **ChatGPT (GPT-5 mini, OpenAI)** en su versión en la nube.
- **Claude AI (Claude Opus 4.1, Anthropic)** en su versión en la nube.

El uso de la IA incluyó las siguientes funciones principales:

- **Corrección de código:** revisión de sintaxis, detección de errores lógicos y sugerencias de optimización en JavaScript, incluyendo Node.js, Express.js y dependencias como dotenv y nodemon.
- **Explicaciones teóricas:** consultas sobre funcionamiento de conceptos de programación, arquitectura de software y metodologías de desarrollo.
- **Implementación de plantillas Pug:** asistencia en la creación de plantillas Pug y su implementación en el sistema.
- **Generación de documentación:** asistencia en la redacción de secciones formales del proyecto, incluyendo guías, introducciones y análisis de caso.

---

## 6.2 Prompts

### AI: ChatGPT  
**Modelo:** GPT-5 Mini  

**Prompt ejemplo 1:**  
Genera un JSON de ejemplo para un sistema de gestión de proyectos que incluya datos realistas para cada entidad. Las entidades son:

1. `users`: id(string), nombre, apellido, email, hash de contraseña, teléfono, role_id, salario mensual, estado, fecha de creación y actualización.  
2. `roles`: id(string), nombre, descripción.  
3. `areas`: id(string), name_area.  
4. `clients`: id(string), nombre, persona de contacto, email, teléfono, dirección, estado.  
5. `projects`: id(string), client_id, nombre, descripción, fecha de inicio y fin, presupuesto, tipo de facturación, estado, manager_id.  
6. `tasks`: id(string), project_id, assigned_to (user_id), título, descripción, prioridad, estado, horas estimadas, fecha de entrega.  
7. `time_entries`: id(string), user_id, task_id, project_id, fecha, horas trabajadas, descripción, facturable.  
8. `estimates`: id(string), client_id, project_id, título, descripción, monto total, estado, fecha de validez.  
9. `invoices`: id(string), client_id, estimate_id, número de factura, fecha de emisión, fecha de vencimiento, monto total, estado.  
10. `payments`: id(string), invoice_id, monto, fecha de pago, método de pago, id de transacción.  
11. `expenses`: id(string), project_id, user_id, descripción, monto, fecha, categoría.  
12. `teams`: id(string), nombre, descripción.  
13. `team_members`: id(string), team_id, user_id, rol dentro del equipo.  
14. `documents`: id(string), project_id, uploaded_by (user_id), título, url del archivo, tipo de archivo, fecha de subida.

**Instrucciones:**  

- Usar nombres, emails y direcciones realistas.  
- Incluir al menos 5-6 registros por entidad.  
- Generar relaciones coherentes entre entidades (`foreign keys`).  
- Diferenciar estados (`active`, `inactive`, `pending`, `in_progress`, etc.).  
- Usar fechas consistentes en el año 2025.  

**Respuesta:**  
Archivo `db.json`.

---

### AI: ChatGPT  
**Modelo:** GPT-5 Mini  

**Descripción de uso:**  
Cuando surgió un bug difícil de corregir, se solicitó a la IA que insertara `console.log()` en la función o sección del código donde se detectaba el error, para identificar exactamente dónde se producía. Cada `console.log()` incluía una explicación de lo que estaba ocurriendo en ese punto, facilitando la localización y corrección del bug.

**Prompt ejemplo 2:**  
Tengo un bug en mi código que es difícil de encontrar. Por favor, agrega `console.log()` en la función o sección donde podría estar el error. Cada `console.log()` debe explicar claramente qué está sucediendo en ese punto del código, para que sea más fácil identificar y corregir el bug.

**Ejemplo de código antes de usar IA:**

```javascript
getEditView = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await this.model.findById(id);
        if (!task) return res.render('error404', { title: 'Tarea no encontrada' });

        const users = await User.findAll();
        const projects = await Project.findAll();

        const formattedTask = formatDatesForInput(this.formatItem(task), ['due_date', 'created_at']);

        res.render(`${this.viewPath}/edit`, {
            title: `Editar Task`,
            item: formattedTask,
            users,
            projects
        });
    } catch (error) {
        console.error('Error en getEditView:', error.message);
        res.status(500).render('error500', { title: 'Error del servidor' });
    }
};
````

**Ejemplo de código mejorado con IA:**

```javascript
getEditView = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('📌 Parámetro recibido:', id);

        const task = await this.model.findById(id);
        console.log('📌 Resultado de findById:', task);

        if (!task) {
            console.log('⚠️ No se encontró la tarea con el id proporcionado');
            return res.render('error404', { title: 'Tarea no encontrada' });
        }

        const users = await User.findAll();
        console.log('📌 Usuarios obtenidos:', users.length);

        const projects = await Project.findAll();
        console.log('📌 Proyectos obtenidos:', projects.length);

        const formattedTask = formatDatesForInput(this.formatItem(task), ['due_date', 'created_at']);
        console.log('📌 Tarea después de formatear fechas:', formattedTask);

        res.render(`${this.viewPath}/edit`, {
            title: `Editar Task`,
            item: formattedTask,
            users,
            projects
        });
        console.log('✅ Renderizado de la vista edit completado correctamente');
    } catch (error) {
        console.error('❌ Error en getEditView:', error.message);
        res.status(500).render('error500', { title: 'Error del servidor' });
    }
};
```

---

# 7. Bibliografía y Fuentes

* IFTS Nro. 29, Tecnicatura Superior en Desarrollo de Software a Distancia, Desarrollo de Sistemas Web (Back End) - 2° (2025). [Link](https://aulasvirtuales.bue.edu.ar/course/view.php?id=22553)
* The Net Ninja. (2022). MERN Stack Crash Course Tutorial [Playlist]. YouTube. [Link](https://youtube.com/playlist?list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE&si=TEi7PZTW6xPRlSSk)
* Martín Gesualdo. (2023). Emprendedor Full Stack | Aprende a desarrollar aplicaciones web [Playlist]. YouTube. [Link](https://youtube.com/playlist?list=PLAmcNbGd0fkNl-CleT_XxwGKDk1j00uUp&si=U8oSAdMzI47pPvVo)
* Node.js Foundation. (s.f.). Node.js. Recuperado en septiembre de 2025, de [https://node.js.org/](https://node.js.org/)
* npm, Inc. (s.f.). Documentación de npm. Recuperado en septiembre de 2025, de [https://docs.npmjs.com/](https://docs.npmjs.com/)
* Express.js. (s.f.). Documentación oficial de Express.js. Recuperado en septiembre de 2025, de [https://expressjs.com/](https://expressjs.com/)
* Pug (s.f.). Documentación oficial de plantillas Pug. Recuperado en septiembre de 2025, de [https://pugjs.org/api/getting-started.html](https://pugjs.org/api/getting-started.html)
* Bootstrap (s.f.). Documentación oficial de Bootstrap v5.3. Recuperado en septiembre de 2025, de [https://getbootstrap.com/docs/5.3/getting-started/introduction/](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
* MongoDB (s.f.). Documentación oficial de MongoDB. Recuperado en octubre de 2025, de [https://www.mongodb.com/docs/](https://www.mongodb.com/docs/)
* Mongoose (s.f.). Documentación oficial de Mongoose 8.19.0. Recuperado en octubre de 2025, de [https://mongoosejs.com/docs/guide.html](https://mongoosejs.com/docs/guide.html)
* Leonardo Jose Castillo Lacruz - FreeCodeCamp Español. (05/11/2024). Curso API CRUD - Node.js, Express, MongoDB y Autenticación. YouTube, [Link](https://www.youtube.com/watch?v=Oa5blAV7Fyg)
* Dave Gray. (2022). MERN Stack Tutorials [Playlist]. YouTube. [Link](https://youtube.com/playlist?list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&si=YQyOf194iv0GNgUH)

