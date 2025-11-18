# Generador de Certificados

Aplicación web para generar certificados con códigos QR de verificación, construida con HTML, CSS y JavaScript, utilizando Supabase como backend.

## Características

- ✅ Formulario para ingresar datos de personas
- ✅ Almacenamiento en base de datos Supabase
- ✅ Generación de certificados con código QR único
- ✅ Página de verificación de certificados
- ✅ Panel de administración para personalizar el diseño del certificado
- ✅ Subida de imágenes de fondo a Supabase Storage
- ✅ Configuración de posiciones para nombre y QR

## Configuración Inicial

### 1. Configurar Supabase

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ejecuta el siguiente SQL en el SQL Editor de Supabase:

```sql
-- Tabla para almacenar los certificados
CREATE TABLE certificados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  identificacion TEXT NOT NULL,
  celular TEXT NOT NULL,
  email TEXT NOT NULL,
  fecha_emision TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para la configuración del certificado
CREATE TABLE configuracion_certificado (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imagen_fondo_url TEXT,
  nombre_x INTEGER DEFAULT 400,
  nombre_y INTEGER DEFAULT 300,
  qr_x INTEGER DEFAULT 600,
  qr_y INTEGER DEFAULT 500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_certificado ENABLE ROW LEVEL SECURITY;

-- Políticas para certificados (permitir lectura y escritura pública)
CREATE POLICY "Permitir lectura pública de certificados" ON certificados
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserción pública de certificados" ON certificados
  FOR INSERT WITH CHECK (true);

-- Políticas para configuración (permitir lectura y escritura pública)
CREATE POLICY "Permitir lectura pública de configuración" ON configuracion_certificado
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserción pública de configuración" ON configuracion_certificado
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de configuración" ON configuracion_certificado
  FOR UPDATE USING (true);
```

4. Crea un bucket de Storage llamado `certificados`:
   - Ve a Storage en el panel de Supabase
   - Crea un nuevo bucket llamado `certificados`
   - Configura las políticas para permitir lectura y escritura pública (o según tus necesidades de seguridad)

### 2. Configurar las Credenciales

Abre el archivo `supabaseClient.js` y reemplaza las credenciales de Supabase:

`try {
        // Insertar datos en Supabase
        const { data, error } = await supabase
            .from('certificados')
            .insert([
                { 
                    nombre: nombre, 
                    identificacion: identificacion, 
                    celular: celular, 
                    email: email 
                }
            ])
            .select(); // <-- ¡IMPORTANTE! Agrega .select() para recuperar el ID

        if (error) {
            throw error; // Lanza el error si algo salió mal
        }

        // --- ¡AQUÍ ESTÁ LA MAGIA! ---
        // Si todo salió bien, toma el ID del nuevo registro
        const nuevoId = data[0].id;
        
        // Y redirige a la página del certificado, pasando el ID en la URL
        window.location.href = `certificado.html?id=${nuevoId}`;
        // ------------------------------

    } catch (error) {
        console.error('Error al guardar en Supabase:', error.message);
        mostrarMensaje('Error al guardar los datos. Intente de nuevo.', 'error');
    }
const SUPABASE_URL = 'TU_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY';
```

Con tus credenciales reales que puedes encontrar en:
- Supabase Dashboard → Settings → API

**Nota:** Este archivo centraliza la configuración de Supabase para toda la aplicación, por lo que solo necesitas actualizar las credenciales en un solo lugar.

### 3. Despliegue en Railway

1. Instala Railway CLI:
```bash
npm i -g @railway/cli
```

2. Inicia sesión en Railway:
```bash
railway login
```

3. Crea un nuevo proyecto:
```bash
railway init
```

4. Crea un archivo `railway.json` en la raíz del proyecto (ya incluido)

5. Despliega:
```bash
railway up
```

O puedes conectar tu repositorio de GitHub directamente desde el dashboard de Railway.

## Estructura del Proyecto

```
certificados/
├── index.html          # Formulario principal
├── certificado.html    # Página del certificado generado
├── verificar.html       # Página de verificación
├── admin.html          # Panel de administración
├── style.css           # Estilos CSS
├── supabaseClient.js   # Configuración centralizada de Supabase
├── app.js              # Lógica del formulario
├── certificado.js      # Lógica de generación de certificado
├── verificar.js        # Lógica de verificación
├── admin.js            # Lógica del panel de administración
├── railway.json        # Configuración de Railway
├── supabase-setup.sql  # Script SQL para configurar la base de datos
└── README.md           # Este archivo
```

## Uso

1. **Generar Certificado:**
   - Completa el formulario en `index.html`
   - Los datos se guardan en Supabase
   - Se genera automáticamente el certificado con QR

2. **Verificar Certificado:**
   - Escanea el código QR del certificado
   - O visita `/verificar.html?id=ID_DEL_CERTIFICADO`
   - Se mostrarán los datos del certificado si es válido

3. **Personalizar Certificado:**
   - Accede a `/admin.html`
   - Sube una imagen de fondo
   - Configura las posiciones X, Y del nombre y del QR
   - Guarda la configuración

## Notas Importantes

- Asegúrate de configurar correctamente las políticas de seguridad en Supabase según tus necesidades
- Las imágenes de fondo se almacenan en Supabase Storage
- Los certificados se generan como imágenes PNG descargables
- El código QR apunta a la URL de verificación con el ID del certificado

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- Supabase (Backend y Storage)
- QRCode.js (Generación de códigos QR)
- Railway (Hosting)

