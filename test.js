import test from 'tape'
import { randomBytes } from 'node:crypto'
import { MapeoId } from './index.js'

test('create and parse id', (t) => {
  const mapeoId = new MapeoId(randomBytes(32))
  const timestampInput = Date.now() - 1000
  const id = mapeoId.createId(timestampInput)
  const { timestamp, machineId } = mapeoId.parseId(id)
  t.equal(timestamp, timestampInput, 'timestamp correctly decoded')
  t.equal(machineId, mapeoId.machineId, 'machine id correctly decoded')
  t.end()
})

test('getMachineId', (t) => {
  const deviceKey = randomBytes(32)
  const mapeoId = new MapeoId(deviceKey)

  t.equal(MapeoId.getMachineId(deviceKey), mapeoId.machineId)
  t.end()
})
