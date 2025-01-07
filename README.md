# SASF Commons

Este repositorio centraliza recursos compartidos y reutilizables para proyectos desarrollados bajo el ecosistema de micro frontends. Aquí encontrarás componentes primitivos, configuraciones, hooks personalizados, y utilidades que facilitan el desarrollo y aseguran la consistencia entre los proyectos.

## 📂 Contenido

### 1. **Componentes Primitivos**
- **Elementos Base**: Componentes fundamentales como:
  - `Button`
  - `Input`
  - `Select`
  - `Checkbox`
  - `RadioButton`
  - Otros diseñados para ser simples, accesibles y altamente reutilizables.
- **Controlado con Storybook**: Todos los componentes primitivos cuentan con documentación y ejemplos interactivos en Storybook para facilitar su uso, personalización y garantizar consistencia visual.

### 2. **Componentes Reutilizables**
- **UI Más Compleja**: Componentes que combinan primitivos para casos de uso más avanzados:
  - **Modales**: Ventanas modales estándar y personalizables.
  - **Tablas**: Componentes dinámicos para manejar datos tabulares.
  - **Notificaciones**: Componentes para mostrar alertas y mensajes al usuario.

### 3. **Providers**
- **Gestión de Estado Global**: Providers para compartir datos o configuraciones globales entre micro frontends.
- **Autenticación y Autorización**: Configuración estándar para manejar usuarios, roles y accesos.
- **Temas y Configuración Visual**: Providers para alternar entre temas (noche y día) y controlar estilos de forma dinámica.

### 4. **Hooks Personalizados**
- **Manejo de Formularios**: Hooks para integrarse con librerías como `React Hook Form` o manejar validaciones personalizadas.
- **Peticiones HTTP**: Hooks como `useFetch` o `useAxios` para simplificar la interacción con APIs.
- **Estado Global**: Hooks para gestionar estados compartidos en micro frontends.
- **Temas Dinámicos**: Hooks para alternar entre modos (oscuro y claro) y manejar temas personalizados.

### 5. **Configuraciones Comunes**
- **Estilos y Temas**:
  - Paleta de colores centralizada para garantizar consistencia visual.
  - Configuración compartida para TailwindCSS, incluyendo temas oscuros y personalizados.
  - Variables CSS globales para temas y estilos reutilizables.
- **Linting y Formateo**: Configuraciones estándar de ESLint y Prettier para mantener la calidad y consistencia del código.
- **Configuraciones para Storybook**: Plantillas y configuraciones básicas para facilitar la integración de Storybook en proyectos.

### 6. **Formularios**
- **Primitivos**: Elementos esenciales como `Input`, `Checkbox`, y `Select`, diseñados para máxima flexibilidad.
- **Estilo Reutilizable**: Formularios diseñados para adaptarse a cualquier tema o esquema visual.

### 7. **Funciones Útiles**
- **Manejo de Fechas**: Funciones para formateo, cálculo y manipulación de fechas.
- **Utilidades de Strings**: Funciones para operaciones comunes con cadenas de texto (capitalización, truncado, etc.).
- **Validaciones Generales**: Validadores estándar como emails, números de teléfono, contraseñas, etc.
- **Conversión de Datos**: Funciones para transformar datos en formatos reutilizables.

---

## 🚀 Cómo Usarlo

### 1. **Clonar el repositorio como submódulo**
Si estás utilizando este repositorio en un proyecto, agrégalo como submódulo:

```bash
git submodule add <<URL>> src/sasf-commons/
