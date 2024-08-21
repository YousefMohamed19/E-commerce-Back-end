import path from 'path'
import fs from 'fs'
export const deleteFile = (filepath)=>{
    let fullpath = path.resolve(filepath)
    fs.unlinkSync(fullpath)
}