import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { initApp } from './src/initApp.js'
import { deleteExpiredCoupons, deletePendingUsers, handleDeletedUsers } from './src/utils/cronJobs.js'
import { webhook } from './src/utils/webhook.js'

const app = express()

deletePendingUsers()
handleDeletedUsers()
deleteExpiredCoupons()


dotenv.config({ path: path.resolve('./config/.env') })
const port = process.env.PORT || 3000;
initApp(app, express)
app.post('/webhook',
    express.raw({ type: 'application/json' }),
    webhook
  );
  app.listen(port, () => console.log('server is running on port', port))

