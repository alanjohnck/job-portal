# Job Search & Filter Specification

This document details the logic and data structures for the Job Search and Filtering system in the Candidate portal.

## 1. Top Search Bar (Premium Bar)
Located at the top of the `FindJobs` page, used for quick discovery.

| Field | Input Type | Query Parameter | Values |
| :--- | :--- | :--- | :--- |
| **Keyword** | Text | `q` | Job title, company name, or skills (e.g., "React Developer") |
| **Location** | Text | `location` | City, State, or Country (e.g., "Kochi, India") |

---

## 2. Sidebar Filters (`JobFilter.jsx`)
Used for granular narrowing of job listings.

### A. Industry (Category)
*   **Query Parameter:** `category`
*   **Behavior:** Single selection (Radio-style behavior).
*   **Options:**
    ```text
    - Developments
    - Business
    - Finance & Accounting
    - IT & Software
    - Design
    - Marketing
    ```

### B. Job Type
*   **Query Parameter:** `type`
*   **Behavior:** Multi-select or Single-select (as per UI radio implementation).
*   **Values:** 
    *   `full-time`
    *   `part-time`
    *   `internship`
    *   `temporary`
    *   `contract`

### C. Salary Range (Yearly)
The UI handles this using a dual-thumb slider and pre-set ranges.
*   **Query Parameters:** `salary_min`, `salary_max`
*   **Logic:**
    *   If a pre-set range is selected (e.g., `$10k - $100k`), the API should receive `salary_min=10000` and `salary_max=100000`.
    *   If "Custom" is selected, use the values from the manual slider state.

### D. Remote Option
*   **Query Parameter:** `is_remote`
*   **Type:** `boolean` (true/false)
*   **Behavior:** Filter jobs that are explicitly marked as "Remote" or "Work from Home".

---

## 3. Active Filters (Tags)
Every time a filter is applied, a "Tag" should appear at the top of the sidebar.
*   **Format:** `Label: Value` (e.g., `Job Type: Full Time`)
*   **Action:** Clicking the `X` on a tag should reset that specific filter state and trigger a fresh API fetch.

---

## 4. API Integration Example
When a user searches for "Developer" in "New York", selects "Design" industry, and sets a salary of "$50k+", the final URL to the backend should look like:

`GET /v1/jobs?q=Developer&location=New+York&category=Design&salary_min=50000&is_remote=false`

## 5. Implementation Notes
*   **Debouncing**: The Top Search Bar should ideally use a 500ms debounce to avoid overwhelming the API on every keystroke.
*   **Pagination Reset**: Whenever ANY filter or search query changes, the current page must be reset to `1`.
*   **No Results**: Handle cases where the combination of filters returns 0 jobs with a clear "Clear all filters" CTA.
