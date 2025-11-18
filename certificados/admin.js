// C// Usar el cliente de Supabase centralizado
const supabase = window.supabaseClient;onfiguración de Supabase

    // Listener para vista previa de imagen cuando se selecciona un archivo
    const imagenFondoInput = document.getElementById('imagenFondo');
    imagenFondoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Crear URL local para vista previa
            const reader = new FileReader();
            reader.onload = (event) => {
                const previewImg = document.getElementById('previewImg');
                previewImg.src = event.target.result;
                previewImg.style.display = 'block';
            };
            document.getElementById('nombreX').value = 400;
            document.getElementById('nombreY').value = 300;
            document.getElementById('qrX').value = 600;
            document.getElementById('qrY').value = 500;
        }
    } catch (error) {
        console.error('Error al cargar configuración:', error);
        mostrarMensaje('Error al cargar la configuración', 'error');
    }
}

async function subirImagen() {
    const fileInput = document.getElementById('imagenFondo');
    const file = fileInput.files[0];

    if (!file) {
        mostrarMensaje('Por favor, seleccione una imagen', 'error');
        return;
    }

    try {
        // Generar nombre único para el archivo
        const fileName = `fondo_${Date.now()}_${file.name}`;

        // Subir imagen a Supabase Storage
        const { data, error } = await supabase.storage
            .from('certificados')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Eliminar imagen anterior si existe
        if (configActual && configActual.imagen_fondo_url) {
            await supabase.storage
                .from('certificados')
                .remove([configActual.imagen_fondo_url]);
        }

        // Actualizar configuración
        configActual = configActual || {};
        configActual.imagen_fondo_url = fileName;

        // Mostrar preview
        const url = URL.createObjectURL(file);
        document.getElementById('previewImg').src = url;
        document.getElementById('previewImg').style.display = 'block';

        mostrarMensaje('Imagen subida correctamente', 'exito');
    } catch (error) {
        console.error('Error al subir imagen:', error);
        mostrarMensaje('Error al subir la imagen', 'error');
    }
}

async function guardarConfiguracion() {
    const nombreX = parseInt(document.getElementById('nombreX').value) || 400;
    const nombreY = parseInt(document.getElementById('nombreY').value) || 300;
    const qrX = parseInt(document.getElementById('qrX').value) || 600;
    const qrY = parseInt(document.getElementById('qrY').value) || 500;

    try {
        const configData = {
            nombre_x: nombreX,
            nombre_y: nombreY,
            qr_x: qrX,
            qr_y: qrY,
            imagen_fondo_url: configActual?.imagen_fondo_url || null
        };

        // Verificar si ya existe una configuración
        const { data: existing } = await supabase
            .from('configuracion_certificado')
            .select('id')
            .single();

        let result;
        if (existing) {
            // Actualizar
            result = await supabase
                .from('configuracion_certificado')
                .update(configData)
                .eq('id', existing.id);
        } else {
            // Insertar
            result = await supabase
                .from('configuracion_certificado')
                .insert([configData]);
        }

        if (result.error) throw result.error;

        configActual = configData;
        mostrarMensaje('Configuración guardada correctamente', 'exito');
        await actualizarVistaPrevia();
    } catch (error) {
        console.error('Error al guardar configuración:', error);
        mostrarMensaje('Error al guardar la configuración', 'error');
    }
}

async function actualizarVistaPrevia() {
    const canvas = document.getElementById('previewCanvas');
    const ctx = canvas.getContext('2d');
    const nombrePrueba = document.getElementById('nombrePrueba').value || 'Juan Pérez';

    canvas.width = 800;
    canvas.height = 600;

    // Cargar imagen de fondo si existe
    if (configActual && configActual.imagen_fondo_url) {
        try {
            const { data: imagenData } = await supabase.storage
                .from('certificados')
                .download(configActual.imagen_fondo_url);

            if (imagenData) {
                const img = new Image();
                const url = URL.createObjectURL(imagenData);
                
                await new Promise((resolve, reject) => {
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        URL.revokeObjectURL(url);
                        resolve();
                    };
                    img.onerror = reject;
                    img.src = url;
                });
            }
        } catch (error) {
            console.error('Error al cargar imagen:', error);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 5;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    }

    // Dibujar nombre
    const nombreX = parseInt(document.getElementById('nombreX').value) || 400;
    const nombreY = parseInt(document.getElementById('nombreY').value) || 300;
    
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(nombrePrueba, nombreX, nombreY);

    // Generar QR de prueba
    const qrX = parseInt(document.getElementById('qrX').value) || 600;
    const qrY = parseInt(document.getElementById('qrY').value) || 500;
    const qrSize = 150;

    try {
        const qrDataURL = await QRCode.toDataURL('https://ejemplo.com/verificar?id=123', {
            width: qrSize,
            margin: 2
        });

        const qrImg = new Image();
        await new Promise((resolve, reject) => {
            qrImg.onload = () => {
                ctx.drawImage(
                    qrImg,
                    qrX - qrSize / 2,
                    qrY - qrSize / 2,
                    qrSize,
                    qrSize
                );
                resolve();
            };
            qrImg.onerror = reject;
            qrImg.src = qrDataURL;
        });
    } catch (error) {
        console.error('Error al generar QR:', error);
    }
}

function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensajeAdmin');
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
    mensaje.style.display = 'block';

    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 3000);
}

