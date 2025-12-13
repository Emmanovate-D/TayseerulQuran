# How to Generate JWT_SECRET and JWT_REFRESH_SECRET

## 🎯 Quick Methods to Generate Secrets

### Method 1: Online Generator (Easiest - Recommended)

1. **Go to:** https://randomkeygen.com/
2. **Scroll down to:** "CodeIgniter Encryption Keys" section
3. **Copy any key** (they're 64 characters long)
4. **Use it for `JWT_SECRET`**
5. **Refresh the page** and copy another key
6. **Use it for `JWT_REFRESH_SECRET`**

**Example output:**
```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_REFRESH_SECRET=f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3
```

---

### Method 2: Using Node.js (If Installed)

If you have Node.js installed, open a terminal and run:

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET (run again to get a different one)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example output:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3
```

---

### Method 3: Using PowerShell (Windows)

Open PowerShell and run:

```powershell
# Generate JWT_SECRET
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Generate JWT_REFRESH_SECRET (run again)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

Or use this simpler version:

```powershell
# Generate JWT_SECRET (64 characters)
-join ((1..64) | ForEach-Object { Get-Random -InputObject ('a'..'z' + 'A'..'Z' + '0'..'9') })

# Generate JWT_REFRESH_SECRET (run again)
-join ((1..64) | ForEach-Object { Get-Random -InputObject ('a'..'z' + 'A'..'Z' + '0'..'9') })
```

---

### Method 4: Using Python (If Installed)

```python
import secrets
print(secrets.token_hex(32))
```

Run twice to get two different secrets.

---

### Method 5: Manual Generation (Not Recommended)

You can manually create a random string, but it's less secure:
- Use a mix of letters (a-z, A-Z) and numbers (0-9)
- Make it at least 64 characters long
- Use a password generator if available

---

## ✅ What You Need

You need **TWO different secrets**:

1. **JWT_SECRET** - For signing access tokens
2. **JWT_REFRESH_SECRET** - For signing refresh tokens

**Important:**
- ✅ Must be **different** from each other
- ✅ Should be **at least 64 characters** long
- ✅ Should be **random** and **unpredictable**
- ✅ Never share or commit to Git

---

## 📋 Example Values

Here are example secrets (DO NOT USE THESE - Generate your own!):

```
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
JWT_REFRESH_SECRET=f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3
```

---

## 🚀 Quick Steps

1. **Go to:** https://randomkeygen.com/
2. **Copy first key** → Use for `JWT_SECRET`
3. **Refresh page, copy another key** → Use for `JWT_REFRESH_SECRET`
4. **Save them securely** (not in Git!)
5. **Add to Render** environment variables

---

## ⚠️ Security Notes

- ❌ **Never use default values** like "default_secret"
- ❌ **Never commit secrets to Git**
- ❌ **Never share secrets publicly**
- ✅ **Use strong, random strings**
- ✅ **Keep secrets secure**
- ✅ **Mark as "Secret" in Render dashboard**

---

## 📝 For Render Deployment

When adding to Render:

1. Go to your service → Environment tab
2. Click "Add Environment Variable"
3. Key: `JWT_SECRET`
4. Value: `<paste_your_generated_secret>`
5. **Click the lock icon** to mark as "Secret"
6. Repeat for `JWT_REFRESH_SECRET`

---

## ✅ Verification

Your secrets should:
- ✅ Be 64+ characters long
- ✅ Contain letters and numbers
- ✅ Be different from each other
- ✅ Be random (not predictable)



