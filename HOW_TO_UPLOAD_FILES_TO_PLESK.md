# How to Upload Files to Plesk - Complete Guide

## Overview
This guide shows you exactly **what files to upload** and **how to upload them** to Plesk.

**Important:** Your backend is on Render, so you **only upload frontend files** to Plesk.

---

## What Files to Upload

### ✅ Upload These Files (From `TayseerulQuran/` folder)

#### Priority 1: Critical Files (Upload First)
1. **`assets/js/api.js`** → `/httpdocs/assets/js/api.js`
   - **Most important file!** This must have the Render URL
   
2. **`login.html`** → `/httpdocs/login.html`
3. **`register.html`** → `/httpdocs/register.html`
4. **`index.html`** → `/httpdocs/index.html`

#### Priority 2: All Other HTML Files
Upload all `.html` files from `TayseerulQuran/` folder:
- `enroll.html`
- `classes.html`
- `courses.html`
- `about.html`
- `contact.html`
- `faq.html`
- `checkout.html`
- `courses-details.html`
- `blog-*.html` (all blog files)
- `super-admin-*.html` (all admin files)
- Any other `.html` files

#### Priority 3: Assets Folder
Upload the entire `assets/` folder:
- `assets/css/` → `/httpdocs/assets/css/`
- `assets/js/` → `/httpdocs/assets/js/`
- `assets/images/` → `/httpdocs/assets/images/`
- `assets/fonts/` → `/httpdocs/assets/fonts/`
- All other subfolders in `assets/`

#### Priority 4: Other Files
- `test-api-connection.html` (optional - for testing)
- Any other frontend files

### ❌ DO NOT Upload These
- `backend/` folder (backend is on Render)
- `.env` files
- `node_modules/` folder
- `package.json`
- `.git/` folder
- Any backend files

---

## Method 1: Upload Using File Manager (Recommended for Small Files)

### Step 1: Access File Manager
1. Log in to **Plesk**
2. Go to **Websites & Domains** → **tayseerulquran.org**
3. Click **File Manager**

### Step 2: Navigate to Upload Location
1. In File Manager, navigate to `/httpdocs/` folder
2. This is where all your website files should go

### Step 3: Upload Files

#### Upload Single File
1. Click **Upload Files** button (usually at the top)
2. Click **Choose Files** or **Browse**
3. Navigate to your local `TayseerulQuran/` folder
4. Select the file (e.g., `login.html`)
5. Click **Open**
6. Wait for upload to complete
7. File should appear in `/httpdocs/`

#### Upload Multiple Files
1. Click **Upload Files** button
2. Click **Choose Files** or **Browse**
3. Hold `Ctrl` (Windows) or `Cmd` (Mac) and click multiple files
4. Select all files you want to upload
5. Click **Open**
6. Wait for all files to upload

#### Upload Folder (Create Structure First)
**For `assets/` folder:**

1. **Create folder structure:**
   - In `/httpdocs/`, click **New Folder**
   - Name it: `assets`
   - Click inside `assets` folder
   - Create subfolders: `css`, `js`, `images`, `fonts`

2. **Upload files to each subfolder:**
   - Go to `assets/js/` folder
   - Upload `api.js` file
   - Go to `assets/css/` folder
   - Upload all CSS files
   - Repeat for other subfolders

**OR** (Easier method):
- Use FTP (Method 2) to upload entire folders at once

---

## Method 2: Upload Using FTP (Recommended for Large Files/Folders)

### Step 1: Get FTP Credentials
1. In Plesk, go to **Websites & Domains** → **tayseerulquran.org**
2. Click **FTP Access**
3. Note your:
   - **FTP username**
   - **FTP password**
   - **FTP server** (usually your domain: `tayseerulquran.org`)

### Step 2: Connect with FTP Client
1. **Download FTP client** (if you don't have one):
   - **FileZilla** (free): https://filezilla-project.org/
   - **WinSCP** (Windows): https://winscp.net/
   - Or use any FTP client you prefer

2. **Open FTP client** and connect:
   - **Host:** `tayseerulquran.org` (or your FTP server)
   - **Username:** Your FTP username
   - **Password:** Your FTP password
   - **Port:** `21` (FTP) or `22` (SFTP)
   - Click **Connect**

### Step 3: Navigate to Upload Location
1. On the **right side** (remote/server), navigate to `/httpdocs/`
2. On the **left side** (local), navigate to your `TayseerulQuran/` folder

### Step 4: Upload Files

#### Upload Single File
1. Find file on **left side** (local)
2. **Drag and drop** to **right side** (`/httpdocs/`)
3. Or right-click file → **Upload**

#### Upload Multiple Files
1. Select multiple files on **left side** (hold `Ctrl` or `Cmd`)
2. **Drag and drop** to **right side**
3. Or right-click → **Upload**

#### Upload Entire Folder
1. Find `assets/` folder on **left side** (local)
2. **Drag and drop** entire `assets/` folder to `/httpdocs/` on **right side**
3. This will upload the entire folder structure automatically

### Step 5: Verify Upload
1. Check that files appear in `/httpdocs/` on the server
2. Verify folder structure is correct

---

## Step-by-Step: Upload Critical Files First

### Upload `api.js` (Most Important!)

**Using File Manager:**
1. In Plesk File Manager, go to `/httpdocs/`
2. Create folder structure if needed:
   - Create `assets` folder (if doesn't exist)
   - Go into `assets` folder
   - Create `js` folder (if doesn't exist)
   - Go into `js` folder
3. Click **Upload Files**
4. Browse to: `TayseerulQuran/assets/js/api.js`
5. Upload the file
6. Verify it's at: `/httpdocs/assets/js/api.js`

**Using FTP:**
1. Connect via FTP
2. Navigate to `/httpdocs/assets/js/` on server
3. Navigate to `TayseerulQuran/assets/js/` on local
4. Drag `api.js` from local to server
5. Done!

### Upload HTML Files

**Using File Manager:**
1. In File Manager, go to `/httpdocs/`
2. Click **Upload Files**
3. Select all HTML files from `TayseerulQuran/` folder:
   - `login.html`
   - `register.html`
   - `index.html`
   - `enroll.html`
   - All other `.html` files
4. Upload all at once (or one by one)
5. Files should appear in `/httpdocs/`

**Using FTP:**
1. Connect via FTP
2. Navigate to `/httpdocs/` on server
3. Navigate to `TayseerulQuran/` on local
4. Select all `.html` files
5. Drag to `/httpdocs/` on server
6. Done!

### Upload `assets/` Folder

**Using File Manager:**
- This is tedious - better to use FTP
- Or upload files one subfolder at a time

**Using FTP (Recommended):**
1. Connect via FTP
2. Navigate to `/httpdocs/` on server
3. Navigate to `TayseerulQuran/` on local
4. Find `assets/` folder
5. **Drag entire `assets/` folder** to `/httpdocs/` on server
6. This uploads the entire folder structure automatically
7. Done!

---

## File Structure After Upload

After uploading, your Plesk structure should look like:

```
/httpdocs/
├── index.html
├── login.html
├── register.html
├── enroll.html
├── classes.html
├── (all other .html files)
├── assets/
│   ├── css/
│   │   └── (all CSS files)
│   ├── js/
│   │   └── api.js  ← CRITICAL: Must have Render URL
│   ├── images/
│   │   └── (all image files)
│   └── fonts/
│       └── (all font files)
└── test-api-connection.html (optional)
```

---

## Verification After Upload

### Verify Critical Files

1. **Check `api.js`:**
   - In Plesk File Manager, go to `/httpdocs/assets/js/api.js`
   - Click to open/edit
   - Search for: `tayseerulquran.onrender.com`
   - Should find it on line 26
   - Should NOT find: `window.location.origin + '/api'`

2. **Check `login.html`:**
   - In Plesk File Manager, go to `/httpdocs/login.html`
   - Click to open/edit
   - Search for: `tayseerulquran.onrender.com`
   - Should find: `window.BACKEND_API_URL = 'https://tayseerulquran.onrender.com/api';`

3. **Check file dates:**
   - Files should have recent modification dates
   - If dates are old, files might not have uploaded correctly

### Test the Upload

1. **Visit your site:**
   - Go to: `https://tayseerulquran.org/login.html`

2. **Check browser console (F12):**
   - Should see: `"Production API URL set to: https://tayseerulquran.onrender.com/api"`
   - Should see: `"Using Render API URL: https://tayseerulquran.onrender.com/api"`

3. **Check Network tab:**
   - Try to log in
   - Request should go to: `https://tayseerulquran.onrender.com/api/auth/login`
   - Should NOT go to: `https://tayseerulquran.org/api/auth/login`

---

## Upload Priority Order

Upload files in this order for best results:

### 1. First: Critical Files
- ✅ `assets/js/api.js` (MOST IMPORTANT)
- ✅ `login.html`
- ✅ `register.html`

### 2. Second: Other HTML Files
- ✅ All other `.html` files

### 3. Third: Assets Folder
- ✅ Entire `assets/` folder (CSS, images, fonts, etc.)

### 4. Fourth: Test File (Optional)
- ✅ `test-api-connection.html`

---

## Troubleshooting

### Problem: Files won't upload
**Solution:**
- Check file size limits in Plesk
- Try uploading smaller batches
- Use FTP for large files

### Problem: Folder structure is wrong
**Solution:**
- Delete incorrectly placed files
- Create folders first, then upload files
- Or use FTP to upload entire folders

### Problem: Files uploaded but don't work
**Solution:**
- Verify files are in correct location (`/httpdocs/`)
- Check file permissions (should be readable)
- Clear browser cache
- Verify `api.js` has Render URL

### Problem: Can't find upload button
**Solution:**
- Look for "Upload Files" or "Upload" icon
- May be in toolbar at top of File Manager
- Or use FTP instead

### Problem: Upload is slow
**Solution:**
- Use FTP for large files/folders
- Upload in smaller batches
- Check your internet connection

---

## Quick Upload Checklist

Before uploading:
- [ ] Files deleted from Plesk (old files)
- [ ] Local files ready in `TayseerulQuran/` folder
- [ ] Verified local `api.js` has Render URL
- [ ] FTP client installed (if using FTP method)

Upload process:
- [ ] Uploaded `assets/js/api.js` first
- [ ] Uploaded `login.html` and `register.html`
- [ ] Uploaded all other HTML files
- [ ] Uploaded entire `assets/` folder
- [ ] Verified file structure is correct

After uploading:
- [ ] Verified `api.js` has Render URL in Plesk
- [ ] Verified `login.html` has Render URL in Plesk
- [ ] Cleared browser cache
- [ ] Tested login page
- [ ] Console shows correct API URL

---

## Tips for Successful Upload

1. **Upload `api.js` first** - This is the most critical file
2. **Use FTP for folders** - Easier to upload entire `assets/` folder
3. **Verify after upload** - Always check that files have Render URL
4. **Clear browser cache** - After uploading, clear cache before testing
5. **Test in incognito** - Use incognito window to avoid cache issues

---

## Summary

**What to upload:**
- All files from `TayseerulQuran/` folder
- Most important: `assets/js/api.js`

**How to upload:**
- **File Manager:** Good for single files
- **FTP:** Better for folders and multiple files

**Where to upload:**
- All files go to `/httpdocs/` folder
- Maintain folder structure (e.g., `assets/js/api.js`)

**After upload:**
- Verify files have Render URL
- Clear browser cache
- Test login page

---

## Need More Help?

If you're stuck:
1. Start with uploading just `api.js` file
2. Test if that fixes the issue
3. Then upload other files
4. Use FTP if File Manager is difficult

Good luck! 🎯


