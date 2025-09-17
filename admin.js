// Credenciales de administrador (en producción, esto debería estar en el servidor)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Siroco4_2b';

let mineralsData = [];
let isLoggedIn = false;

// Verificar si ya hay sesión iniciada
document.addEventListener("DOMContentLoaded", () => {
    checkLoginStatus();
    if (isLoggedIn) {
        loadAdminData();
    }
});

// Verificar estado de login
function checkLoginStatus() {
    const token = localStorage.getItem('adminToken');
    const loginTime = localStorage.getItem('loginTime');
    
    if (token && loginTime) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - parseInt(loginTime);
        
        // Sesión válida por 24 horas
        if (timeDiff < (24 * 60 * 60 * 1000) && token === btoa(ADMIN_USERNAME + ':' + ADMIN_PASSWORD)) {
            isLoggedIn = true;
            showAdminPanel();
        } else {
            logout();
        }
    }
}

// Función de login
function login(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('loginMessage');
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Guardar sesión
        const token = btoa(username + ':' + password);
        localStorage.setItem('adminToken', token);
        localStorage.setItem('loginTime', new Date().getTime().toString());
        
        isLoggedIn = true;
        showAdminPanel();
        loadAdminData();
        
        if (messageDiv) {
            messageDiv.innerHTML = '';
        }
    } else {
        if (messageDiv) {
            messageDiv.innerHTML = '❌ Usuario o contraseña incorrectos';
            messageDiv.className = 'login-message error';
        }
    }
}

// Mostrar panel de administración
function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('loginTime');
    isLoggedIn = false;
    window.location.href = 'index.html';
}

// Cargar datos para administración
function loadAdminData() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los datos');
            }
            return response.json();
        })
        .then(data => {
            mineralsData = data;
            displayMineralsForEdit();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar los datos: ' + error.message);
        });
}

// Mostrar minerales para edición con soporte para múltiples imágenes
function displayMineralsForEdit() {
    const container = document.getElementById('mineralsList');
    if (!container) return;
    
    container.innerHTML = mineralsData.map((mineral, index) => {
        // Obtener imágenes (compatibilidad con formatos antiguos)
        let images = [];
        if (Array.isArray(mineral.imagenes)) {
            images = mineral.imagenes;
        } else if (mineral.imagen) {
            images = [mineral.imagen];
        } else if (mineral.imagenes && typeof mineral.imagenes === 'string') {
            images = mineral.imagenes.split(',').map(img => img.trim());
        } else {
            images = [''];
        }
        
        // Asegurar que siempre haya al menos un campo de imagen
        if (images.length === 0) {
            images = [''];
        }
        
        const imagesHTML = images.map((image, imgIndex) => `
            <div class="image-input-group">
                <input type="text" 
                       value="${image || ''}" 
                       placeholder="URL de la imagen ${imgIndex + 1}"
                       onchange="updateMineralImage(${index}, ${imgIndex}, this.value)">
                ${images.length > 1 ? `<button class="remove-image-btn" onclick="removeImage(${index}, ${imgIndex})">✕</button>` : ''}
            </div>
        `).join('');
        
        return `
            <div class="mineral-edit-card" data-index="${index}">
                <h3>
                    Mineral #${index + 1}
                    <button class="delete-btn" onclick="deleteMineral(${index})">🗑️</button>
                </h3>
                
                <label>Nombre:</label>
                <input type="text" value="${mineral.nombre || ''}" onchange="updateMineral(${index}, 'nombre', this.value)">
                
                <label>Fórmula:</label>
                <input type="text" value="${mineral.formula || ''}" onchange="updateMineral(${index}, 'formula', this.value)">
                
                <label>Dureza:</label>
                <input type="text" value="${mineral.dureza || ''}" onchange="updateMineral(${index}, 'dureza', this.value)">
                
                <label>Sistema Cristalino:</label>
                <input type="text" value="${mineral.sistema_cristalino || ''}" onchange="updateMineral(${index}, 'sistema_cristalino', this.value)">
                
                <label>Color:</label>
                <input type="text" value="${mineral.color || ''}" onchange="updateMineral(${index}, 'color', this.value)">
                
                <label>Transparencia:</label>
                <input type="text" value="${mineral.transparencia || ''}" onchange="updateMineral(${index}, 'transparencia', this.value)">
                
                <label>Brillo:</label>
                <input type="text" value="${mineral.brillo || ''}" onchange="updateMineral(${index}, 'brillo', this.value)">
                
                <label>Raya:</label>
                <input type="text" value="${mineral.raya || ''}" onchange="updateMineral(${index}, 'raya', this.value)">
                
                <label>Densidad:</label>
                <input type="text" value="${mineral.densidad || ''}" onchange="updateMineral(${index}, 'densidad', this.value)">
                
                <label>Hábito:</label>
                <input type="text" value="${mineral.habito || ''}" onchange="updateMineral(${index}, 'habito', this.value)">
                
                <label>Exfoliación:</label>
                <input type="text" value="${mineral.exfoliacion || ''}" onchange="updateMineral(${index}, 'exfoliacion', this.value)">
                
                <label>Fractura:</label>
                <input type="text" value="${mineral.fractura || ''}" onchange="updateMineral(${index}, 'fractura', this.value)">
                
                <label>Ubicación:</label>
                <input type="text" value="${mineral.ubicacion || ''}" onchange="updateMineral(${index}, 'ubicacion', this.value)">
                
                <label>Fecha de Adquisición:</label>
                <input type="text" value="${mineral.fecha_adquisicion || ''}" onchange="updateMineral(${index}, 'fecha_adquisicion', this.value)">
                
                <label>Proveedor:</label>
                <input type="text" value="${mineral.proveedor || ''}" onchange="updateMineral(${index}, 'proveedor', this.value)">
                
                <label>Clasificación:</label>
                <input type="text" value="${mineral.clasificacion || ''}" onchange="updateMineral(${index}, 'clasificacion', this.value)">
                
                <label>Usos:</label>
                <input type="text" value="${mineral.usos || ''}" onchange="updateMineral(${index}, 'usos', this.value)">
                
                <label>Propiedades Especiales:</label>
                <input type="text" value="${mineral.propiedades_especiales || ''}" onchange="updateMineral(${index}, 'propiedades_especiales', this.value)">
                
                <label>Notas:</label>
                <textarea onchange="updateMineral(${index}, 'notas', this.value)">${mineral.notas || ''}</textarea>
                
                <div class="images-section">
                    <h4>🖼️ Imágenes (${images.length})</h4>
                    <div id="images-container-${index}">
                        ${imagesHTML}
                    </div>
                    <button class="add-image-btn" onclick="addImage(${index})">➕ Agregar Imagen</button>
                </div>
            </div>
        `;
    }).join('');
}

// Actualizar mineral (campos simples)
function updateMineral(index, field, value) {
    if (mineralsData[index]) {
        mineralsData[index][field] = value;
    }
}

// Actualizar imagen específica
function updateMineralImage(mineralIndex, imageIndex, value) {
    if (mineralsData[mineralIndex]) {
        // Asegurar que exista el array de imágenes
        if (!Array.isArray(mineralsData[mineralIndex].imagenes)) {
            mineralsData[mineralIndex].imagenes = [''];
        }
        
        // Actualizar la imagen específica
        mineralsData[mineralIndex].imagenes[imageIndex] = value;
    }
}

// Agregar nueva imagen a un mineral
function addImage(mineralIndex) {
    if (mineralsData[mineralIndex]) {
        // Asegurar que exista el array de imágenes
        if (!Array.isArray(mineralsData[mineralIndex].imagenes)) {
            mineralsData[mineralIndex].imagenes = [];
        }
        
        // Agregar nueva imagen vacía
        mineralsData[mineralIndex].imagenes.push('');
        
        // Refrescar la vista
        displayMineralsForEdit();
    }
}

// Eliminar imagen de un mineral
function removeImage(mineralIndex, imageIndex) {
    if (mineralsData[mineralIndex] && Array.isArray(mineralsData[mineralIndex].imagenes)) {
        // Eliminar la imagen
        mineralsData[mineralIndex].imagenes.splice(imageIndex, 1);
        
        // Si no quedan imágenes, dejar un array vacío
        if (mineralsData[mineralIndex].imagenes.length === 0) {
            mineralsData[mineralIndex].imagenes = [''];
        }
        
        // Refrescar la vista
        displayMineralsForEdit();
    }
}

// Eliminar mineral
function deleteMineral(index) {
    if (confirm('¿Estás seguro de que quieres eliminar este mineral?')) {
        mineralsData.splice(index, 1);
        displayMineralsForEdit();
    }
}

// Agregar nuevo mineral con mejor interfaz
function addNewMineral() {
    const newMineral = {
        "nombre": "",
        "formula": "",
        "dureza": "",
        "sistema_cristalino": "",
        "color": "",
        "transparencia": "",
        "brillo": "",
        "raya": "",
        "densidad": "",
        "habito": "",
        "exfoliacion": "",
        "fractura": "",
        "ubicacion": "",
        "fecha_adquisicion": "",
        "proveedor": "",
        "clasificacion": "",
        "usos": "",
        "propiedades_especiales": "",
        "notas": "",
        "imagenes": [""]
    };
    
    mineralsData.push(newMineral);
    displayMineralsForEdit();
    
    // Scroll al final
    const container = document.getElementById('mineralsList');
    if (container) {
        container.scrollTop = container.scrollHeight;
        
        // Enfocar el primer campo del nuevo mineral
        setTimeout(() => {
            const newCard = container.lastElementChild;
            if (newCard) {
                const firstInput = newCard.querySelector('input[type="text"]');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        }, 100);
    }
}

// Guardar datos
function saveData() {
    // Limpiar datos: eliminar imágenes vacías y convertir formato
    const cleanedData = mineralsData.map(mineral => {
        const cleanedMineral = { ...mineral };
        
        // Procesar imágenes
        if (Array.isArray(cleanedMineral.imagenes)) {
            // Filtrar imágenes vacías
            const filteredImages = cleanedMineral.imagenes.filter(img => img && img.trim() !== '');
            if (filteredImages.length > 0) {
                cleanedMineral.imagenes = filteredImages;
            } else {
                // Si no hay imágenes válidas, eliminar la propiedad
                delete cleanedMineral.imagenes;
                delete cleanedMineral.imagen; // Por compatibilidad
            }
        } else if (cleanedMineral.imagen && cleanedMineral.imagen.trim() === '') {
            delete cleanedMineral.imagen;
        }
        
        return cleanedMineral;
    });
    
    const dataStr = JSON.stringify(cleanedData, null, 2);
    
    // Crear blob y descargar
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('✅ Datos guardados correctamente. El archivo data.json se ha descargado.');
}

// Exportar datos
function exportData() {
    saveData();
}

// Importar datos (simulación)
function importData() {
    alert('Para importar datos, reemplaza el archivo data.json en tu servidor con el nuevo archivo.');
}

// Cerrar sesión con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && isLoggedIn) {
        logout();
    }
});