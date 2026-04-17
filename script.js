// Global variable to store travel data
let travelData = { beaches: [], temples: [], countries: [] };

// DOM elements
const homePage = document.getElementById('homePage');
const aboutPage = document.getElementById('aboutPage');
const contactPage = document.getElementById('contactPage');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsContainer = document.getElementById('resultsContainer');

// Navigation links
const navLinks = document.querySelectorAll('.nav-links a');

// Fetch data from JSON file
async function loadData() {
  try {
    const response = await fetch('data/travel_recommendation_api.json');
    if (!response.ok) throw new Error('Failed to load data');
    travelData = await response.json();
    console.log('Data loaded:', travelData);
  } catch (error) {
    console.error('Error loading data:', error);
    resultsContainer.innerHTML = '<p class="error">Failed to load travel data. Please try again later.</p>';
  }
}

// Show specific page (Home, About, Contact)
function showPage(pageId) {
  homePage.classList.remove('active-page');
  aboutPage.classList.remove('active-page');
  contactPage.classList.remove('active-page');
  if (pageId === 'home') homePage.classList.add('active-page');
  else if (pageId === 'about') aboutPage.classList.add('active-page');
  else if (pageId === 'contact') contactPage.classList.add('active-page');
  
  // Clear results when changing page (optional)
  if (pageId !== 'home') {
    resultsContainer.innerHTML = '';
    searchInput.value = '';
  }
}

// Search logic
function performSearch() {
  const keyword = searchInput.value.trim().toLowerCase();
  if (!keyword) {
    resultsContainer.innerHTML = '<p>Please enter a keyword (beach, temple, country).</p>';
    return;
  }

  // Determine which category to search
  let results = [];
  if (keyword.includes('beach') || keyword === 'beaches') {
    results = travelData.beaches;
  } else if (keyword.includes('temple') || keyword === 'temples') {
    results = travelData.temples;
  } else if (keyword.includes('country') || keyword === 'countries') {
    results = travelData.countries;
  } else {
    // optional: search across all categories (basic)
    results = [...travelData.beaches, ...travelData.temples, ...travelData.countries];
  }

  displayResults(results);
}

// Display results as cards
function displayResults(items) {
  if (!items || items.length === 0) {
    resultsContainer.innerHTML = '<p>No matching destinations found. Try "beach", "temple", or "country".</p>';
    return;
  }

  let html = '<div class="results-container">';
  items.forEach(item => {
    html += `
      <div class="card">
        <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/600x400?text=No+Image'">
        <div class="card-content">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
      </div>
    `;
  });
  html += '</div>';
  resultsContainer.innerHTML = html;
}

// Clear search results and input
function clearSearch() {
  searchInput.value = '';
  resultsContainer.innerHTML = '';
}

// Event listeners
searchBtn.addEventListener('click', performSearch);
clearBtn.addEventListener('click', clearSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch();
});

// Navigation
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    if (page) showPage(page);
  });
});

// Initialize
loadData();
// Show home page by default
showPage('home');
