import { storage } from "@/appwrite"

const getUrl = (bucketId, fileId) => {
  const url = storage.getFileView(bucketId, fileId)
  return url
}

export default getUrl