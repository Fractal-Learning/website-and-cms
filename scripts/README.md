# Scripts

This directory contains utility scripts for the Payload CMS project.

## Database Seeding

The seeding system is integrated into the main Payload CMS seeding system in `src/endpoints/seed/`.

### Usage

**Method 1: Using npm script (recommended)**

```bash
# Seeds all data including states and common core codes
pnpm seed
```

**Method 2: Using Payload CLI directly**

```bash
# Seeds all data including states and common core codes
pnpm payload seed
```

**Method 3: Via admin panel**
Navigate to the admin panel at `http://localhost:3000/admin` and use the seed endpoint via the admin interface.

### What gets seeded

The seed command creates:

- **All 50 US States** with proper abbreviations and full names
- **Common Core Codes** (RL.6.1-RL.6.10, RL.7.1-RL.7.10, RL.8.1-RL.8.10)
- **Grades K-12** with proper level codes and names
- Demo content (posts, pages, media, etc.)
- Categories
- Forms
- Headers and footers

### Data Included

#### States

All 50 US states with their official:

- 2-letter postal abbreviations (e.g., "CA", "NY", "TX")
- Full state names (e.g., "California", "New York", "Texas")

#### Common Core Codes

30 Reading Literature codes across grades 6-8:

- **Grade 6**: RL.6.1 through RL.6.10
- **Grade 7**: RL.7.1 through RL.7.10
- **Grade 8**: RL.8.1 through RL.8.10

#### Grades

All grade levels from Kindergarten through 12th grade:

- **K** - Kindergarten
- **1-12** - 1st Grade through 12th Grade
- Each grade includes level code, full name, and sort order

### File Structure

The seeding system is organized in:

- `src/endpoints/seed/index.ts` - Main seeding orchestration
- `src/endpoints/seed/states.ts` - States data definition
- `src/endpoints/seed/common-core-codes.ts` - Common Core codes data definition
- `src/endpoints/seed/grades.ts` - Grades data definition
- `src/endpoints/seed/` - Other demo content (posts, images, etc.)

### Safety

- The seeding system clears existing data before seeding (use with caution)
- Designed for development and initial setup
- All curriculum data will be created along with demo content
