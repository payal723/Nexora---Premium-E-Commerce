import { useRef, useEffect } from 'react';

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

uniform float u_time;
uniform vec2 u_res;
uniform float u_speed;
uniform float u_scale;
uniform float u_colorIntensity;
uniform vec2 u_mouse;

const int N_BLOBS = 8;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float snoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float val = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 5; i++) {
    val += amp * snoise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return val;
}

float warpedFbm(vec2 p, float t) {
  vec2 q = vec2(fbm(p + vec2(1.7, 9.2) + 0.05 * t), fbm(p + vec2(8.3, 2.8) + 0.04 * t));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + 0.03 * t), fbm(p + 3.0 * q + vec2(8.3, 2.8) + 0.02 * t));
  return fbm(p + 2.5 * r);
}

float metaballs(vec2 p, float t) {
  vec2 center = vec2(0.0);
  float radius = 0.35;
  float accum = 0.0;
  for (int i = 0; i < N_BLOBS; i++) {
    float angle = float(i) * 6.28318 / float(N_BLOBS) + t * 0.05 * (0.5 + 0.5 * sin(float(i) * 1.3));
    float r = radius * (0.7 + 0.3 * sin(float(i) * 2.7));
    float bx = r * cos(angle) + 0.08 * sin(t * 0.07 + float(i) * 1.1);
    float by = r * sin(angle) + 0.08 * cos(t * 0.06 + float(i) * 0.9);
    float d = length(p - center - vec2(bx, by));
    float size = 0.12 + 0.06 * sin(float(i) * 1.7 + t * 0.03);
    accum += size * size / (d * d + 0.0001);
  }
  return clamp(accum, 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 aspect = vec2(u_res.x / u_res.y, 1.0);
  uv = (uv - 0.5) * aspect;
  float speed = u_speed;
  float t = u_time * speed;
  float scale = u_scale;
  vec2 p = uv * scale;
  float field = warpedFbm(p, t);
  vec3 fieldColor = 0.5 + 0.5 * vec3(
    sin(field * 3.0 + t * 0.1),
    sin(field * 5.0 + t * 0.15 + 1.0),
    sin(field * 7.0 + t * 0.08 + 2.0)
  );
  float metaballField = metaballs(p * 0.8, t * 0.5);
  vec3 metaballColor = vec3(0.2, 0.4, 0.9);
  float blend = smoothstep(0.3, 0.7, metaballField);
  vec3 blendColor = mix(fieldColor, metaballColor, blend * 0.5);
  float mouseEffect = 0.5 + 0.5 * cos(clamp(length(uv - (u_mouse - 0.5) * aspect), 0.0, 1.0) * 3.14159 * 2.0);
  blendColor = mix(blendColor, blendColor * 1.2, mouseEffect * 0.3);
  blendColor *= u_colorIntensity;
  gl_FragColor = vec4(blendColor, 1.0);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function GradientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false }) ||
               canvas.getContext('experimental-webgl', { alpha: false, antialias: false }) as WebGLRenderingContext | null;
    if (!gl) return;

    const program = gl.createProgram()!;
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_res');
    const uSpeed = gl.getUniformLocation(program, 'u_speed');
    const uScale = gl.getUniformLocation(program, 'u_scale');
    const uColorIntensity = gl.getUniformLocation(program, 'u_colorIntensity');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    gl.uniform1f(uSpeed, 0.4);
    gl.uniform1f(uScale, 2.5);
    gl.uniform1f(uColorIntensity, 0.9);

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const startTime = performance.now();
    let animationId: number;

    const cvs = canvas;
    const glCtx = gl;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      const dprWidth = Math.round(cvs.clientWidth * dpr);
      const dprHeight = Math.round(cvs.clientHeight * dpr);
      if (cvs.width !== dprWidth || cvs.height !== dprHeight) {
        cvs.width = dprWidth;
        cvs.height = dprHeight;
        glCtx.viewport(0, 0, cvs.width, cvs.height);
        glCtx.uniform2f(uRes, cvs.width, cvs.height);
      }
    }

    function render(now: number) {
      resizeCanvas();
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      glCtx.uniform1f(uTime, (now - startTime) * 0.001);
      glCtx.uniform2f(uMouse, mouse.x, mouse.y);
      glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = cvs.getBoundingClientRect();
      mouse.targetX = (e.clientX - rect.left) / cvs.clientWidth;
      mouse.targetY = 1.0 - (e.clientY - rect.top) / cvs.clientHeight;
    }

    function handleMouseLeave() {
      mouse.targetX = 0.5;
      mouse.targetY = 0.5;
    }

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="gradient-canvas-container">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
