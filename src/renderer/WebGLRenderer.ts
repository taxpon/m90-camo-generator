import { m90VertexShader } from "../shaders/m90Vertex.glsl.ts";
import { m90FragmentShader } from "../shaders/m90Fragment.glsl.ts";

export class M90Renderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private buffer: WebGLBuffer;
  private uResolution: WebGLUniformLocation;
  private uSeed: WebGLUniformLocation;
  private uScale: WebGLUniformLocation;
  private uComplexity: WebGLUniformLocation;
  private uColor0: WebGLUniformLocation;
  private uColor1: WebGLUniformLocation;
  private uColor2: WebGLUniformLocation;
  private uColor3: WebGLUniformLocation;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true });
    if (!gl) {
      throw new Error("WebGL2 not supported");
    }
    this.gl = gl;

    // Compile shaders
    const vert = this.compileShader(gl.VERTEX_SHADER, m90VertexShader);
    const frag = this.compileShader(gl.FRAGMENT_SHADER, m90FragmentShader);

    // Link program
    const program = gl.createProgram()!;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      throw new Error(`Shader program link failed: ${info}`);
    }

    // Shaders can be detached after linking
    gl.detachShader(program, vert);
    gl.detachShader(program, frag);
    gl.deleteShader(vert);
    gl.deleteShader(frag);

    this.program = program;

    // Get uniform locations
    this.uResolution = gl.getUniformLocation(program, "u_resolution")!;
    this.uSeed = gl.getUniformLocation(program, "u_seed")!;
    this.uScale = gl.getUniformLocation(program, "u_scale")!;
    this.uComplexity = gl.getUniformLocation(program, "u_complexity")!;
    this.uColor0 = gl.getUniformLocation(program, "u_color0")!;
    this.uColor1 = gl.getUniformLocation(program, "u_color1")!;
    this.uColor2 = gl.getUniformLocation(program, "u_color2")!;
    this.uColor3 = gl.getUniformLocation(program, "u_color3")!;

    // Create full-screen quad VAO
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Two triangles covering clip space [-1, 1]
    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);

    this.vao = vao;
    this.buffer = buffer;
  }

  render(
    seed: number,
    scale: number,
    complexity: number = 0.5,
    colors?: [number, number, number][]
  ): void {
    const { gl, program } = this;
    const width = gl.canvas.width;
    const height = gl.canvas.height;

    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.uniform2f(this.uResolution, width, height);
    gl.uniform1f(this.uSeed, seed);
    gl.uniform1f(this.uScale, scale);
    gl.uniform1f(this.uComplexity, complexity);

    // Default M90 colors if none provided
    const c = colors ?? [
      [0.502, 0.502, 0.188],
      [0.314, 0.314, 0.196],
      [0.624, 0.584, 0.471],
      [0.227, 0.204, 0.251],
    ];
    gl.uniform3f(this.uColor0, c[0][0], c[0][1], c[0][2]);
    gl.uniform3f(this.uColor1, c[1][0], c[1][1], c[1][2]);
    gl.uniform3f(this.uColor2, c[2][0], c[2][1], c[2][2]);
    gl.uniform3f(this.uColor3, c[3][0], c[3][1], c[3][2]);

    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  dispose(): void {
    const { gl } = this;
    gl.deleteBuffer(this.buffer);
    gl.deleteVertexArray(this.vao);
    gl.deleteProgram(this.program);
  }

  private compileShader(type: number, source: string): WebGLShader {
    const { gl } = this;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(
        `Shader compile failed (${type === gl.VERTEX_SHADER ? "vertex" : "fragment"}): ${info}`
      );
    }

    return shader;
  }
}
