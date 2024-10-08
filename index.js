import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { initApp } from './src/initApp.js'
import { deleteExpiredCoupons, deletePendingUsers, handleDeletedUsers } from './src/utils/cronJobs.js'



const app = express()

deletePendingUsers()
handleDeletedUsers()
deleteExpiredCoupons()


dotenv.config({ path: path.resolve('./config/.env') })
initApp(app, express)




