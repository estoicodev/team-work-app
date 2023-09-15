import { storage } from '@/appwrite'
import { v4 as uuidv4 } from 'uuid'

const uploadImage = async (file) => {
  const fileResponse = await storage.createFile(
    process.env.NEXT_PUBLIC_TODOs_BUCKET_ID,
    uuidv4(),
    file
  )
  return fileResponse
}

export default uploadImage
