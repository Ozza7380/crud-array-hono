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

//read all
app.get(`/api/items`, (c) => {
    return c.json({error: false, data: items})
})

//read one
app.get(`/api/items/:id`, (c) => {
    const id = Number(c.req.param(`id`))
    const item = items.find((i) => i.id === id)

    if (!item) {
        return c.json({ error: true, massage: `item tidak ditemukan` }, 404)
    }

    return c.json({ error:false, data: item })
})

//menambahkan data (create) -post
app.post(`/api/items`, async (c) => {
    const body = await c.req.json()

    //validasi sederhana
    if (!body.nama) {
        return c.json({error: true, massage: `Field nama wajib diisi`}, 404)
    }

    const itemBaru = {
        id: nextId++,
        nama: body.nama,
        status: body.status || `belum`
    }

    items.push(itemBaru)

    return c.json({ error: false, data: itemBaru }, 201)
})

//mengubah data (Update)-put
app.put(`/api/items/:id`, async (c) => {
    const id = Number(c.req.param(`id`))
    const body = await c.req.json()

    const index = items.findIndex((i) => i.id === id) //findindex() cari posisi item di array

    if (index === -1) {
        return c.json({ error: true, massage: `ite tidak ditemukan` }, 404)
    }

    //update hanya field yang dikirim
    if (body.nama !== undefined) items[index].nama = body.nama
    if (body.status !== undefined) items[index].status = body.status

    return c.json({ error: false, data: items[index] })
})

//menghapus data(delete)-delete
app.delete(`api/items/:id`, (c) => {
    const id = Number(c.req.param(`id`))
    const index = items.findIndex((i) => i.id === id)

    if (index === -1) {
        returnc.json({error: true, massage: `item tidak ditemukan`}, 404)
    }

    const deleted = items.splice(index, 1)[0]

    return c.json({error: false, massage: `item "${deleted.nama}" berhasil dihapus`})
})

serve({ fetch: app.fetch, port:3000  })
console.log(`API berjalan di http://localhost:3000`)