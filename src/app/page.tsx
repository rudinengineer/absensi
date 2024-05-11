"use client"
import React from "react"
import { CameraIcon, CheckIcon } from '@heroicons/react/24/outline'
import swal from "sweetalert"
import axios from "axios"

export default function Home() {
  const [users, setUsers] = React.useState<Array<object>>()
  const [thumbnail, setThumbnail] = React.useState<string|null>(null)
  const [quote, setQuote] = React.useState<string|null>(null)
  const [closedTime, setClosedTime] = React.useState<boolean>(false)
  const [userId, setUserId] = React.useState<any>()
  const [kegiatan, setKegiatan] = React.useState<string>()
  const [latitude, setLatitude] = React.useState<any>()
  const [longitude, setLongitude] = React.useState<any>()
  const [showWebcamCard, setWebcamCard] = React.useState<boolean>(false)
  const [showAbsenCard, setAbsenCard] = React.useState<boolean>(false)
  const [showCaptureBtn, setCaptureBtn] = React.useState<boolean>(false)
  const [showAbsenBtn, setAbsenBtn] = React.useState<boolean>(true)
  const [showAbsenMasukSuccess, setAbsenMasukSuccess] = React.useState<boolean>(false)
  const [captureStream, setCaptureStream] = React.useState<boolean>(true)
  const [captureResult, setCaptureResult] = React.useState<boolean>(false)
  const [captureResultSrc, setCaptureResultSrc] = React.useState<any>(true)

  const handleAbsenMasuk = () => {
    let userLocation = navigator.geolocation

        if(userLocation) {
            userLocation.getCurrentPosition(function(data) {
                setLatitude(data.coords.latitude)
                setLongitude(data.coords.longitude)
            }, function() {
                console.log('error')
            })
        } else {
            swal({
              title: 'Error',
              icon: 'error',
              text: 'Browser anda tidak mendukung',
              timer: 2000
            })
        }

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia

        if (navigator.getUserMedia) {
            navigator.getUserMedia({ video: true }, async function handleVideo(stream: any) {
              setWebcamCard(true)
              setCaptureBtn(true)
              const video = window.document.querySelector("#video-webcam")
              video.srcObject = stream
          }, function videoError(e: any) {
              swal({
                title: 'Error',
                icon: 'error',
                text: 'Izinkan menggunakan webcam untuk absen!',
                timer: 2000
              })
              console.log(e)
          })
        }
  }

  const handleAbsenKeluar = () => {
    if ( userId ) {
      axios.put('/api/absen', {
        user_id: userId,
        kegiatan: kegiatan
      }).then((response) => {
        setAbsenCard(false)
        if ( response.data.error ) {
          swal({
            icon: 'error',
            title: 'Error',
            text: response.data.error,
            timer: 2000
          })
        }
        if ( response.data.message ) {
          setAbsenBtn(false)
          setClosedTime(false)
          setAbsenMasukSuccess(true)
        }
      })
    } else {
      setAbsenCard(false)
      swal({
        icon: 'error',
        title: 'Error',
        text: 'Harap memilih nama',
        timer: 2000
      })
    }
  }

  const hanldeCapture = () => {
    if ( userId && longitude && latitude ) {
      const video: any = window.document.querySelector('#video-webcam')
      let context

      const width = video.offsetWidth, height = video.offsetHeight

      let canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      context = canvas.getContext('2d')
      context?.drawImage(video, 0, 0, width, height)

      setCaptureStream(false)
      setCaptureResultSrc(canvas.toDataURL('image/png'))
      console.log(canvas.toDataURL('image/png'))
      setCaptureResult(true)
      setCaptureBtn(false)

      const data = {
          user_id: userId,
          picture: canvas.toDataURL('image/png'),
          latitude: latitude,
          longitude: longitude
      }

      axios.post('/api/absen', data, {
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
          }
      }).then((response) => {
        setWebcamCard(false)
        if ( response.data?.error ) {
          swal({
            icon: 'error',
            title: 'Error',
            text: response.data?.error,
            timer: 2000
          }).then(() => {
              window.location.reload()
          })
        }
        if ( response.data?.message ) {
          setAbsenBtn(false)
          setAbsenMasukSuccess(true)
        }
      })
    }
  }

  React.useEffect(() => {
    axios.get('/api/contents').then((response) => {
      if ( response.data ) {
        setUsers(response.data.users)
        setThumbnail(response.data.thumbnail)
        setQuote(response.data.quote)
        setClosedTime(response.data.closed_time)
      }
    })
  }, [])

  return (
    <div className="w-full h-screen bg-slate-200 overflow-hidden flex justify-center items-center p-4">
        <div className="w-full sm:w-[45%] bg-light p-8 rounded-xl shadow-xl">
            <div className="flex justify-center">
                {
                  thumbnail ? (
                    <img src={thumbnail ?? ""} alt="" className="h-[250px] aspect-square rounded-lg object-cover object-center" />
                  ) : (
                    <div className="aspect-square h-[250px] rounded-lg flex justify-center items-center bg-slate-400 animate-pulse"></div>
                  )
                }
            </div>
            <div className="mt-2 w-full flex justify-center">
              {
                quote ? (
                  <q className="text-center font-medium">{ quote }</q>
                ) : (
                  <h1>Loading...</h1>
                )
              }
            </div>
            <div className="mt-4">
                <select name="name" id="name" className="user-id outline-none w-full px-4 py-3 rounded-md border-[1px] border-slate-300" defaultValue={"default"} onChange={(e) => {setUserId(e.target.value)}}>
                    <option value="default" disabled>Nama Anak Magang</option>
                    {
                      users?.map((value: any, index) => (
                        <option key={index} value={value.id}>{ value.username }</option>
                      ))
                    }
                </select>
            </div>
            <div className="mt-3">
                {
                  showAbsenBtn && (
                    <button className="absen-btn w-full py-2.5 border-[1px] border-primary bg-primary font-bold text-light rounded-md text-xl bg-opacity-90 transition ease-in-out hover:bg-opacity-100" onClick={handleAbsenMasuk}>Absen Masuk</button>
                  )
                }
                {
                  showAbsenMasukSuccess && (
                    <h1 className="absen-success w-full py-2.5 font-medium text-green-500 rounded-md text-xl bg-opacity-90 transition ease-in-out border-[1px] border-green-500 flex gap-2 justify-center items-center">
                      <span>Absen Berhasil</span>
                      <CheckIcon className="w-8 h-8" />
                  </h1>
                  )
                }
                {
                  closedTime && (
                    <button className="mt-2 w-full py-2.5 border-[1px] border-slate-500 bg-slate-500 font-bold text-light rounded-md text-xl bg-opacity-90 transition ease-in-out hover:bg-opacity-100" onClick={() => {setAbsenCard(state => !state)}}>Absen Keluar</button>
                  )
                }
            </div>

            {/* Webcam */}
            <div className={`${showWebcamCard ? 'flex' : 'hidden'} w-full h-screen bg-dark bg-opacity-40 fixed top-0 left-0 justify-center items-center`}>
              <div className="w-full sm:w-1/3 p-8 bg-light rounded-xl shadow-md">
                  {
                    captureStream && (
                      <video autoPlay={true} id="video-webcam" className="w-full aspect-square object-cover object-center">
                          Browsermu tidak mendukung bro, upgrade donk!
                      </video>
                    )
                  }
                  {
                    captureResult && (
                      <img src={captureResultSrc} alt="" className="w-full aspect-square object-cover object-center" />
                    )
                  }
                  {
                    showCaptureBtn && (
                      <button className="w-full py-3 rounded-md bg-primary font-medium text-light mt-4 bg-opacity-90 transition ease-in-out hover:bg-opacity-100 flex gap-3 justify-center items-center" onClick={hanldeCapture}>
                        <CameraIcon className="w-7 h-7" />
                        <span>Ambil Foto</span>
                    </button>
                    )
                  }
              </div>
          </div>

          {/* Absen Keluar */}
          {
            showAbsenCard && (
              <div className={`w-full flex h-screen bg-dark bg-opacity-40 fixed top-0 left-0 justify-center items-center`}>
                <div className="w-full sm:w-1/3 p-8 bg-light rounded-xl shadow-md">
                  <textarea placeholder="Kegiatan Hari Ini" className="w-full outline-none p-4 rounded-md border-[1px] border-slate-300 transition ease-in-out focus:border-primary" rows={5} onChange={(e) => {setKegiatan(e.target.value)}}></textarea>
                  <button className="mt-4 w-full py-3 rounded-md bg-primary font-bold text-light" onClick={handleAbsenKeluar}>Kirim Kegiatan</button>
                </div>
              </div>
            )
          }

        </div>
    </div>
  )
}
