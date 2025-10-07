#!/usr/bin/env python3
"""
Simple Asset Remover
Creates a working version by removing all missing asset references
"""

import re
from pathlib import Path

def clean_wpdata_file(project_root: str):
    """Clean the wpData.js file by replacing missing assets with placeholders"""
    
    data_file = Path(project_root) / 'src' / 'data' / 'wpData.js'
    
    if not data_file.exists():
        print(f"❌ wpData.js not found at {data_file}")
        return
    
    print("🧹 Cleaning wpData.js...")
    
    # Read the file
    content = data_file.read_text()
    
    # Backup original
    backup_file = data_file.with_suffix('.js.original')
    backup_file.write_text(content)
    print(f"📦 Backed up original to {backup_file}")
    
    # Define placeholder assets
    placeholder_image = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect width="800" height="600" fill="%23f0f0f0"/%3E%3Ctext x="400" y="300" text-anchor="middle" fill="%23999" font-family="Arial" font-size="24"%3EPlaceholder%3C/text%3E%3C/svg%3E'
    placeholder_video = 'data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAAAAG1wNDJpc29tYXZjMQAAAOpkYXRhAAAA'
    
    # Replace all asset URLs with placeholders
    replacements = [
        # Images
        (r'"/public/uploads/[^"]*\.(jpg|jpeg|png|gif|webp)[^"]*"', f'"{placeholder_image}"'),
        # Videos  
        (r'"/public/uploads/[^"]*\.(mp4|webm|mov)[^"]*"', f'"{placeholder_video}"'),
        # Remove broken references
        (r'"/wp-content/uploads/[^"]*"', '""'),
    ]
    
    cleaned_content = content
    total_replacements = 0
    
    for pattern, replacement in replacements:
        matches = len(re.findall(pattern, cleaned_content, re.IGNORECASE))
        cleaned_content = re.sub(pattern, replacement, cleaned_content, flags=re.IGNORECASE)
        total_replacements += matches
        print(f"  📄 Replaced {matches} instances of {pattern[:30]}...")
    
    # Write cleaned content
    data_file.write_text(cleaned_content)
    
    print(f"✅ Cleaned wpData.js - {total_replacements} total replacements")
    print(f"💾 Original backed up to {backup_file.name}")

def create_placeholder_assets(project_root: str):
    """Create basic placeholder assets in public directory"""
    
    public_dir = Path(project_root) / 'public'
    public_dir.mkdir(exist_ok=True)
    
    print("🎨 Creating placeholder assets...")
    
    # Create a simple favicon
    favicon_content = '''<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#000"/>
  <text x="16" y="20" text-anchor="middle" fill="#fff" font-family="Arial" font-size="16">P</text>
</svg>'''
    
    (public_dir / 'favicon.svg').write_text(favicon_content)
    
    # Create uploads directory structure (empty but prevents 404s)
    uploads_dir = public_dir / 'uploads'
    uploads_dir.mkdir(exist_ok=True)
    
    # Create year/month structure that's referenced in the data
    for year in ['2023', '2024', '2025']:
        year_dir = uploads_dir / year
        year_dir.mkdir(exist_ok=True)
        for month in ['01', '02', '04', '07', '11', '12']:
            month_dir = year_dir / month
            month_dir.mkdir(exist_ok=True)
            # Create a placeholder file to prevent empty directory issues
            (month_dir / '.gitkeep').write_text('')
    
    print("✅ Placeholder assets created")

def update_env_config(project_root: str):
    """Update environment configuration for local development"""
    
    env_file = Path(project_root) / 'src' / 'utils' / 'env.js'
    
    if env_file.exists():
        content = env_file.read_text()
        
        # Force development mode and disable external dependencies
        new_content = '''// Development environment configuration
export const IS_DEV = true;
export const DISABLE_EXTERNAL_ASSETS = true;
export const USE_PLACEHOLDERS = true;

// Local development settings
export const LOCAL_MODE = true;
export const ASSET_BASE_PATH = '/public';
'''
        
        # Backup original
        backup_file = env_file.with_suffix('.js.original')
        backup_file.write_text(content)
        
        env_file.write_text(new_content)
        print("✅ Updated environment configuration")

def main():
    """Main execution"""
    # Get project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    print("🚀 Creating asset-independent working version...\n")
    
    try:
        # Clean the data file
        clean_wpdata_file(str(project_root))
        
        # Create placeholder assets
        create_placeholder_assets(str(project_root))
        
        # Update environment config
        update_env_config(str(project_root))
        
        print("\n✅ Asset cleanup complete!")
        print("\n🎯 Your vanilla.js version is now working and asset-independent!")
        print("\n📋 Next steps:")
        print("1. Test: python3 -m http.server 8000")
        print("2. Visit: http://localhost:8000")
        print("3. Ready for Astro migration!")
        
    except Exception as error:
        print(f"❌ Cleanup failed: {error}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()