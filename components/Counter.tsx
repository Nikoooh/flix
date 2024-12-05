"use client"

import { updateCounter } from "@/lib/analytics"
import { useEffect, useState } from "react"

const Counter = ({page}: {page: string}) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true)
  })

  useEffect(() => {
    if (mounted) {
      updateCounter(page);
    }
  }, [mounted, page])
  return null
}

export default Counter