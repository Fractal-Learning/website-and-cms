import * as migration_20250726_113914_initial from './20250726_113914_initial';
import * as migration_20250822_224227 from './20250822_224227';

export const migrations = [
  {
    up: migration_20250726_113914_initial.up,
    down: migration_20250726_113914_initial.down,
    name: '20250726_113914_initial',
  },
  {
    up: migration_20250822_224227.up,
    down: migration_20250822_224227.down,
    name: '20250822_224227'
  },
];
