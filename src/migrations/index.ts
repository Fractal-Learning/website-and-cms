import * as migration_20250726_113914_initial from './20250726_113914_initial';
import * as migration_20250902_031050 from './20250902_031050';
import * as migration_20250828_160000_create_state_standards from './20250828_160000_create_state_standards';

export const migrations = [
  {
    up: migration_20250726_113914_initial.up,
    down: migration_20250726_113914_initial.down,
    name: '20250726_113914_initial',
  },
  {
    up: migration_20250902_031050.up,
    down: migration_20250902_031050.down,
    name: '20250902_031050'
  },
  {
    up: migration_20250828_160000_create_state_standards.up,
    down: migration_20250828_160000_create_state_standards.down,
    name: '20250828_160000_create_state_standards'
  },
];
