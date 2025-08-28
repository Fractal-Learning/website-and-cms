import * as migration_20250828_032249 from './20250828_032249'

export const migrations = [
  {
    up: migration_20250828_032249.up,
    down: migration_20250828_032249.down,
    name: '20250828_032249',
  },
]
