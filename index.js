// @ts-check

import b4a from 'b4a'
import sodium from 'sodium-universal'
import cenc from 'compact-encoding'

/** @typedef {Buffer | Uint8Array} DeviceKey */

/**
 * Generate and parse Mapeo IDs. A Mapeo ID is composed of:
 *
 * 1. 72-bits of random data
 * 2. A 64-bit machine ID
 * 3. A 48-bit timestamp (milliseconds since UNIX epoch)
 *
 */
export class MapeoId {
  #machineKey
  /**
   *
   * @param {DeviceKey} deviceKey 32-byte device identifier
   */
  constructor(deviceKey) {
    this.#machineKey = getMachineKey(deviceKey)
  }

  get machineId() {
    return b4a.toString(this.#machineKey, 'hex')
  }

  /**
   * Create a new Mapeo ID, optionally pass a timestamp
   *
   * @param {number} [timestamp]
   */
  createId(timestamp = Date.now()) {
    const state = cenc.state()
    state.buffer = b4a.allocUnsafe(23)
    sodium.randombytes_buf(state.buffer)
    state.start = 9
    cenc.fixed(8).encode(state, this.#machineKey)
    cenc.uint48.encode(state, timestamp)
    return b4a.toString(state.buffer, 'hex')
  }

  /**
   * Parse a Mapeo ID to get the timestamp and machine ID
   *
   * @param {string} id
   */
  parseId(id) {
    const state = cenc.state()
    state.start = 9
    state.buffer = b4a.from(id, 'hex')
    state.end = state.buffer.length
    const machineKey = cenc.fixed(8).decode(state)
    const timestamp = cenc.uint48.decode(state)
    return {
      machineId: b4a.toString(machineKey, 'hex'),
      timestamp,
    }
  }

  /**
   * Get the machine ID for a particular 32-byte device key (the device identity
   * public key)
   *
   * @param {DeviceKey} deviceKey 32-byte device identifier
   */
  static getMachineId(deviceKey) {
    const machineKey = getMachineKey(deviceKey)
    return b4a.toString(machineKey, 'hex')
  }
}

const MAPEO_ID = b4a.from('MAPEO_ID')

/**
 *
 * @param {DeviceKey} deviceKey 32-byte device identifier
 */
function getMachineKey(deviceKey) {
  const digest = b4a.allocUnsafe(32)
  sodium.crypto_generichash(digest, MAPEO_ID, deviceKey)
  return digest.subarray(0, 8)
}
