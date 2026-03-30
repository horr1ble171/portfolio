/**
 * Silk Background Animation
 * Ported from React Three Fiber to Vanilla Three.js
 */

class SilkBackground {
  constructor(options = {}) {
    this.container = document.getElementById(options.containerId || 'silk-container');
    if (!this.container) return;

    this.settings = {
      speed: options.speed || 5,
      scale: options.scale || 1,
      color: options.color || '#7B7481',
      noiseIntensity: options.noiseIntensity || 1.5,
      rotation: options.rotation || 0,
    };

    this.init();
  }

  hexToNormalizedRGB(hex) {
    hex = hex.replace('#', '');
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255
    ];
  }

  init() {
    // Scene setup
    this.scene = new THREE.Scene();

    // Camera setup - Orthographic for 2D plane covering screen
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    // Shaders
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vPosition = position;
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec3 vPosition;

      uniform float uTime;
      uniform vec3  uColor;
      uniform float uSpeed;
      uniform float uScale;
      uniform float uRotation;
      uniform float uNoiseIntensity;

      const float e = 2.71828182845904523536;
      const float TWO_PI = 6.28318530718;

      float noise(vec2 texCoord) {
        float G = e;
        // Modulo 2*PI fixes precision loss at high screen coordinates (x > 2048)
        vec2  r = (G * sin(mod(G * texCoord, TWO_PI)));
        return fract(r.x * r.y * (1.0 + texCoord.x));
      }

      vec2 rotateUvs(vec2 uv, float angle) {
        float c = cos(angle);
        float s = sin(angle);
        mat2  rot = mat2(c, -s, s, c);
        return rot * uv;
      }

      void main() {
        // Restored original noise function and parameter
        float rnd        = noise(gl_FragCoord.xy);
        vec2  uv         = rotateUvs(vUv * uScale, uRotation);
        vec2  tex        = uv * uScale;
        float tOffset    = uSpeed * uTime;

        tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

        float pattern = 0.6 +
                        0.4 * sin(5.0 * (tex.x + tex.y +
                                         cos(3.0 * tex.x + 5.0 * tex.y) +
                                         0.02 * tOffset) +
                                 sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

        vec4 col = vec4(uColor, 1.0) * vec4(pattern) - (rnd / 15.0) * uNoiseIntensity;
        col.a = 1.0;
        gl_FragColor = col;
      }
    `;



    // Uniforms
    const rgb = this.hexToNormalizedRGB(this.settings.color);
    this.uniforms = {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(rgb[0], rgb[1], rgb[2]) },
      uSpeed: { value: this.settings.speed },
      uScale: { value: this.settings.scale },
      uRotation: { value: this.settings.rotation },
      uNoiseIntensity: { value: this.settings.noiseIntensity }
    };

    // Mesh
    const geometry = new THREE.PlaneGeometry(2.1, 2.1);
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    // Resize listener
    window.addEventListener('resize', () => this.onResize());

    // Start animation loop
    this.animate();
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Update time matching the R3F implementation (0.1 * delta)
    // We'll use a constant delta or performance.now()
    const now = performance.now() * 0.001;
    if (!this.lastTime) this.lastTime = now;
    const delta = now - this.lastTime;
    this.lastTime = now;

    this.uniforms.uTime.value += 0.1 * delta;

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.silkBackground = new SilkBackground({
    speed: 15,
    scale: 1,
    color: '#323232',
    noiseIntensity: 1.5,
    rotation: 0
  });
});
