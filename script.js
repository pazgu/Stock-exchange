const API_KEY = "API_KEY";

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const loadingIndicator = document.getElementById("loading-indicator");
const resultsList = document.getElementById("results-list");

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
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

  const searchUrl = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=10&exchange=NASDAQ&apikey=${API_KEY}`;

  try {
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) throw new Error("Search request failed");

    const searchResults = await searchResponse.json();

    if (searchResults.length === 0) {
      resultsList.innerHTML = "<li>No NASDAQ results found.</li>";
      return;
    }

    const symbolsString = searchResults.map((item) => item.symbol).join(",");

    const profileUrl = `https://financialmodelingprep.com/api/v3/profile/${symbolsString}?apikey=${API_KEY}`;
    const profileResponse = await fetch(profileUrl);
    if (!profileResponse.ok) throw new Error("Profile batch request failed");

    const profilesData = await profileResponse.json();

    renderEnrichedResults(profilesData);
  } catch (error) {
    console.error("Error fetching data:", error);
    resultsList.innerHTML = `<li style="color: #dc3545; padding: 10px;">Failed to gather stock information. Please verify your token configuration.</li>`;
  } finally {
    loadingIndicator.classList.add("hidden");
  }
}

function renderEnrichedResults(companies) {
  companies.forEach((company) => {
    const li = document.createElement("li");
    const a = document.createElement("a");

    a.href = `/company.html?symbol=${encodeURIComponent(company.symbol)}`;

    const isNegative = company.changesPercentage.toString().includes("-");
    const changeClass = isNegative ? "neg-change" : "pos-change";
    const formatSign = isNegative ? "" : "+";

    a.innerHTML = `
            <img class="result-logo" src="${company.image || "https://via.placeholder.com/32"}" alt="">
            <span class="company-name">${company.companyName}</span>
            <span class="company-meta">
                (${company.symbol})
                <span class="price-change ${changeClass}">${formatSign}${Number(company.changesPercentage).toFixed(2)}%</span>
            </span>
        `;

    li.appendChild(a);
    resultsList.appendChild(li);
  });
}
