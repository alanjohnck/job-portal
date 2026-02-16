# Testing Admin Dashboard - Quick Guide

## Issue Identified
The API returns data in this structure:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {...}
  }
}
```

## Fix Applied
Updated all admin API functions in `src/services/api.js` to extract `result.data` from the response.

## How to Test

### Step 1: Login as Admin
1. Navigate to: `http://localhost:5173/login`
2. Use admin credentials:
   - **Email**: `admin@jobportal.com`
   - **Password**: (your admin password from the database)

### Step 2: Access Admin Pages
After logging in, you should be redirected to `/admin/dashboard`. You can also manually navigate to:

- **Dashboard**: `http://localhost:5173/admin/dashboard`
- **Users**: `http://localhost:5173/admin/users`
- **Companies**: `http://localhost:5173/admin/companies`
- **Jobs**: `http://localhost:5173/admin/jobs`
- **Support**: `http://localhost:5173/admin/support`

### Step 3: Check Browser Console
Open the browser console (F12) and check for:
1. **Console logs** showing the API response structure
2. **Network tab** to verify API calls are successful (Status 200)
3. **Any error messages**

### Expected Behavior

#### Users Page (`/admin/users`)
- Should display 5 users from your seed data
- You should see:
  - john.smith@example.com (Candidate)
  - jane.doe@example.com (Candidate)
  - jobs@innovatelabs.io (Company)
  - hr@techcorp.com (Company)
  - admin@jobportal.com (Admin)

#### Companies Page (`/admin/companies`)
- Should display 2 companies:
  - jobs@innovatelabs.io
  - hr@techcorp.com

#### Console Output
In the browser console, you should see:
```
Admin Users API Response: { items: [...], pagination: {...} }
Extracted items: [5 users]
```

## Troubleshooting

### If you see "No users found"
1. Check the browser console for errors
2. Check the Network tab - look for the request to `/api/v1/admin/users`
3. Verify the response structure matches the expected format
4. Make sure you're logged in as an admin user

### If you get "Failed to fetch users"
1. Verify the backend is running on `http://localhost:5113`
2. Check that you have a valid admin token in localStorage
3. Verify CORS is configured correctly on the backend

### If you get 401 Unauthorized
1. Make sure you're logged in as an admin user
2. Check localStorage for the token: `localStorage.getItem('token')`
3. Verify the user role: `JSON.parse(localStorage.getItem('user')).role` should be "Admin"

## Quick Console Commands

Run these in the browser console to debug:

```javascript
// Check if you're logged in
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));

// Manually test the API
fetch('http://localhost:5113/api/v1/admin/users?page=1&pageSize=20', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(d => console.log('API Response:', d));
```

## Next Steps

Once you verify the admin pages are working:
1. Test the search functionality
2. Test the filters (role, status, priority)
3. Test the actions (toggle status, delete, mark resolved)
4. Verify the dashboard statistics are displaying correctly

## Notes

- All admin pages now have console logging enabled for debugging
- The API response structure is: `{ success, data: { items, pagination } }`
- The frontend extracts `data.items` to display in the tables
- Loading states show "Loading..." while fetching data
- Error states show error messages with a retry button
