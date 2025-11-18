document.addEventListener('DOMContentLoaded', async () => {
    const infoDiv = document.getElementById('info-certificado');
    const supabase = window.supabaseClient;
    const urlParams = new URLSearchParams(window.location.search);
    const certificadoId = urlParams.get('id');

    try {
        if (!certificadoId) {
            infoDiv.innerHTML = `<p style="color: orange; font-weight: bold;">⚠️ URL incompleta. No se encontró ID.</p>`;
            return;
        }

        const { data, error } = await supabase
            .from('certificados')
            .select('nombre, identificacion, email, created_at')
            .eq('id', certificadoId)
            .single(); 

        if (error || !data) {
            throw new Error('Certificado no válido o no encontrado en el sistema.');
        }

        const fecha = new Date(data.created_at).toLocaleDateString();
        infoDiv.innerHTML = `
            <p style="color: green; font-weight: bold;">✓ CERTIFICADO VÁLIDO</p>
            <p><strong>Nombre:</strong> ${data.nombre}</p>
            <p><strong>Identificación:</strong> ${data.identificacion}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Fecha de Emisión:</strong> ${fecha}</p>
        `;

    } catch (error) {
        console.error(error.message);
        infoDiv.innerHTML = `<p style="color: red; font-weight: bold;">X ${error.message}</p>`;
    }
});