document.addEventListener('DOMContentLoaded', async () => {
    const loader = document.getElementById('certificado-loader');
    const wrapper = document.getElementById('certificado-wrapper');
    const nombreEl = document.getElementById('nombre-persona');
    const qrEl = document.getElementById('qr-code');

    const supabase = window.supabaseClient;

    const mostrarError = (mensaje) => {
        if (loader) loader.innerHTML = `<h2 class="mensaje error">${mensaje}</h2>`;
    };

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const certificadoId = urlParams.get('id');

        if (!certificadoId) {
            throw new Error('No se encontró ID de certificado en la URL.');
        }

        // Buscar los datos del certificado y la configuración (en paralelo)
        const [certRes, configRes] = await Promise.all([
            supabase.from('certificados').select('nombre').eq('id', certificadoId).single(),
            supabase.from('configuracion').select('*').eq('id', 1).single()
        ]);

        const { data: certData, error: certError } = certRes;
        const { data: configData, error: configError } = configRes;

        if (certError) throw new Error('Certificado no encontrado en la base de datos.');
        if (configError) throw new Error('Error al cargar la configuración de diseño. Ve al panel Admin y guarda la configuración.');

        // Aplicar el diseño y los datos
        wrapper.style.backgroundImage = `url(${configData.imagen_url})`;
        
        // Aplicar nombre + posición
        nombreEl.textContent = certData.nombre;
        nombreEl.style.position = 'absolute';
        nombreEl.style.left = `${configData.nombre_x}px`;
        nombreEl.style.top = `${configData.nombre_y}px`;

        // Generar el Código QR
        const verificationUrl = `${window.location.origin}/NUEVOS-CERTIFICADOS/certificados/verificar.html?id=${certificadoId}`;
        
        new QRCode(qrEl, {
            text: verificationUrl,
            width: 100, 
            height: 100
        });

        // Aplicar posición del QR
        qrEl.style.position = 'absolute';
        qrEl.style.left = `${configData.qr_x}px`;
        qrEl.style.top = `${configData.qr_y}px`;

        // Mostrar el certificado
        if (loader) loader.style.display = 'none';
        wrapper.style.display = 'block';

    } catch (error) {
        console.error(error.message);
        mostrarError(`Error al cargar certificado: ${error.message}`);
    }
});
          