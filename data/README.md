# Data Population Guide

This project includes sample data files and a Django management command to populate the database with realistic recruitment data.

## Data Files

The `data/` folder contains three JSON files:

- **candidates.json** - 150 candidate records with names, emails, and phone numbers
- **jobs.json** - 30 job opening records across various departments
- **applications.json** - 220 application records linking candidates to jobs with various statuses

## Populating the Database

### Using Docker (Recommended)

If you're running the application with Docker Compose:

```bash
# Populate database (clears existing data first)
docker compose exec backend python manage.py populatedb --clear

# Populate database (keeps existing data, skips duplicates)
docker compose exec backend python manage.py populatedb
```

### Without Docker

If you're running Django locally:

```bash
cd backend
python manage.py populatedb --clear
```

## Command Options

- `--clear` - Clears all existing data (Candidates, Jobs, Applications) before populating
- Without `--clear` - Only adds new records, skips duplicates based on email (candidates) or existing relationships (applications)

## Data Statistics

After running the population command, you should have:
- **150 Candidates** - Various names, emails, and phone numbers
- **30 Job Openings** - Across multiple departments (Engineering, Computer Science, Business, etc.)
- **220 Applications** - With various statuses (Received, Under Review, Interview, Offer Extended, Rejected)

## Regenerating Data

If you want to regenerate the data files with different records:

```bash
# From the project root
python3 generate_data.py
```

This will create new JSON files in the `data/` folder with fresh random data.

## Notes

- The data folder is mounted as a volume in Docker at `/data`
- Email addresses are unique - duplicate emails will be skipped
- Application dates are randomly distributed over the last 90 days
- Job statuses are randomly assigned from: Received, Under Review, Interview, Offer Extended, Rejected

