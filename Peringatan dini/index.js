var url = "https://arsip.nyphp.com/data/warning.json";

function getJSON(urls) {
  fetch(urls)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var api_data = JSON.parse(JSON.stringify(data));

      if (api_data.status === true) {
        var warning1 = api_data.files[0]; // Gambar Peta
        var warning2 = api_data.files[1]; // Gambar Tulisan

        document.getElementById("warning-content").innerHTML = `
                    <p>${new Date().toLocaleDateString("en-GB")}</p>
                    <div class="warning-details">
                        <img id="warning-image" src="https://arsip.nyphp.com/data/${warning1}" alt="Gambar Peta" class="warning-img">
                        <div class="warning-text">
                            <p>${api_data.text}</p>
                        </div>
                    </div>
                `;

        // Add event listener for the image to trigger the popup
        document.getElementById("warning-image").onclick = function () {
          openPopup(this.src);
        };
      } else {
        document.getElementById("warning-content").innerHTML = `
                    <p>Status warning: ${api_data.status
                      .toString()
                      .toUpperCase()}</p>
                    <p>NIHIL</p>
                `;
      }
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
      document.getElementById("warning-content").innerHTML =
        "<p>Error fetching data</p>";
    });
}

// Function to open the popup with the image
function openPopup(imgSrc) {
  var popup = document.getElementById("img-popup");
  var popupImage = document.getElementById("popup-image");
  popup.style.display = "block";
  popupImage.src = imgSrc;
}

// Close the popup when clicking outside the image or on the close button
document.getElementsByClassName("close-popup")[0].onclick = function () {
  document.getElementById("img-popup").style.display = "none";
};

// Close popup if the user clicks outside the image
window.onclick = function (event) {
  var popup = document.getElementById("img-popup");
  if (event.target === popup) {
    popup.style.display = "none";
  }
};

// Fetch the data on page load
getJSON(url);
