// Importación de estilos principales del proyecto
import "../sass/style.scss";
import { App } from "./app/app";
import { Favorite } from "./ui/favorites";
// Instancia de la aplicación principal
const app = new App();
app.start();
app.loadMoreCats();
app.initEvents();
app.syncViews();