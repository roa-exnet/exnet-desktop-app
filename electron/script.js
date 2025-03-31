function cargarURLGuardada() {
    const savedURL = localStorage.getItem('savedURL');
    if (savedURL) {
        document.getElementById('urlInput').value = savedURL;
    }
    
    mostrarHistorial();
}

function mostrarHistorial() {
    const historialContainer = document.getElementById('historyContainer');
    const historial = JSON.parse(localStorage.getItem('urlHistory') || '[]');
    
    if (historial.length > 0) {
        let historialHTML = '<h3>Conexiones recientes</h3>';
        
        historial.slice(0, 5).forEach(url => {
            historialHTML += `
                <div class="history-item" onclick="cargarURL('${url}')">
                    <span class="history-item-icon">&#8227;</span>
                    ${url}
                </div>
            `;
        });
        
        historialContainer.innerHTML = historialHTML;
    }
}

function cargarURL(url) {
    document.getElementById('urlInput').value = url;
}

function verificarURL() {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) return;
    
    const fullURL = url.startsWith('http') ? url : 'https://' + url;
    
    const loadingScreen = document.getElementById('loadingScreen');
    const statusText = document.getElementById('statusText');
    loadingScreen.classList.add('active');
    
    statusText.textContent = "Verificando disponibilidad...";
    
    setTimeout(() => {
        statusText.textContent = "Servidor encontrado, estableciendo conexión...";
        
        setTimeout(() => {
            localStorage.setItem('savedURL', fullURL);
            
            const historial = JSON.parse(localStorage.getItem('urlHistory') || '[]');
            if (!historial.includes(fullURL)) {
                historial.unshift(fullURL);
                if (historial.length > 10) {
                    historial.pop();
                }
                localStorage.setItem('urlHistory', JSON.stringify(historial));
            }
            
            statusText.textContent = "Conexión establecida, redirigiendo...";
            
            setTimeout(() => {
                window.location.href = fullURL;
            }, 500);
            
        }, 1500);
        
    }, 1500);
}

document.getElementById('urlInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        verificarURL();
    }
});

cargarURLGuardada();