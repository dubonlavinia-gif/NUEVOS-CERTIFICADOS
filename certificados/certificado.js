// Usar el cliente de Supabase centralizado
const supabase = window.supabaseClient;

// Obtener ID del certificado desde la URL
const urlParams = new URLSearchParams(window.location.search);
const certificadoId = urlParams.get('id');

let configCertificado = null;
let datosPersona = null;

document.addEventListener('DOMContentLoaded', async () => {
    if (!certificadoId) {
        alert('ID de certificado no válido');
        window.location.href = 'index.html';
        return;
    }

    try {
        // Obtener datos de la persona
        const { data: personaData, error: personaError } = await supabase
            .from('certificados')
            .select('*')
            .eq('id', certificadoId)
            .single();

        if (personaError) throw personaError;
        datosPersona = personaData;

        // Obtener configuración del certificado
        const { data: configData, error: configError } = await supabase
            .from('configuracion_certificado')
            .select('*')
            .single();

        if (configError && configError.code !== 'PGRST116') {
            // PGRST116 significa que no hay registros, usamos valores por defecto
            console.warn('No se encontró configuración, usando valores por defecto');
            configCertificado = {
                imagen_fondo_url: null,
                nombre_x: 400,
                nombre_y: 300,
                qr_x: 600,
                qr_y: 500
            };
        } else {
            configCertificado = configData || {
                imagen_fondo_url: null,
                nombre_x: 400,
                nombre_y: 300,
                qr_x: 600,
                qr_y: 500
            };
        }

        // Generar certificado
        await generarCertificado();

        // Event listeners para botones
        document.getElementById('descargarBtn').addEventListener('click', descargarCertificado);
        document.getElementById('imprimirBtn').addEventListener('click', imprimirCertificado);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el certificado');
        window.location.href = 'index.html';
    }
});

async function generarCertificado() {
    const canvas = document.getElementById('certificadoCanvas');
    const ctx = canvas.getContext('2d');
    
    // Dimensiones del certificado
    canvas.width = 800;
    canvas.height = 600;

    // Cargar imagen de fondo si existe
    if (configCertificado.imagen_fondo_url) {
        try {
            const { data: imagenData } = await supabase.storage
                .from('certificados')
                .download(configCertificado.imagen_fondo_url);

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
            console.error('Error al cargar imagen de fondo:', error);
            // Continuar sin imagen de fondo
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    } else {
        // Fondo blanco por defecto
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Borde decorativo
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 5;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    }

    // Dibujar nombre
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
        datosPersona.nombre,
        configCertificado.nombre_x || 400,
        configCertificado.nombre_y || 300
    );

    // Generar código QR
    const urlVerificacion = `${window.location.origin}/verificar.html?id=${certificadoId}`;
    const qrSize = 150;
    
    try {
        const qrDataURL = await QRCode.toDataURL(urlVerificacion, {
            width: qrSize,
            margin: 2
        });

        const qrImg = new Image();
        await new Promise((resolve, reject) => {
            qrImg.onload = () => {
                ctx.drawImage(
                    qrImg,
                    (configCertificado.qr_x || 600) - qrSize / 2,
                    (configCertificado.qr_y || 500) - qrSize / 2,
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

function descargarCertificado() {
    const canvas = document.getElementById('certificadoCanvas');
    const link = document.createElement('a');
    link.download = `certificado_${datosPersona.nombre.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function imprimirCertificado() {
    window.print();
}

