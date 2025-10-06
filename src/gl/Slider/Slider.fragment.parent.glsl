precision highp float;

// Default uniform for previous pass is 'tMap'.
// Can change this using the 'textureUniform' property
// when adding a pass.
uniform sampler2D tMap;

uniform float uTime;
uniform float uStart;
uniform float uHover;

varying vec2 vUv;

//https://www.shadertoy.com/view/XsfSRr
// https://www.shadertoy.com/view/3sjBRR
//CIRCULAR, ESTO ES JUGABLE https://www.shadertoy.com/view/XtjGWm
//OTRO https://www.shadertoy.com/view/WdVSWd
//https://www.shadertoy.com/view/NtGczw
//https://www.shadertoy.com/view/Ds2XRR
//BASTANTE SENCILLO https://www.shadertoy.com/view/3sBXDh
// SENCILLITO https://www.shadertoy.com/view/mslSzs
//SIMPLE TAMBIEN Y CON GRAD https://www.shadertoy.com/view/ct2cRD
  void main() {
    
    // vec3 kernel[SAMPLES] = vec3[70][
    // v3(-3,-2,0.0099343), v3(-3,-1,0.0158491), v3(-3,0,0.0198582), v3(-3,1,0.0193742), v3(-3,2,0.01562), v3(-3,3,0.0092086), v3(-2,-3,0.0036023), v3(-2,-2,0.017351), v3(-2,-1,0.026431), v3(-2,0,0.0318141), v3(-2,1,0.0318476), v3(-2,2,0.0282652), v3(-2,3,0.0207794), v3(-2,4,0.0100408), v3(-1,-3,0.0118306), v3(-1,-2,0.0230702), v3(-1,-1,0.028688), v3(-1,0,0.0287297), v3(-1,1,0.0291755), v3(-1,2,0.0288904), v3(-1,3,0.0242141), v3(-1,4,0.0133157), v3(0,-3,0.0177183), v3(0,-2,0.0269386), v3(0,-1,0.0255012), v3(0,0,0.0231038), v3(0,1,0.0240891), v3(0,2,0.0266765), v3(0,3,0.026509), v3(0,4,0.0185881), v3(1,-4,0.0066892), v3(1,-3,0.0225386), v3(1,-2,0.0271861), v3(1,-1,0.0236909), v3(1,0,0.0199988), v3(1,1,0.0204911), v3(1,2,0.0250744), v3(1,3,0.0265619), v3(1,4,0.0210398), v3(2,-4,0.0087099), v3(2,-3,0.0241667), v3(2,-2,0.027311), v3(2,-1,0.0227511), v3(2,0,0.019024), v3(2,1,0.0192731), v3(2,2,0.023786), v3(2,3,0.0278565), v3(2,4,0.022605), v3(2,5,0.0069317), v3(3,-4,0.0080222), v3(3,-3,0.0218081), v3(3,-2,0.0268296), v3(3,-1,0.0238996), v3(3,0,0.0200351), v3(3,1,0.0195484), v3(3,2,0.0230739), v3(3,3,0.0269896), v3(3,4,0.0210053), v3(3,5,0.0032463), v3(4,-3,0.0189985), v3(4,-2,0.026861), v3(4,-1,0.0267855), v3(4,0,0.0236707), v3(4,1,0.0230364), v3(4,2,0.0262396), v3(4,3,0.0261808), v3(4,4,0.0176466), v3(5,-3,0.0156334), v3(5,-2,0.0255458), v3(5,-1,0.0285479), v3(5,0,0.029006), v3(5,1,0.0285642), v3(5,2,0.0279639), v3(5,3,0.0220895), v3(5,4,0.011235), v3(6,-3,0.007862), v3(6,-2,0.021451), v3(6,-1,0.0280171), v3(6,0,0.0326608), v3(6,1,0.032852), v3(6,2,0.0261432), v3(6,3,0.0160087), v3(7,-2,0.0028554), v3(7,-1,0.0142694), v3(7,0,0.0180889), v3(7,1,0.0194572), v3(7,2,0.0142807)
    // ];

  // float moder = sin(uTime * .0005);
  //PARA QUE EL HOVER SEA MÁS LOCOS
  float moder = clamp((uStart * .5) + uHover,0.,1.);
  // ALGO MÁS TRANQUI
  // float moder = clamp(uStart,0.,1.);

  float cols = 16.;
  vec2 U = vec2(vUv.x - (moder * .2 ), vUv.y);
  vec2 P = vec2(cols, cols);
  vec2 C = floor(U*P)/P;

  vec2 mouse = vec2(moder,0.);
    
    float centpos = vUv.x + (mouse.x );
    // centpos += -.5;
    // centpos *=2.;
    // centpos = abs(centpos);

    float cent = (1. - vUv.x);

    cent += -.5;
    cent *=2.;

    float otro = floor((cent)*P.x)/P.x;
    U.x -= otro ;

    U.x += (mouse.x * (otro * .2) );
    U.x += (centpos*1.2) * (mouse.x * (otro * .1));

  float hov = .1 * uHover;
    U.x += otro + (otro * hov) + (uHover * .16);

  // U.y += moder * .1002;

  float r = texture2D(tMap, vec2(U.x,U.y)).r;
  float g = texture2D(tMap, vec2(U.x,U.y)).g;
  float b = texture2D(tMap, vec2(U.x,U.y)).b;
  
  float a = texture2D(tMap, vec2(vUv.x,vUv.y)).a ;

  gl_FragColor = vec4(r , g , b ,a);
  // gl_FragColor.a = step(uTime, fract(16. * vUv.x));
  
  // gl_FragColor = vec4(U.x,0.,0. ,a);
  
  
  }
