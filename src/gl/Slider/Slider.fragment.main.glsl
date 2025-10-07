#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;

uniform float uStart;
uniform float uTime;
uniform vec2 uCover;
uniform vec2 uTextureSize;
uniform sampler2D tMap;

in vec2 vUv;

vec2 coverTexture( vec2 imgSize, vec2 ouv, vec2 mouse) {
  vec2 s = uCover;
  vec2 i = imgSize;
  //Desplazamiento 20-80%
  // ouv.x-=( (mouse.x) * 1.2);

  //Desplazamiento brusco
  // ouv.x-=( (mouse.x) * 2.);
  // i.y *= 1.2;

  
  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
  vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
  vec2 uv = ouv * s / new + offset;
  
  // uv.x *= 1. + (1. * (.5 *  ( 1. + sin(time*.002))));
  // uv.x -= .05 * (.5 *  ( 1. + sin(time*.002)));
  // uv.x += .02 *  sin(time*.001);
  

  // uv.x += .6 * mouse.x;

  // uv.x += .05 * ( (sin(time*.002)));
  // return texture2D(tex, uv);
  return uv;
}

void main() {

  vec2 cover = coverTexture(uTextureSize, vUv,vec2(0.));
  gl_FragColor  = texture2D(tMap, cover);
  
  
}