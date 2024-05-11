import axios from "axios"
import { NextResponse } from "next/server"

export const GET = async () => {
    try {
        const response = await axios.get(process.env.NEXT_API_URL + '/contents')
        const data = await response.data
        return NextResponse.json(data, { status: 200 });
    } catch(e) {
        return NextResponse.json({
            message: "Internal Server Error"
        }, { status: 500 });
    }
}