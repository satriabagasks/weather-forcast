const windDirections = {
  N: "Utara",
  NNE: "Utara Timur Laut",
  NE: "Timur Laut",
  ENE: "Timur-Timur Laut",
  E: "Timur",
  ESE: "Timur-Tenggara",
  SE: "Tenggara",
  SSE: "Selatan Tenggara",
  S: "Selatan",
  SSW: "Selatan Barat Daya",
  SW: "Barat Daya",
  WSW: "Barat-Barat Daya",
  W: "Barat",
  WNW: "Barat-Barat Laut",
  NW: "Barat Laut",
  NNW: "Utara Barat Laut",
  VARIABLE: "Berubah-ubah",
};

document.addEventListener("DOMContentLoaded", function () {
  const weatherTableBody = document
    .getElementById("weather-table")
    .querySelector("tbody");
  const kecamatanTitle = document.getElementById("kecamatan-title");
  const navDays = document.getElementById("nav-days");
  const selectedDateSpan = document.getElementById("selected-date"); // Reference to the selected-date span

  // Function to get the value of a query parameter by name
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Get the adm2 code from the URL
  const adm2Code = getQueryParam("adm2");

  function generateNavDays() {
    const today = new Date();

    // Add 'Today' to the navbar
    const todayString = today.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const todayItem = document.createElement("li");
    const todayLink = document.createElement("a");
    todayLink.href = "#";
    todayLink.textContent = todayString;
    todayLink.dataset.dayOffset = 0; // 0 means today
    todayLink.addEventListener("click", (e) => {
      e.preventDefault();
      fetchWeatherData(0); // Fetch data for today
      updateActiveLink(e.target); // Update the active link
      updateSelectedDate(todayString); // Update the selected date span
    });
    todayItem.appendChild(todayLink);
    navDays.appendChild(todayItem);

    // Add the next 7 days to the navbar
    for (let i = 1; i <= 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      const dayString = day.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = dayString;
      link.dataset.dayOffset = i;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        fetchWeatherData(i); // Fetch data for the selected day
        updateActiveLink(e.target); // Update the active link
        updateSelectedDate(dayString); // Update the selected date span
      });

      listItem.appendChild(link);
      navDays.appendChild(listItem);
    }
  }

  function updateActiveLink(activeLink) {
    const links = document.querySelectorAll(".nav-header a");
    links.forEach((link) => link.classList.remove("active"));
    activeLink.classList.add("active");
  }

  // Function to update the selected date in the span
  function updateSelectedDate(dateString) {
    selectedDateSpan.textContent = dateString;
  }

  function fetchWeatherData(dayOffset) {
    fetch(
      `https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm1=76&adm2=${adm2Code}`
    )
      .then((response) => response.json())
      .then((data) => {
        const areas = data.data;
        weatherTableBody.innerHTML = ""; // Clear the table

        // Set the title based on the first kecamatan found
        if (areas.length > 0) {
          kecamatanTitle.textContent = `Prakiraan Cuaca - ${areas[0].lokasi.kotkab}`;
        }

        areas.forEach((area) => {
          const row = document.createElement("tr");

          // Kecamatan name
          const nameCell = document.createElement("td");
          nameCell.textContent = area.lokasi.kecamatan;
          row.appendChild(nameCell);

          const forecasts = area.cuaca[dayOffset]; // Adjust index for specific day

          const specificHours = [2, 5, 8, 11, 14, 17, 20, 23];
          let minHumidity = Infinity;
          let maxHumidity = -Infinity;
          let minTemp = Infinity;
          let maxTemp = -Infinity;
          let windDirection = "";
          let windSpeed = 0;

          specificHours.forEach((hour) => {
            const forecast = forecasts.find((f) => {
              const localTime = new Date(f.local_datetime);
              const localHour = localTime.getHours();
              return localHour === hour;
            });

            const cell = document.createElement("td");
            if (forecast) {
              cell.innerHTML = `<img style="width: 30px;" src="${forecast.image}" alt="${forecast.weather_desc}">`; // Only display the icon
              minHumidity = Math.min(minHumidity, forecast.hu);
              maxHumidity = Math.max(maxHumidity, forecast.hu);
              minTemp = Math.min(minTemp, forecast.t);
              maxTemp = Math.max(maxTemp, forecast.t);
              windDirection = forecast.wd;
              windSpeed = Math.max(windSpeed, forecast.ws);
            } else {
              cell.textContent = "-"; // Placeholder if no data is available for the hour
            }
            row.appendChild(cell);
          });

          const rhCell = document.createElement("td");
          rhCell.textContent = `${minHumidity} - ${maxHumidity}`;
          row.appendChild(rhCell);

          const suhuCell = document.createElement("td");
          suhuCell.textContent = `${minTemp} - ${maxTemp}`;
          row.appendChild(suhuCell);

          // Use the windDirections object to translate the wind direction
          const translatedWindDirection =
            windDirections[windDirection] || windDirection;
          const windCell = document.createElement("td");
          windCell.textContent = `${translatedWindDirection} - ${windSpeed} KM/Jam`;
          row.appendChild(windCell);

          weatherTableBody.appendChild(row);
        });
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        weatherTableBody.innerHTML = `<tr><td colspan="12">Gagal mengambil data cuaca.</td></tr>`;
      });
  }

  generateNavDays(); // Generate navbar for today and the next 7 days
  fetchWeatherData(0); // Initial load for today (dayOffset = 0)
});

// WAKTU & JAM PADA HEADER
document.addEventListener("DOMContentLoaded", function () {
  const updateDateTime = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date().toLocaleDateString("id-ID", options);

    const optionsUTC = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC",
    };
    const datetimeUTC = new Date().toLocaleTimeString("id-ID", optionsUTC);

    const optionsWITA = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Makassar",
    };
    const datetimeWITA = new Date().toLocaleTimeString("id-ID", optionsWITA);

    document.getElementById("tanggal").innerHTML = "<p>" + date + "</p>";
    document.getElementById("datetime-utc").innerHTML =
      "<p>" + datetimeUTC + " UTC</p>";
    document.getElementById("datetime-wita").innerHTML =
      "<p>" + datetimeWITA + " WITA</p>";
  };

  // Initial update
  updateDateTime();

  // Update datetime every second
  setInterval(updateDateTime, 1000);
});
