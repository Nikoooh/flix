"use client"

import { useState, useEffect, useRef } from "react"

interface Props {
  kuvaus: string
}

const DescriptionModal: React.FC<Props> = ({ kuvaus }): JSX.Element => {
  const [showMore, setShowMore] = useState(false)
  const pRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const checkShowMore = () => {
      if (pRef.current) {
        const fullHeight = pRef.current.scrollHeight
        const lineHeight = parseFloat(getComputedStyle(pRef.current).lineHeight)
        const clampHeight = lineHeight * 6
        if (fullHeight > clampHeight) {
          setShowMore(true)
        }
      }
    }

    checkShowMore()
  }, [kuvaus])

  return (
    <div className="mt-2 mb-2">
      <p ref={pRef} className='h-1/3 text-ellipsis line-clamp-6'>
        {kuvaus}
      </p>    
      {showMore && (
        <p className="underline hover:text-blue-700 cursor-pointer text-right mt-2" onClick={() => {
            const modal = document.getElementById('descModal') as HTMLDialogElement | null
            if (modal) modal.showModal()
          }}>
          Lue lisää
        </p>
      )}

      <dialog id="descModal" className="modal">
        <div className="modal-box text-white bg-gray-600 max-w-3xl p-8">
          <h3 className="font-bold text-3xl">Kuvaus</h3>
          <p className="py-4">    
            {kuvaus}
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-gray-700 text-white border-none">Sulje</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default DescriptionModal