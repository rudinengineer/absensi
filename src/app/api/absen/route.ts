import axios from "axios"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    const body = await req.json()
    const response = await axios.post(process.env.NEXT_API_URL + '/absen', {
        user_id: body.user_id,
        latitude: body.latitude,
        longitude: body.longitude,
        picture: body.picture
    })
    const data = await response.data
    return NextResponse.json(data, { status: 200 })
}

export const PUT = async (req: NextRequest) => {
    const body = await req.json()
    const response = await axios.post(process.env.NEXT_API_URL + '/absen/keluar', {
        user_id: body.user_id,
        kegiatan: body.kegiatan
    })
    const data = await response.data
    return NextResponse.json(data, { status: 200 })
}