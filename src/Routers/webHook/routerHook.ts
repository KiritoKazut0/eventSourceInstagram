import { Router } from "express";
import { registerHook } from "../../Controllers/WebHook";

const router = Router();

router.post('/', registerHook);

export default router;