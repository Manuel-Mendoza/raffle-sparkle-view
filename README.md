# Raffle Sparkle View

## Descripción General

Raffle Sparkle View es una plataforma web moderna y completa diseñada para la gestión y participación en rifas de manera transparente y eficiente. La aplicación conecta organizadores y participantes en un ecosistema digital que facilita la compra de boletos, el seguimiento de rifas activas y la visualización de resultados.

## ¿Cómo usar la web?

### Para Participantes

#### 🎯 **Página Principal (Landing)**

- **Explorar Rifas Activas**: Al acceder al sitio, verás inmediatamente la rifa que está activa en ese momento
- **Información Detallada**: Cada rifa muestra:
  - Descripción del premio
  - Precio por boleto
  - Cantidad total de boletos disponibles
  - Boletos vendidos hasta el momento
  - Fecha de finalización
  - Imagen del premio

#### 🎫 **Proceso de Compra de Boletos**

1. **Selección de Boletos**: Elige la cantidad de boletos que deseas comprar
2. **Datos Personales**: Completa tu información (nombre, teléfono, email)
3. **Método de Pago**: Selecciona entre Pago Móvil y Transferencia Bancaria.
4. **Comprobante de Pago**: Sube una foto del comprobante de pago
5. **Confirmación**: Recibe tus números de boletos únicos

#### ✅ **Verificación de Boletos**

- **Verificar Participación**: Ingresa tu número de boleto para confirmar tu participación
- **Consulta de Estado**: Verifica si tu boleto está aprobado y activo
- **Información del Cliente**: Consulta los datos asociados a tu boleto

#### 🏆 **Consulta de Ganadores**

- **Resultados en Vivo**: Visualiza los ganadores una vez finalizada la rifa
- **Historial de Ganadores**: Consulta ganadores de rifas anteriores
- **Múltiples Posiciones**: Ver ganadores de 1er, 2do y 3er lugar (cuando aplique)

### Para Administradores

#### 🔐 **Acceso al Panel Administrativo**

- **Login Seguro**: Accede a través de `/login` con credenciales administrativas
- **Dashboard Completo**: Panel de control centralizado con todas las funciones

#### 📊 **Gestión de Rifas**

- **Crear Rifas**: Define nuevas rifas con:
  - Título y descripción
  - Premio y precio por boleto
  - Cantidad total de boletos
  - Fecha de finalización
  - Imagen del premio
- **Estado de Rifas**: Pausar, reactivar o finalizar rifas
- **Eliminar Rifas**: Borrar rifas cuando sea necesario

#### 👥 **Administración de Participantes**

- **Boletos Pendientes**: Revisar y aprobar compras pendientes de verificación
- **Boletos Aprobados**: Ver todos los boletos confirmados y activos
- **Gestión de Clientes**: Aprobar o rechazar participaciones según el comprobante de pago

#### 🎲 **Sistema de Sorteos**

- **Selección Manual de Ganadores**: Establecer ganadores específicos por posición
- **Sorteo Automático**: Seleccionar ganadores de forma aleatoria
- **Múltiples Posiciones**: Definir primer, segundo y tercer lugar
- **Publicación de Resultados**: Los ganadores se muestran automáticamente en la página principal

#### 📈 **Estadísticas y Reportes**

- **Métricas en Tiempo Real**:
  - Total de boletos vendidos
  - Ingresos generados
  - Participantes únicos
  - Tasa de conversión
- **Cliente Top**: Identificar al participante con más boletos comprados
- **Historial de Ventas**: Seguimiento detallado de todas las transacciones

## Características Técnicas Destacadas

### 🎨 **Interfaz de Usuario**

- **Diseño Responsive**: Optimizado para dispositivos móviles y desktop
- **Interfaz Moderna**: Construida con componentes shadcn/ui y Tailwind CSS
- **Experiencia Fluida**: Navegación intuitiva y carga rápida
- **Modo Oscuro/Claro**: Soporte para preferencias de tema del usuario

### ⚡ **Rendimiento**

- **Lazy Loading**: Carga diferida de componentes para mejor rendimiento
- **Optimización de Imágenes**: Componentes optimizados para carga eficiente
- **Code Splitting**: División del código para cargas más rápidas
- **PWA Ready**: Configurado como Progressive Web App

### 🔒 **Seguridad**

- **Autenticación Segura**: Sistema de login para administradores
- **Validación de Datos**: Validaciones tanto en frontend como backend
- **Subida Segura de Archivos**: Validación de tipos y tamaños de comprobantes
- **Manejo de Errores**: Sistema robusto de manejo de errores

### 📱 **Funcionalidades Avanzadas**

- **Notificaciones Toast**: Feedback inmediato para todas las acciones
- **Modales Interactivos**: Visualización de información detallada
- **Verificación en Tiempo Real**: Consulta instantánea del estado de boletos
- **Copiar al Portapapeles**: Facilita el copiado de datos bancarios
- **SEO Optimizado**: Metadatos y structured data para mejor indexación

## Tecnologías Utilizadas

### 🚀 **Frontend Framework & Build Tools**

- **React 18.3.1** - Biblioteca principal para la interfaz de usuario
- **TypeScript 5.8.3** - Tipado estático para mejor desarrollo
- **Vite 5.4.19** - Build tool y dev server ultrarrápido
- **React Router DOM 6.30.1** - Enrutamiento del lado del cliente

### 🎨 **UI/UX & Styling**

- **Tailwind CSS 3.4.17** - Framework de CSS utility-first
- **Tailwindcss Animate 1.0.7** - Animaciones predefinidas
- **shadcn/ui** - Biblioteca de componentes moderna
- **Radix UI** - Componentes primitivos accesibles:
  - Dialog, Toast, Select, Tabs, Progress, etc.
- **Lucide React 0.462.0** - Iconos SVG optimizados
- **next-themes 0.3.0** - Soporte para temas claro/oscuro

### 🔧 **State Management & Data Fetching**

- **React Query (@tanstack/react-query 5.83.0)** - Gestión de estado del servidor
- **React Hook Form 7.61.1** - Manejo eficiente de formularios
- **@hookform/resolvers 3.10.0** - Resolvers para validación
- **Zod 3.25.76** - Validación de esquemas TypeScript-first

### 🌐 **HTTP & API Integration**

- **Axios 1.11.0** - Cliente HTTP para comunicación con la API
- **API REST** - Integración con backend para todas las operaciones

### 📊 **Charts & Visualization**

- **Recharts 2.15.4** - Biblioteca de gráficos para React
- **QRCode React 4.2.0** - Generación de códigos QR

### 🔧 **Utilities & Helpers**

- **class-variance-authority 0.7.1** - Gestión de variantes de CSS
- **clsx 2.1.1** - Utilidad para construcción de clases CSS
- **tailwind-merge 2.6.0** - Fusión inteligente de clases Tailwind
- **date-fns 3.6.0** - Utilidades modernas para manejo de fechas
- **input-otp 1.4.2** - Componente para códigos OTP

### 🎪 **Enhanced Components**

- **embla-carousel-react 8.6.0** - Carrusel responsive y accesible
- **react-resizable-panels 2.1.9** - Paneles redimensionables
- **vaul 0.9.9** - Drawer/modal component
- **sonner 1.7.4** - Notificaciones toast elegantes

### 🔍 **Development & Quality Tools**

- **ESLint 9.32.0** - Linter para identificar problemas en el código
- **Prettier 3.6.2** - Formateador de código
- **TypeScript ESLint 8.38.0** - Rules de ESLint para TypeScript
- **@vitejs/plugin-react-swc 3.11.0** - Plugin de Vite con SWC para React

### 📱 **PWA & Performance**

- **Service Worker** - Caching y funcionalidad offline
- **Web Manifest** - Configuración de PWA
- **Optimized Images** - Componentes de imagen optimizados
- **Code Splitting** - División automática del bundle

### 🔐 **Security & Validation**

- **Zod Validation** - Validación robusta de datos
- **File Upload Validation** - Validación de tipos y tamaños de archivo
- **CORS Handling** - Configuración adecuada de CORS
- **Error Boundaries** - Manejo elegante de errores

---

**Raffle Sparkle View** representa una solución completa y moderna para la gestión de rifas digitales, combinando una interfaz elegante con funcionalidad robusta y tecnologías de vanguardia.
