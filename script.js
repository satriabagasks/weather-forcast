// CUACA BERANDA
document.addEventListener("DOMContentLoaded", function () {
  const fetchWeatherData = (dayOffset = 0) => {
    fetch("https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm1=76")
      .then((response) => response.json())
      .then((data) => {
        const areas = data.data;
        let weatherHtml = "";

        // Calculate and display the current date based on the day offset
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + dayOffset);
        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };
        const formattedDate = currentDate.toLocaleDateString("id-ID", options);
        document.getElementById("current-date").innerText = formattedDate;

        areas.forEach((area) => {
          const name = area.lokasi.kotkab + ", " + area.lokasi.provinsi;
          weatherHtml += `<div class="weather-area"><h3>${name}</h3>`;

          const forecasts = area.cuaca[dayOffset];
          let timestampsHtml = "<div class='weather-timestamp'>";
          let iconsHtml = "<div class='weather-icon'>";
          let descriptionsHtml = "<div class='weather-description'>";

          if (dayOffset === 0) {
            const now = new Date();
            const filteredForecasts = forecasts.filter((forecast) => {
              const forecastTime = new Date(forecast.local_datetime);
              return (
                forecastTime >= now &&
                forecastTime <= new Date(now.getTime() + 8 * 60 * 60 * 1000)
              );
            });

            filteredForecasts.forEach((forecast) => {
              const localTime = new Date(forecast.local_datetime);
              const hour =
                localTime.getHours().toString().padStart(2, "0") + ":00";
              const iconUrl = forecast.image;
              const description = forecast.weather_desc;

              timestampsHtml += `<div><p style="font-size: 1rem;">${hour}</p></div>`;
              iconsHtml += `<div><img src="${iconUrl}" alt="${description}"></div>`;
              // descriptionsHtml += `<div><p style="font-size: 16px;">${description}</p></div>`;
            });
          } else if (dayOffset === 1) {
            const hours = [2, 5, 8, 11, 14, 17, 20, 23];
            hours.forEach((hour) => {
              const forecast = forecasts.find((forecast) => {
                const forecastTime = new Date(forecast.local_datetime);
                return forecastTime.getHours() === hour;
              });

              if (forecast) {
                const localTime = new Date(forecast.local_datetime);
                const hourString =
                  localTime.getHours().toString().padStart(2, "0") + ":00";
                const iconUrl = forecast.image;
                const description = forecast.weather_desc;

                timestampsHtml += `<div><p style="font-size: 1em;">${hourString}</p></div>`;
                iconsHtml += `<div><img src="${iconUrl}" alt="${description}"></div>`;
                // descriptionsHtml += `<div><p style="font-size: 16px;">${description}</p></div>`;
              } else {
                const hourString = hour.toString().padStart(2, "0") + ":00";
                timestampsHtml += `<div><p style="font-size: 1em;">${hourString}</p></div>`;
                iconsHtml += `<div><img src="/icons/placeholder.png" alt="No data"></div>`;
                // descriptionsHtml += `<div><p style="font-size: 16px;">No data available</p></div>`;
              }
            });
          } else if (dayOffset === 2) {
            const hours = [2, 5, 8, 11, 14, 17, 20, 23];
            hours.forEach((hour) => {
              const forecast = forecasts.find((forecast) => {
                const forecastTime = new Date(forecast.local_datetime);
                return forecastTime.getHours() === hour;
              });

              if (forecast) {
                const localTime = new Date(forecast.local_datetime);
                const hourString =
                  localTime.getHours().toString().padStart(2, "0") + ":00";
                const iconUrl = forecast.image;
                const description = forecast.weather_desc;

                timestampsHtml += `<div><p style="font-size: 16px;">${hourString}</p></div>`;
                iconsHtml += `<div><img src="${iconUrl}" alt="${description}"></div>`;
                // descriptionsHtml += `<div><p style="font-size: 16px;">${description}</p></div>`;
              } else {
                const hourString = hour.toString().padStart(2, "0") + ":00";
                timestampsHtml += `<div><p style="font-size: 16px;">${hourString}</p></div>`;
                iconsHtml += `<div><img src="/icons/placeholder.png" alt="No data"></div>`;
                // descriptionsHtml += `<div><p style="font-size: 16px;">No data available</p></div>`;
              }
            });
          }

          timestampsHtml += "</div>";
          iconsHtml += "</div>";
          descriptionsHtml += "</div>";
          weatherHtml +=
            timestampsHtml + iconsHtml + descriptionsHtml + "</div>";
        });

        document.getElementById("weather-data").innerHTML = weatherHtml;
      })
      .catch((error) => {
        document.getElementById("weather-data").innerHTML =
          "Gagal mengambil data cuaca.";
        console.error("Error fetching weather data:", error);
      });
  };

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

  const handleNavClick = (event) => {
    event.preventDefault();
    const dayOffset =
      event.target.id === "nav-besok-hari"
        ? 1
        : event.target.id === "nav-lusa"
        ? 2
        : 0;
    fetchWeatherData(dayOffset);
  };

  // Event listeners for navigation clicks
  document
    .getElementById("nav-hari-ini")
    .addEventListener("click", handleNavClick);
  document
    .getElementById("nav-besok-hari")
    .addEventListener("click", handleNavClick);
  document.getElementById("nav-lusa").addEventListener("click", handleNavClick);

  // Fetch weather data for "Hari Ini"
  fetchWeatherData();
  updateDateTime();

  // Update datetime every second
  setInterval(updateDateTime, 1000);
});

// FETCHING DATA GEMPA TERKINI
document.addEventListener("DOMContentLoaded", function () {
  const fetchEarthquakeData = () => {
    const earthquakeUrl = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml";

    fetch(earthquakeUrl)
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "application/xml");

        const event = xmlDoc.getElementsByTagName("gempa")[0];

        const date = event.getElementsByTagName("Tanggal")[0].textContent;
        const time = event.getElementsByTagName("Jam")[0].textContent;
        const datetime = `${date} ${time}`;
        const magnitude =
          event.getElementsByTagName("Magnitude")[0].textContent;
        const depth = event.getElementsByTagName("Kedalaman")[0].textContent;
        const latitude = event.getElementsByTagName("Lintang")[0].textContent;
        const longitude = event.getElementsByTagName("Bujur")[0].textContent;
        const region = event.getElementsByTagName("Wilayah")[0].textContent;
        const potentialTsunami =
          event.getElementsByTagName("Potensi")[0].textContent;
        const felt = event.getElementsByTagName("Dirasakan")[0].textContent;
        const shakemapUrl =
          "https://data.bmkg.go.id/DataMKG/TEWS/" +
          event.getElementsByTagName("Shakemap")[0].textContent;

        const earthquakeInfoHtml = `
                  <img src="${shakemapUrl}" alt="Shakemap">
                  <div class="info">
                    <p><strong>Tanggal:</strong>${datetime}</p>
                    <p><strong>Magnitude: </strong>${magnitude}</p>
                    <p><strong>Kedalaman:</strong> ${depth}</p>
                    <p><strong>Koordinat:</strong> ${latitude}, ${longitude}</p>
                    <p><strong>Wilayah:</strong> ${region}</p>
                    <p><strong>Potensi Tsunami:</strong> ${potentialTsunami}</p>
                    <p><strong>Dirasakan:</strong> ${felt}</p>
                  </div>
              `;

        document.getElementById("earthquake-data").innerHTML =
          earthquakeInfoHtml;
      })
      .catch((error) => {
        document.getElementById("earthquake-data").innerHTML =
          "Gagal mengambil data gempa.";
        console.error("Error fetching earthquake data:", error);
      });
  };

  fetchEarthquakeData();
});

// FETCHING DATA GEMPA DIRASAKAN
document.addEventListener("DOMContentLoaded", () => {
  const url = "https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.xml";
  const tableBody = document.querySelector("#gempaTable tbody");

  axios
    .get(url)
    .then((response) => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(response.data, "application/xml");
      const gempaItems = xml.querySelectorAll("gempa");

      gempaItems.forEach((item, index) => {
        const waktu =
          item.querySelector("Tanggal").textContent +
          " " +
          item.querySelector("Jam").textContent;
        const lintang = item.querySelector("Lintang").textContent;
        const bujur = item.querySelector("Bujur").textContent;
        const magnitudo = item.querySelector("Magnitude").textContent;
        const kedalaman = item.querySelector("Kedalaman").textContent;
        const dirasakan = item.querySelector("Dirasakan").textContent;

        const dirasakanList = dirasakan
          .split(",")
          .map((entry) => `<li >${entry.trim()}</li>`)
          .join("");

        const row = `
                  <tr >
                      <td>${index + 1}</td>
                      <td>${waktu}</td>
                      <td>${lintang}</td>
                      <td>${bujur}</td>
                      <td>${magnitudo}</td>
                      <td>${kedalaman}</td>
                      <td>${dirasakanList}</td>
                  </tr>
              `;

        tableBody.insertAdjacentHTML("beforeend", row);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
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

// CUACA KABUPATEN
document.addEventListener("click", function (e) {
  const dropdowns = document.querySelectorAll(".dropdown");
  dropdowns.forEach((dropdown) => {
    const menu = dropdown.querySelector(".dropdown-menu");
    if (dropdown.contains(e.target)) {
      menu.style.display = "block";
    } else {
      menu.style.display = "none";
    }
  });
});

// CUACA KABUPATEN
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

// Mapping kabupaten to their specific `adm2` codes
const kabupatenMap = {
  Pasangkayu: "76.01",
  Mamuju: "76.02",
  Mamasa: "76.03",
  "Polewali Mandar": "76.04",
  Majene: "76.05",
  "Mamuju Tengah": "76.06",
  // Add more kabupaten with their respective adm2 codes here
};

document.addEventListener("DOMContentLoaded", function () {
  const weatherTableBody = document
    .getElementById("weather-table")
    .querySelector("tbody");

  // Select the span element for the date
  const selectedDateSpan = document.getElementById("selected-date"); // Added: Get the span element by its ID

  const navDays = document.getElementById("nav-days");

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

      // Update the selected date span
      updateSelectedDate(todayString); // Added: Update the span with today's date
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

        // Update the selected date span
        updateSelectedDate(dayString); // Added: Update the span with the selected date
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

  // Function to update the selected date span
  function updateSelectedDate(dateString) {
    // Added: Function to update the span content
    selectedDateSpan.textContent = dateString;
  }

  function fetchWeatherData(dayOffset) {
    fetch(`https://cuaca.bmkg.go.id/api/df/v1/forecast/adm?adm1=76`)
      .then((response) => response.json())
      .then((data) => {
        const areas = data.data;
        weatherTableBody.innerHTML = ""; // Clear the table

        areas.forEach((area) => {
          const row = document.createElement("tr");

          // Kabupaten with a clickable link
          const nameCell = document.createElement("td");
          const kabupatenName = area.lokasi.kotkab;
          const adm2Code = kabupatenMap[kabupatenName];
          if (adm2Code) {
            const link = document.createElement("a");
            link.href = `kecamatan.html?adm2=${adm2Code}`;
            link.textContent = kabupatenName;
            nameCell.appendChild(link);
          } else {
            nameCell.textContent = kabupatenName;
          }
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

// POPUP
document.addEventListener("DOMContentLoaded", function () {
  // Get all images with the class 'popup-img'
  const images = document.querySelectorAll(".popup-img");
  const popup = document.getElementById("img-popup");
  const popupImage = document.getElementById("popup-image");
  const closeBtn = document.querySelector(".close-popup");

  // Loop through each image to add the click event
  images.forEach((img) => {
    img.onclick = function () {
      popup.style.display = "block";
      popupImage.src = this.src;
    };
  });

  // When the close button is clicked, close the popup
  closeBtn.onclick = function () {
    popup.style.display = "none";
  };

  // When the user clicks outside of the popup image, close the popup
  popup.onclick = function (event) {
    if (event.target === popup) {
      popup.style.display = "none";
    }
  };
});

// NAV HIDER
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("navbar-toggle");
  const navbarMenu = document.getElementById("navbar-menu");

  // Add a click event listener for toggling the navbar menu
  toggleButton.addEventListener("click", function () {
    navbarMenu.classList.toggle("show");
  });
});
