# Step-by-Step Guide: Upload Fixed Files to Plesk

## Files to Upload (5 HTML files)

1. `TayseerulQuran/login.html`
2. `TayseerulQuran/index.html`
3. `TayseerulQuran/register.html`
4. `TayseerulQuran/enroll.html`
5. `TayseerulQuran/classes.html`

---

## Method 1: Using Plesk File Manager (Recommended)

### Step 1: Access Plesk File Manager

1. Log in to your **Plesk control panel**
2. Click on **Websites & Domains**
3. Click on **tayseerulquran.org**
4. Click on **File Manager** (or **Files**)

### Step 2: Navigate to Frontend Directory

1. In File Manager, you should see the file structure
2. Navigate to `/httpdocs/` (this is your website root)
3. You should see files like:
   - `index.html`
   - `login.html`
   - `register.html`
   - `assets/` folder
   - etc.

### Step 3: Upload Each File (One by One)

#### Upload `login.html`:

1. **Select the file** on your local computer: `TayseerulQuran/login.html`
2. In Plesk File Manager, make sure you're in `/httpdocs/`
3. Click **Upload Files** button (usually at the top)
4. Click **Choose Files** or drag and drop `login.html`
5. Wait for upload to complete
6. **Confirm** the file was uploaded (you should see it in the file list)

#### Upload `index.html`:

1. Repeat the same process for `TayseerulQuran/index.html`
2. **Important:** When prompted to overwrite, click **Yes** or **Replace**
3. Wait for upload to complete

#### Upload `register.html`:

1. Upload `TayseerulQuran/register.html`
2. Click **Yes** to overwrite if prompted
3. Wait for upload to complete

#### Upload `enroll.html`:

1. Upload `TayseerulQuran/enroll.html`
2. Click **Yes** to overwrite if prompted
3. Wait for upload to complete

#### Upload `classes.html`:

1. Upload `TayseerulQuran/classes.html`
2. Click **Yes** to overwrite if prompted
3. Wait for upload to complete

### Step 4: Verify Upload

1. In File Manager, check that all 5 files are present:
   - `login.html`
   - `index.html`
   - `register.html`
   - `enroll.html`
   - `classes.html`
2. Check the **Last Modified** date - it should show today's date/time

### Step 5: Create Missing Directory (for backend)

1. Navigate to `/httpdocs/backend/` in File Manager
2. Click **New Folder** or **Create Directory**
3. Name it: `public`
4. Click inside the `public` folder
5. Click **New Folder** again
6. Name it: `tmp`
7. Set permissions (if available):
   - Right-click `public` folder → **Change Permissions** → Set to `755`
   - Right-click `tmp` folder → **Change Permissions** → Set to `755`

---

## Method 2: Using FTP Client (Alternative)

If you prefer using an FTP client (FileZilla, WinSCP, etc.):

### Step 1: Connect to FTP

1. Open your FTP client
2. Enter connection details:
   - **Host:** Your server IP or domain
   - **Username:** Your Plesk FTP username
   - **Password:** Your Plesk FTP password
   - **Port:** 21 (or 22 for SFTP)

### Step 2: Navigate to Frontend Directory

1. Navigate to `/httpdocs/` on the server
2. This is usually: `/var/www/vhosts/tayseerulquran.org/httpdocs/`

### Step 3: Upload Files

1. On your local computer, navigate to `TayseerulQuran/` folder
2. Select all 5 files:
   - `login.html`
   - `index.html`
   - `register.html`
   - `enroll.html`
   - `classes.html`
3. Drag and drop them to `/httpdocs/` on the server
4. When prompted to overwrite, click **Yes** or **Overwrite**

### Step 4: Create Missing Directory

1. Navigate to `/httpdocs/backend/` on the server
2. Create folder: `public`
3. Navigate into `public`
4. Create folder: `tmp`
5. Set permissions to `755` for both folders

---

## Method 3: Using Plesk File Manager - Bulk Upload

### Step 1: Prepare Files

1. On your local computer, create a temporary folder
2. Copy all 5 HTML files into this folder:
   - `login.html`
   - `index.html`
   - `register.html`
   - `enroll.html`
   - `classes.html`

### Step 2: Create ZIP File (Optional)

1. Select all 5 files
2. Right-click → **Send to** → **Compressed (zipped) folder**
3. Name it: `fixed-files.zip`

### Step 3: Upload ZIP and Extract

1. In Plesk File Manager, navigate to `/httpdocs/`
2. Upload `fixed-files.zip`
3. Right-click the ZIP file → **Extract** or **Unzip**
4. Delete the ZIP file after extraction

---

## After Upload: Test the Fix

### Step 1: Clear Browser Cache

1. Open your browser
2. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
3. Select **Cached images and files**
4. Click **Clear data**

### Step 2: Test Login Page

1. Navigate to `https://tayseerulquran.org/login.html`
2. Open browser console (F12)
3. Check for errors:
   - ✅ Should NOT see: "API_CONFIG has already been declared"
   - ✅ Should see: "Using Plesk API URL: https://tayseerulquran.org/api"
4. Try to log in

### Step 3: Check Other Pages

1. Visit `https://tayseerulquran.org/index.html`
2. Visit `https://tayseerulquran.org/register.html`
3. Check browser console for errors on each page

---

## Troubleshooting

### Issue: Files won't upload

**Solution:**
- Check file permissions on your local computer
- Try uploading one file at a time
- Check available disk space in Plesk

### Issue: Files uploaded but changes not showing

**Solution:**
- Clear browser cache (see above)
- Try hard refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
- Check file modification date in File Manager

### Issue: Still seeing "API_CONFIG has already been declared"

**Solution:**
- Verify the files were actually uploaded (check modification dates)
- Clear browser cache completely
- Try in incognito/private browsing mode
- Check browser console to see which file is loading api.js twice

### Issue: Can't create public/tmp directory

**Solution:**
- Check you have write permissions in `/httpdocs/backend/`
- Try creating directories one at a time
- If using FTP, make sure you're connected with proper permissions

---

## Quick Checklist

- [ ] Uploaded `login.html`
- [ ] Uploaded `index.html`
- [ ] Uploaded `register.html`
- [ ] Uploaded `enroll.html`
- [ ] Uploaded `classes.html`
- [ ] Created `/httpdocs/backend/public/` directory
- [ ] Created `/httpdocs/backend/public/tmp/` directory
- [ ] Cleared browser cache
- [ ] Tested login page (no console errors)
- [ ] Tested other pages (no console errors)

---

## File Locations Summary

**On Plesk Server:**
```
/httpdocs/
  ├── login.html          ← Upload here
  ├── index.html          ← Upload here
  ├── register.html       ← Upload here
  ├── enroll.html         ← Upload here
  ├── classes.html        ← Upload here
  └── backend/
      └── public/
          └── tmp/        ← Create this directory
```

**On Your Local Computer:**
```
TayseerulQuran/
  ├── login.html          ← Upload this
  ├── index.html          ← Upload this
  ├── register.html      ← Upload this
  ├── enroll.html        ← Upload this
  └── classes.html       ← Upload this
```

---

## Need Help?

If you encounter any issues:
1. Check Plesk error logs
2. Check browser console for JavaScript errors
3. Verify file upload was successful (check file dates)
4. Make sure you're uploading to the correct directory (`/httpdocs/`)

---

**Last Updated:** After fixing duplicate api.js includes




