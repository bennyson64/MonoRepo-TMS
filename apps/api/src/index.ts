import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { v4 as uuid } from 'uuid'
const app = new Hono()

// In-memory database
type Task = {
  id: string
  title: string
  description: string
}
let items: Task[] = []

app.use('*', cors())

app.get('/', (c) => {
  return c.json(items)
})

app.post('/', async (c) => {
  const body = await c.req.json<{ title: string; description: string }>()
  const newTask: Task = {
    id: uuid(),
    title: body.title,
    description: body.description
  }
  items.push(newTask)
  return c.json({ success: true, task:newTask})
})

app.put('/:id',async(c) => {
  const id = c.req.param("id")
  const body = await c.req.json<{title: string; description: string}>()
  items = items.map((item) => (item.id === id ? { ...item, ...body } : item))
  return c.json({ success: true })
})

app.delete("/:id", async (c) => {
  const id = c.req.param("id")
  items = items.filter((item) => item.id !== id)
  return c.json({ success: true })
})

serve({
  fetch: app.fetch,
  port: 3000
})

console.log('Backend running on http://localhost:3000')
