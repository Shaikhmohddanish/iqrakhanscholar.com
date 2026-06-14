import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/**
 * Upload a PDF buffer to Cloudinary as a private authenticated asset.
 * Returns the public_id - the raw URL is never exposed to clients.
 */
export async function uploadPdf(buffer: Buffer, slug: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        type: 'authenticated',
        public_id: `books/${slug}`,
        overwrite: true,
        tags: ['book', 'pdf'],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Upload failed'))
        resolve(result.public_id)
      },
    )
    uploadStream.end(buffer)
  })
}

/**
 * Upload an image buffer to Cloudinary as a public asset.
 * Returns the secure_url - stored directly in the DB and safe to send to clients.
 */
export async function uploadImage(buffer: Buffer, folder: 'products' | 'blog' | 'books'): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        type: 'upload',
        folder,
        unique_filename: true,
        overwrite: false,
        tags: ['image'],
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Upload failed'))
        resolve(result.secure_url)
      },
    )
    uploadStream.end(buffer)
  })
}

/**
 * Generate a short-lived signed URL for a private PDF asset.
 * Must only be called server-side - never serialise this URL to the client.
 */
export function signedPdfUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    resource_type: 'raw',
    type: 'authenticated',
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + 300, // 5-minute window
  })
}
