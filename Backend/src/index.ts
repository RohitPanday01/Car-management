import { Hono } from 'hono'
import { userrouter } from './routes/user';
import { productrouter } from './routes/products';
import { cors } from 'hono/cors';


const app = new Hono();

app.use('/*', cors())
app.route('/api/v1/user',userrouter)
app.route('/api/v1/products', productrouter)

export default app