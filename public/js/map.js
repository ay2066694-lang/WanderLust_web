const mapElement = document.getElementById("map");

const coordinates = JSON.parse(mapElement.dataset.coordinates);

const map = L.map("map").setView(
    [coordinates[1], coordinates[0]],
    12
);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);

L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup("<b>WanderLust</b>")
    .openPopup();