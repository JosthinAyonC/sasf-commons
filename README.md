# SASF Commons

## Secciones
- [Descripción General](#descripción-general)
- [Estructura del Submódulo](#estructura-del-submódulo)
- [Dependencias Necesarias](#dependencias-necesarias)
- [Uso de Componentes](#uso-de-componentes)
- [Uso de Hooks](#uso-de-hooks)
- [Manejo de Formularios](#manejo-de-formularios)

---

## Descripción General
Este submódulo contiene recursos compartidos entre los distintos micro frontends de la aplicación. Está diseñado para centralizar componentes, configuraciones, hooks, y demás elementos reutilizables, garantizando consistencia en el desarrollo de toda la aplicación.

**Importante:** Los recursos incluidos en este submódulo son generales para la aplicación completa. Es importante no realizar modificaciones a menos que sea absolutamente necesario. Para crear nuevos elementos, es completamente válido agregar nuevas funcionalidades. Si necesitas modificar algo existente, por favor contacta con:

- **Nombre:** Josthin Ayon  
- **Correo:** [josthin.ayon@sasf.net](mailto:josthin.ayon@sasf.net)

---

## Estructura del Submódulo
El submódulo está organizado de la siguiente manera:

```plaintext
sasf-commons/
├── components/        # Componentes reutilizables de forma global para la aplicación
├── guard/             # Componentes que manejan la autorización de páginas
├── provider/          # Contextos globales de la aplicación
├── store/             # Almacén global con Redux
└── utils/             # Pantallas útiles y funciones reutilizables
```

### Descripción de Carpetas

#### **1. components/**
Contiene componentes reutilizables que pueden ser usados de manera global en la aplicación. Estos componentes están diseñados para ser altamente configurables y flexibles.

#### **2. config/**
Incluye archivos de configuración que son necesarios para el funcionamiento global de la aplicación. Por ejemplo, configuraciones de temas, error handling.

#### **3. form/**
Componentes diseñados para formularios. Utiliza **React Hook Form** y está personalizado con estilos globales definidos a través de variables de entorno. Estos componentes permiten la creación de formularios consistentes en toda la aplicación.

#### **4. guard/**
Proporciona componentes que manejan la autorización y protección de páginas. Estos garantizan que los usuarios tengan los permisos necesarios antes de acceder a ciertas áreas de la aplicación.

#### **5. hooks/**
Incluye hooks reutilizables que facilitan el desarrollo y aseguran que las funcionalidades compartidas se implementen de manera uniforme.

#### **6. provider/**
Contextos globales de la aplicación que encapsulan funcionalidades y permiten la propagación de datos entre diferentes partes de la aplicación.

#### **7. store/**
El almacén global de la aplicación basado en **Redux**, centralizando el estado global y sus acciones.

#### **8. utils/**
Incluye pantallas útiles, funciones de utilidad y módulos `.ts` que contienen lógica reutilizable para diferentes propósitos dentro de la aplicación.

---

## Dependencias Necesarias
Este submódulo requiere las siguientes dependencias para funcionar correctamente. Asegúrate de instalarlas antes de usar el submódulo en tu proyecto.
Ejecuta el siguiente comando para instalar las dependencias necesarias:
### Dependencias de Producción
```bash
npm install react react-dom react-hook-form @emotion/is-prop-valid framer-motion @fortawesome/react-fontawesome react-redux tailwindcss react-router-dom @fortawesome/free-solid-svg-icons react-datepicker jwt-decode @tanstack/react-table react-icons uuid react-easy-crop eventemitter3 react-input-color

*Nota:* debemos instalar una librería de esta forma: 
```bash
npm install react-dropzone@14.2.3 --save--exact 
```
```
### Dependencias de Desarrollo
Si necesitas trabajar en el submódulo, instala las dependencias de desarrollo con:
```bash
npm install --save-dev @types/react @types/react-dom @types/react-redux @types/react-router-dom typescript eslint eslint-plugin-react eslint-plugin-react-hooks prettier tailwindcss autoprefixer
```
*Nota importante:* Si implementas nuevos componentes que instalen dependencias nuevas, modifica este readme.

---
## Uso de Componentes

### **ModalProvider**
**Tipo de Componente:** Provider

**Descripción:** Este componente envuelve una pantalla que utiliza el hook `useDialog` para manejar modales basados en parámetros de consulta (query params). Permite levantar modales e incluso manejar modales anidados.

**Ejemplo de uso:**
```tsx
import { ModalProvider } from '~/providers/ModalProvider';

<ModalProvider keyId="modalKey" content={YourModalComponent}>
  <YourPageComponent />
</ModalProvider>
```

---

### **ThemeProvider**
**Tipo de Componente:** Provider

**Descripción:** Este componente permite alternar entre los temas de la aplicación (modo claro y modo oscuro). Funciona con la configuración de Tailwind y utiliza variables de entorno para distinguir entre ambos modos. El tema seleccionado se guarda en `localStorage` y se aplica automáticamente al cargar la página.

**Ejemplo de uso:**
```tsx
import { ThemeProvider } from '~/providers/ThemeProvider';

<ThemeProvider>
  <YourAppComponent />
</ThemeProvider>
```

**Nota:** Utiliza el hook `useTheme` para acceder al tema actual y la función de alternancia:
```tsx
import { useTheme } from '~/components/ThemeProvider';

const { theme, toggleTheme } = useTheme();
```

### **Dialog**
**Tipo de Componente:** UI / Modal

**Descripción:** Este componente se utiliza para crear diálogos modales que son altamente configurables y responsivos. Funciona en conjunto con `ModalProvider` y aprovecha el contexto global para manejar su orden de superposición (zIndex) y su estado de cierre.

**Props Principales:**
- `children`: Contenido del diálogo.
- `keyId`: Identificador único del diálogo.
- `closeable`: Define si el diálogo puede cerrarse.
- `onCloseAction`: Función opcional que se ejecuta al cerrar el diálogo.
- `closeIconClassName`: Clase CSS para personalizar el icono de cierre.
- `contentClassName`: Clase CSS para personalizar el contenido del diálogo.

**Ejemplo de uso:**
```tsx
import { Dialog } from '~/components/Dialog';

<Dialog keyId="exampleDialog" closeable={true} title="Ejemplo de Diálogo">
  <p>Este es el contenido del diálogo.</p>
</Dialog>
```

---

### **Tooltip**
**Tipo de Componente:** UI / Tooltip

**Descripción:** Este componente se utiliza para mostrar información adicional cuando el usuario interactúa con un elemento. Es altamente configurable y soporta diferentes posiciones y variantes de estilo.

**Props Principales:**
- `message`: Mensaje que se muestra en el tooltip.
- `className`: Clases CSS opcionales para personalizar el estilo.
- `variant`: Define el estilo del tooltip (`danger`, `warning`, `info`, `success`).
- `position`: Posición del tooltip (`top`, `bottom`, `left`, `right`).
- `showIndicator`: Muestra un indicador (flecha) que apunta al elemento relacionado.

**Ejemplo de uso:**
```tsx
import Tooltip from '~/components/Tooltip';

<Tooltip message="Texto del tooltip" position="top" variant="info" />
```

---

### **PrivateRoute**
**Tipo de Componente:** Guard

**Descripción:** Este componente asegura que solo los usuarios autenticados y con el rol adecuado puedan acceder a ciertas rutas. Si no se cumplen los requisitos, redirige a páginas de inicio de sesión o no autorizado.

**Props Principales:**
- `children`: Elementos renderizados si el acceso es válido.
- `requiredRole`: Rol necesario para acceder a la ruta (`ADMIN`, `USER`, `MAINTAINER`).

**Ejemplo de uso:**
```tsx
import PrivateRoute from '~/components/PrivateRoute';

<PrivateRoute requiredRole="ADMIN">
  <AdminDashboard />
</PrivateRoute>
```

## Documentación para los componentes `QueryTable` y `Table`
### Componente QueryTable

#### Descripción General
El componente `QueryTable` es una tabla reutilizable con paginación, filtrado y capacidad de obtención de datos desde el servidor. Integra `@tanstack/react-table` y admite Redux para manejar tokens de autenticación. Además, se ha integrado un sistema de **refetch** basado en `EventEmitter` para actualizar la tabla automáticamente tras ciertas mutaciones.

#### Props

| Propiedad          | Tipo                                  | Valor por Defecto | Descripción                                                                                 |
|--------------------|---------------------------------------|-------------------|---------------------------------------------------------------------------------------------|
| `columns`          | `ColumnDef<T>[]`                     | **Requerido**     | Define la estructura y configuración de las columnas de la tabla.                           |
| `fetchUrl`         | `string`                             | **Requerido**     | La URL para obtener los datos de la tabla.                                                  |
| `queryParams`      | `Record<string, string | number | boolean>` | `{}`               | Parámetros adicionales de consulta a incluir en la petición.                                |
| `filterKey`        | `string`                             | `'filter'`        | Clave del parámetro de consulta para el filtrado global.                                    |
| `pageKey`          | `string`                             | `'page'`          | Clave del parámetro de consulta para la paginación.                                         |
| `sizeKey`          | `string`                             | `'size'`          | Clave del parámetro de consulta para el tamaño de página.                                   |
| `responseDataKey`  | `string`                             | `'content'`       | Clave en la respuesta del servidor que contiene los datos de la tabla.                      |
| `debounceDelay`    | `number`                             | `300`             | Tiempo en milisegundos para aplicar un retraso controlado al filtro global.                 |
| `showOptions`      | `boolean`                            | `true`            | Define si se deben mostrar los controles de paginación.                                     |
| `searchable`       | `boolean`                            | `true`            | Define si se habilita el campo de búsqueda global.                                          |
| `onSelectAction`   | `(row: T) => void`                   | `undefined`       | Función opcional que se ejecuta al seleccionar una fila, pasando los datos de la fila.      |

#### Integración con `EventEmitter` para Refetch Automático
El `QueryTable` está suscrito a un `EventEmitter` que permite refrescar los datos automáticamente cuando un componente externo emite un evento `refreshTable`.

##### Configuración del `EventEmitter`
Crea un archivo llamado `eventEmitter.ts` y define el `EventEmitter` global:
```tsx
import { EventEmitter } from 'events';
export const tableEventEmitter = new EventEmitter();
```

##### Uso en `QueryTable`
Dentro del `QueryTable`, se suscribe al evento `refreshTable` y dispara un `fetchData()` cuando se recibe:
```tsx
import { tableEventEmitter } from '~/config/eventEmitter';

useEffect(() => {
  const listener = () => fetchData();
  tableEventEmitter.on('refreshTable', listener);
  
  return () => {
    tableEventEmitter.off('refreshTable', listener);
  };
}, [fetchData]);
```

##### Emisión del evento tras una mutación
Dentro de un componente como `ParametrosGeneralesForm`, después de una mutación exitosa, emite el evento para actualizar la tabla:
```tsx
import { tableEventEmitter } from '~/utils/eventEmitter';

const onSubmit = async (formData: AgeParametrosGenerales) => {
  try {
    await mutate({ ...formattedData, usuarioModificacion: currentCodUser });
    addToast('Parámetro general editado satisfactoriamente.', 'success');
    
    tableEventEmitter.emit('refreshTable'); // Notifica a QueryTable que recargue los datos
  } catch (error) {
    const err = error as ApiError;
    addToast(err.message, 'danger');
  }
};
```

#### Ejemplo de Uso
```tsx
<QueryTable
  columns={columns}
  fetchUrl="http://api.example.com/data"
  queryParams={{ status: 'active' }}
  onSelectAction={(row) => console.log('Fila seleccionada:', row)}
/>
```

#### Beneficios de esta Implementación
- **Actualización automática de la tabla** cuando ocurre una mutación (`PUT`, `POST`, `DELETE`).
- **Manejo centralizado del estado** sin necesidad de prop drilling.
- **Mayor modularidad**, permitiendo reutilizar `QueryTable` en distintos contextos.
---
### Componente Table

#### Descripción General
El componente `Table` es una tabla simple para manejar datos en el cliente. Utiliza `@tanstack/react-table` para la renderización y admite paginación y filtrado global.

#### Props
| Propiedad  | Tipo              | Descripción                                                 |
|------------|-------------------|-------------------------------------------------------------|
| `data`     | `T[]`             | Datos que se mostrarán en la tabla.                         |
| `columns`  | `ColumnDef<T>[]`  | Define la estructura y configuración de las columnas.       |

#### Ejemplo de Uso
```tsx
<Table
  data={[
    { id: 1, name: 'Juan', age: 25 },
    { id: 2, name: 'María', age: 30 },
  ]}
  columns={[
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Nombre',
      accessorKey: 'name',
    },
    {
      header: 'Edad',
      accessorKey: 'age',
    },
  ]}
/>
```

### Funcionalidades
- **Campo de búsqueda global:** Permite buscar datos en todas las columnas.
- **Paginación:** Controla la cantidad de datos mostrados por página.

### Controles de Paginación
- Navegación entre páginas: Botones para ir a la primera, anterior, siguiente y última página.
- Selección de tamaño de página: Dropdown para definir cuántas filas mostrar por página.

---

Ambos componentes aseguran flexibilidad y consistencia al manejar tablas en React.


---

## Uso de Hooks

### **useDebounce**
**Descripción:** Este hook permite aplicar un retraso controlado (debounce) a un valor. Es útil para optimizar tareas como búsquedas o eventos que se disparan continuamente.

**Ejemplo de uso:**
```typescript
import useDebounce from '~/hooks/useDebounce';

const debouncedValue = useDebounce(inputValue, 500);
```

---

### **useMediaQuery**
**Descripción:** Este hook verifica si una consulta de medios CSS (`media query`) se cumple, devolviendo un valor booleano.

**Ejemplo de uso:**
```typescript
import { useMediaQuery } from '~/hooks/useMediaQuery';

const isMobile = useMediaQuery('(max-width: 768px)');
```

---

### **useMutation**
**Descripción:** Este hook se utiliza para realizar peticiones HTTP tipo `POST`, `PUT` o `PATCH` con integración de Redux para autenticación.

**Ejemplo de uso:**
```typescript
import useMutation from '~/hooks/useMutation';

const { mutate, data, loading, error } = useMutation('/api/resource', 'POST');

mutate({ key: 'value' });
```

---

### **useQuery**
**Descripción:** Este hook realiza peticiones HTTP tipo `GET` con soporte para parámetros de consulta y autenticación mediante Redux.

**Ejemplo de uso:**
```typescript
import { useQuery } from '~/hooks';

const { data, loading, error, refetch } = useQuery('/api/resource', {}, { param: 'value' });
```

---

### **useDialog**
**Descripción:** Este hook se utiliza para manejar diálogos en la aplicación mediante parámetros de consulta en la URL. Permite abrir, cerrar y obtener el orden de los diálogos.

**Ejemplo de uso:**
```typescript
import { useDialog } from '~/hooks/useDialog';

const { openDialog, closeDialog, getDialogOrder } = useDialog();

openDialog('dialogKey', 'dialogValue');
closeDialog('dialogKey');
const order = getDialogOrder('dialogKey');
```
### **useToast**

**Descripción**  
El hook `useToast` permite mostrar notificaciones (toasts) personalizables con variantes (`success`, `warning`, `info`, `danger`) y un tiempo de duración opcional.  
Es ideal para proporcionar retroalimentación visual al usuario, como mensajes de éxito, advertencias, errores o información.

**Parámetros**

1. **message** (`string`): El mensaje que se mostrará en el toast.
2. **variant** (`"success" | "warning" | "info" | "danger"`): La variante del toast, que define el estilo y el ícono mostrado.
3. **timeout** *(opcional)* (`number`): Tiempo en milisegundos que el toast estará visible. Por defecto, es `5000` ms.

**Ejemplo de uso**
```typescript
import { useToast } from '~/provider/ToastContext';

const MyComponent = () => {
  const { addToast } = useToast();

  const showSuccessToast = () => {
    addToast("Operación completada con éxito", "success");
  };

  const showErrorToast = () => {
    addToast("Ocurrió un error inesperado", "danger", 7000);
  };

  return (
    <div>
      <button onClick={showSuccessToast}>Mostrar Éxito</button>
      <button onClick={showErrorToast}>Mostrar Error</button>
    </div>
  );
};

export default MyComponent;
```
**Notas**
- El hook debe ser utilizado dentro del componente `<ToastProvider>`.
- Los toasts desaparecen automáticamente después del tiempo definido por `timeout`, pero también pueden ser eliminados manualmente.

## Manejo de Formularios

### **Form**
**Tipo de Componente:** Provider / Form Wrapper

**Descripción:** Este componente actúa como un envoltorio (`wrapper`) para formularios basados en `React Hook Form`. Proporciona una configuración centralizada y un manejo uniforme del estado del formulario.

**Props Principales:**
- `onSubmit`: Función que se ejecuta al enviar el formulario.
- `className`: Clase CSS opcional para el formulario.
- `children`: Campos y elementos del formulario.
- `methods`: Configuración del formulario, valores iniciales, tipos de eventos.

**Ejemplo de uso:**
```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, FormState } from '~/form/fields';
import { Form } from '~/form/Form';

export const FormUse = () => {
  const methods = useForm<FormState>({
    mode: 'onChange',
    defaultValues: { name: 'Valor por defecto' },
  });

  const onSubmit = (data: FormState) => {
    console.log(data);
  };

  return (
    <Form<FormState> onSubmit={onSubmit} methods={methods} className="space-y-4">
      <TextField name="name" label="Name" isRequired placeholder="Enter your name" />
      <button type="submit">Submit</button>
    </Form>
  );
};

```

### **Campos Primitivos en Formularios**
**Componente:** TextField

**Descripción:** Los componentes en `form/fields` son campos reutilizables diseñados para integrarse con `React Hook Form` y el componente `Form`. Incluyen validaciones comunes como campos obligatorios, longitudes máximas/mínimas, y patrones personalizados.

### **TextField**
**Descripción:** Campo de texto genérico para entradas como nombres, correos electrónicos o contraseñas. Admite validaciones específicas como correos electrónicos y contraseñas seguras.

**Props Principales:**
- `label`: Etiqueta del campo.
- `name`: Nombre del campo.
- `isRequired`: Define si el campo es obligatorio.
- `minLength`: Longitud mínima permitida.
- `maxLength`: Longitud máxima permitida.
- `validateEmail`: Valida si el texto ingresado es un correo electrónico.
- `validatePassword`: Valida si el texto cumple con un formato de contraseña segura.

**Ejemplo de uso:**
```tsx
import { TextField } from '~/form/fields';

<TextField
  name="email"
  label="Correo Electrónico"
  isRequired
  validateEmail
  placeholder="Ingrese su correo electrónico"
/>
```

---

### **TextAreaField**
**Descripción:** Campo de texto para entradas más largas, como descripciones o comentarios.

**Props Principales:**
- `label`: Etiqueta del campo.
- `name`: Nombre del campo.
- `isRequired`: Define si el campo es obligatorio.
- `placeholder`: Texto de marcador de posición.

**Ejemplo de uso:**
```tsx
import { TextAreaField } from '~/form/fields';

<TextAreaField
  name="description"
  label="Descripción"
  isRequired
  placeholder="Escriba aquí su descripción"
/>
```

---

### **SelectField**
**Descripción:** Campo desplegable para seleccionar una opción de una lista.

**Props Principales:**
- `label`: Etiqueta del campo.
- `name`: Nombre del campo.
- `options`: Lista de opciones con `label` y `value`.

**Ejemplo de uso:**
```tsx
import { SelectField } from '~/form/fields';

const options = [
  { label: 'Opción 1', value: '1' },
  { label: 'Opción 2', value: '2' },
];

<SelectField
  name="selection"
  label="Seleccione una opción"
  options={options}
/>
```

---

### **RadioGroupField**
**Descripción:** Grupo de botones de opción para seleccionar una sola opción.

**Props Principales:**
- `name`: Nombre del grupo de botones.
- `options`: Lista de opciones con `label` y `value`.
- `required`: Define si es obligatorio seleccionar una opción.

**Ejemplo de uso:**
```tsx
import { RadioGroupField } from '~/form/fields';

const options = [
  { label: 'Masculino', value: 'male' },
  { label: 'Femenino', value: 'female' },
];

<RadioGroupField
  name="gender"
  options={options}
  required
/>
```

---

### **NumberField**
**Descripción:** Campo para la entrada de números con validaciones personalizadas.

**Props Principales:**
- `label`: Etiqueta del campo.
- `name`: Nombre del campo.
- `min`: Valor mínimo permitido.
- `max`: Valor máximo permitido.
- `isRequired`: Define si el campo es obligatorio.

**Ejemplo de uso:**
```tsx
import { NumberField } from '~/form/fields';

<NumberField
  name="age"
  label="Edad"
  isRequired
  min={18}
  max={99}
  placeholder="Ingrese su edad"
/>
```

---

### **CheckboxField**
**Descripción:** Campo para opciones que pueden ser seleccionadas o deseleccionadas.

**Props Principales:**
- `label`: Etiqueta del checkbox.
- `name`: Nombre del campo.
- `defaultChecked`: Define si el checkbox está seleccionado por defecto.

**Ejemplo de uso:**
```tsx
import { CheckboxField } from '~/form/fields';

<CheckboxField
  name="terms"
  label="Acepto los términos y condiciones"
  defaultChecked
/>
```

---

### **Button**
**Descripción:** Botón reutilizable para formularios o acciones generales.

**Props Principales:**
- `type`: Define el tipo del botón (`button`, `submit`, `reset`).
- `variant`: Variante visual del botón (`outline`, `primary`, etc.).

**Ejemplo de uso:**
```tsx
import { Button } from '~/form/fields';

<Button type="submit" variant="primary">
  Enviar
</Button>
```

---
### **DatePickerField**
**Descripción:** Componente personalizado para fechas. El value que atrapa es en formato TimeStamp.

**Props más relevantes:**
- `label`: Label que acompaña el field.
- `name`: Nombre del campo.
- `minDate`: Fecha mínima para seleccionar.
- `maxDate`: Fecha máxima para seleccionar.
- `defaultValue`: Fecha por defecto a mostrarse.
- `yearUpRange`: Rango de años a mostrarse hacía arriba, por ejemplo, si hoy es 2025, y se pone de rango 50, mostrará opciones hasta 2075.
- `yearDownRange`: Rango de años a mostrarse hacía abajo, por ejemplo, si hoy es 2025, y se pone de rango 50, mostrará opciones hasta 1975.

**Ejemplo de uso:**
```tsx
import { DatePickerField } from '~/form/fields';

<DatePickerField
  name="date"
  defaultValue={new Date()}
  maxDate={new Date()} 
  minDate={new Date("2024-11-14")}
  yearDownRange={10}
  yearUpRange={10}
/>
```

---

Estos componentes aseguran una experiencia de usuario consistente y facilitan la implementación de formularios accesibles y responsivos.


---
