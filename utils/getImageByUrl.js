import { storage } from "@/appwrite"


const getImageIdByUrl = async (url) => {
  if (!url) return
  const filesResult = await storage.listFiles(process.env.NEXT_PUBLIC_TODOS_BUCKET_ID)
  const fileUrls = filesResult.files.map((file) => {
    const url = storage.getFilePreview(file.bucketId, file.$id)
    return url.href
  })
  const endUrlIndexString = url.lastIndexOf('/')
  const matchUrlIndex = fileUrls.findIndex(
    (fileUrl) => fileUrl.slice(0, endUrlIndexString) === url.slice(0, endUrlIndexString)
  )
  return filesResult.files[matchUrlIndex].$id
}

export default getImageIdByUrl