precision highp float;

uniform float uStart;
uniform float uTime;
uniform vec2 uCover;
uniform vec2 uTextureSize;
uniform sampler2D tMap;

varying vec2 vUv;

vec2 coverTexture( vec2 imgSize, vec2 ouv, vec2 mouse) {
  vec2 s = uCover;
  vec2 i = imgSize;

  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
  vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
  vec2 uv = ouv * s / new + offset;

  return uv;
}

void main() {
  vec2 cover = coverTexture(uTextureSize, vUv,vec2(0.));
  gl_FragColor  = texture2D(tMap, cover);
}