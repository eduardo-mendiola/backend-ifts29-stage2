# Tecnicatura Superior en Desarrollo de Software  
## Entrega Final de Proyecto: Sistema de Gestión Integral NexusFlow v3.0 para ClickWave 
### Caso 2: ClickWave  

**Materia:** Desarrollo de Sistemas Web (Back End)  
**Profesor:** Emir Eliezer Garcia Ontiveros  
**Comisión:** A  
**Alumno:** Mendiola, Eduardo E.  
**Fecha de la Entrega:** 19-11-2025  

---


## Índice

1. [Introducción del Caso](#1-introducción-del-caso)  
   1.1 [Propósito del Sistema](#11-propósito-del-sistema)  
   1.2 [Contexto Empresarial](#12-contexto-empresarial)  
       1.2.1 [Descripción General de ClickWave](#121-descripción-general-de-clickwave)  
       1.2.2 [Problemáticas Detectadas (Etapa 1)](#122-problemáticas-detectadas-etapa-1)  
   1.3 [Objetivos del Sistema](#13-objetivos-del-sistema)  
   1.4 [Arquitectura Técnica del Sistema](#14-arquitectura-técnica-del-sistema)  
       1.4.1 [Definiciones Técnicas y Tecnologías](#141-definiciones-técnicas-y-tecnologías)  

2. [Asignación de Roles y Responsabilidades Por Etapas](#2-asignación-de-roles-y-responsabilidades-por-etapas)  
   2.1 [Primera Etapa del Proyecto: Fundamentos con JSON](#21-primera-etapa-del-proyecto-fundamentos-con-json)  
       2.1.1 [Arquitectura Inicial con BaseController y BaseModel](#211-arquitectura-inicial-con-basecontroller-y-basemodel)  
       2.1.2 [Sistema de Persistencia en JSON](#212-sistema-de-persistencia-en-json)  
       2.1.3 [Entidades Principales del Dominio](#213-entidades-principales-del-dominio)  
       2.1.4 [Rutas y Controladores por Entidad](#214-rutas-y-controladores-por-entidad)  
       2.1.5 [Vistas Pug y Estilos Básicos](#215-vistas-pug-y-estilos-básicos)  
       2.1.6 [Refactorización a ESM (Módulos ECMAScript)](#216-refactorización-a-esm-módulos-ecmascript)  
       2.1.7 [Gestión del Repositorio en GitHub](#217-gestión-del-repositorio-en-github)  
   2.2 [Segunda Etapa del Proyecto: Transición a MongoDB](#22-segunda-etapa-del-proyecto-transición-a-mongodb)  
       2.2.1 [Migración a MongoDB con Mongoose](#221-migración-a-mongodb-con-mongoose)  
       2.2.2 [Refactorización de Controladores](#222-refactorización-de-controladores)  
       2.2.3 [Módulos de Facturación y Cobranza](#223-módulos-de-facturación-y-cobranza)  
       2.2.4 [Ampliación del Dominio](#224-ampliación-del-dominio)  
       2.2.5 [Refactorización y Ampliación de Vistas (Pug + Bootstrap)](#225-refactorización-y-ampliación-de-vistas-pug--bootstrap)  
       2.2.6 [Despliegue en MongoDB Atlas y Render](#226-despliegue-en-mongodb-atlas-y-render)  
   2.3 [Tercera Etapa del Proyecto: Autenticación, Autorización y Testing](#23-tercera-etapa-del-proyecto-autenticación-autorización-y-testing)  
       2.3.1 [Implementación de Autenticación y Autorización](#231-implementación-de-autenticación-y-autorización)  
       2.3.2 [Sistema de Permisos Granulares](#232-sistema-de-permisos-granulares)  
       2.3.3 [Testing Integral con Jest](#233-testing-integral-con-jest)  
       2.3.4 [Mejoras de Seguridad](#234-mejoras-de-seguridad)  
       2.3.5 [Dashboards y Reportes con Chart.js](#235-dashboards-y-reportes-con-chartjs)  

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
   3.7 [Versionado](#37-versionado)  

4. [Cómo ejecutar este proyecto](#4-cómo-ejecutar-este-proyecto)  
   4.1 [Clonar el repositorio](#41-clonar-el-repositorio)  
   4.2 [Instalar las dependencias](#42-instalar-las-dependencias)  
   4.3 [Configurar MongoDB](#43-configurar-mongodb)  
   4.4 [Variables de entorno](#44-variables-de-entorno)  
   4.5 [Ejecutar la aplicación](#45-ejecutar-la-aplicación)  
   4.6 [Abrir la aplicación en el navegador](#46-abrir-la-aplicación-en-el-navegador)  

5. [Sistema de Autenticación](#5-sistema-de-autenticación)  
   5.1 [Características](#características)  
   5.2 [Documentación Completa](#documentación-completa)  
   5.3 [Inicio Rápido con Autenticación](#inicio-rápido-con-autenticación)  

6. [Sistema de Testing](#6-sistema-de-testing)  
   6.1 [Testing con TDD](#testing-con-tdd-test-driven-development)  
   6.2 [Stack de Testing](#stack-de-testing)  
   6.3 [Comandos Disponibles](#comandos-disponibles)  
   6.4 [Tests Implementados](#tests-implementados)  
   6.5 [Documentación Completa](#documentación-completa-1)  

7. [Documentación de Interfaces y Funcionalidades](#7-documentación-de-interfaces-y-funcionalidades)  
   7.1 [Menú y navegación entre módulos](#71-menú-y-navegación-entre-módulos)  
   7.2 [Patrón CRUD general (un ejemplo completo)](#72-patrón-crud-general-un-ejemplo-completo)  
   7.3 [Casos especiales por módulo](#73-casos-especiales-por-módulo)  
       7.3.1 [Usuarios y Empleados (filtros de selección)](#731-usuarios-y-empleados-filtros-de-selección)  
       7.3.2 [Roles (opciones de permisos)](#732-roles-opciones-de-permisos)  
       7.3.3 [Proyectos (selección de equipos)](#733-proyectos-selección-de-equipos)  
       7.3.4 [Equipos (selección miembros y asignación de roles)](#734-equipos-selección-miembros-y-asignación-de-roles)  
       7.3.5 [Presupuesto (carga de ítems y cálculo de impuestos y descuentos)](#735-presupuesto-carga-de-ítems-y-cálculo-de-impuestos-y-descuentos)  
       7.3.6 [Facturas (editar, eliminar y anular)](#736-facturas-editar-eliminar-y-anular)  
       7.3.7 [Facturas (carga de ítems extras)](#737-facturas-carga-de-ítems-extras)  
       7.3.8 [Facturas (generar e imprimir factura)](#738-facturas-generar-e-imprimir-factura)  
   7.4 [Interfaces de Dashboards, Reportes y Análisis](#74-interfaces-de-dashboards-reportes-y-análisis)  

8. [Uso de IAs](#8-uso-de-ias)  
   8.1 [Modelos](#81-modelos)  
   8.2 [Prompts](#82-prompts)  

9. [Bibliografía y Fuentes](#9-bibliografía-y-fuentes)
 

---

## 1. Introducción del Caso

El sistema **NexusFlow** desarrollado para la empresa **ClickWave** es una aplicación de gestión interna diseñada para optimizar la administración de Usuarios (User), Clientes (Client), y la estructura interna de la compañía (definición de Roles y Áreas).

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


## 2. Asignación de Roles y Responsabilidades Por Etapas

### **Mendiola, Eduardo E.**
**Rol:** Desarrollador Fullstack: Backend (Node.js / Mongoose), Frontend (Pug / Bootstrap) y Operaciones Cloud.

---

## 2.1 Primera Etapa del Proyecto: Fundamentos con JSON

En esta primera fase, se sentaron las bases de la arquitectura del sistema, implementando un modelo CRUD básico con persistencia en archivos JSON. Este enfoque inicial permitió definir la estructura del dominio, establecer los patrones de diseño fundamentales y construir una base sólida para las etapas posteriores.

### 2.1.1 Arquitectura Inicial con BaseController y BaseModel

Se diseñó una arquitectura genérica y reutilizable basada en dos clases fundamentales:

- **BaseModel:**  
  Clase abstracta responsable de gestionar la persistencia de datos en archivos JSON. Implementaba métodos genéricos para crear, leer, actualizar y eliminar registros (`create`, `findAll`, `findById`, `update`, `delete`), asegurando la manipulación consistente de entidades mediante operaciones de E/S sobre el sistema de archivos (`fs`).

- **BaseController:**  
  Controlador genérico que orquestaba las operaciones CRUD mediante el patrón MVC. Esta clase proporcionaba métodos estándar (`index`, `show`, `create`, `update`, `destroy`) que podían ser heredados y especializados por controladores específicos de cada entidad.

### 2.1.2 Sistema de Persistencia en JSON

La persistencia se implementó completamente sobre archivos JSON almacenados localmente en el directorio `data/`. Cada entidad disponía de su propio archivo JSON, actuando como un almacenamiento estructurado y portable. Este enfoque facilitó el desarrollo ágil y las pruebas iniciales sin dependencia de una base de datos externa.

### 2.1.3 Entidades Principales del Dominio

Se implementaron las siguientes entidades con sus respectivos modelos, controladores, rutas y vistas:

- **User:** Usuarios del sistema.
- **Employee:** Empleados de la organización.
- **Client:** Clientes y empresas.
- **Role:** Roles de usuario con permisos asociados.
- **Area:** Áreas organizacionales.
- **Task:** Tareas asociadas a proyectos.
- **Project:** Proyectos gestionados en el sistema.

Cada entidad seguía el patrón CRUD completo, permitiendo operaciones de listado, creación, edición y eliminación tanto desde la interfaz web como desde la API.

### 2.1.4 Rutas y Controladores por Entidad

Se estructuraron rutas independientes para cada módulo del sistema (`userRoutes`, `clientRoutes`, `projectRoutes`, etc.), todas siguiendo convenciones RESTful. Los controladores extendían `BaseController` e incorporaban lógica de negocio específica cuando era necesario, como validaciones personalizadas o transformaciones de datos.

### 2.1.5 Vistas Pug y Estilos Básicos

Se desarrollaron plantillas Pug para la presentación dinámica de datos en el servidor (SSR). Las vistas incluían:

- **Plantillas de listado** (`index.pug`): Tablas con todos los registros de una entidad.
- **Vistas de detalle** (`show.pug`): Presentación de un registro individual.
- **Formularios de creación/edición** (`new.pug`, `edit.pug`): Interfaces para la captura de datos.

Los estilos básicos se implementaron con Bootstrap para garantizar un diseño responsivo y una experiencia de usuario coherente.

### 2.1.6 Refactorización a ESM (Módulos ECMAScript)

Se migró todo el código de CommonJS (`require`/`module.exports`) a ESM (`import`/`export`), adoptando el estándar moderno de módulos de JavaScript. Este cambio implicó:

- Actualización de todos los archivos de código fuente para utilizar sintaxis ESM.
- Modificación del `package.json` para incluir `"type": "module"`.
- Ajustes en la configuración de herramientas y dependencias para garantizar compatibilidad.

### 2.1.7 Gestión del Repositorio en GitHub

Se creó y configuró el repositorio en GitHub (`backend-ifts29-stage2`), estableciendo una estructura de versionado y commits organizados. Se documentó el proyecto con un README inicial y se gestionaron las actualizaciones mediante commits específicos para cada funcionalidad implementada.

---

## 2.2 Segunda Etapa del Proyecto: Transición a MongoDB

En esta etapa se migró la arquitectura de persistencia desde JSON hacia MongoDB, utilizando Mongoose como ODM. Esta transición permitió aprovechar las capacidades de una base de datos NoSQL documental, incorporando validaciones robustas, relaciones entre entidades y operaciones eficientes de consulta.

### 2.2.1 Migración a MongoDB con Mongoose

**Instalación y Configuración de Mongoose:**  
Integración de Mongoose mediante npm para gestionar la conexión y la definición de esquemas de datos, garantizando un mapeo consistente entre los documentos de MongoDB y las entidades de la aplicación.

**Conexión a MongoDB:**  
Desarrollo de un módulo de conexión centralizado (`db.js`) encargado de gestionar la conexión a MongoDB mediante variables de entorno (archivo `.env`), permitiendo mantener la configuración desacoplada y portable entre entornos locales y de producción.

**Modelado de Esquemas con Mongoose:**

- Definición de schemas para entidades principales como `User`, `Employee`, `Client`, `Contact`, `Role`, `Area`, `Task`, `Invoice`, `Estimate`, etc., estableciendo validaciones, índices y relaciones entre colecciones.
- Inclusión de timestamps automáticos (`createdAt`, `updatedAt`) y campos únicos cuando correspondía (ejemplo: `email` en usuarios).
- Implementación de validaciones integradas (`required`, `minLength`, `unique`, etc.) para asegurar la integridad de los datos.

### 2.2.2 Refactorización de Controladores

**Migración de BaseModel a Mongoose:**  
Adaptación de la lógica CRUD genérica, reemplazando operaciones sobre archivos JSON por métodos nativos de Mongoose (`create`, `find`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`).

**Refactorización de Controladores:**

- Actualización de `UserController`, `ClientController`, `RoleController` y otros controladores para utilizar directamente los modelos de Mongoose en lugar de las clases previas basadas en JSON.
- Implementación de un sistema de manejo de errores estandarizado con `try/catch` y respuestas claras para errores de validación o conexión a base de datos.

**Actualización de Middlewares:**  
Adaptación del middleware de validación para trabajar en conjunto con los errores arrojados por Mongoose (ejemplo: duplicados o campos requeridos).

### 2.2.3 Módulos de Facturación y Cobranza

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

### 2.2.4 Ampliación del Dominio

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

### 2.2.5 Refactorización y Ampliación de Vistas (Pug + Bootstrap)

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

### 2.2.6 Despliegue en MongoDB Atlas y Render

**Migración a MongoDB Atlas:**  
Configuración inicial de la base de datos en la plataforma cloud MongoDB Atlas para asegurar la escalabilidad, alta disponibilidad y accesibilidad del entorno de producción.

**Configuración de Conexión a la Nube:**  
Actualización de la configuración de la aplicación para utilizar la cadena de conexión de MongoDB Atlas (configurándolo en las variables de entorno), reemplazando la conexión local previa.

**Despliegue Continuo (CD) en Render:**  
Configuración del proyecto para el despliegue automático en la plataforma Render, enlazando el repositorio de GitHub y definiendo los parámetros de construcción y puesta en marcha del servidor Node.js.

**Mantenimiento Operacional y Actualizaciones:**

- **Monitoreo y Actualización de DB Atlas:** Tarea continua para monitorear el estado y rendimiento de la base de datos en MongoDB Atlas y garantizar la integridad de la información.
- **Gestión del Deploy:** Mantenimiento del entorno de Render para asegurar que la aplicación esté siempre operativa y que las actualizaciones automáticas reflejen la última versión estable del código en el repositorio.

**Actualización del README y Documentación:**  
Documentación de los cambios realizados en la migración a MongoDB, incluyendo las instrucciones para configurar la conexión a la base de datos y capturas de pantalla de evidencias visuales de operaciones CRUD sobre MongoDB.

---

## 2.3 Tercera Etapa del Proyecto: Autenticación, Autorización y Testing

En esta etapa se consolidó la capa de seguridad del sistema mediante la implementación completa de autenticación y autorización, junto con un conjunto integral de pruebas automatizadas y el desarrollo de dashboards interactivos para la visualización de datos clave.

### 2.3.1 Implementación de Autenticación y Autorización

**Sistema de Autenticación Dual:**

- **Autenticación Tradicional con Passport.js y Sesiones:**  
  Implementación de Passport con estrategia Local para la autenticación de usuarios mediante formularios de login. Las sesiones se gestionan con `express-session` y se almacenan en MongoDB mediante `connect-mongo`, garantizando persistencia y escalabilidad.

- **Autenticación API con JSON Web Tokens (JWT):**  
  Desarrollo de un sistema de autenticación basado en JWT para proteger las rutas de la API. Los tokens tienen una expiración de 24 horas y se emiten tras la validación exitosa de credenciales mediante la ruta `/api/auth/login`.

**Modelo de Usuario con Seguridad:**

- Implementación del schema `UserModel` con hash de contraseñas mediante `bcrypt`.
- Métodos de instancia para comparación de contraseñas (`comparePassword`).
- Relación con el modelo `Role` mediante `populate` para cargar dinámicamente los permisos asociados.

**Middlewares de Protección:**

- `isAuthenticated`: Verifica que el usuario esté autenticado mediante sesión.
- `verifyJWT`: Valida tokens JWT en las peticiones a la API.
- `hasRole(role)`: Restringe el acceso a usuarios con un rol específico.
- `hasPermission(permission)`: Controla el acceso basado en permisos granulares.

**Controladores de Autenticación:**

- `AuthController`: Gestiona el flujo de autenticación tradicional (login, logout, registro).
- `ApiAuthController`: Maneja la autenticación API (emisión de JWT, validación de tokens).

### 2.3.2 Sistema de Permisos Granulares

Se implementó un sistema de autorización basado en roles y permisos con más de 28 permisos específicos, organizados por categoría:

**Permisos de Gestión de Usuarios:**
- `users:view`, `users:create`, `users:edit`, `users:delete`

**Permisos de Gestión de Proyectos:**
- `projects:view`, `projects:create`, `projects:edit`, `projects:delete`

**Permisos de Facturación:**
- `invoices:view`, `invoices:create`, `invoices:edit`, `invoices:delete`, `invoices:cancel`

**Permisos de Reportes y Dashboards:**
- `reports:view`, `dashboards:view`, `analytics:view`

**Permisos Administrativos:**
- `roles:manage`, `permissions:manage`, `system:admin`

Estos permisos se asignan a roles (`admin`, `manager`, `developer`, `client`, `employee`, `executive`) mediante un esquema flexible que permite combinaciones personalizadas.

### 2.3.3 Testing Integral con Jest

**Stack de Testing:**

- **Jest:** Framework de testing con soporte para TDD y BDD.
- **Supertest:** Librería para testing de endpoints HTTP.
- **MongoDB Memory Server:** Base de datos MongoDB en memoria para pruebas aisladas.

**Tests Implementados:**

- **Tests Unitarios:**
  - Validación de helpers y utilidades (`dateHelpers.test.js`).
  - Testing de controladores (`projectController.test.js`).

- **Tests de Integración:**
  - CRUD completo de proyectos (`projects-crud.test.js`).
  - Flujos de autenticación y autorización.

- **Tests de Humo (Smoke Tests):**
  - Verificación básica de la disponibilidad del servidor y conexión a base de datos.

**Configuración de Testing:**

- `jest.config.js`: Configuración centralizada con timeout extendido (30 segundos).
- `setupTests.js`: Inicialización de la conexión a MongoDB Memory Server antes de cada suite.
- `globalSetup.js` / `globalTeardown.js`: Setup y teardown global del entorno de pruebas.

**Helpers y Builders:**

- `authHelper.js`: Funciones auxiliares para login y obtención de tokens JWT en tests.
- `dataBuilders.js`: Builders para la creación de datos de prueba (proyectos, usuarios, roles).

**Cobertura de Código:**

- Generación de reportes de cobertura en formato HTML con `lcov-report`.
- Objetivo: Mantener cobertura superior al 80% en módulos críticos.

### 2.3.4 Mejoras de Seguridad

**Protección de Rutas:**

- Todas las rutas web (vistas Pug) protegidas con middleware `isAuthenticated`.
- Todas las rutas de API protegidas con middleware `verifyJWT`.
- Aplicación de middlewares `hasRole` y `hasPermission` en rutas administrativas y operaciones sensibles.

**Control de Estado de Usuario:**

- Verificación del campo `is_active` antes de permitir el acceso.
- Mensajes de error específicos para cuentas desactivadas.

**Validación de Datos:**

- Validación de entrada en controladores y middlewares.
- Sanitización de datos para prevenir inyección SQL y XSS.

### 2.3.5 Dashboards y Reportes con Chart.js

**Dashboards Implementados:**

- **Dashboard Ejecutivo:**  
  Visualización de KPIs clave: total de proyectos, clientes, facturación, estados de proyectos, distribución de clientes por tipo, evolución de facturación mensual.

- **Dashboard Financiero:**  
  Indicadores de facturación, ingresos por proyecto, comparativas de presupuesto vs. facturación real, gráficos de ingresos mensuales y anuales.

- **Dashboard Operativo:**  
  Estado de tareas, carga de trabajo por empleado, proyectos activos vs. completados, seguimiento de hitos y entregables.

**Tecnologías de Visualización:**

- **Chart.js:** Librería JavaScript para gráficos interactivos.
- **Tipos de Gráficos:** Barras, líneas, tortas (pie), donas (doughnut).
- **Integración:** Los datos se obtienen de la base de datos mediante controladores especializados (`DashboardController`, `ClientReportController`) y se renderizan dinámicamente en las vistas Pug.

**Controladores de Reportes:**

- `ClientReportController`: Generación de reportes de clientes con filtros por tipo, estado y rango de fechas.
- `ProjectReportController`: Análisis de proyectos por estado, equipo, área y rentabilidad.
- `FinancialReportController`: Consolidación de datos de facturación, pagos, gastos y presupuestos.

---


# 3. Descripción Técnica del Sistema

**Resumen Ejecutivo:**  
Este sistema fue concebido y desarrollado sobre un stack tecnológico basado en Node.js, con el objetivo de proporcionar una solución integral para la gestión de proyectos, clientes, facturación y recursos. La arquitectura se fundamenta en el patrón Model-View-Controller (MVC) dentro de un enfoque monolítico, priorizando la velocidad de desarrollo y una entrega funcional consistente.

A su estructura original se le incorporaron posteriormente mecanismos completos de autenticación, autorización y seguridad, incluyendo sesiones con Passport, protección mediante JSON Web Tokens (JWT) y un sistema de roles, lo que consolidó un entorno más robusto para el acceso, la administración de usuarios y la integridad del flujo operativo.

Este capítulo describe los componentes clave, la estructura de capas, los flujos de datos, las entidades y la lógica de negocio que definen el estado actual del sistema.

## 3.1 Introducción a la Arquitectura y Componentes Principales

La base del sistema se ha construido para ser robusta, comprensible y progresivamente ampliable. Los siguientes apartados describen los elementos tecnológicos y estructurales que conforman la plataforma en su estado actual.

### 3.1.1 Componentes Tecnológicos

El ecosistema tecnológico fue seleccionado para garantizar la eficiencia y la productividad durante el desarrollo:

**Entorno de Ejecución y Framework:**  
El sistema opera sobre Node.js utilizando el framework Express.js, que gestiona el enrutamiento, el middleware y el ciclo de vida de las peticiones HTTP. El punto de entrada es `server.js`, mientras que `app.js` centraliza la configuración global, la inicialización de middleware y la integración de sesiones y autenticación.

**Capa de Persistencia:**  
La interacción con la base de datos se gestiona a través de Mongoose, un ODM (Object Data Modeling) para MongoDB. Esta herramienta facilita la definición de esquemas de datos, índices únicos, relaciones y virtuals, validaciones y la gestión de relaciones entre las distintas entidades del dominio.

**Capa de Seguridad y Autenticación:**  
El sistema incorpora una capa completa de seguridad y autenticación que opera de manera integrada dentro del esquema MVC. La autenticación tradicional se gestiona mediante sesiones utilizando Passport con estrategia Local, mientras que el acceso a la API se asegura a través de tokens JWT. Además, un conjunto de middlewares se encarga de proteger las rutas y aplicar la autorización por roles, garantizando que cada usuario solo acceda a lo que le corresponde. Todo este mecanismo funciona como una capa transversal que refuerza la seguridad sin alterar la estructura principal del sistema.

**Capa de Presentación:**  
Para el renderizado de vistas en el servidor (SSR), se utiliza el motor de plantillas Pug, que permite generar HTML dinámico de manera eficiente. La interfaz se apoya en Bootstrap para un diseño responsivo y consistente. Se incorporan pantallas protegidas (dashboard, vistas CRUD) y la vista de login, coherente con el resto del sistema.

### 3.1.2 Estructura Arquitectónica: El Patrón MVC

La arquitectura del sistema se adhiere estrictamente al patrón Model-View-Controller (MVC), que separa las responsabilidades en tres capas bien definidas:

**Modelos (Model):**  
Representan las entidades de negocio y la lógica de acceso a datos. Cada modelo de Mongoose (ProjectModel, ClientModel, etc.) encapsula el esquema de la base de datos, las validaciones, índices únicos (p. ej., email en User), timestamps automáticos y relaciones entre colecciones.

**Vistas (View):**  
Componen la interfaz de usuario. Las plantillas Pug son responsables de presentar los datos al usuario final de una manera clara y estructurada. Pug genera HTML dinámico compatible con las operaciones de gestión, autenticación y navegación. Se incluyen plantillas consistentes para login, presentaciones de datos, formularios y errores.

**Controladores (Controller):**  
Actúan como el núcleo de la lógica de la aplicación, orquestando la interacción entre los Modelos y las Vistas. Reciben las peticiones del usuario, interactúan con la capa de persistencia para obtener o modificar datos, coordinan la lógica de negocio, manipulan modelos, gestionan sesiones, emiten JWT, procesan formularios y preparan los datos para la vista.

## 3.2 Diseño Arquitectónico Detallado

### 3.2.1 El Enfoque MVC Monolítico

La arquitectura monolítica consolida toda la funcionalidad en una única base de código. Este enfoque simplifica el despliegue y las pruebas iniciales, la trazabilidad, la incorporación posterior del sistema de autenticación sin fragmentar el proyecto, y fomenta una alta cohesión entre los distintos módulos del dominio (proyectos, facturación, clientes). Dentro de esta estructura, los controladores han sido diseñados para ser el centro de la lógica de orquestación, asumiendo la responsabilidad de procesar las entradas del usuario, aplicar reglas de negocio, acceso a datos, validación de identidad y roles y preparar los datos para la presentación.

### 3.2.2 Estructura y Organización de Carpetas

Dentro del directorio principal `src/` se encuentran los módulos esenciales que dan estructura al sistema. En `controllers/` se aloja toda la lógica de negocio junto con los controladores responsables de los procesos de autenticación. El directorio `models/` contiene los modelos de Mongoose que representan el dominio completo de la aplicación, incluyendo el UserModel, la definición de roles, la estructura de permisos y cualquier otra entidad relevante.

En `routes/` se organizan tanto las rutas públicas como las protegidas, cada una vinculada a su respectivo middleware de autenticación. Justamente, esos middlewares residen en el directorio `middleware/`, donde se implementan funciones como `isAuthenticated`, `hasRole`, `hasPermission`, etc., además del módulo centralizado de manejo de errores.

La configuración del sistema se concentra en `config/`, que reúne los archivos encargados de establecer la conexión con MongoDB e inicializar componentes clave como Passport y JWT. Por otro lado, todas las utilidades auxiliares se ubican en `utils/`, un espacio donde viven herramientas como CodeGenerator, filterManagers, invoiceNumberGenerator, etc., también funciones de formato y distintos validadores.

Finalmente, el directorio `views/` contiene las plantillas Pug del sistema, como las interfaces CRUD, dashboard, sidebar con botones desplegables y la vista de login, integradas visualmente para mantener coherencia estética y funcional con toda la aplicación.

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

El flujo de información dentro del sistema sigue un recorrido claramente definido entre sus capas, combinando la lógica de negocio, el acceso a datos, la renderización de vistas y la seguridad. Cuando llega una petición HTTP, esta es recibida por el enrutador de Express, que la dirige al método correspondiente en un Controlador. El Controlador se encarga de procesar la petición, interactuando con uno o varios Modelos para realizar operaciones sobre la base de datos, ya sea lectura, escritura o actualización. Para optimizar la carga de datos relacionados y construir un grafo de objetos completo, se utiliza extensivamente Mongoose y su función populate.

Una vez que los datos están preparados, el Controlador los pasa a una Vista Pug, la cual renderiza el HTML final y lo devuelve como respuesta al cliente. Por ejemplo, en el caso de `ProjectController.createView`, el controlador recibe los datos de un formulario, los procesa para crear una nueva instancia de ProjectModel, invoca al CodeGenerator para asignar un identificador de negocio único y, finalmente, redirige al usuario hacia la vista del proyecto recién creado.

A esta interacción básica se le ha integrado una capa de seguridad y autenticación. Cuando un usuario intenta acceder a una ruta protegida, primero se ejecuta el middleware `hasPermission` o `isAuthenticated`, que valida la identidad del usuario. Luego, el middleware `hasRole` comprueba que el usuario cuente con los permisos necesarios para realizar la operación solicitada. Solo una vez completadas estas validaciones, el Controlador ejecuta la lógica correspondiente y obtiene los datos desde los Modelos. La Vista finalmente renderiza la respuesta, asegurando que únicamente los usuarios autenticados y autorizados puedan acceder a operaciones sensibles de lectura, escritura o modificación en el sistema.

Este flujo garantiza no solo la correcta interacción entre capas Controlador, Modelos y Vistas, sino también la integridad y seguridad de las operaciones, integrando de manera transversal la autenticación y la autorización sin alterar la arquitectura MVC.

### 3.2.5 Integración de Componentes y Flujo de Dependencias

La arquitectura del sistema presenta una integración directa y coherente entre todos sus componentes, diseñada para maximizar la eficiencia y mantener la claridad en el flujo de datos. Las vistas Pug están preparadas para consumir directamente los objetos de Mongoose, enriquecidos mediante populate, lo que permite renderizar información relacional compleja de manera inmediata, como por ejemplo mostrar el nombre del cliente asociado a un proyecto, sin necesidad de lógica adicional en la capa de presentación.

Los controladores dependen de los modelos de Mongoose para acceder a la capa de datos de forma rápida y tipada, facilitando la implementación de nuevas funcionalidades CRUD. Además, esta dependencia se extiende a la capa de seguridad, de modo que cada controlador puede verificar la identidad y los permisos de los usuarios antes de ejecutar cualquier operación.

Las rutas se encuentran protegidas por middlewares de autenticación, como `isAuthenticated` o `hasPermission`, y por control de roles mediante `hasRole`, asegurando que solo los usuarios autorizados puedan acceder a operaciones sensibles. Cuando corresponde, las vistas reciben información personalizada del usuario autenticado, integrando datos de manera contextual y segura.

Los modelos, a su vez, interactúan entre sí mediante populate y validaciones de dominio, lo que garantiza consistencia en los datos y refuerza la integridad de la información dentro del sistema. Esta integración transversal entre vistas, controladores, modelos y capas de seguridad establece un flujo de dependencias claro y eficiente, donde cada componente cumple su función sin romper la cohesión general de la arquitectura MVC.

## 3.3 Modelo de Dominio y Persistencia

El corazón del sistema es su modelo de dominio, que representa las entidades de negocio y sus interrelaciones.

**Entidad ProjectModel:**  
Es la entidad central del sistema. Representa un proyecto y mantiene relaciones con Client, Employee (como project_manager) y Team. Las vistas de detalle de un proyecto se construyen utilizando populate anidado para cargar toda la información relevante de una sola vez.

**Entidad EstimateModel:**  
Modela un presupuesto o estimación. Se vincula a un Project y contiene una lista de ítems con sus costos. Utiliza campos virtuales de Mongoose para exponer datos relacionados, como el nombre del cliente (`clientName`), de forma conveniente.

**Entidades de Facturación (InvoiceModel, ReceiptModel, ExpenseModel):**  
Forman el núcleo del subsistema de facturación. Un Invoice (factura) se genera a partir de un Estimate. Un Receipt (recibo) se asocia a una factura para registrar un pago. Los Expense (gastos) se asocian a proyectos para llevar un control de costos. Estas entidades utilizan populate de forma intensiva para trazar la relación completa desde el recibo hasta el cliente final.

**Entidad UserModel:**  
El modelo de Usuario constituye un elemento fundamental para el acceso y la gestión del sistema. Cada usuario se identifica mediante un email único y una contraseña protegida mediante hashing con bcrypt, asegurando la confidencialidad de las credenciales. Además, se almacena el `role_id`, que define los permisos y el nivel de acceso del usuario, así como el registro del último inicio de sesión y distintos flags de estado que permiten gestionar su actividad y vigencia dentro del sistema.

El modelo también incorpora virtuals y utiliza populate para relacionar los roles con los usuarios, de manera que la información de permisos y responsabilidades se integre automáticamente al consultar la base de datos. Gracias a esta estructura, todas las operaciones vinculadas a proyectos, facturación y administración quedan asociadas a un usuario responsable y autenticado, garantizando trazabilidad, seguridad y control dentro de la plataforma.

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

### 3.4.3 Flujo de Autenticación

1. Usuario ingresa email y contraseña en la vista `login.pug`.
2. Passport verifica credenciales contra UserModel.
3. Si es correcto, crea una sesión persistente.
4. Para la API, se genera un JWT firmado con el secreto del entorno.
5. El usuario es redirigido al dashboard o recibe el token desde el endpoint API.

### 3.4.4 Flujo de Autorización por Roles

1. `verifyRole` evalúa los permisos.
2. Solo perfiles autorizados pueden ver, editar o eliminar ciertas entidades.

## 3.5 Implementación de la Lógica de Negocio

La lógica que gobierna las operaciones y reglas del sistema está implementada de manera pragmática para facilitar su desarrollo y mantenimiento inicial.

### 3.5.1 Ubicación de las Reglas de Negocio

La lógica de negocio se concentra en los Controladores, que centralizan la validación de datos de entrada, la orquestación de llamadas a los modelos, la transformación de información y la ejecución de reglas específicas, como la generación de códigos únicos tras la creación de una entidad. Los controladores integran la validación de credenciales, el cifrado y la comparación de contraseñas, la asignación de roles, el registro del último inicio de sesión (`last_login`) y la aplicación de reglas de acceso según el tipo de usuario. El BaseController abstrae la lógica CRUD más común, mientras que los controladores específicos extienden esa funcionalidad con reglas particulares de cada entidad, incorporando de manera coherente todos los mecanismos de seguridad y autorización necesarios para proteger las operaciones sensibles del sistema.

### 3.5.2 Reglas de Negocio Clave Implementadas

**Generación de Códigos Únicos:**  
Todas las entidades principales poseen un código único de negocio (`code`), generado por un servicio CodeGenerator después de la creación del registro en la base de datos.

**Asignación de Roles:**  
Se aplican reglas como la asignación obligatoria de un Project Manager a cada proyecto.

**Mapeo de Estados y Tipos:**  
El sistema gestiona un conjunto de estados y tipos a través de enumeraciones en los modelos Mongoose (por ejemplo, `status` en proyectos, `billing_type`, etc.), asegurando la consistencia de los datos.

**Validación de Autenticación:**  
Se valida la autenticación antes de ejecutar cada operación crítica.

**Generación y Validación de JWT:**  
Los endpoints de la API utilizan JSON Web Tokens (JWT) para asegurar que solo usuarios autorizados puedan acceder.

**Restricción de Vistas y Rutas según Rol:**  
El acceso a vistas y rutas se controla de acuerdo con el rol asignado a cada usuario.

**Control de Estado de Usuarios:**  
Se gestiona el estado activo o inactivo de los usuarios para garantizar que únicamente las cuentas habilitadas puedan realizar acciones dentro del sistema.

### 3.5.3 Lógica de Negocio para Dashboards, Reportes y Análisis

La implementación de la lógica de negocio para los dashboards se diseñó con un enfoque orientado al análisis en tiempo real. A diferencia de las operaciones CRUD tradicionales, este módulo requiere combinar información de distintas entidades, aplicar cálculos intermedios y normalizar datos heterogéneos. Por este motivo, se establecieron controladores especializados que actúan como orquestadores de múltiples consultas.

Cada reporte se construye siguiendo un flujo similar: primero se recopilan los datos brutos desde las colecciones relevantes, luego se aplican transformaciones específicas, como agrupamiento por período, acumulación de horas trabajadas o cálculo de márgenes financieros, y finalmente se prepara una estructura de datos optimizada para ser consumida por las vistas. Este proceso permite que las vistas se enfoquen exclusivamente en la presentación, delegando toda la lógica de negocio al backend.

Además, la lógica incorpora mecanismos defensivos para garantizar consistencia en las métricas, gestionando valores nulos, conversiones de campos y diferencias entre tipos de cliente o tipos de proyectos. Parte fundamental de esta implementación fue resolver relaciones encadenadas que no existían explícitamente en los modelos; por ejemplo, vincular facturas con clientes o vincular proyectos con horas trabajadas a través de tareas. La solución consistió en consultas con populate anidado y búsquedas secundarias, permitiendo reconstruir el contexto completo de cada entidad para producir métricas confiables.

El resultado es una capa de negocio capaz de generar indicadores ejecutivos, financieros y operativos a partir de datos dispersos, manteniendo la coherencia del modelo y el enfoque modular del sistema.

---

## 3.6 Interacción entre Módulos (usando MongoDB y Mongoose)

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

## 3.7 Versionado

El desarrollo del sistema seguirá un esquema de **versionado mayor**, reflejando cambios significativos en la funcionalidad o arquitectura del sistema. Cada versión mayor incluye nuevas características o modificaciones importantes que justifican un incremento de número completo, en lugar de versiones menores (por ejemplo, 1.1, 1.2), que se suelen reservar para ajustes o correcciones menores.

* **v1.0** – CRUD básico utilizando archivos JSON como almacenamiento de datos.
* **v2.0** – Migración a MongoDB y mejoras en la interfaz, incluyendo un sidebar más completo y funcional.
* **v3.0** – Implementación del sistema de autenticación y autorización de usuarios.

El salto de versión completa (1.0 → 2.0 → 3.0) se utiliza para reflejar que cada etapa representa un **avance importante en la arquitectura y funcionalidades**, diferenciándose claramente de simples correcciones o mejoras menores. Esto facilita el seguimiento del desarrollo y permite identificar rápidamente hitos clave en la evolución del sistema.


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

> Nota: La primera vez que ejecutes la aplicación, Mongoose creará automáticamente las colecciones necesarias según los modelos definidos en tu proyecto.


---
# 5. Sistema de Autenticación 

**Se ha implementado una arquitectura completa de autenticación con Passport.js + JWT**

### Características
- Login/Registro con sesiones persistentes
- API REST protegida con tokens JWT
- Hash de contraseñas con bcrypt
- Protección de todas las rutas
- Gestión de perfiles y permisos

### Documentación Completa
- [`AUTH_DOCUMENTATION.md`](./AUTH_DOCUMENTATION.md) - Guía completa de autenticación

### Inicio Rápido con Autenticación
```bash
    # 1. Instalar dependencias
    npm install

    # 2. Crear usuarios de prueba
    node seed.js

    # 3. Iniciar servidor
    npm run dev

    # 4. Acceder a http://localhost:4000
    # Login: admin@clickwave.com / admin123
```

---

## Para ejecutar el proyecto (¡Importante la conexión a MongoDB!):  
1. Clonar el repositorio.  
2. Instalar dependencias con `npm install`.  
3. **NUEVO:** Ejecutar `node seed.js` para crear usuarios de prueba.
4. Crear un archivo `.env` en la raíz del proyecto para la configuración de la base de datos.  

### Contenido Mínimo del `.env`:  
```bash
# Puerto donde se ejecutará la aplicación
PORT=4000

# URI de conexión a MongoDB (local o Atlas)
MONGO_URI_ATLAS="mongodb://localhost:27017/clickwavedb" 
# o MONGO_URI_ATLAS="mongodb+srv://user:password@cluster.mongodb.net/..."

# NUEVO: Secrets para autenticación
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_clickwave2025
SESSION_SECRET=your_super_secret_session_key_change_this_in_production_clickwave2025
NODE_ENV=development
````

4. Ejecutar la aplicación con `npm run dev` (o `npm start`).

---


# 6. Sistema de Testing

## Testing con TDD (Test Driven Development)

Este proyecto cuenta con un **sistema completo de testing profesional** implementado siguiendo las mejores prácticas de TDD (Test Driven Development).

### Stack de Testing

- **Jest**: Framework principal de testing
- **Supertest**: Testing de endpoints HTTP
- **MongoDB Memory Server**: Base de datos en memoria para tests aislados

### Comandos Disponibles

```bash
# Ejecutar todos los tests
npm test

# Modo watch (desarrollo)
npm run test:watch

# Con reporte de cobertura
npm run test:coverage
```

### Estructura de Tests

```
__tests__/
├── setup/              # Configuración global
├── helpers/            # Utilidades compartidas
├── builders/           # Patrón Builder para datos
├── fixtures/           # Datos estáticos de prueba
├── integration/        # Tests de endpoints completos
└── unit/              # Tests unitarios con mocks
```

### Tests Implementados

- **67+ tests de integración** para endpoints CRUD
- **30+ tests unitarios** con mocking
- Tests de validaciones de campos requeridos
- Tests de enumeraciones y referencias
- Tests de funciones puras
- Patrón Builder para datos de prueba
- Helpers y fixtures reutilizables

### Resultados de Tests

#### 1. Smoke Tests (7/7)
Verificación básica del sistema de testing: Jest, operaciones básicas, async/await, helpers globales.

![Smoke Tests](./assets/screenshots/smoke-tests.png)

#### 2. Unit Tests - dateHelpers (18/18)
Tests unitarios para funciones de formateo de fechas: `formatDate`, `formatDatesForInput`, edge cases.

![Unit Tests - dateHelpers](./assets/screenshots/unit-datehelpers.png)

#### 3. Integration Tests - POST /api/projects (14/14)
Tests de integración completos para creación de proyectos:
- Creación con datos válidos
- Validación de campos requeridos (name, client_id, project_manager)
- Validación de enumeraciones (billing_type, status)
- Validación de referencias (ObjectIds)
- Campos opcionales y valores por defecto

![Integration Tests - POST](./assets/screenshots/integration-projects-post.png)

#### 4. Integration Tests - CRUD /api/projects (15/15)
Tests de integración para operaciones CRUD completas:
- **GET** /api/projects - Listar todos los proyectos
- **GET** /api/projects/:id - Obtener proyecto específico
- **PUT** /api/projects/:id - Actualizar proyecto
- **DELETE** /api/projects/:id - Eliminar proyecto
- Manejo de errores (404, 500)

![Integration Tests - CRUD](./assets/screenshots/integration-projects-crud.png)

#### 5. Suite Completa (56/56 - 100%)
Ejecución de toda la suite de tests:
- 7 Smoke tests
- 18 Unit tests
- 29 Integration tests (projects)
- 2 Example pattern tests

**Resultado: 56 tests pasando, 0 fallando**

![Test Suite Completa](./assets/screenshots/full-test-suite.png)

### Documentación Completa

Para información detallada sobre cómo escribir y ejecutar tests:

- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Guía completa de testing
- **[TESTING_QUICK_REFERENCE.md](./TESTING_QUICK_REFERENCE.md)** - Referencia rápida
- **[__tests__/README.md](./__tests__/README.md)** - Estructura de carpetas

### Ejemplo Rápido

```javascript
// Test de integración
describe('POST /api/projects', () => {
  it('debe crear proyecto con datos válidos', async () => {
    const response = await request(app)
      .post('/api/projects')
      .send(validProjectData)
      .expect(201);
    
    expect(response.body).toHaveProperty('_id');
  });
});
```

---


# 7. Documentación de Interfaces y Funcionalidades

## 7.1 Inicio de sesión

**Descripción:**
La aplicación incorpora una pantalla de inicio de sesión diseñada para habilitar el acceso seguro de los usuarios registrados. La vista presenta un formulario simple, compuesto por los campos de email y contraseña, ambos validados desde el frontend y procesados posteriormente por los controladores de autenticación. La interfaz mantiene coherencia visual con el resto del sistema, utilizando la misma estructura, estilos y mensajes de retroalimentación, además de integrar los logotipos del sistema, de la empresa usuaria y de la empresa proveedora.

Ante intentos fallidos de inicio de sesión, el sistema muestra mensajes claros que informan al usuario sobre credenciales incorrectas o errores de validación. Una vez autenticado correctamente, el usuario es redirigido automáticamente al panel principal. Esta pantalla constituye el punto de entrada al sistema para todas las funciones que requieren autenticación, integrándose tanto con el flujo basado en sesiones como con la API protegida mediante JSON Web Tokens.

![Pantalla Login](assets/screenshots/login.webp)

## 7.2 Menú y navegación entre módulos

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
**Rol Administrador**
![Menú y navegación](assets/screenshots/menu_navegacion1.webp)
**Rol Junior**
![Menú y navegación](assets/screenshots/menu_navegacion2.webp)

---

## 7.2 Patrón CRUD general (un ejemplo completo)

**Descripción:**  
Se presenta un caso representativo del patrón CRUD que se aplica de manera consistente en la mayoría de las entidades del sistema, evitando mostrar todas las pantallas repetitivas.

- **Index:** Muestra el listado de elementos de la entidad, incluyendo una barra de búsqueda por código para localizar rápidamente registros. Cada fila incluye opciones por documento: Ver, Editar y Eliminar.  

  ![Index](assets/screenshots/crud_index.webp)

- **Ver (Show):** Resume toda la información de la entidad y, si es necesario, muestra datos relacionados. Incluye botones de navegación para volver al listado o editar el registro directamente.  

  ![Show](assets/screenshots/crud_show.webp)

- **Editar (Edit):** Permite modificar la información del registro, respetando la lógica de negocio y validaciones específicas de cada entidad.  

  ![Edit](assets/screenshots/crud_edit.webp)

- **Eliminar (Delete):** Abre un modal de confirmación antes de proceder, asegurando que la acción no se realice accidentalmente.  

  ![Delete](assets/screenshots/crud_delete.webp)

- **Nuevo (New):** Permite crear un registro con los campos requeridos y aplicando la lógica de negocio correspondiente.  

  ![New](assets/screenshots/crud_new.webp)

Este patrón uniforme garantiza consistencia en la experiencia del usuario y facilita la comprensión y gestión de todas las entidades del sistema.

---

## 7.3 Casos especiales por módulo

### 7.3.1 Usuarios y Empleados (filtros de selección)

**Descripción:**  
Demuestra la funcionalidad de filtros y búsqueda avanzada para seleccionar usuarios o empleados de manera eficiente.  

![Usuarios y Empleados](assets/screenshots/filtros_usuarios_empleados.webp)

![Usuarios y Empleados](assets/screenshots/filtros_usuarios_empleados2.webp)

---

### 7.3.2 Roles (opciones de permisos)

**Descripción:**  
Muestra la gestión de roles y la configuración de permisos específicos para cada tipo de usuario.  

![Roles](assets/screenshots/roles_permisos1.webp)
![Roles](assets/screenshots/roles_permisos2.webp)

---

### 7.3.3 Proyectos (selección de equipos)

**Descripción:**  
Ejemplo de cómo se asignan equipos a proyectos, permitiendo la selección múltiple de equipos de trabajo.  

![Proyectos](assets/screenshots/proyectos_equipos.webp)

---

### 7.3.4 Equipos (selección miembros y asignación de roles)

**Descripción:**  
Pantalla de gestión de equipos con selección de miembros y asignación de roles dentro del equipo.  

![Equipos](assets/screenshots/equipos_miembros_roles.webp)

---

### 7.3.5 Presupuesto (carga de ítems y cálculo de impuestos y descuentos)

**Descripción:**  
Destaca la funcionalidad de ingreso de ítems, aplicación automática de impuestos y descuentos, y cálculo final del presupuesto.  

![Presupuesto](assets/screenshots/presupuesto_items.webp)

---

### 7.3.6 Facturas (editar, eliminar y anular)

**Descripción:**  
Esta pantalla muestra las acciones disponibles sobre las facturas según su estado, reflejando las restricciones de negocio:

- **Edición:** Solo las facturas en estado de edición pueden ser modificadas.
- **Eliminación:** Solo las facturas en estado de edición pueden eliminarse, ya que aún no se les ha asignado un número de factura.
- **Anulación:** Las facturas en estado generada pueden anularse, pero no eliminarse.
- **Restricciones completas:** Las facturas en estado pagada no se pueden eliminar ni anular.
- **Impresión:** Las facturas en estado Pagada, Generada o Anulada pueden imprimirse.  

![Facturas](assets/screenshots/facturas_acciones.webp)

---

### 7.3.7 Facturas (carga de ítems extras)

**Descripción:**  
Ejemplo de cómo agregar ítems adicionales a una factura ya creada, reflejando flexibilidad en la gestión.  

![Facturas Ítems Extras](assets/screenshots/facturas_items_extras.webp)

---

### 7.3.8 Facturas (generar e imprimir factura)

**Descripción:**  
Esta pantalla permite gestionar la generación e impresión de facturas a partir de la información ya cargada:

- **Generación:** Se muestra una previsualización de la factura con toda la información cargada previamente. El usuario debe confirmar para que se asigne el número de factura, cambiando su estado a Generada.
- **Impresión:** Las facturas en estado Generada, Pagada o Anulada pueden imprimirse en formato físico o PDF, asegurando que cumplan con los requisitos legales y contables. Además, las facturas en estado Pagada o Anulada muestran claramente su respectivo sello o etiqueta indicando “PAGADA” o “ANULADA”, para reflejar su situación en el documento impreso.  

Este flujo garantiza que solo las facturas completas y validadas sean emitidas oficialmente, preservando la integridad de los documentos contables.  

![Facturas Generar e Imprimir](assets/screenshots/facturas_generar_imprimir.webp)

![Facturas Generar e Imprimir](assets/screenshots/facturas_generar_imprimir2.webp)

![Facturas Generar e Imprimir](assets/screenshots/facturas_generar_imprimir3.webp)

---

## 7.4 Interfaces de Dashboards, Reportes y Análisis

Las interfaces desarrolladas para los dashboards y reportes introducen una nueva capa visual dentro del sistema, orientada a usuarios ejecutivos y gerenciales. Su diseño se centra en la claridad, la lectura rápida de métricas y la navegación directa hacia información crítica. Cada pantalla fue construida utilizando Pug como motor de plantillas, complementado con componentes visuales de Chart.js y estilos consistentes con Bootstrap 5.

El **Dashboard Ejecutivo** presenta una composición simplificada centrada en tres indicadores clave, acompañados de un gráfico comparativo de desviación presupuestaria. La distribución del diseño se realizó para minimizar el ruido visual, priorizando información accionable por encima de detalles operativos.

Las pantallas de **reportes financieros, de proyectos y de clientes** incorporan una combinación de visualizaciones y tablas detalladas. Los gráficos de líneas, barras y dona permiten identificar tendencias de ingresos, distribución de gastos, estados de facturas y rendimiento por proyecto o cliente. Las tablas, por su parte, funcionan como capas de exploración profunda, mostrando registros recientes, valores clave y advertencias que facilitan la toma de decisiones.

El **análisis de ingresos y rentabilidad** cuenta con interfaces más técnicas, donde se presenta la evolución mensual, indicadores de crecimiento, métricas de margen y resultados de ROI. Se incorporaron colores consistentes con el resto del sistema, indicadores visuales de salud financiera y herramientas interactivas que permiten comparar períodos o analizar desviaciones específicas.

![Dashboard Ejecutivo](assets/screenshots/dashboard_ejecutivo.webp)

![Reporte Financiero](assets/screenshots/reporte_financiero.webp)

![Reporte de Proyectos](assets/screenshots/reporte_proyectos.webp)

![Reporte de Clientes](assets/screenshots/reporte_clientes.webp)

![Análisis de Ingresos](assets/screenshots/analisis_ingresos.webp)

![Análisis de Rentabilidad](assets/screenshots/analisis_rentabilidad.webp)

---

# 8. Uso de IAs

## 8.1 Modelos

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

## 8.2 Prompts

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
        console.log('Parámetro recibido:', id);

        const task = await this.model.findById(id);
        console.log('Resultado de findById:', task);

        if (!task) {
            console.log('No se encontró la tarea con el id proporcionado');
            return res.render('error404', { title: 'Tarea no encontrada' });
        }

        const users = await User.findAll();
        console.log('Usuarios obtenidos:', users.length);

        const projects = await Project.findAll();
        console.log('Proyectos obtenidos:', projects.length);

        const formattedTask = formatDatesForInput(this.formatItem(task), ['due_date', 'created_at']);
        console.log('Tarea después de formatear fechas:', formattedTask);

        res.render(`${this.viewPath}/edit`, {
            title: `Editar Task`,
            item: formattedTask,
            users,
            projects
        });
        console.log('Renderizado de la vista edit completado correctamente');
    } catch (error) {
        console.error('Error en getEditView:', error.message);
        res.status(500).render('error500', { title: 'Error del servidor' });
    }
};
```

---

# 9. Bibliografía y Fuentes

### Bibliografía y Fuentes

#### Documentación oficial

* Node.js Foundation. (s.f.). Node.js – Documentación oficial. Recuperado en septiembre de 2025, de [https://node.js.org/](https://node.js.org/)
* npm, Inc. (s.f.). Documentación de npm. Recuperado en septiembre de 2025, de [https://docs.npmjs.com/](https://docs.npmjs.com/)
* Express.js. (s.f.). Documentación oficial de Express.js. Recuperado en septiembre de 2025, de [https://expressjs.com/](https://expressjs.com/)
* Pug. (s.f.). Documentación oficial de plantillas Pug. Recuperado en septiembre de 2025, de [https://pugjs.org/api/getting-started.html](https://pugjs.org/api/getting-started.html)
* Bootstrap. (s.f.). Documentación oficial de Bootstrap v5.3. Recuperado en septiembre de 2025, de [https://getbootstrap.com/docs/5.3/getting-started/introduction/](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
* MongoDB. (s.f.). Documentación oficial de MongoDB. Recuperado en octubre de 2025, de [https://www.mongodb.com/docs/](https://www.mongodb.com/docs/)
* Mongoose. (s.f.). Documentación oficial de Mongoose 8.19.0. Recuperado en octubre de 2025, de [https://mongoosejs.com/docs/guide.html](https://mongoosejs.com/docs/guide.html)
* Passport.js. (s.f.). Documentación oficial de Passport.js. Recuperado en noviembre de 2025, de [http://www.passportjs.org/](http://www.passportjs.org/)
* JWT.io. (s.f.). JSON Web Tokens – Introduction. Recuperado en noviembre de 2025, de [https://jwt.io/introduction](https://jwt.io/introduction)
* bcrypt. (s.f.). bcrypt – npm package. Recuperado en noviembre de 2025, de [https://www.npmjs.com/package/bcrypt](https://www.npmjs.com/package/bcrypt)
* Jest. (s.f.). Documentación oficial de Jest. Recuperado en noviembre de 2025, de [https://jestjs.io/docs/getting-started](https://jestjs.io/docs/getting-started)
* Supertest. (s.f.). Supertest – npm package. Recuperado en noviembre de 2025, de [https://www.npmjs.com/package/supertest](https://www.npmjs.com/package/supertest)
* MongoDB Memory Server. (s.f.). mongodb-memory-server – npm package. Recuperado en noviembre de 2025, de [https://www.npmjs.com/package/mongodb-memory-server](https://www.npmjs.com/package/mongodb-memory-server)

#### Guías y cursos en línea

* IFTS Nro. 29, Tecnicatura Superior en Desarrollo de Software a Distancia, Desarrollo de Sistemas Web (Back End) – 2° (2025). Recuperado de [https://aulasvirtuales.bue.edu.ar/course/view.php?id=22553](https://aulasvirtuales.bue.edu.ar/course/view.php?id=22553)
* The Net Ninja. (2022). MERN Stack Crash Course Tutorial [Lista de reproducción]. YouTube. Recuperado de [https://youtube.com/playlist?list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE&si=TEi7PZTW6xPRlSSk](https://youtube.com/playlist?list=PL4cUxeGkcC9iJ_KkrkBZWZRHVwnzLIoUE&si=TEi7PZTW6xPRlSSk)
* Martín Gesualdo. (2023). Emprendedor Full Stack | Aprende a desarrollar aplicaciones web [Lista de reproducción]. YouTube. Recuperado de [https://youtube.com/playlist?list=PLAmcNbGd0fkNl-CleT_XxwGKDk1j00uUp&si=U8oSAdMzI47pPvVo](https://youtube.com/playlist?list=PLAmcNbGd0fkNl-CleT_XxwGKDk1j00uUp&si=U8oSAdMzI47pPvVo)
* Leonardo Jose Castillo Lacruz – FreeCodeCamp Español. (05/11/2024). Curso API CRUD – Node.js, Express, MongoDB y Autenticación. YouTube. Recuperado de [https://www.youtube.com/watch?v=Oa5blAV7Fyg](https://www.youtube.com/watch?v=Oa5blAV7Fyg)
* Dave Gray. (2022). MERN Stack Tutorials [Lista de reproducción]. YouTube. Recuperado de [https://youtube.com/playlist?list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&si=YQyOf194iv0GNgUH](https://youtube.com/playlist?list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&si=YQyOf194iv0GNgUH)







