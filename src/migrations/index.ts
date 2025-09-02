import * as migration_20250902_173328_initial from './20250902_173328_initial';

export const migrations = [
  {
    up: migration_20250902_173328_initial.up,
    down: migration_20250902_173328_initial.down,
    name: '20250902_173328_initial'
  },
];
