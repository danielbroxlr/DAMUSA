# DAMUSA - Sistema de Gestión de Información de Laboratorio (LIMS)

![DAMUSA Logo](docs/logo.png)

## 📋 Descripción

**DAMUSA** es un Sistema de Gestión de Información de Laboratorio (LIMS) especializado para laboratorios de química orgánica e inorgánica. Proporciona una solución integral para la trazabilidad de muestras, gestión de moléculas, cuaderno electrónico de laboratorio (ELN), y análisis de KPIs.

## ✨ Características Principales

### 🔬 Gestión de Muestras
- Cadena de custodia completa
- Transferencias inter-laboratorio con firmas digitales
- Códigos QR/barcodes automáticos
- Geolocalización en tiempo real
- Historial inmutable (audit trail)

### 📓 Cuaderno Electrónico (ELN)
- Editor químico integrado (estructuras moleculares)
- Templates personalizables
- Registro completo de experimentos
- Cálculos automáticos (rendimientos, diluciones)
- Firmas digitales certificadas

### 🧪 Registro de Moléculas (RegMol)
- Base de datos estructural (MOL, SDF, SMILES, InChI)
- Búsqueda por subestructura y similaridad
- Propiedades calculadas (LogP, pKa, Lipinski)
- Biblioteca de espectros de referencia
- Información de seguridad GHS

### 📊 Analytics y KPIs
- Dashboards personalizables por rol
- Métricas de productividad
- Análisis de rendimiento
- Reportes automatizados

### 👥 Sistema de Roles
- **Administrador**: Control total del sistema
- **Jefe de Laboratorio/PI**: Supervisión y aprobación
- **Químico Senior**: Investigación y registro
- **Químico Junior**: Operaciones básicas
- **Analista**: Servicios instrumentales
- **QA**: Auditoría y compliance
- **Viewer**: Solo lectura

## 🚀 Instalación

### Prerrequisitos
- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL >= 14 (para producción)

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/DAMUSA.git
cd DAMUSA

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar en modo desarrollo
npm run dev
```

### Docker

```bash
# Construir imagen
docker build -t damusa:latest .

# Ejecutar contenedor
docker run -p 3000:3000 damusa:latest
```

## 📁 Estructura del Proyecto

```
DAMUSA/
├── src/
│   ├── components/     # Componentes React reutilizables
│   ├── pages/          # Páginas/módulos principales
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utilidades y helpers
│   ├── styles/         # Estilos globales
│   └── data/           # Mock data y constantes
├── public/             # Assets estáticos
├── docs/               # Documentación
├── tests/              # Tests unitarios e integración
└── docker/             # Configuración Docker
```

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Frontend | React 18, TailwindCSS |
| Gráficos | Chart.js, D3.js |
| Química | RDKit.js, Ketcher |
| Backend | Node.js, Express (API) |
| Base de Datos | PostgreSQL + RDKit |
| Búsqueda | Elasticsearch |
| Auth | JWT, OAuth 2.0 |
| Deploy | Docker, Kubernetes |

## 📖 Documentación

- [Guía de Usuario](docs/USER_GUIDE.md)
- [Manual de Administrador](docs/ADMIN_GUIDE.md)
- [API Reference](docs/API.md)
- [Guía de Contribución](CONTRIBUTING.md)

## 🔒 Seguridad y Compliance

- ✅ 21 CFR Part 11 compliant
- ✅ Audit trail completo
- ✅ Encriptación AES-256
- ✅ Autenticación 2FA
- ✅ Firmas electrónicas certificadas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, lee [CONTRIBUTING.md](CONTRIBUTING.md) antes de enviar un PR.

## 📞 Soporte

- 📧 Email: soporte@damusa.io
- 📚 Docs: https://docs.damusa.io
- 🐛 Issues: https://github.com/tu-usuario/DAMUSA/issues

---

Desarrollado con ❤️ para la comunidad científica
