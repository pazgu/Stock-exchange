const API_KEY = "API_KEY";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const loadingIndicator = document.getElementById("loading-indicator");
const resultsList = document.getElementById("results-list");

function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    // If the user is still typing, cancel the previous scheduled API call
    clearTimeout(timeoutId);

    // Schedule a new API call after the delay has passed
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

searchButton.addEventListener("click", performSearch);

searchInput.addEventListener("input", debounce(performSearch, 500));

async function performSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    resultsList.innerHTML = "";
    loadingIndicator.classList.add("hidden");
    return;
  }

  loadingIndicator.classList.remove("hidden");
  resultsList.innerHTML = "";

  const url = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=10&exchange=NASDAQ&apikey=${API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    renderResults(data);
  } catch (error) {
    resultsList.innerHTML = `<li style="color: red; padding: 10px;">Failed to fetch results. Please check your API key or connection.</li>`;
  } finally {
    loadingIndicator.classList.add("hidden");
  }
}

function renderResults(companies) {
  if (companies.length === 0) {
    resultsList.innerHTML = "<li>No NASDAQ results found.</li>";
    return;
  }

  companies.forEach((company) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = `/company.html?symbol=${encodeURIComponent(company.symbol)}`;

    a.innerHTML = `${company.name} <span class="company-symbol">(${company.symbol})</span>`;

    li.appendChild(a);
    resultsList.appendChild(li);
  });
}
