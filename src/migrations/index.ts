import * as migration_20250726_113914_initial from './20250726_113914_initial'
import * as migration_20250902_031050 from './20250902_031050'

export const migrations = [
  {
    up: migration_20250726_113914_initial.up,
    down: migration_20250726_113914_initial.down,
    name: '20250726_113914_initial',
  },
  {
    up: migration_20250902_031050.up,
    down: migration_20250902_031050.down,
    name: '20250902_031050',
  },
]
