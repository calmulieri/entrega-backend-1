import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.send('Carritos funcionando');
});

export default router;