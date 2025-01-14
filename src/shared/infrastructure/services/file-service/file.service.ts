import { Injectable, InternalServerErrorException } from "@nestjs/common"
import * as fs from "fs"

@Injectable()
export class FileService {
  public readFile(path: string): string {
    try {
      return fs.readFileSync(path, "utf8")
    } catch (error) {
      throw new InternalServerErrorException(`Failed to read file at path: ${path}`)
    }
  }
}
