'use client'

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog'
import { UploadDropzone } from '@/lib/uploadthing'

export default function UploadFile() {
  return (
    <UploadDropzone
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log('Files: ', res)
        alert('Upload Completed')
      }}
      onUploadError={(error: Error) => {
        // Do something with the error.
        alert(`ERROR! ${error.message}`)
      }}
      appearance={{
        button: 'bg-theme-600 font-heading font-bold',
        container: 'w-full',
      }}
    />
  )
}
