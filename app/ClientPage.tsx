"use client"

import dynamic from "next/dynamic"

const MiruScalePage = dynamic(() => import("./MiruScalePage"), { ssr: false })

export default function ClientPage() {
  return <MiruScalePage />
}
