import { createHash } from 'crypto'

export function toHashed(str: string): string {
    // Sha256でハッシュ化する。
    const hash = createHash('sha256');
    hash.update(str);
    return hash.digest('hex')
}