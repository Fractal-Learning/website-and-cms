import * as migration_20250726_113914_initial from './20250726_113914_initial'
import * as migration_20250822_224227 from './20250822_224227'
import * as migration_20250826_031259 from './20250826_031259'
import * as migration_20250826_031858 from './20250826_031858'
import * as migration_20250826_032227 from './20250826_032227'
import * as migration_20250826_032228_rename_abbreviation_to_tag_and_remove_code from './20250826_032228_rename_abbreviation_to_tag_and_remove_code'

export const migrations = [
  {
    up: migration_20250726_113914_initial.up,
    down: migration_20250726_113914_initial.down,
    name: '20250726_113914_initial',
  },
  {
    up: migration_20250822_224227.up,
    down: migration_20250822_224227.down,
    name: '20250822_224227',
  },
  {
    up: migration_20250826_031259.up,
    down: migration_20250826_031259.down,
    name: '20250826_031259',
  },
  {
    up: migration_20250826_031858.up,
    down: migration_20250826_031858.down,
    name: '20250826_031858',
  },
  {
    up: migration_20250826_032227.up,
    down: migration_20250826_032227.down,
    name: '20250826_032227',
  },
  {
    up: migration_20250826_032228_rename_abbreviation_to_tag_and_remove_code.up,
    down: migration_20250826_032228_rename_abbreviation_to_tag_and_remove_code.down,
    name: '20250826_032228_rename_abbreviation_to_tag_and_remove_code',
  },
]
