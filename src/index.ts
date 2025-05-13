import App from './pages/app';
import './styles/main.scss';
import { Resthandler } from './service/rest/resthandler';

const restHandler = new Resthandler();
const app = new App(restHandler);
app.render();
