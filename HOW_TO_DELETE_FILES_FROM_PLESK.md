# How to Delete Files from Plesk - Step-by-Step Guide

## Method 1: Using File Manager (Recommended)

### Step 1: Access File Manager
1. Log in to your **Plesk control panel**
2. Click on **Websites & Domains** (in the left sidebar or main menu)
3. Click on **tayseerulquran.org** (your domain)
4. Click on **File Manager** (you'll see an icon or link)

### Step 2: Navigate to the Files
1. In File Manager, you should see a folder structure
2. Navigate to `/httpdocs/` folder:
   - Click on `httpdocs` folder to open it
   - This is your website root directory

### Step 3: Select Files to Delete

#### Option A: Delete Specific Files (Recommended First Time)
1. **Find the files you want to delete:**
   - `assets/js/api.js` (navigate to `assets` → `js` → select `api.js`)
   - `login.html`
   - `register.html`
   - `index.html`
   - Any other HTML files

2. **Select files:**
   - Click the **checkbox** next to each file you want to delete
   - Or right-click on the file and select **Delete**

3. **Delete:**
   - Click the **Delete** button (trash icon) at the top
   - Or right-click and select **Delete**
   - Confirm the deletion when prompted

#### Option B: Delete Everything (Complete Cleanup)
1. **Select all files:**
   - Click the **checkbox** at the very top (selects all files and folders)
   - Or press `Ctrl + A` (Windows) / `Cmd + A` (Mac)

2. **Delete:**
   - Click the **Delete** button (trash icon)
   - Confirm deletion when prompted
   - **Warning:** This will delete ALL files in `/httpdocs/`

### Step 4: Delete Folders (If Needed)
1. **To delete the entire `assets` folder:**
   - Navigate to `/httpdocs/`
   - Find the `assets` folder
   - Click the checkbox next to `assets`
   - Click **Delete** button
   - Confirm deletion

2. **To delete the `backend` folder (if it exists):**
   - Navigate to `/httpdocs/`
   - Find the `backend` folder
   - Click the checkbox next to `backend`
   - Click **Delete** button
   - Confirm deletion

### Step 5: Verify Deletion
1. Check that the files/folders are gone
2. The `/httpdocs/` folder should be empty (or only contain default files)
3. You're ready to upload fresh files!

---

## Method 2: Using FTP Client (Alternative)

If you prefer using FTP software (FileZilla, WinSCP, etc.):

### Step 1: Get FTP Credentials
1. In Plesk, go to **Websites & Domains** → **tayseerulquran.org**
2. Click **FTP Access**
3. Note your FTP username and password
4. Note the FTP server address (usually your domain name)

### Step 2: Connect via FTP
1. Open your FTP client (FileZilla, WinSCP, etc.)
2. Enter:
   - **Host:** Your domain (e.g., `tayseerulquran.org`)
   - **Username:** Your FTP username
   - **Password:** Your FTP password
   - **Port:** 21 (or 22 for SFTP)
3. Click **Connect**

### Step 3: Navigate and Delete
1. Navigate to `/httpdocs/` folder
2. **Select files to delete:**
   - Click on files/folders to select them
   - Hold `Ctrl` (Windows) or `Cmd` (Mac) to select multiple files
3. **Delete:**
   - Right-click → **Delete**
   - Or press `Delete` key
   - Confirm deletion

---

## Detailed Step-by-Step: Delete Specific Files

### Delete `api.js` File
1. In File Manager, navigate to `/httpdocs/`
2. Click on `assets` folder
3. Click on `js` folder
4. Find `api.js` file
5. Click the **checkbox** next to `api.js`
6. Click **Delete** button (trash icon at top)
7. Click **OK** or **Confirm** when prompted

### Delete HTML Files
1. In File Manager, navigate to `/httpdocs/`
2. Find `login.html`
3. Click the **checkbox** next to `login.html`
4. Repeat for other HTML files:
   - `register.html`
   - `index.html`
   - `enroll.html`
   - `classes.html`
   - Any other `.html` files
5. Click **Delete** button
6. Confirm deletion

### Delete Entire `assets` Folder
1. In File Manager, navigate to `/httpdocs/`
2. Find `assets` folder
3. Click the **checkbox** next to `assets`
4. Click **Delete** button
5. Confirm deletion
6. **Note:** This will delete all CSS, JS, images, etc. You'll need to re-upload the entire `assets` folder.

---

## What to Delete (Priority Order)

### Priority 1: Critical Files (Delete These First)
- ✅ `/httpdocs/assets/js/api.js` - **MOST IMPORTANT**
- ✅ `/httpdocs/login.html`
- ✅ `/httpdocs/register.html`

### Priority 2: Other HTML Files
- ✅ `/httpdocs/index.html`
- ✅ `/httpdocs/enroll.html`
- ✅ `/httpdocs/classes.html`
- ✅ All other `.html` files

### Priority 3: Entire Folders (If You Want Complete Cleanup)
- ✅ `/httpdocs/assets/` (entire folder - you'll re-upload it)
- ✅ `/httpdocs/backend/` (if it exists - backend is on Render, not needed)

---

## Screenshots Guide (What You'll See)

### File Manager Interface
```
┌─────────────────────────────────────────┐
│  File Manager                            │
├─────────────────────────────────────────┤
│  [Upload] [New Folder] [Delete] [Refresh]│
├─────────────────────────────────────────┤
│  ☑ httpdocs/                            │
│    ├── ☐ index.html                     │
│    ├── ☐ login.html                     │
│    ├── ☐ register.html                  │
│    └── ☐ assets/                        │
│         └── ☐ js/                       │
│              └── ☐ api.js               │
└─────────────────────────────────────────┘
```

### Selecting Files
- Click checkboxes (☐) to select files
- Selected files will show: ☑
- Click **Delete** button to remove selected files

---

## Important Notes

### ⚠️ Before Deleting
1. **Make sure you have backups** of your local files
2. **Verify your local files are correct** (they should have Render URL)
3. **You're only deleting from Plesk**, not from your local computer

### ✅ Safe to Delete
- All files in `/httpdocs/` (you'll re-upload fresh copies)
- `backend/` folder (backend is on Render, not needed on Plesk)

### ❌ Don't Delete
- `/httpdocs/` folder itself (just delete contents)
- Any system files (if you see any)
- `.htaccess` file (if you have one for redirects)

---

## Quick Delete Checklist

Before you start:
- [ ] Logged into Plesk
- [ ] Located File Manager
- [ ] Navigated to `/httpdocs/` folder
- [ ] Identified files to delete

To delete:
- [ ] Selected `assets/js/api.js`
- [ ] Selected all HTML files
- [ ] Clicked Delete button
- [ ] Confirmed deletion
- [ ] Verified files are gone

After deleting:
- [ ] Ready to upload fresh files
- [ ] Have local files ready to upload

---

## Troubleshooting

### Problem: Can't find File Manager
**Solution:**
- Look for "File Manager" in the main menu
- Or go to: **Websites & Domains** → **tayseerulquran.org** → Look for file/folder icon

### Problem: Delete button is grayed out
**Solution:**
- Make sure you've selected at least one file/folder
- Check file permissions (should be deletable)

### Problem: Files won't delete
**Solution:**
- Check if files are in use (unlikely for static files)
- Try deleting one file at a time
- Check file permissions in Plesk

### Problem: Accidentally deleted wrong file
**Solution:**
- Don't panic - you have local copies
- Just re-upload the correct file from your local `TayseerulQuran/` folder

---

## After Deleting

Once you've deleted the files:

1. **Verify deletion:**
   - `/httpdocs/` should be empty (or mostly empty)
   - No `assets/js/api.js` file
   - No HTML files (or only default ones)

2. **Ready to upload:**
   - You can now upload fresh files from your local `TayseerulQuran/` folder
   - See `COMPLETE_PLESK_REUPLOAD_GUIDE.md` for upload instructions

---

## Summary

**To delete files from Plesk:**

1. **Plesk** → **Websites & Domains** → **tayseerulquran.org** → **File Manager**
2. Navigate to `/httpdocs/`
3. Select files (checkboxes)
4. Click **Delete** button
5. Confirm deletion
6. Done! ✅

**Most Important File to Delete:**
- `/httpdocs/assets/js/api.js` - This is the file causing the 404 error

---

## Need Help?

If you're stuck:
1. Check that you're in the right folder (`/httpdocs/`)
2. Make sure files are selected (checkboxes checked)
3. Look for the Delete button (usually a trash icon)
4. Try deleting one file at a time if bulk delete doesn't work

Good luck! 🎯


