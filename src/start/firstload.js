const computeAssetRoot = () => {
  const raw = (document.body?.dataset?.js ?? '').trim();
  if (!raw) return '';
  if (/^https?:\/\//.test(raw)) {
    try {
      return new URL(raw, window.location.origin).pathname.replace(/\/+$/, '');
    } catch {
      return '';
    }
  }
  return `/${raw.replace(/^\/+|\/+$/g, '')}`;
};

export async function loadBootstrapData() {
  try {
    const assetRoot = computeAssetRoot();
    
    // Load the options.json file that contains templates
    const response = await fetch('/content/options.json');
    if (!response.ok) {
      throw new Error(`Failed to load options.json: ${response.status}`);
    }
    
    const options = await response.json();
    
    const normalized = {
      fields: {
        base: assetRoot || '/',
        template: assetRoot || '',
      },
      // Include all the templates from options.json
      loader: options.loader || '',
      nav: options.nav || '',
      main: options.main || '',
      textures: options.textures || {},
      // Any other templates found in the options
      ...options,
    };

    return normalized;
  } catch (error) {
    console.warn('Failed to load options.json, using fallbacks:', error);
    
    // Fallback data structure if options.json fails to load
    const assetRoot = computeAssetRoot();
    return {
      fields: {
        base: assetRoot || '/',
        template: assetRoot || '',
      },
      loader: '',
      nav: '',
      main: '',
      textures: {},
    };
  }
}

export default { loadBootstrapData };
