async function loadAppData({ device = 0, webp = 0, id = '', template = '', logged = 0, visible = 0, webgl = 1 }) {
  if (import.meta.env.DEV == true) {
    console.log('Loading app data:', { device, id, webp, template, logged, visible, webgl });
  }

  // Load BOTH options.json AND the initial page data
  try {
    // Fetch options.json (contains nav, loader, global textures)
    const optionsResponse = await fetch('/content/options.json');
    if (!optionsResponse.ok) {
      throw new Error(`Failed to load options.json: ${optionsResponse.status}`);
    }
    const optionsData = await optionsResponse.json();

    // Fetch the initial page data (contains the main HTML content)
    let pageData = null;
    if (id) {
      try {
        const templateKey = typeof template === 'string' ? template.toLowerCase() : '';
        const collection = templateKey === 'project' ? 'project' : 'pages';
        const pageResponse = await fetch(`/content/${collection}/${id}.json`);
        if (pageResponse.ok) {
          pageData = await pageResponse.json();
        }
      } catch (pageError) {
        console.warn(`Could not load page ${id}:`, pageError);
      }
    }

    // Merge the loaded data with config
    // This matches the structure expected by the original WordPress version
    return {
      device,
      webp,
      id,
      template,
      logged,
      webgl,
      visible,
      // From options.json
      nav: optionsData.nav,
      loader: optionsData.loader,
      // The 'main' field contains the initial page HTML (if available from page data)
      main: pageData?.csskfields?.main || optionsData.main || '',
      // Textures from options.json (home0, home1, about0, etc.)
      texs: optionsData.textures || {},
      textures: optionsData.textures || {},
      // Fields for base URL and template
      fields: {
        base: optionsData.fields?.base || window.location.origin,
        template: template || optionsData.fields?.template || '',
      },
    };
  } catch (error) {
    console.error('Error loading app data:', error);
    // Return minimal data to prevent complete failure
    return {
      device,
      webp,
      id,
      template,
      logged,
      webgl,
      visible,
      nav: '',
      loader: '',
      main: '',
      texs: {},
      textures: {},
      fields: {
        base: window.location.origin,
        template: template || '',
      },
    };
  }
}

export default { loadAppData };
