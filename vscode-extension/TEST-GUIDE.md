# 🚀 Quick Test Guide for SnippetSync Extension

## Step-by-Step Testing

### Step 1: Launch Extension Development Host
1. In your current VS Code window (with vscode-extension folder open)
2. **Press F5** (or go to Run > Start Debugging)
3. A new VS Code window will open with "[Extension Development Host]" in the title

### Step 2: Test Login ✅
1. In the new window, press `Ctrl+Shift+P`
2. Type "SnippetSync: Login" and press Enter
3. Enter your email (the one you used to signup)
4. Enter your password
5. You should see: "Welcome back, [username]!"

### Step 3: Test Export Snippet ✅
1. Create a new file (Ctrl+N)
2. Paste this test code:
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```
3. **Select all the code** (Ctrl+A)
4. Press `Ctrl+Shift+P`
5. Type "SnippetSync: Export Snippet to Platform"
6. Fill in:
   - Title: "Greet Function"
   - Description: "Simple greeting function"
   - Visibility: "PUBLIC"
   - Tags: "javascript, function"
7. You should see: "Snippet 'Greet Function' exported successfully!"

### Step 4: Verify on Web Platform ✅
1. Go to `http://localhost:5173` in your browser
2. Navigate to "My Snippets"
3. You should see "Greet Function" listed
4. Click on it to view details
5. **Copy the snippet ID from the URL** (it's after `/snippet/`)
   Example: `http://localhost:5173/snippet/abc123-def456-...`

### Step 5: Test Import Snippet ✅
1. Back in VS Code Extension Development Host
2. Create a new empty file (Ctrl+N)
3. Press `Ctrl+Shift+P`
4. Type "SnippetSync: Import Snippet from Platform"
5. Paste the snippet ID you copied
6. The code should appear in your editor!

### Step 6: Test View My Snippets ✅
1. Press `Ctrl+Shift+P`
2. Type "SnippetSync: View My Snippets"
3. You should see a list of your snippets
4. Select one
5. It gets inserted into your editor!

### Step 7: Test with Share Slug (Alternative Import) ✅
1. On the web platform, view any snippet
2. Look for the shareSlug (it should be displayed or in the URL)
3. In VS Code, import using that share slug
4. Should work the same way!

## 🎯 Expected Results

✅ Login shows welcome message with username
✅ Export creates snippet visible on web platform  
✅ Import inserts code at cursor position
✅ View My Snippets shows all your snippets
✅ Share slug works for importing

## 🐛 Troubleshooting

### "Login failed"
- Check backend is running: `http://localhost:5000/health`
- Check your credentials are correct

### "Failed to import snippet"  
- Make sure you copied the full snippet ID
- Check the snippet is PUBLIC or you're the owner
- Verify you're logged in

### Commands not showing
- Press F5 again to reload
- Check terminal for compilation errors
- Run `npm run compile` in vscode-extension folder

## 🎉 Success Indicators

When everything works:
1. ✅ You can login from VS Code
2. ✅ Selected code exports to platform
3. ✅ Snippets import back to VS Code
4. ✅ You can browse and insert your snippets
5. ✅ Web platform shows all exported snippets

## 📝 Test Checklist

- [ ] Extension loads (F5 works)
- [ ] Login successful
- [ ] Export snippet works
- [ ] Snippet visible on web platform
- [ ] Import snippet works
- [ ] View my snippets works
- [ ] Share slug import works
- [ ] Logout works

---

**Ready to test? Press F5 and start from Step 2!** 🚀
