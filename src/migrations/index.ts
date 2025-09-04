import * as migration_20250904_152430_initial from './20250904_152430_initial';

export const migrations = [
  {
    up: migration_20250904_152430_initial.up,
    down: migration_20250904_152430_initial.down,
    name: '20250904_152430_initial'
  },
];
