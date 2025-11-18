/document.addEventListener('DOMContentLoaded', () => {
    const guardarBtn = document.getElementById('guardarConfigBtn');
    const imagenInput = document.getElementById('imagenFondo');
    const mensajeDiv = document.getElementById('mensaje');
    const supabase = window.supabaseClient;

    const mostrarMensaje = (texto, tipo) => {
        if (!mensajeDiv) return;
        mensajeDiv.textContent = texto;
        mensajeDiv.className = `mensaje ${tipo}`;
        mensajeDiv.style.display = 'block';
    };

    guardarBtn.addEventListener('click', async () => {
        guardarBtn.disabled = true;
        guardarBtn.textContent = 'Guardando...';
        mostrarMensaje('Procesando...', 'success');

        try {
            const file = imagenInput.files[0];
            let imageUrl = null;
            const filePath = `public/fondo-certificado.png`; 

            // 1. Subir la imagen (si se seleccionó una nueva)
            if (file) {
                const { error: uploadError } = await supabase.storage
                    .from('plantillas') 
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (uploadError) {
                    throw new Error(`Error al subir imagen: ${uploadError.message}`);
                }

                // Obtener la URL pública
                const { data: urlData } = supabase.storage
                    .from('plantillas')
                    .getPublicUrl(filePath);
                
                imageUrl = urlData.publicUrl;
            }

            // 2. Obtener valores de posición
            const configData = {
                id: 1, // Usar un ID fijo (1) para tener una única fila de config
                nombre_x: document.getElementById('nombre_x').value,
                nombre_y: document.getElementById('nombre_y').value,
                qr_x: document.getElementById('qr_x').value,
                qr_y: document.getElementById('qr_y').value,
            };

            // Si subimos o ya tenemos URL, la incluimos
            if (imageUrl) {
                configData.imagen_url = imageUrl;
            }

            // 3. Guardar configuración en la tabla 'configuracion'
            const { error: dbError } = await supabase
                .from('configuracion')
                .upsert(configData);

            if (dbError) {
                throw new Error(`Error al guardar configuración en DB: ${dbError.message}`);
            }
            
            mostrarMensaje('¡Configuración guardada con éxito!', 'success');

        } catch (error) {
            console.error(error.message);
            mostrarMensaje(`ERROR: ${error.message}`, 'error');
        } finally {
            guardarBtn.disabled = false;
            guardarBtn.textContent = 'Guardar Configuración';
        }
    });
});