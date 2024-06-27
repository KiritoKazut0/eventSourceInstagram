import {Router} from "express"
import * as ctrlPublication from "../../Events/Event"
import { getAllPublications } from "../../Controllers/Publication.controller";
import { getReaccionsInitialForAll} from "../../Controllers/reaction";
import { TokenValidation } from "../../Middlewares/auth/authJwt";

const router = Router();
router.get('/',  ctrlPublication.event);

router.post('/',   ctrlPublication.addPublication);
router.get('/inicial',  getAllPublications);

//rutas de las reacciones
router.post('/reaction-initial', getReaccionsInitialForAll );
router.post('/reaction/add',ctrlPublication.addReactions );

//ruta para que se registren los webhooks


export default router;