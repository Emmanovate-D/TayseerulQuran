# Simple Guide: Upload Updated Files to Plesk

## 🎯 What You're Uploading

You need to upload the **updated frontend files** that now point to Render backend:
- `TayseerulQuran/assets/js/api.js` (main API configuration)
- All HTML files in `TayseerulQuran/` folder (26 files)

---

## 📋 Step-by-Step Instructions

### Step 1: Access Plesk File Manager

1. **Log in to Plesk** control panel
2. Go to **Websites & Domains**
3. Click on **tayseerulquran.org**
4. Click on **File Manager** (or **Files**)

---

### Step 2: Navigate to Frontend Directory

1. In File Manager, navigate to:
   ```
   /httpdocs/
   ```
   This is where your website files are stored.

---

### Step 3: Upload Updated Files

#### Option A: Upload Individual Files (Recommended - Faster)

**Upload the main API file:**
1. Navigate to `/httpdocs/assets/js/` folder
2. Click **Upload** button (or drag & drop)
3. Upload `api.js` from your local `TayseerulQuran/assets/js/` folder
4. **Overwrite** the existing file when prompted

**Upload updated HTML files:**
1. Go back to `/httpdocs/` folder
2. Upload these files one by one (or select multiple):
   - `login.html`
   - `index.html`
   - `register.html`
   - `enroll.html`
   - `classes.html`
   - `courses.html`
   - `courses-details.html`
   - `checkout.html`
   - `contact.html`
   - `about.html`
   - `faq.html`
   - `enrol-success.html`
   - `enrol-failure.html`
   - `super-admin-dashboard.html`
   - `super-admin-courses.html`
   - `super-admin-students.html`
   - `super-admin-tutors.html`
   - `super-admin-roles.html`
   - `super-admin-blog.html`
   - `super-admin-payments.html`
   - `blog-grid.html`
   - `blog-left-sidebar.html`
   - `blog-right-sidebar.html`
   - `blog-details-left-sidebar.html`
   - `blog-details-right-sidebar.html`
   - `test-api-connection.html`

3. **Overwrite** existing files when prompted

#### Option B: Upload Entire Folder (Alternative)

1. In File Manager, go to `/httpdocs/`
2. Click **Upload** button
3. Select the entire `TayseerulQuran/` folder
4. **Overwrite** all existing files when prompted

**Note:** This will upload everything, but it's slower if you have many files.

---

### Step 4: Verify Upload

1. **Check `api.js`:**
   - Navigate to `/httpdocs/assets/js/api.js`
   - Open it in File Manager
   - Look for line 26: Should show `'https://tayseerulquran.onrender.com/api'`
   - If it shows `window.location.origin + '/api'`, the upload didn't work

2. **Check `login.html`:**
   - Navigate to `/httpdocs/login.html`
   - Open it in File Manager
   - Search for "tayseerulquran.onrender.com"
   - Should find it around line 616

---

### Step 5: Clear Browser Cache

**Important:** You MUST clear your browser cache after uploading!

**Method 1: Hard Refresh**
- Press `Ctrl + Shift + R` (Windows/Linux)
- Or `Cmd + Shift + R` (Mac)

**Method 2: Clear Cache**
1. Press `Ctrl + Shift + Delete` (Windows/Linux)
2. Select "Cached images and files"
3. Click "Clear data"

**Method 3: Incognito/Private Window**
- Open a new incognito/private window
- Test the login there

---

### Step 6: Test the Changes

1. **Open browser console:**
   - Press `F12` or `Right-click → Inspect`
   - Go to **Console** tab

2. **Visit login page:**
   - Go to: `https://tayseerulquran.org/login.html`

3. **Check console output:**
   - You should see: `"Using Render API URL: https://tayseerulquran.onrender.com/api"`
   - ✅ **If you see this** = Upload successful!
   - ❌ **If you see** `"Using Plesk API URL"` = Upload failed or cache issue

4. **Try logging in:**
   - Enter your credentials
   - Click Login
   - Check Render logs for the login request

---

## 🔍 Troubleshooting

### Problem: Files won't upload
**Solution:**
- Check file permissions in Plesk
- Make sure you have write access
- Try uploading one file at a time

### Problem: Still seeing old API URL in console
**Solution:**
- Clear browser cache (Step 5)
- Try incognito/private window
- Check if file was actually uploaded (verify in File Manager)

### Problem: Upload button not visible
**Solution:**
- Look for "Upload Files" or "Add Files" button
- Some Plesk versions use drag-and-drop
- Try right-clicking in the folder → "Upload"

### Problem: Can't find the files in Plesk
**Solution:**
- Make sure you're in `/httpdocs/` folder
- Check if you're looking at the correct domain
- Use the search function in File Manager

---

## ✅ Quick Checklist

- [ ] Logged into Plesk
- [ ] Opened File Manager for tayseerulquran.org
- [ ] Navigated to `/httpdocs/` folder
- [ ] Uploaded `assets/js/api.js`
- [ ] Uploaded all 26 HTML files
- [ ] Verified files were overwritten
- [ ] Cleared browser cache
- [ ] Tested in browser console
- [ ] Saw "Using Render API URL" message
- [ ] Tested login functionality

---

## 📝 File Locations in Plesk

After upload, your files should be at:

```
/httpdocs/
  ├── index.html
  ├── login.html
  ├── register.html
  ├── ... (all other HTML files)
  └── assets/
      └── js/
          └── api.js  ← This is the critical file!
```

---

## 🚀 After Upload

Once files are uploaded and tested:

1. **Monitor Render logs** - Check if login requests are coming through
2. **Test all pages** - Make sure all pages work correctly
3. **Check database** - Verify database connection in Render logs

---

## 💡 Pro Tips

1. **Upload `api.js` first** - This is the most important file
2. **Test after each upload** - Don't wait until all files are uploaded
3. **Keep a backup** - Download current files before overwriting (optional)
4. **Use File Manager search** - Makes finding files easier
5. **Check file dates** - Verify upload date matches current time

---

## 🆘 Need Help?

If you encounter issues:
1. Check Plesk File Manager permissions
2. Verify you're uploading to the correct domain
3. Make sure files are not corrupted
4. Try uploading one file at a time
5. Check browser console for errors

---

**Ready to upload? Start with Step 1!** 🎯



