# Rhytmo

**Version:** 1.0.1

## Download for macOS

### System Requirements

- macOS 10.13 (High Sierra) or later
- Intel or Apple Silicon (M1/M2/M3) Mac

### Installation Instructions

1. **Download the App**

   - Navigate to the `release/platforms/macos/` directory
   - Locate the `rhytmo.app` file

2. **Install the App**

   - Drag `rhytmo.app` to your Applications folder, or
   - Double-click `rhytmo.app` to run it directly from the download location

3. **First Launch (macOS Security)**

   - If you see a message saying "rhytmo cannot be opened because it is from an unidentified developer":
     - Go to **System Settings** (or **System Preferences** on older macOS versions)
     - Navigate to **Privacy & Security**
     - Click **Open Anyway** next to the blocked app message
     - Alternatively, right-click the app and select **Open**, then click **Open** in the dialog

4. **Run the App**
   - Open **Applications** folder
   - Double-click **rhytmo** to launch

### Alternative Installation Method

If you prefer using Terminal:

```bash
# Navigate to the release directory
cd release/platforms/macos/

# Copy the app to Applications
cp -R rhytmo.app /Applications/

# Remove quarantine attribute (if needed)
xattr -dr com.apple.quarantine /Applications/rhytmo.app
```

## Troubleshooting

### App Won't Open

- Make sure you've allowed the app in **System Settings > Privacy & Security**
- Check that your Mac meets the minimum system requirements
- Try removing the quarantine attribute using the Terminal command above

### App is Damaged

- If macOS says the app is damaged, it's likely a security restriction
- Follow the steps in "First Launch" above to allow the app to run

## Support

For issues or questions, please check the project repository or contact support.
