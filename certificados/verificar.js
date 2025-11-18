// Usar el cliente de Supabase centralizado
const supabase = window.supabaseClient;

// Obtener ID del certificado desde la URL
const urlParams = new URLSearchParams(window.location.search);
const certificadoId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', async () => {
    const cargando = document.getElementById('cargando');
    const valido = document.getElementById('valido');
    const invalido = document.getElementById('invalido');

    if (!certificadoId) {
        cargando.style.display = 'none';
        invalido.style.display = 'block';
        return;
    }

    try {
        // Buscar el certificado en la base de datos
        const { data, error } = await supabase
            .from('certificados')
            .select('*')
            .eq('id', certificadoId)
            .single();

        cargando.style.display = 'none';

        if (error || !data) {
            invalido.style.display = 'block';
            return;
        }

        // Mostrar datos del certificado válido
        document.getElementById('nombreVerificado').textContent = data.nombre;
        document.getElementById('identificacionVerificada').textContent = data.identificacion;
        document.getElementById('celularVerificado').textContent = data.celular;
        document.getElementById('emailVerificado').textContent = data.email;
        
        const fecha = new Date(data.fecha_emision);
        document.getElementById('fechaEmision').textContent = fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        valido.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        cargando.style.display = 'none';
        invalido.style.display = 'block';
    }
});

