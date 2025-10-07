#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;

uniform float uStart;
uniform float uEnd;
uniform float uPos;
uniform float uChange;
uniform vec2 uCover;
uniform vec2 uTextureSize;
uniform vec2 uTextureSize2;
uniform sampler2D tMap;
uniform sampler2D tMap2;

in vec2 vUv;
in vec2 vUv1;
in vec2 vUv2;

void main() {
  // float timer = sin(uTime * .0005);
  float timer = uStart;

  float mouse = 0.;

  mouse += (timer) * 2.8;
  float cols = 8.;
  vec2
  U = vUv1,
  P = vec2(cols, cols),
  C = floor(U*P)/P;
  float centpos = vUv1.x + (mouse );
  centpos += -.5 + (mouse * .4 );
  centpos *=2.;
  centpos = abs(centpos);

  float cent = (1. - vUv1.x);

  cent += -.5  + (mouse * .4 );
  cent *=2.;

  cent = abs(cent);

  float umod = floor((cent)*P.x)/P.x;
  U.x -= umod;
  
  U.x += (mouse * (umod * .2));
  U.x += (centpos*1.2) * (mouse * (umod * .1));
  U.x += umod;

  timer = uEnd;

  mouse = 0.;

  mouse -= (timer) * 2.8;

  vec2
  I = vUv2,
  Q = vec2(cols, cols),
  D = floor(I*P)/P;

  float centposi = vUv2.x + (mouse );
  centposi += -.5 + (mouse * .4 );
  centposi *=2.;
  centposi = abs(centposi);
  
  
  float centi = (1. - vUv2.x);

  centi += -.5  + (mouse * .4 );
  centi *=2.;

  centi = abs(centi);
  
  float imod = floor((centi)*Q.x)/Q.x;

  

  I.x -= imod;
  I.x += (mouse * (imod * .2));
  I.x += (centpos*1.2) * (mouse * (imod * .1));
  I.x += imod;

  float r = texture2D(tMap, vec2(U.x,U.y)).r;
  float g = texture2D(tMap, vec2(U.x,U.y)).g;
  float b = texture2D(tMap, vec2(U.x,U.y)).b;
  

  vec4 tex1 = vec4(r,g,b,1.);

  r = texture2D(tMap2, vec2(I.x,I.y)).r;
  g = texture2D(tMap2, vec2(I.x,I.y)).g;
  b = texture2D(tMap2, vec2(I.x,I.y)).b;
  

  vec4 tex2 = vec4(r,g,b,1.);

  
  // gl_FragColor.r = step(abs(uStart), fract(cols * vUv.x * -1.));
  
  
  // float change = 1. - step(uChange, fract(cols * ((uChange * .2) - vUv.x)));
  float change = 1. - step(uChange, fract(-1. * ( vUv.x )));

  gl_FragColor = mix(tex1,tex2,change);
}

//blury https://www.shadertoy.com/view/Xltfzj
//blur sin mierdas https://www.shadertoy.com/view/Mtl3Rj
//https://lygia.xyz/filter/gaussianBlur/2D