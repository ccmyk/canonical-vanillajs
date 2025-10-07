#!/usr/bin/env python3
"""
WordPress to Local Sanitization Script
Fixes critical issues in the WordPress to local conversion
"""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional


class WPSanitizer:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.wp_json_dir = self.project_root / 'wp-json'
        self.data_output_file = self.project_root / 'src' / 'data' / 'wpData.js'
        self.public_uploads_dir = self.project_root / 'public' / 'uploads'
        
        # Path transformations
        self.old_paths = {
            'domain': 'https://evansanchez.info',
            'wp_uploads': '/wp-content/uploads/',
            'wp_themes': '/wp-content/themes/csskiller_wp',
            'wp_api': '/wp-json/wp/v2/'
        }
        self.new_paths = {
            'domain': '',
            'uploads': '/public/uploads/',
            'themes': '',
            'api': '/wp-json/wp/v2/'
        }

    def find_wp_json_files(self) -> List[Path]:
        """Recursively find all HTML files in wp-json directory"""
        files = []
        for file_path in self.wp_json_dir.rglob("*.html"):
            files.append(file_path)
        return files

    def extract_json_from_html(self, file_path: Path) -> Optional[Dict[Any, Any]]:
        """Clean and parse JSON content from HTML files"""
        try:
            content = file_path.read_text(encoding='utf-8').strip()
            
            # Skip empty files
            if not content:
                print(f"⚠️  Empty file: {file_path}")
                return None
            
            # Try to parse as JSON directly
            parsed = json.loads(content)
            return parsed
        except json.JSONDecodeError as error:
            print(f"❌ Failed to parse {file_path}: {error}")
            return None
        except Exception as error:
            print(f"❌ Error reading {file_path}: {error}")
            return None

    def sanitize_paths(self, data: Any) -> Any:
        """Sanitize paths in JSON data"""
        if not data:
            return data
        
        json_string = json.dumps(data)
        
        # Replace all WordPress-specific paths
        replacements = [
            (self.old_paths['domain'], self.new_paths['domain']),
            (self.old_paths['wp_uploads'], self.new_paths['uploads']),
            (self.old_paths['wp_themes'], self.new_paths['themes']),
            ('https://api.w.org/', ''),
            ('evansanchez.info', ''),
            ('evasanchez.info', ''),  # Handle both variations
            (r'\/', '/'),  # Fix escaped slashes
        ]
        
        for old, new in replacements:
            json_string = json_string.replace(old, new)
        
        return json.loads(json_string)

    def process_wp_json_files(self) -> Dict[str, Any]:
        """Process wp-json files and generate data structure"""
        print('🔍 Scanning wp-json directory...')
        
        files = self.find_wp_json_files()
        print(f'📁 Found {len(files)} files')
        
        data = {
            'pages': {},
            'projects': {},
            'options': {}
        }
        
        for file_path in files:
            relative_path = file_path.relative_to(self.wp_json_dir)
            print(f'📄 Processing: {relative_path}')
            
            raw_data = self.extract_json_from_html(file_path)
            if not raw_data:
                continue
            
            sanitized_data = self.sanitize_paths(raw_data)
            
            # Categorize by file path
            if 'wp/v2/pages/' in str(relative_path):
                file_id = file_path.stem
                data['pages'][file_id] = sanitized_data
            elif 'wp/v2/project/' in str(relative_path):
                file_id = file_path.stem
                data['projects'][file_id] = sanitized_data
            elif 'csskiller/v1/options' in str(relative_path):
                data['options'] = sanitized_data
        
        print(f'✅ Processed {len(data["pages"])} pages')
        print(f'✅ Processed {len(data["projects"])} projects')
        print(f'✅ Processed options: {"Yes" if data["options"] else "No"}')
        
        return data

    def generate_data_file(self, data: Dict[str, Any]) -> None:
        """Generate wpData.js file"""
        print('📝 Generating wpData.js...')
        
        # Ensure the directory exists
        self.data_output_file.parent.mkdir(parents=True, exist_ok=True)
        
        content = f"""// Auto-generated from wp-json files - do not edit manually
// Generated on: {__import__('datetime').datetime.now().isoformat()}

export const pages = {json.dumps(data['pages'], indent=2)};

export const projects = {json.dumps(data['projects'], indent=2)};

export const options = {json.dumps(data.get('options', {}), indent=2)};

// Default export for convenience
export default {{
  pages,
  projects,
  options
}};
"""

        self.data_output_file.write_text(content, encoding='utf-8')
        print(f'✅ Generated: {self.data_output_file}')

    def validate_assets(self, data: Dict[str, Any]) -> List[Dict[str, str]]:
        """Validate asset paths exist"""
        print('🔍 Validating asset paths...')
        
        missing_assets = []
        
        def check_paths(obj: Any, parent_key: str = '') -> None:
            if isinstance(obj, str) and '/public/uploads/' in obj:
                # Skip extremely long strings that are clearly HTML content
                if len(obj) > 500:
                    return
                    
                try:
                    asset_path = self.project_root / obj.lstrip('/')
                    if not asset_path.exists():
                        missing_assets.append({
                            'path': obj,
                            'full_path': str(asset_path),
                            'context': parent_key
                        })
                except OSError:
                    # Skip paths that are too long for filesystem
                    return
            elif isinstance(obj, dict):
                for key, value in obj.items():
                    check_paths(value, f'{parent_key}.{key}')
            elif isinstance(obj, list):
                for i, value in enumerate(obj):
                    check_paths(value, f'{parent_key}[{i}]')
        
        check_paths(data)
        
        if missing_assets:
            print(f'⚠️  Found {len(missing_assets)} missing assets:')
            for asset in missing_assets[:10]:
                print(f'   - {asset["path"]}')
            if len(missing_assets) > 10:
                print(f'   ... and {len(missing_assets) - 10} more')
        else:
            print('✅ All asset paths validated')
        
        return missing_assets

    def run(self) -> None:
        """Main execution"""
        print('🚀 Starting WordPress data sanitization...\n')
        
        try:
            # Check if wp-json directory exists
            if not self.wp_json_dir.exists():
                print(f'❌ wp-json directory not found: {self.wp_json_dir}')
                return
            
            # Process wp-json files
            data = self.process_wp_json_files()
            
            # Validate assets
            missing_assets = self.validate_assets(data)
            
            # Generate data file
            self.generate_data_file(data)
            
            print('\n✅ Sanitization complete!')
            
            if missing_assets:
                print('\n⚠️  Note: Some assets are missing. You may need to:')
                print('1. Copy missing files from your WordPress uploads directory')
                print('2. Update paths in wp-json files')
                print('3. Remove references to missing assets')
            
        except Exception as error:
            print(f'❌ Sanitization failed: {error}')
            raise


def main():
    """CLI entry point"""
    import sys
    
    # Get project root (parent of scripts directory)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    sanitizer = WPSanitizer(str(project_root))
    sanitizer.run()


if __name__ == '__main__':
    main()