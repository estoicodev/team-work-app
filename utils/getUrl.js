import { storage } from "@/appwrite"

const getUrl = (bucketId, fileId) => {
  const url = storage.getFileView(bucketId, fileId)
  return url.href
}

export default getUrl