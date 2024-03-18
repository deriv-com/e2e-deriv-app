/**
 * Used to generate Epoch.
 * @example generateEpoch()
 * @returns {EpochTimeStamp}
 */
export function generateEpoch() {
  return Math.floor(new Date().getTime() / 100000)
}
