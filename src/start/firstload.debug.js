const computeAssetRoot = () => {
  // Check if body element exists and has dataset
  if (!document.body) {
    console.error('[firstload] document.body not found!');
    return '';
  }
  
  const raw = (document.body?.dataset?.js ?? '').trim();
  console.log('[firstload] document.body.dataset.js =', raw);
  
  if (!raw) {
    console.log('[firstload] No data-js attribute on body, using empty asset root');
    return '';
  }
  
  if (/^https?:\/\//.test(raw)) {
    try {
      const result = new URL(raw, window.location.origin).pathname.replace(/\/+$/, '');
      console.log('[firstload] Parsed URL asset root:', result);
      return result;
    } catch (err) {
      console.error('[firstload] Error parsing URL:', err);
      return '';
    }
  }
  
  const result = `/${raw.replace(/^\/+|\/+$/g, '')}`;
  console.log('[firstload] Computed asset root:', result);
  return result;
};

export async function loadBootstrapData({ id, template } = {}) {
  try {
    console.log('[firstload] Computing assetRoot...');
    const assetRoot = computeAssetRoot();
    console.log('[firstload] assetRoot =', assetRoot);

    // Ensure assetRoot always has a leading slash and no trailing slash
    const base = assetRoot || '';
    console.log('[firstload] base path for fetches =', base);
    // Load the options.json file that contains global templates (nav, loader, textures)
    const optionsUrl = `${base}/content/options.json`;
    console.log('[firstload] Loading options from:', optionsUrl);
    const optionsResponse = await fetch(optionsUrl);
    if (!optionsResponse.ok) {
      throw new Error(`Failed to load options.json: ${optionsResponse.status} ${optionsResponse.statusText}`);
    }

    const options = await optionsResponse.json();
    console.log('[firstload] Options loaded successfully', { 
      loaderPresent: !!options.loader,
      navPresent: !!options.nav,
      loaderLength: options.loader ? options.loader.length : 0
    });

    // Load page-specific content if id is provided
    let pageData = {};
    if (id) {
      const pageUrl = `${base}/content/pages/${id}.json`;
      console.log('[firstload] Loading page data from:', pageUrl);
      try {
        const pageResponse = await fetch(pageUrl);
        if (pageResponse.ok) {
          const pageJson = await pageResponse.json();
          console.log('[firstload] Page data loaded', { 
            id, 
            hasFields: !!pageJson.csskfields 
          });
          // Extract the main template and other page-specific data
          if (pageJson.csskfields) {
            pageData = {
              main: pageJson.csskfields.main || '',
              ...pageJson.csskfields,
            };
          }
        } else {
          console.warn(`[firstload] Page data fetch failed with status: ${pageResponse.status} ${pageResponse.statusText}`);
        }
      } catch (pageError) {
        console.warn(`[firstload] Failed to load page content for id ${id}:`, pageError);
      }
    }
    
    // Ensure we have textures data and that it's duplicated to the texs property
    const textures = pageData.textures || options.textures || {};
    
    const normalized = {
      fields: {
        base: assetRoot || '/',
        template: assetRoot || '',
      },
      // Include all the templates from options.json
      loader: options.loader || '',
      nav: options.nav || '',
      main: pageData.main || options.main || '',
      textures: textures,
      texs: textures, // Duplicate textures to texs for backward compatibility
      // Any other templates found in the options or page data
      ...options,
      ...pageData,
    };

    console.log('[firstload] Final data structure:', {
      hasLoader: !!normalized.loader,
      hasNav: !!normalized.nav,
      hasMain: !!normalized.main,
      loaderLength: normalized.loader.length
    });

    return normalized;
  } catch (error) {
    console.error('[firstload] Failed to load bootstrap data:', error);
    
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