import express from 'express'
import { PORT } from './config/config.js'
import userRouter from './routes/user.router.js'
import postRouter from './routes/post.router.js'
import commentRouter from './routes/comment.router.js'
import categoryRouter from './routes/category.router.js'

const app = express()

app.use(express.json())

app.use('', userRouter)
app.use('', postRouter)
app.use('', commentRouter)
app.use('', categoryRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
