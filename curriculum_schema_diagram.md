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

    concept_universal_questions_suggested_followups {
        integer id PK
        integer parent_id FK
        varchar followup_question
        integer order
    }

    skill_universal_questions_suggested_followups {
        integer id PK
        integer parent_id FK
        varchar followup_question
        integer order
    }

    %% Teaching Strategies Tables
    strategies {
        integer id PK
        varchar name
        integer skill_id FK
        jsonb description
        numeric sort
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    kid_translations {
        uuid id PK
        uuid strategy_id FK UK
        text translation
        timestamptz created_at
        timestamptz updated_at
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

    concepts ||--o{ skills : "has many"

    skills ||--o{ skill_universal_questions : "has many"
    skills ||--o{ strategies : "has many"

    concepts ||--o{ concept_universal_questions : "has many"

    skill_universal_questions ||--o{ skill_universal_questions_suggested_followups : "has many"
    concept_universal_questions ||--o{ concept_universal_questions_suggested_followups : "has many"

    strategies ||--|| kid_translations : "has one"

    %% Notes
    %% - concepts.subjects: JSONB array of subject IDs
    %% - concepts.common_core_standards: JSONB array of standard IDs
    %% - strategies.description: JSONB rich text content
    %% - kid_translations.translation: text field supporting Markdown
    %% - question_type: enum('open_ended', 'reflective', 'analytical', 'evaluative', 'creative')
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

- **JSONB fields** for complex relationships (subjects, common_core_standards, rich text content)
- **Enum fields** for controlled vocabulary (question types, grade levels, reading levels)
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
4. **Develop teaching strategies** for specific skills
5. **Create student-friendly translations** of teaching strategies in simple, accessible language
6. **Ask universal questions** to promote deeper thinking about concepts and skills
7. **Manage relationships** flexibly using JSONB fields
