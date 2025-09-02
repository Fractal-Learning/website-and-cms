# Scripts

This directory contains utility scripts for the Payload CMS project.

## seed-states.ts

Seeds all 50 US states into the `states` collection.

### Usage

```bash
# Run the states seeding script
pnpm seed:states
```

### Features

- Creates all 50 US states with proper abbreviations and full names
- Checks if states already exist to prevent duplicates
- Provides detailed logging of the seeding process
- Gracefully handles errors and provides summary statistics

### Data

The script includes all 50 US states with their official:

- 2-letter postal abbreviations (e.g., "CA", "NY", "TX")
- Full state names (e.g., "California", "New York", "Texas")

### Safety

- The script will not create duplicate states if they already exist
- Uses proper error handling and logging
- Exits cleanly after completion or on error
