sa// Usar el cliente de Supabase centralizado
const supabase = window.supabaseClient;

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('certificadoForm');
    const mensaje = document.getElementById('mensaje');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Ocultar mensajes anteriores
        mensaje.style.display = 'none';
        mensaje.className = 'mensaje';

        // Obtener datos del formulario
        const nombre = document.getElementById('nombre').value.trim();
        const identificacion = document.getElementById('identificacion').value.trim();
        const celular = document.getElementById('celular').value.trim();
        const email = document.getElementById('email').value.trim();

        // Validar que todos los campos estén llenos
        if (!nombre || !identificacion || !celular || !email) {
            mostrarMensaje('Por favor, complete todos los campos.', 'error');
            return;
        }

        try {
            // Insertar datos en Supabase
            const { data, error } = await supabase
                .from('certificados')
                .insert([
                    {
                        nombre: nombre,
                        identificacion: identificacion,
                        celular: celular,
                        email: email,
                        fecha_emision: new Date().toISOString()
                    }
                ])
                .select();

            if (error) {
                throw error;
            }

            if (data && data.length > 0) {
                const certificadoId = data[0].id;
                
                // Redirigir a la página del certificado con el ID
                window.location.href = `certificado.html?id=${certificadoId}`;
            } else {
                throw new Error('No se pudo crear el certificado');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al generar el certificado. Por favor, intente nuevamente.', 'error');
        }
    });

    function mostrarMensaje(texto, tipo) {
        mensaje.textContent = texto;
        mensaje.className = `mensaje ${tipo}`;
        mensaje.style.display = 'block';
    }
});

