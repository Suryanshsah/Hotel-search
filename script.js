const track = document.getElementById('carouselTrack');
const nextButton = document.getElementById('nextBtn');
const prevButton = document.getElementById('prevBtn');
const slides = Array.from(track.children);

let currentIndex = 0;

function updateCarousel() {
    // Shifts the inline container left/right based on viewport percentage metrics 
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

nextButton.addEventListener('click', () => {
    if (currentIndex === slides.length - 1) {
        currentIndex = 0; // Infinite loop forward
    } else {
        currentIndex++;
    }
    updateCarousel();
});

prevButton.addEventListener('click', () => {
    if (currentIndex === 0) {
        currentIndex = slides.length - 1; // Infinite loop backward
    } else {
        currentIndex--;
    }
    updateCarousel();
});

window.addEventListener('resize', updateCarousel);



const API_URL = "https://demohotelsapi.pythonanywhere.com/hotels/";
const container = document.getElementById('hotelsCarouselContainer');
const hotelsTrack = document.getElementById('hotelsCarouselTrack');
const hotelNext = document.getElementById('hotelNextBtn');
const hotelPrev = document.getElementById('hotelPrevBtn');
const cityButtons = document.querySelectorAll('.city-btn');

let hotelIndex = 0;
let maxScrollIndex = 0;

const hotelImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80"
];

async function fetchHotels(cityName) {
    container.style.display = "block";
    hotelsTrack.innerHTML = `<div class="hotel-status-msg">Loading premium rooms in ${cityName}...</div>`;
    // Hide navigation arrows while loading new data
    hotelNext.style.display = "none";
    hotelPrev.style.display = "none";
    hotelIndex = 0;
    hotelsTrack.style.transform = `translateX(0px)`;

    try {
        const response = await fetch(`${API_URL}?city=${encodeURIComponent(cityName)}`);
        if (!response.ok) throw new Error("Server error");
        
        const data = await response.json();
        
        // Normalize object wrappers to arrays safely
        let hotelsArray = Array.isArray(data) ? data : (data.hotels || data.data || []);
        if (hotelsArray.length === 0 && data.name) hotelsArray = [data];

        displayHotelCarousel(hotelsArray);
    } catch (error) {
        hotelsTrack.innerHTML = `<div class="hotel-status-msg" style="color: #dc3545;">Failed to communicate with API.</div>`;
    }
}

function displayHotelCarousel(hotels) {
    hotelsTrack.innerHTML = "";
    
    if (hotels.length === 0) {
        hotelsTrack.innerHTML = `<div class="hotel-status-msg">No properties registered here yet.</div>`;
        return;
    }

    hotels.forEach((hotel, idx) => {
        const card = document.createElement('div');
        card.className = 'hotel-card';
        const assignedImage = hotelImages[idx % hotelImages.length];
        
        card.innerHTML = `
            <img src="${assignedImage}" alt="Room Visual Preview" class="hotel-card-img">
            <div class="hotel-info">
                <h3 class="hotel-name">${hotel.name || 'Hotel Premium stay'}</h3>
                <p class="hotel-meta-row">Location: ${hotel.city || 'Local Area'}</p>
                <p class="hotel-meta-row">Price: ₹${hotel.price || '0.00'}</p>
                <div class="hotel-rating-container">
                    <span>Rating: ${hotel.rating || '0.0'}</span>
                    <span class="star-icon">★</span>
                </div>
                <button class="view-more-btn">View More</button>
            </div>
        `;
        hotelsTrack.appendChild(card);
    });

    
    setTimeout(() => {
        const totalCards = hotels.length;
        let cardsVisible = 3;
        if (window.innerWidth <= 900) cardsVisible = 2;
        if (window.innerWidth <= 600) cardsVisible = 1;

        maxScrollIndex = Math.max(0, totalCards - cardsVisible);
        
        
        hotelNext.style.display = maxScrollIndex > 0 ? "block" : "none";
        hotelPrev.style.display = maxScrollIndex > 0 ? "block" : "none";
    }, 100);
}

function slideHotels() {
    const cardNode = document.querySelector('.hotel-card');
    if (!cardNode) return;
    
    
    const cardWidth = cardNode.getBoundingClientRect().width + 20; 
    hotelsTrack.style.transform = `translateX(-${hotelIndex * cardWidth}px)`;
}

hotelNext.addEventListener('click', () => {
    if (hotelIndex < maxScrollIndex) {
        hotelIndex++;
    } else {
        hotelIndex = 0; 
    }
    slideHotels();
});

hotelPrev.addEventListener('click', () => {
    if (hotelIndex > 0) {
        hotelIndex--;
    } else {
        hotelIndex = maxScrollIndex; 
    }
    slideHotels();
});

cityButtons.forEach(button => {
    button.addEventListener('click', () => {
        fetchHotels(button.textContent.trim());
    });
});