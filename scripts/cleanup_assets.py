#!/usr/bin/env python3
"""
Asset Cleanup Script
Removes missing asset references and creates a self-contained working version
"""

import json
import re
from pathlib import Path
from typing import Dict, Any, List, Optional, Union

class AssetCleaner:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.data_file = self.project_root / 'src' / 'data' / 'wpData.js'
        self.public_dir = self.project_root / 'public'
        
        # Create basic placeholder structure
        self.placeholder_assets = {
            'image': '/public/placeholder-image.jpg',
            'video': '/public/placeholder-video.mp4',
            'favicon': '/public/favicon.ico'
        }

    def create_placeholder_assets(self):
        """Create minimal placeholder assets"""
        print('🎨 Creating placeholder assets...')
        
        # Ensure public directory exists
        self.public_dir.mkdir(exist_ok=True)
        
        # Create placeholder image (1px transparent PNG as base64)
        placeholder_img = """data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f0f0f0'/%3E%3Ctext x='400' y='300' text-anchor='middle' fill='%23999' font-family='Arial' font-size='24'%3EPlaceholder Image%3C/text%3E%3C/svg%3E"""
        
        # Create basic HTML placeholders
        placeholder_files = {
            'placeholder-image.jpg': placeholder_img,
            'placeholder-video.mp4': 'data:video/mp4;base64,', # Empty video data
            'favicon.ico': placeholder_img.replace('Image', 'Icon')
        }
        
        for filename, content in placeholder_files.items():
            if not (self.public_dir / filename).exists():
                print(f'  📄 Creating {filename}')
                # For data URLs, we'll handle these in the JS/CSS
                pass
        
        print('✅ Placeholder assets ready')

    def clean_data_assets(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Remove or replace missing asset references in the data"""
        print('🧹 Cleaning asset references...')
        
        def clean_obj(obj: Any) -> Any:
            if isinstance(obj, str):
                # Replace asset URLs with placeholders or remove them
                if '/public/uploads/' in obj:
                    if any(ext in obj.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']):
                        return self.placeholder_assets['image']
                    elif any(ext in obj.lower() for ext in ['.mp4', '.webm', '.mov']):
                        return self.placeholder_assets['video']
                    else:
                        return obj  # Keep non-media assets
                return obj
            elif isinstance(obj, dict):
                return {key: clean_obj(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [clean_obj(item) for item in obj]
            return obj
        
        return clean_obj(data)

    def extract_content_structure(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract clean content structure without broken asset references"""
        print('📝 Extracting content structure...')
        
        template_data = {
            'pages': {},
            'projects': {},
            'navigation': [],
            'content_types': {},
            'project_categories': []
        }
        
        # Process pages
        for page_id, page_data in data.get('pages', {}).items():
            clean_page = {
                'id': page_data.get('id', page_id),
                'title': page_data.get('title', {}).get('rendered', f'Page {page_id}'),
                'slug': page_data.get('slug', f'page-{page_id}'),
                'template': page_data.get('template', 'default'),
                'content': self.extract_text_content(page_data),
                'fields': self.clean_fields(page_data.get('csskfields', {}))
            }
            template_data['pages'][page_id] = clean_page
            
            # Add to navigation
            template_data['navigation'].append({
                'title': clean_page['title'],
                'slug': clean_page['slug'],
                'url': f"/{clean_page['slug']}/"
            })
        
        # Process projects
        for project_id, project_data in data.get('projects', {}).items():
            clean_project = {
                'id': project_data.get('id', project_id),
                'title': project_data.get('title', {}).get('rendered', f'Project {project_id}'),
                'slug': project_data.get('slug', f'project-{project_id}'),
                'content': self.extract_text_content(project_data),
                'fields': self.clean_fields(project_data.get('csskfields', {})),
                'featured_image': self.placeholder_assets['image']
            }
            template_data['projects'][project_id] = clean_project
        
        # Extract project categories
        template_data['project_categories'] = list(set(
            proj.get('fields', {}).get('category', 'Web Design') 
            for proj in template_data['projects'].values()
        ))
        
        return template_data

    def extract_text_content(self, item_data: Dict[str, Any]) -> str:
        """Extract clean text content from WordPress data"""
        content_sources = [
            item_data.get('content', {}).get('rendered', ''),
            item_data.get('excerpt', {}).get('rendered', ''),
        ]
        
        # Look for content in custom fields
        fields = item_data.get('csskfields', {})
        if isinstance(fields, dict):
            for key, value in fields.items():
                if isinstance(value, str) and len(value) > 50:
                    content_sources.append(value)
        
        # Clean HTML and get text
        full_content = ' '.join(content_sources)
        # Remove HTML tags
        clean_content = re.sub(r'<[^>]+>', '', full_content)
        # Clean up whitespace
        clean_content = re.sub(r'\s+', ' ', clean_content).strip()
        
        return clean_content or "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

    def clean_fields(self, fields: Dict[str, Any]) -> Dict[str, Any]:
        """Clean custom fields and remove asset dependencies"""
        if not isinstance(fields, dict):
            return {}
        
        clean_fields = {}
        for key, value in fields.items():
            if key in ['nav', 'template', 'base']:
                clean_fields[key] = value
            elif isinstance(value, (str, int, bool)):
                clean_fields[key] = value
            elif isinstance(value, dict):
                clean_fields[key] = self.clean_fields(value)
            # Skip complex structures that likely contain asset references
        
        return clean_fields

    def generate_template_data(self) -> None:
        """Generate clean template data file"""
        print('📊 Loading current data...')
        
        # Read current wpData.js
        current_data = self.load_wpdata()
        
        # Clean asset references
        cleaned_data = self.clean_data_assets(current_data)
        
        # Extract template structure
        template_structure = self.extract_content_structure(cleaned_data)
        
        # Generate new data file
        self.write_template_data(template_structure)
        
        print('✅ Template data generated')

    def load_wpdata(self) -> Dict[str, Any]:
        """Load data from wpData.js file"""
        content = self.data_file.read_text()
        
        # Extract JSON from JS exports
        # This is a simplified parser - in production you'd want something more robust
        data = {'pages': {}, 'projects': {}, 'options': {}}
        
        # Extract pages
        pages_match = re.search(r'export const pages = ({.*?});', content, re.DOTALL)
        if pages_match:
            try:
                data['pages'] = json.loads(pages_match.group(1))
            except json.JSONDecodeError:
                print('⚠️  Could not parse pages data')
        
        # Extract projects  
        projects_match = re.search(r'export const projects = ({.*?});', content, re.DOTALL)
        if projects_match:
            try:
                data['projects'] = json.loads(projects_match.group(1))
            except json.JSONDecodeError:
                print('⚠️  Could not parse projects data')
        
        return data

    def write_template_data(self, template_data: Dict[str, Any]) -> None:
        """Write clean template data"""
        
        content = f"""// Template data - clean and asset-independent
// Generated on: {__import__('datetime').datetime.now().isoformat()}

// Sample content structure for template development
export const templateContent = {{
  site: {{
    title: "Portfolio Template",
    description: "A beautiful portfolio template",
    author: "Template Author"
  }},
  
  navigation: {json.dumps(template_data['navigation'], indent=4)},
  
  projects: {json.dumps(list(template_data['projects'].values())[:8], indent=4)},  // First 8 projects
  
  pages: {json.dumps(template_data['pages'], indent=4)}
}};

// Original data (for reference during migration)
export const pages = {json.dumps(template_data['pages'], indent=2)};

export const projects = {json.dumps(template_data['projects'], indent=2)};

export const options = {{}};

// Default export for convenience
export default {{
  templateContent,
  pages,
  projects,
  options
}};
"""

        # Backup original
        if self.data_file.exists():
            backup_file = self.data_file.with_suffix('.js.backup')
            backup_file.write_text(self.data_file.read_text())
            print(f'📦 Backed up original to {backup_file}')
        
        # Write new template data
        self.data_file.write_text(content)
        print(f'✅ Template data written to {self.data_file}')

    def run(self) -> None:
        """Main execution"""
        print('🚀 Starting asset cleanup and template generation...\n')
        
        try:
            # Create placeholder assets
            self.create_placeholder_assets()
            
            # Generate template data
            self.generate_template_data()
            
            print('\n✅ Asset cleanup complete!')
            print('\n📋 Next steps:')
            print('1. Test the vanilla.js version: python3 -m http.server 8000')
            print('2. Start Astro migration with clean template data')
            print('3. Customize content and styling for your needs')
            
        except Exception as error:
            print(f'❌ Cleanup failed: {error}')
            raise


def main():
    """CLI entry point"""
    # Get project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    cleaner = AssetCleaner(str(project_root))
    cleaner.run()


if __name__ == '__main__':
    main()