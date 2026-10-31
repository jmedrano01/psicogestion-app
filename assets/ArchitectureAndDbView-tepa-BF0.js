import{n as e,o as t,r as n,t as r}from"./jsx-runtime-DphrNBlM.js";import{n as i,t as a}from"./wrench-Dm06QUka.js";import{$ as o,Dt as s,S as c,rt as l,wt as u}from"./index-BEkW225v.js";var d=e(`git-fork`,[[`circle`,{cx:`12`,cy:`18`,r:`3`,key:`1mpf1b`}],[`circle`,{cx:`6`,cy:`6`,r:`3`,key:`1lh9wr`}],[`circle`,{cx:`18`,cy:`6`,r:`3`,key:`1h7g24`}],[`path`,{d:`M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9`,key:`1uq4wg`}],[`path`,{d:`M12 12v3`,key:`158kv8`}]]),f=e(`panels-top-left`,[[`rect`,{width:`18`,height:`18`,x:`3`,y:`3`,rx:`2`,key:`afitv7`}],[`path`,{d:`M3 9h18`,key:`1pudct`}],[`path`,{d:`M9 21V9`,key:`1oto5p`}]]),p=t(n(),1),m=r(),h=()=>{let{addToast:e,setActiveModule:t}=c(),[n,r]=(0,p.useState)(`db`),[h,g]=(0,p.useState)(`sql`),_=t=>{navigator.clipboard.writeText(t),e({type:`success`,title:`Copiado al portapapeles`})},v=`-- ==============================================================
-- PSICOGESTIÓN EDUCATIVA - ESQUEMA RELACIONAL (POSTGRESQL / CLOUD SQL)
-- Adaptado al sistema educativo y marco legal de la República Dominicana
-- Ley 172-13 (Protección de Datos) y Ley 136-03 (Código del Menor)
-- ==============================================================

-- 1. Centros y Distritos Educativos MINERD
CREATE TABLE centros_educativos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_minerd VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    distrito_educativo VARCHAR(10) NOT NULL, -- ej. '15-02'
    regional_educativa VARCHAR(10) NOT NULL, -- ej. '15'
    tipo_jornada VARCHAR(50) NOT NULL -- 'Jornada Extendida', 'Matutina', 'Vespertina'
);

-- 2. Expedientes Principales de Estudiantes
CREATE TABLE estudiantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rne VARCHAR(25) UNIQUE NOT NULL, -- Registro Nacional de Estudiante MINERD
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo VARCHAR(10) CHECK (sexo IN ('Femenino', 'Masculino')),
    grado_actual VARCHAR(50) NOT NULL,
    seccion VARCHAR(5) NOT NULL,
    centro_educativo_id UUID REFERENCES centros_educativos(id),
    condicion_psicopedagogica VARCHAR(100), -- 'Altas Capacidades', 'TDAH', 'Doble Excepcionalidad'
    estado_caso VARCHAR(50) DEFAULT 'Activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Contactos y Tutores Legales
CREATE TABLE tutores_estudiantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID REFERENCES estudiantes(id) ON DELETE CASCADE,
    nombre_completo VARCHAR(150) NOT NULL,
    parentesco VARCHAR(50) NOT NULL, -- 'Madre', 'Padre', 'Tutor Legal'
    telefono VARCHAR(20) NOT NULL,
    consentimiento_firmado BOOLEAN DEFAULT FALSE,
    fecha_consentimiento DATE
);

-- 4. Anamnesis y Antecedentes Clínicos (MMI)
CREATE TABLE anamnesis_clinica (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID UNIQUE REFERENCES estudiantes(id) ON DELETE CASCADE,
    motivo_consulta TEXT NOT NULL,
    derivado_por VARCHAR(150),
    antecedentes_perinatales TEXT,
    antecedentes_medicos TEXT,
    dinamica_familiar TEXT,
    historia_escolar TEXT,
    desarrollo_evolutivo TEXT,
    fortalezas JSONB, -- Array de fortalezas
    barreras_aprendizaje JSONB, -- BAP identificadas
    estilo_aprendizaje VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Sesiones Clínicas Individuales / Familiares
CREATE TABLE sesiones_clinicas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID REFERENCES estudiantes(id) ON DELETE CASCADE,
    numero_sesion INT NOT NULL,
    fecha DATE NOT NULL,
    modalidad VARCHAR(30) CHECK (modalidad IN ('Individual', 'Grupal', 'Familiar')),
    objetivo_sesion TEXT NOT NULL,
    tecnicas_aplicadas TEXT[],
    observaciones_conductuales TEXT,
    avances_registrados TEXT,
    compromisos_proxima_sesion TEXT,
    psicologa_responsable VARCHAR(150) NOT NULL
);

-- 6. Repositorio Multimedia y Consentimientos Informados
CREATE TABLE multimedia_expediente (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID REFERENCES estudiantes(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    tipo VARCHAR(30) CHECK (tipo IN ('pdf', 'foto', 'audio', 'consentimiento')),
    archivo_url TEXT NOT NULL, -- Cloud Storage URL encriptado
    tamano_kb INT,
    nombre_archivo VARCHAR(255),
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Grabaciones de Audio y Transcripciones Inteligentes
CREATE TABLE notas_audio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID REFERENCES estudiantes(id) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    duracion_segundos INT NOT NULL,
    archivo_audio_url TEXT,
    transcripcion_texto TEXT,
    sintesis_clinica_ia TEXT,
    tipo_grabacion VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Planificaciones Oficiales MINERD
CREATE TABLE planificaciones_minerd (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo_plan VARCHAR(255) NOT NULL,
    periodo VARCHAR(20) CHECK (periodo IN ('Anual', 'Mensual', 'Semanal')),
    mes_o_semana VARCHAR(50) NOT NULL,
    nivel_educativo VARCHAR(50) NOT NULL,
    centro_educativo_id UUID REFERENCES centros_educativos(id),
    linea_actuacion_minerd VARCHAR(150) NOT NULL,
    competencias_fundamentales JSONB,
    ejes_transversales JSONB,
    justificacion_tecnica TEXT,
    competencias_especificas JSONB,
    estado_auditoria VARCHAR(50) DEFAULT 'Validado',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Actividades Operativas del Plan
CREATE TABLE actividades_plan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES planificaciones_minerd(id) ON DELETE CASCADE,
    fecha_semana VARCHAR(50) NOT NULL,
    actividad VARCHAR(255) NOT NULL,
    descripcion_paso_a_paso TEXT NOT NULL,
    linea_de_actuacion VARCHAR(150),
    destinatarios VARCHAR(100),
    recursos TEXT,
    indicadores_de_logro TEXT,
    instrumento_evaluacion VARCHAR(150),
    estado VARCHAR(30) DEFAULT 'Planificada'
);

-- 10. Sugerencias Clínicas con IA (APA, AERA, MINERD)
CREATE TABLE informes_clinicos_ia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id UUID REFERENCES estudiantes(id) ON DELETE CASCADE,
    enfoque_evaluado VARCHAR(100) NOT NULL,
    hipotesis_explicativa TEXT NOT NULL,
    intervenciones_apa JSONB NOT NULL,
    adaptaciones_minerd JSONB NOT NULL,
    recomendaciones_familia JSONB NOT NULL,
    referencias_cientificas JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices de Rendimiento
CREATE INDEX idx_estudiantes_rne ON estudiantes(rne);
CREATE INDEX idx_estudiantes_centro ON estudiantes(centro_educativo_id);
CREATE INDEX idx_sesiones_estudiante ON sesiones_clinicas(estudiante_id);
CREATE INDEX idx_plan_periodo ON planificaciones_minerd(periodo);`,y=`// ==============================================================
// PSICOGESTIÓN EDUCATIVA - ESQUEMA NOSQL (FIRESTORE)
// Colecciones documentales optimizadas para acceso offline y baja latencia
// ==============================================================

// Colección: centros_educativos
{
  "_id": "centro-1502-01",
  "codigoMINERD": "01048",
  "nombre": "Politécnico Matías Ramón Mella",
  "distrito": "15-02",
  "regional": "15",
  "tanda": "Jornada Escolar Extendida (JEE)"
}

// Colección: estudiantes/{estudianteId}
{
  "_id": "est-001",
  "rne": "ALC-0105-2016-F",
  "nombres": "Sofía",
  "apellidos": "Alcántara Peña",
  "fechaNacimiento": "2016-04-12",
  "edad": 10,
  "sexo": "Femenino",
  "grado": "5to Grado Primaria",
  "seccion": "B",
  "centroEducativo": "Escuela Primaria República de Colombia",
  "distrito": "15-02",
  "condicionOEnfoque": "Altas Capacidades (AACC) & Doble Excepcionalidad",
  "contactoPrincipal": {
    "nombreTutor": "Rosa Peña",
    "parentesco": "Madre",
    "telefono": "809-555-0143",
    "consentimientoFirmado": true
  },
  "anamnesis": {
    "motivoConsulta": "Aburrimiento crónico en clase y perfeccionismo...",
    "derivadoPor": "Lic. Carmen Gómez (Docente Titular)",
    "antecedentesMedicos": "Hitos precoces, sin patología",
    "antecedentesFamiliares": "Familia nuclear colaboradora",
    "fortalezas": ["Memoria operativa rápida", "Curiosidad científica"],
    "barrerasBAP": ["Enseñanza homogénea", "Baja tolerancia frustración"]
  },
  // Subcolección: estudiantes/{estudianteId}/sesiones
  "sesionesCount": 2,
  // Subcolección: estudiantes/{estudianteId}/multimedia
  "multimediaCount": 3,
  // Subcolección: estudiantes/{estudianteId}/audios
  "audiosCount": 1,
  "updatedAt": "2026-10-24T14:30:00Z"
}

// Colección: planificaciones_minerd/{planId}
{
  "_id": "plan-nov-2026",
  "tituloPlan": "Planificación Mensual: Convivencia y Diversidad",
  "periodo": "Mensual",
  "mesOPeriodo": "Noviembre 2026",
  "nivel": "Nivel Secundario",
  "lineaPrincipal": "2. Apoyo Psicoafectivo y Convivencia Escolar Armoniosa",
  "competenciasFundamentales": [
    "Ética y Ciudadana",
    "Pensamiento Lógico, Creativo y Crítico"
  ],
  "ejesTransversales": ["Cultura de Paz", "Ciudadanía Digital"],
  "actividades": [
    {
      "fechaSemana": "Semana 1: 3 al 7 Nov",
      "actividad": "Cine-Foro: Huellas Digitales",
      "recursos": "Proyector, guía de debate",
      "indicadoresDeLogro": "Decálogo de ciberconvivencia redactado",
      "estado": "Planificada"
    }
  ]
}`;return(0,m.jsxs)(`div`,{className:`space-y-6`,children:[(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h1`,{className:`font-display font-bold text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100`,children:`Arquitectura de referencia & Modelo de Datos propuesto`}),(0,m.jsx)(`p`,{className:`text-xs text-neutral-500 mt-0.5`,children:`Diseño técnico de referencia para una futura versión institucional. No describe la base de datos que esta instalación usa hoy.`})]}),(0,m.jsxs)(`div`,{className:`flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200`,children:[(0,m.jsx)(o,{className:`w-5 h-5 shrink-0 mt-0.5`}),(0,m.jsxs)(`div`,{className:`space-y-1.5`,children:[(0,m.jsx)(`p`,{className:`font-semibold`,children:`Vista de referencia, no el estado real del sistema`}),(0,m.jsxs)(`p`,{className:`leading-relaxed`,children:[`La aplicación instalada guarda los expedientes en una base `,(0,m.jsx)(`strong`,{children:`SQLite local y cifrada`}),` (AES-256-GCM), sin servidor ni PostgreSQL. El esquema y los diagramas de esta pantalla son una propuesta de arquitectura para una eventual edición institucional con base centralizada; no se ejecutan en este equipo.`]}),(0,m.jsxs)(`button`,{type:`button`,onClick:()=>t(`diagnostics`),className:`inline-flex items-center gap-1.5 rounded-lg border border-amber-400 px-3 py-1.5 text-xs font-semibold hover:bg-amber-100 dark:border-amber-800 dark:hover:bg-amber-900/40`,children:[(0,m.jsx)(a,{className:`w-3.5 h-3.5`}),`Ver diagnóstico real de esta instalación`]})]})]}),(0,m.jsxs)(`div`,{className:`flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-800 overflow-x-auto`,children:[(0,m.jsxs)(`button`,{onClick:()=>r(`db`),className:`py-2.5 px-3.5 text-xs font-medium whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${n===`db`?`text-teal-700 dark:text-teal-400 font-semibold`:`text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white`}`,children:[(0,m.jsx)(i,{className:`w-3.5 h-3.5`}),(0,m.jsx)(`span`,{children:`1. Esquema propuesto (referencia)`}),n===`db`&&(0,m.jsx)(`span`,{className:`absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400`})]}),(0,m.jsxs)(`button`,{onClick:()=>r(`flows`),className:`py-2.5 px-3.5 text-xs font-medium whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${n===`flows`?`text-teal-700 dark:text-teal-400 font-semibold`:`text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white`}`,children:[(0,m.jsx)(d,{className:`w-3.5 h-3.5`}),(0,m.jsx)(`span`,{children:`2. Flujos de Pantallas Principales`}),n===`flows`&&(0,m.jsx)(`span`,{className:`absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400`})]}),(0,m.jsxs)(`button`,{onClick:()=>r(`ux-components`),className:`py-2.5 px-3.5 text-xs font-medium whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${n===`ux-components`?`text-teal-700 dark:text-teal-400 font-semibold`:`text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white`}`,children:[(0,m.jsx)(f,{className:`w-3.5 h-3.5`}),(0,m.jsx)(`span`,{children:`3. Componentes UX/UI Anti-Fricción`}),n===`ux-components`&&(0,m.jsx)(`span`,{className:`absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400`})]}),(0,m.jsxs)(`button`,{onClick:()=>r(`legal`),className:`py-2.5 px-3.5 text-xs font-medium whitespace-nowrap transition-colors relative flex items-center gap-1.5 ${n===`legal`?`text-teal-700 dark:text-teal-400 font-semibold`:`text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white`}`,children:[(0,m.jsx)(l,{className:`w-3.5 h-3.5`}),(0,m.jsx)(`span`,{children:`4. Privacidad & Ley 172-13 / 136-03 RD`}),n===`legal`&&(0,m.jsx)(`span`,{className:`absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400`})]})]}),n===`db`&&(0,m.jsx)(`div`,{className:`space-y-4`,children:(0,m.jsxs)(`div`,{className:`bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4`,children:[(0,m.jsxs)(`div`,{className:`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`,children:[(0,m.jsxs)(`div`,{children:[(0,m.jsx)(`h3`,{className:`font-display font-semibold text-sm text-neutral-900 dark:text-neutral-100`,children:`Esquema de Datos Profesional (Relacional & NoSQL)`}),(0,m.jsx)(`p`,{className:`text-xs text-neutral-500`,children:`Diseñado para alta concurrencia escolar, integridad referencial y auditorías del MINERD`})]}),(0,m.jsxs)(`div`,{className:`flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg`,children:[(0,m.jsx)(`button`,{onClick:()=>g(`sql`),className:`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${h===`sql`?`bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs`:`text-neutral-600 dark:text-neutral-400`}`,children:`PostgreSQL / Cloud SQL DDL`}),(0,m.jsx)(`button`,{onClick:()=>g(`nosql`),className:`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${h===`nosql`?`bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs`:`text-neutral-600 dark:text-neutral-400`}`,children:`Firestore / NoSQL Schema`})]})]}),(0,m.jsxs)(`div`,{className:`relative rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950 text-neutral-200 font-mono text-xs p-4 max-h-[500px] overflow-y-auto`,children:[(0,m.jsxs)(`button`,{onClick:()=>_(h===`sql`?v:y),className:`absolute top-3 right-3 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs flex items-center gap-1 transition-colors`,children:[(0,m.jsx)(u,{className:`w-3.5 h-3.5`}),(0,m.jsx)(`span`,{children:`Copiar`})]}),(0,m.jsx)(`pre`,{className:`whitespace-pre leading-relaxed`,children:h===`sql`?v:y})]})]})}),n===`flows`&&(0,m.jsx)(`div`,{className:`space-y-4`,children:(0,m.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 gap-4`,children:[(0,m.jsxs)(`div`,{className:`bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3`,children:[(0,m.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,m.jsx)(`span`,{className:`w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center`,children:`1`}),(0,m.jsx)(`h4`,{className:`font-display font-semibold text-sm text-neutral-900 dark:text-neutral-100`,children:`Flujo de Apertura & Evaluación MMI`})]}),(0,m.jsx)(`p`,{className:`text-xs text-neutral-500`,children:`Desde la derivación docente hasta la caracterización psicopedagógica completa:`}),(0,m.jsxs)(`ol`,{className:`space-y-2 text-xs text-neutral-700 dark:text-neutral-300`,children:[(0,m.jsxs)(`li`,{className:`p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`span`,{className:`font-semibold text-teal-700 dark:text-teal-400`,children:`Paso 1:`}),` Ingreso del RNE y datos demográficos MINERD con autocompletado de centro y tanda.`]}),(0,m.jsxs)(`li`,{className:`p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`span`,{className:`font-semibold text-teal-700 dark:text-teal-400`,children:`Paso 2:`}),` Registro ágil de Anamnesis: motivo de consulta, antecedentes médicos y mapeo de fortalezas vs. BAP.`]}),(0,m.jsxs)(`li`,{className:`p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`span`,{className:`font-semibold text-teal-700 dark:text-teal-400`,children:`Paso 3:`}),` Carga de consentimiento informado firmado por tutores legales en el repositorio multimedia.`]})]})]}),(0,m.jsxs)(`div`,{className:`bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3`,children:[(0,m.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,m.jsx)(`span`,{className:`w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center`,children:`2`}),(0,m.jsx)(`h4`,{className:`font-display font-semibold text-sm text-neutral-900 dark:text-neutral-100`,children:`Flujo de Sesión Clínica & Grabación de Audio`})]}),(0,m.jsx)(`p`,{className:`text-xs text-neutral-500`,children:`Eliminación de la fricción de teclear durante la consulta infantil:`}),(0,m.jsxs)(`ol`,{className:`space-y-2 text-xs text-neutral-700 dark:text-neutral-300`,children:[(0,m.jsxs)(`li`,{className:`p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`span`,{className:`font-semibold text-teal-700 dark:text-teal-400`,children:`Paso 1:`}),` Activación de la grabadora en vivo con 1 clic en el botón grande ergonómico de micrófono.`]}),(0,m.jsxs)(`li`,{className:`p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`span`,{className:`font-semibold text-teal-700 dark:text-teal-400`,children:`Paso 2:`}),` Procesamiento de transcripción y extracción semántica mediante Gemini API.`]}),(0,m.jsxs)(`li`,{className:`p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`span`,{className:`font-semibold text-teal-700 dark:text-teal-400`,children:`Paso 3:`}),` Vinculación directa al expediente del estudiante sin descargas ni conversiones manuales.`]})]})]}),(0,m.jsxs)(`div`,{className:`bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3`,children:[(0,m.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,m.jsx)(`span`,{className:`w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center`,children:`3`}),(0,m.jsx)(`h4`,{className:`font-display font-semibold text-sm text-neutral-900 dark:text-neutral-100`,children:`Flujo de Planificación Inteligente MINERD`})]}),(0,m.jsx)(`p`,{className:`text-xs text-neutral-500`,children:`Generación curricular y auditoría distrital:`}),(0,m.jsxs)(`ol`,{className:`space-y-2 text-xs text-neutral-700 dark:text-neutral-300`,children:[(0,m.jsxs)(`li`,{className:`p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`span`,{className:`font-semibold text-teal-700 dark:text-teal-400`,children:`Paso 1:`}),` Selección de temporalidad (Anual/Mensual/Semanal) y una de las 4 Líneas de Orientación.`]}),(0,m.jsxs)(`li`,{className:`p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`span`,{className:`font-semibold text-teal-700 dark:text-teal-400`,children:`Paso 2:`}),` Generación con IA estructurada en tabla matricial con inicio, desarrollo y cierre.`]}),(0,m.jsxs)(`li`,{className:`p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`span`,{className:`font-semibold text-teal-700 dark:text-teal-400`,children:`Paso 3:`}),` Edición celda por celda en vivo con guardado continuo y exportación a informe oficial para técnicos distritales.`]})]})]}),(0,m.jsxs)(`div`,{className:`bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3`,children:[(0,m.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,m.jsx)(`span`,{className:`w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-bold text-xs flex items-center justify-center`,children:`4`}),(0,m.jsx)(`h4`,{className:`font-display font-semibold text-sm text-neutral-900 dark:text-neutral-100`,children:`Flujo de Sugerencias Clínicas APA / MINERD`})]}),(0,m.jsx)(`p`,{className:`text-xs text-neutral-500`,children:`Traducción de datos de evaluación en intervención práctica:`}),(0,m.jsxs)(`ol`,{className:`space-y-2 text-xs text-neutral-700 dark:text-neutral-300`,children:[(0,m.jsxs)(`li`,{className:`p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`span`,{className:`font-semibold text-teal-700 dark:text-teal-400`,children:`Paso 1:`}),` Consolidación automática de todos los registros multimétodo del caso.`]}),(0,m.jsxs)(`li`,{className:`p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`span`,{className:`font-semibold text-teal-700 dark:text-teal-400`,children:`Paso 2:`}),` Análisis contra bases de datos de APA, AERA, NAGC y lineamientos de Educación Especial MINERD.`]}),(0,m.jsxs)(`li`,{className:`p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`span`,{className:`font-semibold text-teal-700 dark:text-teal-400`,children:`Paso 3:`}),` Emisión de ajustes razonables en aula y pautas familiares, guardados en el historial del expediente.`]})]})]})]})}),n===`ux-components`&&(0,m.jsx)(`div`,{className:`space-y-4`,children:(0,m.jsxs)(`div`,{className:`bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4`,children:[(0,m.jsx)(`h3`,{className:`font-display font-semibold text-sm text-neutral-900 dark:text-neutral-100`,children:`Pilares de Diseño Ergonómico para la Psicóloga Escolar`}),(0,m.jsx)(`p`,{className:`text-xs text-neutral-500`,children:`En los centros educativos dominicanos, las profesionales de orientación enfrentan un promedio de 300 a 500 estudiantes asignados. El diseño debe minimizar drásticamente el cansancio cognitivo y la sobrecarga administrativa:`}),(0,m.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-3 gap-4 text-xs`,children:[(0,m.jsxs)(`div`,{className:`p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-2`,children:[(0,m.jsxs)(`h4`,{className:`font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5`,children:[(0,m.jsx)(s,{className:`w-4 h-4 text-teal-600`}),(0,m.jsx)(`span`,{children:`Áreas Táctiles Mínimas (≥44px)`})]}),(0,m.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400 leading-relaxed`,children:`Todos los botones principales y controles móviles cumplen con la norma ergonómica de 44px de altura mínima, facilitando su pulsación veloz entre reuniones con padres o docentes.`})]}),(0,m.jsxs)(`div`,{className:`p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-2`,children:[(0,m.jsxs)(`h4`,{className:`font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5`,children:[(0,m.jsx)(s,{className:`w-4 h-4 text-teal-600`}),(0,m.jsx)(`span`,{children:`Tipografía Limpia Sin Pills Candy`})]}),(0,m.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400 leading-relaxed`,children:`Se eliminaron las cajas de píldoras saturadas que saturan visualmente los informes. Los metadatos (RNE, grado, sección) se muestran con separadores sutiles (·), optimizando la lectura rápida de expedientes.`})]}),(0,m.jsxs)(`div`,{className:`p-4 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-2`,children:[(0,m.jsxs)(`h4`,{className:`font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5`,children:[(0,m.jsx)(s,{className:`w-4 h-4 text-teal-600`}),(0,m.jsx)(`span`,{children:`Autoguardado Silencioso`})]}),(0,m.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400 leading-relaxed`,children:`Cada edición en las planificaciones y expedientes se persiste en tiempo real, evitando pérdidas de información por cortes imprevistos de energía o conectividad en el centro educativo.`})]})]})]})}),n===`legal`&&(0,m.jsx)(`div`,{className:`space-y-4`,children:(0,m.jsxs)(`div`,{className:`bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-4 text-xs`,children:[(0,m.jsxs)(`h3`,{className:`font-display font-semibold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2`,children:[(0,m.jsx)(l,{className:`w-5 h-5 text-teal-600`}),(0,m.jsx)(`span`,{children:`Cumplimiento Normativo y Protección de Datos en República Dominicana`})]}),(0,m.jsxs)(`div`,{className:`space-y-3 leading-relaxed text-neutral-700 dark:text-neutral-300`,children:[(0,m.jsxs)(`div`,{className:`p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`h4`,{className:`font-semibold text-neutral-900 dark:text-neutral-100 mb-1`,children:`1. Ley No. 172-13 sobre Protección Integral de los Datos Personales (RD)`}),(0,m.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400`,children:`Los registros de salud mental y psicopedagógicos constituyen datos de carácter sensible. La aplicación exige consentimiento expreso, encripta las comunicaciones en tránsito (TLS 1.3) y reposo (AES-256), y garantiza el derecho de acceso y rectificación de los tutores legales.`})]}),(0,m.jsxs)(`div`,{className:`p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`h4`,{className:`font-semibold text-neutral-900 dark:text-neutral-100 mb-1`,children:`2. Ley No. 136-03 (Código para el Sistema de Protección y los Derechos Fundamentales de Niños, Niñas y Adolescentes)`}),(0,m.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400`,children:`Artículo 18 y 26 sobre derecho a la intimidad y confidencialidad de los expedientes escolares. El repositorio multimedia incorpora una categoría específica para auditar el consentimiento informado previo a cualquier grabación de voz o evaluación psicométrica.`})]}),(0,m.jsxs)(`div`,{className:`p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800`,children:[(0,m.jsx)(`h4`,{className:`font-semibold text-neutral-900 dark:text-neutral-100 mb-1`,children:`3. Código de Ética y Disciplina del Colegio Dominicano de Psicólogos (CODOPSI)`}),(0,m.jsx)(`p`,{className:`text-neutral-600 dark:text-neutral-400`,children:`Apego estricto al secreto profesional. Ningún dato de identificación del estudiante es transmitido a modelos de inteligencia artificial externos sin ofuscación de identidad previa.`})]})]})]})})]})};export{h as ArchitectureAndDbView};