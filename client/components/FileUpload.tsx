"use client"

import { useState, useRef } from "react"
import { UploadIcon } from "lucide-react"
import { useMutation } from "@tanstack/react-query"

export default function FileUpload() {
    const [dragActive, setDragActive] = useState(false)
    const [fileName, setFileName] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploadError, setUploadError] = useState<string | null>(null)

    const { mutate: uploadFile, isPending } = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData()
            formData.append("pdf", file)
            
            // Hardcoded API endpoint
            const response = await fetch("http://localhost:3001/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || "Upload failed")
            }

            return response.json()
        },
        onSuccess: (data) => {
            console.log("Upload successful:", data)
            setUploadError(null)
            setFileName("")
        },
        onError: (error: Error) => {
            setUploadError(error.message)
        }
    })

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
        const file = files[0]
        if (!file) return

        // Client-side validation
        if (file.type !== "application/pdf") {
            setUploadError("Please upload a PDF file")
            return
        }

        if (file.size > 10 * 1024 * 1024) {
            setUploadError("File size exceeds 10MB limit")
            return
        }

        setFileName(file.name)
        uploadFile(file)
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
                        ${isPending ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input 
                        id="file-upload" 
                        ref={inputRef} 
                        type="file" 
                        className="hidden" 
                        onChange={handleChange} 
                        accept=".pdf"
                        disabled={isPending}
                    />
                    <UploadIcon className={`h-12 w-12 text-black mb-4 ${isPending ? "animate-pulse" : ""}`} />
                    <div className="space-y-2 text-center">
                        <p className="font-mono">
                            <span className="font-semibold text-black">Click to upload</span>
                            <span className="text-black"> or drag and drop</span>
                        </p>
                        <p className="text-sm text-black font-mono">
                            {isPending ? "Processing..." : (fileName || "PDF file up to 10MB")}
                        </p>
                        {uploadError && (
                            <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                        )}
                    </div>
                </label>
            </div>
        </div>
    )
}
