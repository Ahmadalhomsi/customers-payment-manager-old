// app/loading.js
'use client'

import { HashLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <HashLoader color="#f26000" size={50} />
    </div>
  )
}