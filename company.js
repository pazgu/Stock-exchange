const API_KEY = "API_KEY";

const loadingIndicator = document.getElementById("loading-indicator");
const profileContent = document.getElementById("profile-content");

const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get("symbol");

if (!symbol) {
  alert("No symbol specified in URL!");
  window.location.href = "index.html";
} else {
  loadCompanyData();
}

async function loadCompanyData() {
  loadingIndicator.classList.remove("hidden");
  profileContent.classList.add("hidden");

  const profileUrl = `https://financialmodelingprep.com/api/v3/company/profile/${symbol}?apikey=${API_KEY}`;
  const historyUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${API_KEY}`;

  try {
    const [profileRes, historyRes] = await Promise.all([
      fetch(profileUrl),
      fetch(historyUrl),
    ]);

    if (!profileRes.ok || !historyRes.ok) {
      throw new Error("Failed to process profile or history endpoints.");
    }

    const profileData = await profileRes.json();
    const historyData = await historyRes.json();

    renderProfile(profileData.profile);

    renderChart(historyData.historical);

    profileContent.classList.remove("hidden");
  } catch (error) {
    loadingIndicator.innerHTML = `<p style="color:red;">Error loading company info. Check API limit or key.</p>`;
  } finally {
    if (!profileContent.classList.contains("hidden")) {
      loadingIndicator.classList.add("hidden");
    }
  }
}

function renderProfile(profile) {
  if (!profile) return;

  document.getElementById("company-logo").src =
    profile.image || "https://via.placeholder.com/80";
  document.getElementById("company-name").innerText =
    profile.companyName || symbol;
  document.getElementById("company-industry").innerText =
    profile.industry || "N/A";
  document.getElementById("stock-price").innerText = `$${profile.price}`;
  document.getElementById("company-description").innerText =
    profile.description || "No description available.";

  const webLink = document.getElementById("company-website");
  webLink.href = profile.website;
  webLink.innerText = profile.website;

  const changePercentage = profile.changesPercentage;
  const changeElement = document.getElementById("price-change");
  changeElement.innerText = changePercentage;

  if (changePercentage.toString().includes("-")) {
    changeElement.classList.add("negative-change");
  } else {
    changeElement.classList.add("positive-change");
  }
}

function renderChart(historicalArray) {
  if (!historicalArray || historicalArray.length === 0) return;

  const sortedData = [...historicalArray].reverse();

  const labels = sortedData.map((item) => item.date);
  const prices = sortedData.map((item) => item.close);

  const ctx = document.getElementById("history-chart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Stock Price History",
          data: prices,
          borderColor: "#ff2a75",
          backgroundColor: "rgba(255, 42, 117, 0.1)",
          fill: true,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          grid: { color: "#e9ecef" },
        },
      },
    },
  });
}
