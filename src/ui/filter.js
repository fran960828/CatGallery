export class Filter {
  constructor(root, catApi, onFilterChange) {
    this.root = root;
    this.catApi = catApi;
    this.onFilterChange = onFilterChange; // callback
    this.select = document.createElement("select");
  }

  async init() {
    const breeds = await this.catApi.fetchBreeds();

    // Opción por defecto
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Todas las razas";
    this.select.classList.add("filter");
    this.select.appendChild(defaultOption);

    // Añadimos cada raza
    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      this.select.appendChild(option);
    });

    // Evento de cambio
    this.select.addEventListener("change", (e) => {
      const breedId = e.target.value || null;
      this.onFilterChange(breedId);
    });

    // Agregamos el select al DOM
    this.root.appendChild(this.select);
  }
}
