export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

export function hasCarry(a: number, b: number): boolean {
  const aStr = String(a)
  const bStr = String(b)
  const maxLen = Math.max(aStr.length, bStr.length)
  const aPadded = aStr.padStart(maxLen, '0')
  const bPadded = bStr.padStart(maxLen, '0')
  let carry = 0
  for (let i = maxLen - 1; i >= 0; i--) {
    const sum = Number(aPadded[i]) + Number(bPadded[i]) + carry
    if (sum >= 10) {
      carry = 1
      if (i > 0) return true
    } else {
      carry = 0
    }
  }
  return carry > 0
}

export function hasBorrow(a: number, b: number): boolean {
  const aStr = String(a)
  const bStr = String(b)
  const maxLen = Math.max(aStr.length, bStr.length)
  const aPadded = aStr.padStart(maxLen, '0')
  const bPadded = bStr.padStart(maxLen, '0')
  let borrow = 0
  for (let i = maxLen - 1; i >= 0; i--) {
    const diff = Number(aPadded[i]) - Number(bPadded[i]) - borrow
    if (diff < 0) {
      borrow = 1
      if (i > 0) return true
    } else {
      borrow = 0
    }
  }
  return false
}
