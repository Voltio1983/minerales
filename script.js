let allMinerals = [];
let currentMinerals = [];
let currentModalImages = [];
let currentModalIndex = 0;
let currentModalCaption = '';

// Cargar datos desde el archivo JSON
document.addEventListener("DOMContentLoaded", () => {
    loadMinerals();
    
    // Agregar evento de búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchMinerals, 300));
    }
    
    // Actualizar fecha en el footer
    updateFooterDate();
});

// Función para cargar los minerales
function loadMinerals() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allMinerals = data;
            currentMinerals = [...allMinerals];
            displayMinerals(currentMinerals);
            updateCollectionStats(); // Actualizar estadísticas
        })
        .catch(error => {
            console.error('Error detallado:', error);
            handleError(error);
        });
}

// Función para actualizar estadísticas de la colección
function updateCollectionStats() {
    const totalSamples = document.getElementById('totalSamples');
    const cataloguedMinerals = document.getElementById('cataloguedMinerals');
    
    if (totalSamples && cataloguedMinerals) {
        totalSamples.textContent = allMinerals.length;
        cataloguedMinerals.textContent = allMinerals.length; // Asumimos que todos están catalogados
    }
}

// Función para actualizar la fecha en el footer
function updateFooterDate() {
    const lastUpdate = document.getElementById('lastUpdate');
    if (lastUpdate) {
        const now = new Date();
        lastUpdate.textContent = now.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Función para manejar errores de manera más amigable
function handleError(error) {
    const container = document.getElementById('mineral-list');
    if (container) {
        container.innerHTML = `
            <div class="no-results">
                <h3>⚠️ Error al cargar los datos</h3>
                <p>${error.message}</p>
                <p><strong>Soluciones posibles:</strong></p>
                <ul style="text-align: left; max-width: 600px; margin: 0 auto;">
                    <li>Verifica que el archivo <code>data.json</code> exista en la misma carpeta</li>
                    <li>Asegúrate de que el archivo JSON tenga formato correcto</li>
                    <li>Ejecuta un servidor local (python -m http.server 8000)</li>
                    <li>Verifica la consola del navegador para más detalles (F12)</li>
                </ul>
                <button onclick="loadMinerals()" style="margin-top: 20px;">Reintentar</button>
            </div>
        `;
    }
}

// Función para mostrar los minerales con carrusel de imágenes
function displayMinerals(minerals) {
    const container = document.getElementById('mineral-list');
    
    if (!container) return;
    
    if (minerals.length === 0) {
        container.innerHTML = '<div class="no-results">No se encontraron minerales que coincidan con la búsqueda.</div>';
        return;
    }
    
    container.innerHTML = minerals.map(mineral => {
        // Manejar imágenes: puede ser un array o una sola imagen
        let images = [];
        if (Array.isArray(mineral.imagenes)) {
            images = mineral.imagenes;
        } else if (mineral.imagen) {
            images = [mineral.imagen];
        } else if (mineral.imagenes) {
            // Si es un string separado por comas
            images = mineral.imagenes.split(',').map(img => img.trim());
        }
        
        const imagesHTML = images.length > 0 ? `
            <div class="image-carousel">
                <div class="carousel-container" id="carousel-${mineral.id || Math.random()}">
                    ${images.map((img, index) => `
                        <img src="${img}" alt="${mineral.nombre} - Imagen ${index + 1}" 
                             class="carousel-image" 
                             onclick="openModal(${JSON.stringify(images).replace(/"/g, '&quot;')}, ${index}, '${mineral.nombre.replace(/'/g, "\\'")}')">
                    `).join('')}
                </div>
                ${images.length > 1 ? `
                    <div class="carousel-indicators">
                        ${images.map((_, index) => `
                            <div class="indicator ${index === 0 ? 'active' : ''}" 
                                 onclick="changeCarouselSlide(this, ${index})"></div>
                        `).join('')}
                    </div>
                    <button class="carousel-nav prev-btn" onclick="navigateCarousel(this, -1)">❮</button>
                    <button class="carousel-nav next-btn" onclick="navigateCarousel(this, 1)">❯</button>
                ` : ''}
            </div>
        ` : '';
        
        return `
            <div class="mineral-card">
                ${imagesHTML}
                <h2>${mineral.nombre || 'Sin nombre'}</h2>
                ${mineral.formula ? `<p><strong>Fórmula:</strong> ${mineral.formula}</p>` : ''}
                ${mineral.dureza ? `<p><strong>Dureza:</strong> ${mineral.dureza}</p>` : ''}
                ${mineral.sistema_cristalino ? `<p><strong>Sistema Cristalino:</strong> ${mineral.sistema_cristalino}</p>` : ''}
                ${mineral.color ? `<p><strong>Color:</strong> ${mineral.color}</p>` : ''}
                ${mineral.transparencia ? `<p><strong>Transparencia:</strong> ${mineral.transparencia}</p>` : ''}
                ${mineral.brillo ? `<p><strong>Brillo:</strong> ${mineral.brillo}</p>` : ''}
                ${mineral.raya ? `<p><strong>Raya:</strong> ${mineral.raya}</p>` : ''}
                ${mineral.densidad ? `<p><strong>Densidad:</strong> ${mineral.densidad}</p>` : ''}
                ${mineral.habito ? `<p><strong>Hábito:</strong> ${mineral.habito}</p>` : ''}
                ${mineral.exfoliacion ? `<p><strong>Exfoliación:</strong> ${mineral.exfoliacion}</p>` : ''}
                ${mineral.fractura ? `<p><strong>Fractura:</strong> ${mineral.fractura}</p>` : ''}
                ${mineral.ubicacion ? `<p><strong>Ubicación:</strong> ${mineral.ubicacion}</p>` : ''}
                ${mineral.fecha_adquisicion ? `<p><strong>Fecha de Adquisición:</strong> ${mineral.fecha_adquisicion}</p>` : ''}
                ${mineral.proveedor ? `<p><strong>Proveedor:</strong> ${mineral.proveedor}</p>` : ''}
                ${mineral.clasificacion ? `<p><strong>Clasificación:</strong> ${mineral.clasificacion}</p>` : ''}
                ${mineral.usos ? `<p><strong>Usos:</strong> ${mineral.usos}</p>` : ''}
                ${mineral.propiedades_especiales ? `<p><strong>Propiedades Especiales:</strong> ${mineral.propiedades_especiales}</p>` : ''}
                ${mineral.notas ? `<p><strong>Notas:</strong> ${mineral.notas}</p>` : ''}
            </div>
        `;
    }).join('');
}

// Función para mostrar la galería con todas las imágenes
function displayGallery() {
    const container = document.getElementById('gallery-container');
    if (!container) return;
    
    if (allMinerals.length === 0) {
        container.innerHTML = '<div class="no-results">No hay imágenes para mostrar.</div>';
        return;
    }
    
    // Recolectar todas las imágenes de todos los minerales
    const allImages = [];
    allMinerals.forEach(mineral => {
        let images = [];
        if (Array.isArray(mineral.imagenes)) {
            images = mineral.imagenes;
        } else if (mineral.imagen) {
            images = [mineral.imagen];
        } else if (mineral.imagenes) {
            images = mineral.imagenes.split(',').map(img => img.trim());
        }
        
        images.forEach((img, index) => {
            allImages.push({
                src: img,
                mineralName: mineral.nombre,
                mineralId: mineral.id || mineral.nombre
            });
        });
    });
    
    if (allImages.length === 0) {
        container.innerHTML = '<div class="no-results">No hay imágenes disponibles en la colección.</div>';
        return;
    }
    
    container.innerHTML = allImages.map(image => `
        <div class="gallery-item" onclick="openModal(['${image.src}'], 0, '${image.mineralName}')">
            <img src="${image.src}" alt="${image.mineralName}" class="gallery-image">
            <div class="gallery-caption">${image.mineralName}</div>
        </div>
    `).join('');
}

// Función de búsqueda
function searchMinerals() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase().trim();
    
    if (!searchTerm) {
        currentMinerals = [...allMinerals];
    } else {
        currentMinerals = allMinerals.filter(mineral => {
            return Object.values(mineral).some(value => 
                value && value.toString().toLowerCase().includes(searchTerm)
            );
        });
    }
    
    displayMinerals(currentMinerals);
}

// Limpiar búsqueda
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    currentMinerals = [...allMinerals];
    displayMinerals(currentMinerals);
}

// Modal para mostrar imágenes a tamaño completo
function openModal(images, startIndex, caption) {
    // Convertir string a array si es necesario
    if (typeof images === 'string') {
        try {
            currentModalImages = JSON.parse(images.replace(/&quot;/g, '"'));
        } catch (e) {
            currentModalImages = [images];
        }
    } else {
        currentModalImages = Array.isArray(images) ? images : [images];
    }
    
    currentModalIndex = startIndex || 0;
    currentModalCaption = caption || '';
    
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const imageCounter = document.getElementById('imageCounter');
    
    if (modal && modalImg && modalCaption && imageCounter) {
        modal.style.display = 'block';
        modalImg.src = currentModalImages[currentModalIndex];
        modalCaption.innerHTML = `${currentModalCaption} - Imagen ${currentModalIndex + 1} de ${currentModalImages.length}`;
        imageCounter.textContent = `${currentModalIndex + 1}/${currentModalImages.length}`;
        
        // Prevenir scroll del body cuando el modal está abierto
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.style.display = 'none';
    }
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    if (currentModalImages.length <= 1) return;
    
    currentModalIndex += direction;
    
    // Circular navigation
    if (currentModalIndex >= currentModalImages.length) {
        currentModalIndex = 0;
    } else if (currentModalIndex < 0) {
        currentModalIndex = currentModalImages.length - 1;
    }
    
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const imageCounter = document.getElementById('imageCounter');
    
    if (modalImg && modalCaption && imageCounter) {
        modalImg.src = currentModalImages[currentModalIndex];
        modalCaption.innerHTML = `${currentModalCaption} - Imagen ${currentModalIndex + 1} de ${currentModalImages.length}`;
        imageCounter.textContent = `${currentModalIndex + 1}/${currentModalImages.length}`;
    }
}

// Sistema de pestañas
function showTab(tabName) {
    // Ocultar todas las pestañas
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    // Desactivar todos los botones
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    
    // Mostrar la pestaña seleccionada
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.currentTarget.classList.add('active');
    
    // Si es la galería, mostrar las imágenes
    if (tabName === 'gallery') {
        displayGallery();
    }
    
    // Mostrar u ocultar la barra de búsqueda según la pestaña
    const searchContainer = document.getElementById('searchContainer');
    if (searchContainer) {
        if (tabName === 'collection') {
            searchContainer.style.display = 'flex';
        } else {
            searchContainer.style.display = 'none';
        }
    }
}

// Función debounce para evitar búsquedas constantes
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    } else if (event.key === 'ArrowLeft') {
        changeImage(-1);
    } else if (event.key === 'ArrowRight') {
        changeImage(1);
    }
});

// Carrusel de imágenes en las tarjetas
function changeCarouselSlide(indicator, index) {
    const carousel = indicator.parentElement.parentElement;
    const container = carousel.querySelector('.carousel-container');
    const indicators = carousel.querySelectorAll('.indicator');
    
    // Actualizar indicadores
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });
    
    // Mover carrusel
    container.style.transform = `translateX(-${index * 100}%)`;
}

function navigateCarousel(button, direction) {
    const carousel = button.parentElement;
    const container = carousel.querySelector('.carousel-container');
    const indicators = carousel.querySelectorAll('.indicator');
    const currentIndex = Array.from(indicators).findIndex(ind => ind.classList.contains('active'));
    const newIndex = currentIndex + direction;
    
    if (newIndex >= 0 && newIndex < indicators.length) {
        changeCarouselSlide(indicators[newIndex], newIndex);
    }
}

// Cerrar modal al hacer clic fuera de la imagen
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (modal && event.target === modal) {
        closeModal();
    }
}