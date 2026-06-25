import { Hono } from "hono";
import { serve } from "@hono/node-server";

// data array - penyimpanan sementara di memory
let items = [
    { id: 1, nama: "belajar Hono", status: "selesai" },
    { id: 2, nama: "belajar API", status: "belum"},
]

//counter untuk id otomatis
let nextId = 3

const app = new Hono()

//membaca data (read)
app.get(`/api/items`, (c) => {
    return c.json({eror: false, data: items})
})

serve({ fetch: app.fetch, port:3000  })
console.log(`API berjalan di http://localhost:3000`)