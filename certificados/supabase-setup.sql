-- Script de configuración de Supabase para el Generador de Certificados

-- Tabla para almacenar los certificados
CREATE TABLE IF NOT EXISTS certificados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  identificacion TEXT NOT NULL,
  celular TEXT NOT NULL,
  email TEXT NOT NULL,
  fecha_emision TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para la configuración del certificado
CREATE TABLE IF NOT EXISTS configuracion_certificado (
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

-- Eliminar políticas existentes si existen (opcional, para evitar errores)
DROP POLICY IF EXISTS "Permitir lectura pública de certificados" ON certificados;
DROP POLICY IF EXISTS "Permitir inserción pública de certificados" ON certificados;
DROP POLICY IF EXISTS "Permitir lectura pública de configuración" ON configuracion_certificado;
DROP POLICY IF EXISTS "Permitir inserción pública de configuración" ON configuracion_certificado;
DROP POLICY IF EXISTS "Permitir actualización pública de configuración" ON configuracion_certificado;

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

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_certificados_id ON certificados(id);
CREATE INDEX IF NOT EXISTS idx_certificados_identificacion ON certificados(identificacion);
CREATE INDEX IF NOT EXISTS idx_certificados_email ON certificados(email);

