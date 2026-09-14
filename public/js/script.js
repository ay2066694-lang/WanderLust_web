(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();


const searchInput = document.querySelector(".search-input");
const searchSuggestions = document.getElementById("searchSuggestions");

if (searchInput && searchSuggestions) {

    let timeout;
    searchInput.addEventListener("input", () => {
        clearTimeout(timeout);
        const searchText = searchInput.value.trim();

        if (searchText === "") {
            searchSuggestions.innerHTML = "";
            searchSuggestions.style.display = "none";
            return;
        }

        timeout = setTimeout(async () => {
            try {
                const response = await fetch(
                    `/listings/suggestions?search=${encodeURIComponent(searchText)}`
                );

                const suggestions = await response.json();
                searchSuggestions.innerHTML = "";
                if (suggestions.length === 0) {
                    searchSuggestions.style.display = "none";
                    return;
                }

                suggestions.forEach(listing => {
                    const suggestion = document.createElement("a");

                    suggestion.href = `/listings/${listing._id}`;
                    suggestion.className = "search-suggestion";

                    suggestion.innerHTML = `
                        <div>
                            🏠 ${listing.title}
                        </div>
                        <small>
                            📍 ${listing.location}, ${listing.country}
                        </small>
                    `;

                    searchSuggestions.appendChild(suggestion);
                });

                searchSuggestions.style.display = "block";
            } catch (err) {
                console.error("Search suggestion error:", err);
            }

        }, 300);
    });

    document.addEventListener("click", (event) => {
        if (!searchInput.contains(event.target) &&
            !searchSuggestions.contains(event.target)) {

            searchSuggestions.innerHTML = "";
            searchSuggestions.style.display = "none";
        }
    });
}