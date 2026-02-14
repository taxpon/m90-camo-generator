import { m90VertexShader } from "../shaders/m90Vertex.glsl.ts";
import { m90FragmentShader } from "../shaders/m90Fragment.glsl.ts";
import { dazzleFragmentShader } from "../shaders/dazzleFragment.glsl.ts";

export type PatternType = 'm90' | 'dazzle';

interface ProgramInfo {
  program: WebGLProgram;
  uResolution: WebGLUniformLocation;
  uSeed: WebGLUniformLocation;
  uScale: WebGLUniformLocation;
  uComplexity: WebGLUniformLocation;
  uColor0: WebGLUniformLocation;
  uColor1: WebGLUniformLocation;
  uColor2: WebGLUniformLocation;
  uColor3: WebGLUniformLocation;
}

export class M90Renderer {
  private gl: WebGL2RenderingContext;
  private programs: Record<PatternType, ProgramInfo>;
  private vao: WebGLVertexArrayObject;
  private buffer: WebGLBuffer;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true });
    if (!gl) {
      throw new Error("WebGL2 not supported");
    }
    this.gl = gl;

    const vert = this.compileShader(gl.VERTEX_SHADER, m90VertexShader);

    this.programs = {
      m90: this.createProgram(gl, vert, m90FragmentShader),
      dazzle: this.createProgram(gl, vert, dazzleFragmentShader),
    };

    gl.deleteShader(vert);

    // Create full-screen quad VAO
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(this.programs.m90.program, "a_position");
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
    colors?: [number, number, number][],
    patternType: PatternType = 'm90'
  ): void {
    const { gl } = this;
    const info = this.programs[patternType];
    const width = gl.canvas.width;
    const height = gl.canvas.height;

    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(info.program);
    gl.uniform2f(info.uResolution, width, height);
    gl.uniform1f(info.uSeed, seed);
    gl.uniform1f(info.uScale, scale);
    gl.uniform1f(info.uComplexity, complexity);

    const c = colors ?? [
      [0.502, 0.502, 0.188],
      [0.314, 0.314, 0.196],
      [0.624, 0.584, 0.471],
      [0.227, 0.204, 0.251],
    ];
    gl.uniform3f(info.uColor0, c[0][0], c[0][1], c[0][2]);
    gl.uniform3f(info.uColor1, c[1][0], c[1][1], c[1][2]);
    gl.uniform3f(info.uColor2, c[2][0], c[2][1], c[2][2]);
    gl.uniform3f(info.uColor3, c[3][0], c[3][1], c[3][2]);

    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  dispose(): void {
    const { gl } = this;
    gl.deleteBuffer(this.buffer);
    gl.deleteVertexArray(this.vao);
    for (const key of Object.keys(this.programs) as PatternType[]) {
      gl.deleteProgram(this.programs[key].program);
    }
  }

  private createProgram(gl: WebGL2RenderingContext, vert: WebGLShader, fragSource: string): ProgramInfo {
    const frag = this.compileShader(gl.FRAGMENT_SHADER, fragSource);

    const program = gl.createProgram()!;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      gl.deleteShader(frag);
      throw new Error(`Shader program link failed: ${info}`);
    }

    gl.detachShader(program, vert);
    gl.detachShader(program, frag);
    gl.deleteShader(frag);

    return {
      program,
      uResolution: gl.getUniformLocation(program, "u_resolution")!,
      uSeed: gl.getUniformLocation(program, "u_seed")!,
      uScale: gl.getUniformLocation(program, "u_scale")!,
      uComplexity: gl.getUniformLocation(program, "u_complexity")!,
      uColor0: gl.getUniformLocation(program, "u_color0")!,
      uColor1: gl.getUniformLocation(program, "u_color1")!,
      uColor2: gl.getUniformLocation(program, "u_color2")!,
      uColor3: gl.getUniformLocation(program, "u_color3")!,
    };
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
