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

export async function loadBootstrapData({ id, template } = {}) {
  try {
    const assetRoot = computeAssetRoot();

    // Ensure assetRoot always has a leading slash and no trailing slash
    const base = assetRoot || '';
    // Load the options.json file that contains global templates (nav, loader, textures)
    const optionsResponse = await fetch(`${base}/content/options.json`);
    if (!optionsResponse.ok) {
      throw new Error(`Failed to load options.json: ${optionsResponse.status}`);
    }

    const options = await optionsResponse.json();

    // Load page-specific content if id is provided
    let pageData = {};
    if (id) {
      try {
        const pageResponse = await fetch(`${base}/content/pages/${id}.json`);
        if (pageResponse.ok) {
          const pageJson = await pageResponse.json();
          // Extract the main template and other page-specific data
          if (pageJson.csskfields) {
            pageData = {
              main: pageJson.csskfields.main || '',
              ...pageJson.csskfields,
            };
          }
        }
      } catch (pageError) {
        console.warn(`Failed to load page content for id ${id}:`, pageError);
      }
    }
    
    const normalized = {
      fields: {
        base: assetRoot || '/',
        template: assetRoot || '',
      },
      // Include all the templates from options.json
      loader: options.loader || '',
      nav: options.nav || '',
      main: pageData.main || options.main || '',
      textures: options.textures || {},
      // Any other templates found in the options or page data
      ...options,
      ...pageData,
    };

    return normalized;
  } catch (error) {
    console.warn('Failed to load bootstrap data, using fallbacks:', error);
    
    // Fallback data structure if loading fails
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
