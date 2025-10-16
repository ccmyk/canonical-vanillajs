#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;

uniform vec2 uCover;
uniform vec2 uTextureSize;
uniform sampler2D tMap;
uniform float uStart;
uniform float uStart1;
uniform float uTime;
uniform vec2 uMouse;

in vec2 vUv;
in float vPos;

// vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
// vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
// float cnoise(vec2 P){
//   vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
//   vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
//   Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
//   vec4 ix = Pi.xzxz;
//   vec4 iy = Pi.yyww;
//   vec4 fx = Pf.xzxz;
//   vec4 fy = Pf.yyww;
//   vec4 i = permute(permute(ix) + iy);
//   vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
//   vec4 gy = abs(gx) - 0.5;
//   vec4 tx = floor(gx + 0.5);
//   gx = gx - tx;
//   vec2 g00 = vec2(gx.x,gy.x);
//   vec2 g10 = vec2(gx.y,gy.y);
//   vec2 g01 = vec2(gx.z,gy.z);
//   vec2 g11 = vec2(gx.w,gy.w);
//   vec4 norm = 1.79284291400159 - 0.85373472095314 * 
//     vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
//   g00 *= norm.x;
//   g01 *= norm.y;
//   g10 *= norm.z;
//   g11 *= norm.w;
//   float n00 = dot(g00, vec2(fx.x, fy.x));
//   float n10 = dot(g10, vec2(fx.y, fy.y));
//   float n01 = dot(g01, vec2(fx.z, fy.z));
//   float n11 = dot(g11, vec2(fx.w, fy.w));
//   vec2 fade_xy = fade(Pf.xy);
//   vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
//   float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
//   return 2.3 * n_xy;
// }

vec2 coverTexture( vec2 imgSize, vec2 ouv, vec2 mouse) {
  vec2 s = uCover;
  vec2 i = imgSize;
  //Desplazamiento 20-80%
  // ouv.x-=( (mouse.x) * 1.2);
  ouv.x-=( (mouse.x) * 1.);

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
float sum = 0.;
vec2 mouse = uMouse;

vec2 tSize = uTextureSize;
mouse.x += (uStart) * -.8;
tSize.x *= 1. + abs(mouse.x); 

vec2 cover = coverTexture(tSize, vUv,mouse);

float cols = 8.;

float timeralpha = 0.;
float alpha = 1.;
// float alpha = 1. - step(uStart, fract(1. * vUv.x));
// mouse.x += (1. - uStart) * .8;
// mouse.x += (uStart) * -.8;

vec2 U = cover,
    P = vec2(cols, cols),
    C = floor(U*P)/P;

  

    float centpos = vUv.x + (mouse.x );
    centpos += -.5 + (mouse.x * 2.4 );
    centpos *=2.;
    centpos = abs(centpos);

    float cent = (1. - vUv.x);
    
    // float cent = vUv.y;
    //Aquí está la clave para que se pueda hacer bien el SIN pero sin centrar,
    // comentar la linea de abajo  
    cent += -.5  + (mouse.x * .4 );
    cent *=2.;
    
    //ESTO ES POR SI QUEREMOS MOVER LAS COLS
    // cent += uMouse.y;
    
    cent = abs(cent);
    
    // LO VUELVE LOCO, mucha más distorsión
    // cent *= 2.12;
    // float otro = floor(vUv.y*P.y)/P.y;
    float otro = floor((cent)*P.x)/P.x;
    //Parece un cambio de objetivo de cámara
    // otro *= vUv.x - .5;
    //Meh, no hace mucho, exagera un poco solamente
    // otro += vUv.x - .5;
    U.x -= otro;
    

    // Este es el del último video, que el ratón no repercute en la cantidad de distorsíon con posición
    U.x += (mouse.x * (otro * .2));
    U.x += (centpos*1.2) * (mouse.x * (otro * .1));
 

    // if(otro < uMouse.y){
        // U.y += ripple;
        // EFECTO REQUERIDO PERO QUEREMOS QUE SOLO SE HAGA EN 5 COLS
        // U.y += (otro * .3);
    // }

    U.x += otro;
    // EFECTO INVERT CON LO QUE SE MULTIPLICA DEL DISTORT
   
  // float chk = 0.;
  //  if(U.x > 1.){
  //     U.x -= .12;
  //   }
  //   else if(U.x < 0.){
  //     chk = 1.;
  //     U.x += .12;
  //   }

  vec2 direction = U;

  float distor = 1.;
  distor += (.006 * abs(mouse.x));

  U.x += uMouse.x * .2;

  // CONTROLAR EL DISTORT POR LOS EXTERMOS
  if(U.x > 1.){
    // distor += (.02 * abs(mouse.x - .1));
    // distor += (.002 * abs(mouse.x));
    // mouse.x *=-1.;
    // float noise = cnoise(
    // vec2(
    //   )
    // ) ;

    // U.x *= noise * (.2 - mouse.x);

  }

  if(U.x < 0.){
    // distor += (.02 * abs(mouse.x - .1));
    // distor += (.002 * abs(mouse.x));
    // float noise = cnoise(
    // vec2(
    //   )
    // ) ;

    // U.x *= noise * (1.2 + mouse.x);
  // U.y -= noise ;
  
    // U.x *= -.5;
  }

  vec2 end = U;

  // vec4 final = texture2D(tMap, U);
  float r = texture2D(tMap, vec2(end.x,end.y)).r;
  float g = texture2D(tMap, vec2(end.x,end.y)).g;
  float b = texture2D(tMap, vec2(end.x,end.y)).b;
  

  // gl_FragColor = vec4(r , g , b ,alpha);
  gl_FragColor = vec4(r , g , b ,alpha);
  
  

// if(U.x > 1.){
//     gl_FragColor = vec4(1.,0.,0.,1.);
//   }

//   if(U.x < 0.){
//     gl_FragColor = vec4(1.,0.,0.,1.);
//   }

  
  //TEST
  // gl_FragColor = vec4(centpos*.5 + (mouse.x * (otro * .2)),0.,0.,1.);
  // gl_FragColor = vec4(centpos ,0.,0.,1.);
  //gl_FragColor = vec4((0.5 * (otro)),0.,0.,1.);

  // if(chk == 1.){
  //   gl_FragColor.r = 1.;
  // }
}