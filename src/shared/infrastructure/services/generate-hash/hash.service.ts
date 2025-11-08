import { Injectable } from "@nestjs/common"
import { createHash } from "crypto"

@Injectable()
export class HashService {
  createSHA256Hash(inputString: string): string {
    const hash = createHash("sha256")
    hash.update(inputString)
    return hash.digest("hex")
  }
}
