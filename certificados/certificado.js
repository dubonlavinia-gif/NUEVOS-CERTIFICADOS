// <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Su Certificado</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <main class="container">
        <h1 style="text-align:center;">Generando Certificado Digital...</h1>
        
        <div id="certificado-loader" style="text-align:center;">
            <p>Cargando diseño y datos...</p>
        </div>
        
        <div id="certificado-wrapper" style="display:none;">
            <div id="nombre-persona"></div>
            <div id="qr-code"></div>
        </div>
        
        <p style="text-align:center; margin-top:20px;"><a href="index.html">Generar otro Certificado</a></p>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
    <script src="supabaseClient.js"></script>
    <script src="certificado.js"></script>
</body>
</html>