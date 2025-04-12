"use client"

import { useState } from "react"

interface FallbackImageProps {
  src: string
  alt: string
  fallbackSrc: string
  className?: string
}

export function FallbackImage({ src, alt, fallbackSrc, className = "" }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc)
      setHasError(true)
    }
  }

  return <img src={imgSrc || "/placeholder.svg"} alt={alt} className={className} onError={handleError} />
}
