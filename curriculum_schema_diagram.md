# Curriculum Database Schema - UML Diagram

```mermaid
erDiagram
    %% Core Curriculum Tables
    subjects {
        integer id PK
        varchar name
        text description
        text tag
        numeric sort_order
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    grades {
        integer id PK
        varchar name
        text description
        numeric sort_order
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    standard_types {
        integer id PK
        varchar name
        varchar tag
        integer subject_id FK
        text description
        numeric sort_order
        boolean active
        text display_color
        timestamp created_at
        timestamp updated_at
    }

    concepts {
        integer id PK
        varchar name
        text description
        jsonb subjects
        jsonb common_core_standards
        numeric sort_order
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    states {
        integer id PK
        varchar state_abbreviation UK
        text state_name UK
        timestamp created_at
        timestamp updated_at
    }

    %% Common Core Standards Tables
    common_core_codes {
        integer id PK
        text code_name UK
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    common_core_state_standards {
        integer id PK
        jsonb statement
        integer subject_id FK
        integer grade_id FK
        integer standard_type_id FK
        integer code_id FK
        jsonb metadata
        boolean active
        text notes
        timestamp created_at
        timestamp updated_at
    }

    state_standards {
        integer id PK
        integer state_id FK
        integer common_core_state_standard_id FK
        text statement
        jsonb metadata
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    %% Learning Outcomes Tables
    learning_outcomes {
        integer id PK
        jsonb statement
        integer concept_id FK
        numeric sort
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    essential_questions {
        integer id PK
        varchar question
        integer learning_outcome_id FK
        numeric sort
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    skills {
        integer id PK
        varchar name
        integer concept_id FK
        jsonb big_idea
        numeric sort
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    skill_universal_questions {
        integer id PK
        varchar question
        integer skill_id FK
        numeric sort
        boolean active
        enum question_type
        text context
        timestamp created_at
        timestamp updated_at
    }

    concept_universal_questions {
        integer id PK
        varchar question
        integer concept_id FK
        numeric sort
        boolean active
        enum question_type
        text context
        timestamp created_at
        timestamp updated_at
    }

    %% Assessment Tables
    assessments {
        integer id PK
        varchar name
        text description
        integer learning_outcome_id FK
        jsonb questions
        jsonb rubric
        numeric time_limit
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    %% User Management
    users {
        integer id PK
        varchar email UK
        text password
        varchar first_name
        varchar last_name
        enum role
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    %% Relationships
    subjects ||--o{ standard_types : "has many"
    subjects ||--o{ concepts : "many-to-many"
    subjects ||--o{ learning_outcomes : "has many"
    subjects ||--o{ common_core_state_standards : "has many"

    grades ||--o{ learning_outcomes : "has many"
    grades ||--o{ common_core_state_standards : "has many"

    standard_types ||--o{ common_core_state_standards : "has many"

    concepts ||--o{ learning_outcomes : "has many"
    concepts ||--o{ common_core_state_standards : "many-to-many"

    common_core_codes ||--o{ common_core_state_standards : "referenced by"

    states ||--o{ state_standards : "has many"
    common_core_state_standards ||--o{ state_standards : "has many"

    learning_outcomes ||--o{ essential_questions : "has many"
    learning_outcomes ||--o{ assessments : "has many"

    concepts ||--o{ skills : "has many"

    skills ||--o{ skill_universal_questions : "has many"

    concepts ||--o{ concept_universal_questions : "has many"

    %% Notes
    %% - concepts.subjects: JSONB array of subject IDs
    %% - concepts.common_core_standards: JSONB array of standard IDs
    %% - learning_outcomes.assessment_type: enum('formative', 'summative', 'diagnostic', 'benchmark')
    %% - learning_outcomes.difficulty_level: enum('beginner', 'intermediate', 'advanced')
    %% - users.role: enum('admin', 'teacher', 'student')
```

## Key Features:

### 🎯 **Core Curriculum Structure**

- **Subjects** → **Standard Types** → **Common Core Standards**
- **Concepts** can be linked to multiple subjects and standards
- **Learning Outcomes** tied to specific concepts, subjects, and grades

### 🔗 **Relationship Types**

- **One-to-Many**: Subject → Standard Types, Grade → Learning Outcomes
- **Many-to-Many**: Concepts ↔ Subjects, Concepts ↔ Common Core Standards
- **Referential**: Common Core Codes → Common Core State Standards

### 📊 **Data Flexibility**

- **JSONB fields** for complex relationships (subjects, common_core_standards)
- **Enum fields** for controlled vocabulary (assessment types, difficulty levels)
- **Soft deletion** with `active` boolean flags
- **Audit trails** with `created_at` and `updated_at` timestamps

### 🎨 **UI Support**

- **Display colors** for visual differentiation in the admin interface
- **Sort orders** for consistent content organization
- **Tags** for quick identification and filtering

This schema supports a comprehensive curriculum management system where educators can:

1. **Organize content** by subjects and grade levels
2. **Create learning outcomes** tied to specific concepts
3. **Align with standards** using the Common Core reference system
4. **Build assessments** based on learning outcomes
5. **Manage relationships** flexibly using JSONB fields
