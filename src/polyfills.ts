import { Buffer } from 'buffer'
import process from 'process'

type GlobalWithPolyfills = typeof globalThis & {
  Buffer?: typeof Buffer
  process?: typeof process
}

const globalScope = globalThis as GlobalWithPolyfills

if (!globalScope.Buffer) {
  globalScope.Buffer = Buffer
}

if (!globalScope.process) {
  globalScope.process = process
}

if (!globalScope.process.env) {
  globalScope.process.env = {}
}
