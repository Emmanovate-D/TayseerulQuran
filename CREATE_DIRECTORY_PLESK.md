# How to Create the Missing Directory in Plesk File Manager

## The Issue
When you try to create a folder, Plesk might be showing you file creation options instead. Here's how to create a **folder/directory** correctly.

---

## Method 1: Using "New Folder" Button (Recommended)

### Step 1: Navigate to Backend Directory
1. In Plesk File Manager, navigate to `/httpdocs/backend/`
2. You should see files like `server.js`, `package.json`, `config/`, etc.

### Step 2: Create `public` Folder
1. Look for a button that says:
   - **"New Folder"** or
   - **"Create Folder"** or
   - **"Add Folder"** or
   - A folder icon with a "+" sign
2. Click this button (NOT "New File" or "Add File")
3. A dialog box will appear asking for folder name
4. Enter: `public`
5. Click **OK** or **Create**

### Step 3: Create `tmp` Folder Inside `public`
1. Double-click the `public` folder to enter it
2. Click **"New Folder"** button again
3. Enter folder name: `tmp`
4. Click **OK** or **Create**

---

## Method 2: If "New Folder" Button is Not Visible

### Alternative: Use Right-Click Menu
1. Navigate to `/httpdocs/backend/`
2. Right-click in an empty area (not on a file)
3. Look for options like:
   - **"New"** → **"Folder"**
   - **"Create"** → **"Directory"**
   - **"Add"** → **"Folder"**
4. Click on the folder/directory option
5. Enter name: `public`
6. Click **OK**

---

## Method 3: Using SSH (If File Manager Doesn't Work)

If you have SSH access:

1. Connect via SSH to your server
2. Run these commands:

```bash
# Navigate to backend directory
cd /var/www/vhosts/tayseerulquran.org/httpdocs/backend/

# Create public directory
mkdir -p public

# Create tmp directory inside public
mkdir -p public/tmp

# Set permissions
chmod 755 public
chmod 755 public/tmp

# Verify directories were created
ls -la public/
```

---

## Method 4: Upload a Dummy File (Workaround)

If folder creation is not working, you can create the directories by uploading a dummy file:

### Step 1: Create `public` Folder
1. In Plesk File Manager, go to `/httpdocs/backend/`
2. Click **"Upload Files"**
3. Create a temporary file on your computer named `.gitkeep` (or any name)
4. Upload it to `/httpdocs/backend/`
5. **Rename** the uploaded file to `public` (this might create a folder)
   - OR create a folder structure by uploading to a path

### Step 2: Alternative - Use File Path
1. When uploading, try uploading to path: `public/tmp/.gitkeep`
2. This might auto-create the directory structure

---

## Method 5: Check Plesk Version-Specific Instructions

Different Plesk versions have different interfaces:

### Plesk Obsidian (Latest)
- Look for **"New"** button at the top
- Click dropdown arrow next to "New"
- Select **"Folder"**

### Plesk Onyx
- Look for folder icon with "+" at the top toolbar
- Click it to create new folder

### Older Plesk Versions
- Look for **"Create"** → **"Directory"** in the menu

---

## Visual Guide: What to Look For

**✅ CORRECT Button:**
- Icon: 📁 (folder icon)
- Text: "New Folder", "Create Folder", "Add Folder"
- Location: Usually at the top toolbar

**❌ WRONG Button:**
- Icon: 📄 (document icon)
- Text: "New File", "Create File", "Add File"
- This will ask for HTML template (what you're seeing)

---

## Verification

After creating the directories, verify they exist:

1. In File Manager, navigate to `/httpdocs/backend/`
2. You should see a folder named `public`
3. Double-click `public` folder
4. You should see a folder named `tmp`
5. If both exist, you're done! ✅

---

## If Nothing Works

### Option 1: Contact Hosting Support
Ask them to create:
- `/var/www/vhosts/tayseerulquran.org/httpdocs/backend/public/`
- `/var/www/vhosts/tayseerulquran.org/httpdocs/backend/public/tmp/`

### Option 2: Skip Directory Creation (Temporary)
The `public/tmp` directory error might not be critical if:
- You're not using file uploads
- The backend can create it automatically on first use

You can test if the application works without it first, then create it later if needed.

---

## Quick Troubleshooting

**Q: I only see "New File" option, not "New Folder"**
- A: Look for a dropdown arrow next to "New" - folder option might be there
- A: Try right-clicking in empty space
- A: Check if you have proper permissions

**Q: Plesk keeps asking for HTML template**
- A: You're clicking "New File" instead of "New Folder"
- A: Look for a folder icon, not a document icon

**Q: I can't find any folder creation option**
- A: Your Plesk user might not have permission
- A: Try using SSH method instead
- A: Contact your hosting provider

---

## Final Directory Structure Should Be:

```
/httpdocs/backend/
  ├── server.js
  ├── package.json
  ├── config/
  ├── controllers/
  └── public/          ← Create this
      └── tmp/         ← Create this
```

---

**Note:** If you're still having trouble, the directory might not be critical for basic functionality. You can proceed with testing the HTML file fixes first, and create the directory later if you encounter specific errors related to file uploads.




