"use client"

import type React from "react"

import { useState, useRef } from "react"
import { UploadIcon } from "lucide-react"

export default function FileUpload() {
    const [dragActive, setDragActive] = useState(false)
    const [fileName, setFileName] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        const files = e.dataTransfer.files
        if (files && files[0]) {
            handleFiles(files)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files[0]) {
            handleFiles(files)
        }
    }

    const handleFiles = (files: FileList) => {
        setFileName(files[0].name)
        // Handle your file here
    }

    return (
        <div className="w-full max-w-xl">
            <div
                className={`
          relative w-full aspect-square max-w-xl
          before:absolute before:inset-0
          before:bg-[length:20px_20px]
          before:bg-[radial-gradient(circle_at_center,transparent_19%,white_20%)]
          before:[mask-image:repeating-linear-gradient(0deg,white_0px,white_20px,transparent_20px,transparent_40px),repeating-linear-gradient(90deg,white_0px,white_20px,transparent_20px,transparent_40px)]
        `}
            >
                <label
                    htmlFor="file-upload"
                    className={`
            relative h-full w-full flex flex-col items-center justify-center p-6 bg-white cursor-pointer
            ${dragActive ? "bg-gray-50" : ""}
          `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input id="file-upload" ref={inputRef} type="file" className="hidden" onChange={handleChange} accept=".pdf" />
                    <UploadIcon className="h-12 w-12 text-black mb-4" />
                    <div className="space-y-2 text-center">
                        <p className="font-mono">
                            <span className="font-semibold text-black">Click to upload</span>
                            <span className="text-black"> or drag and drop</span>
                        </p>
                        <p className="text-sm text-black font-mono">{fileName || "PDF file up to 10MB"}</p>
                    </div>
                </label>
            </div>
        </div>
    )
}

