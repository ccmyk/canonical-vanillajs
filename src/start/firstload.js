async function loadAppData({device=0, webp=0, id='', template='', logged=0, visible=0, webgl=1}){
  
  if(import.meta.env.DEV == true){
    console.log('Loading app data:', {device, id, webp, template, logged, visible, webgl})
  }

  // Return configuration object directly - no fetch needed
  return {
    device,
    webp,
    id,
    template,
    logged,
    webgl,
    visible
  }
}

export default { loadAppData }
