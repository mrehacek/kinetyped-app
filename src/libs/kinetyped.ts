import p5 from "p5";
import opentype from "opentype.js";

export type Vec2D = {
  x: number;
  y: number;
};

// TODO: constant rate interpolation for curves 

function interpolate_line(unit_length: number, p0: Vec2D, p1: Vec2D): p5.Vector[] {
  const points = [];
  let v1 = new p5.Vector(p0.x, p0.y);
  let v2 = new p5.Vector(p1.x, p1.y);
  const length = v2.dist(v1);
  const num_points = Math.floor(length / unit_length);
  for (let i = 0; i < num_points; i++) {
    let pp = p5.Vector.lerp(v1, v2, i / num_points);
    points.push(pp);
  }
  return points;
}

function quadratic_lerp(v0: p5.Vector, v1: p5.Vector, v2: p5.Vector, t: number): p5.Vector {
  return p5.Vector.lerp(p5.Vector.lerp(v0, v1, t), p5.Vector.lerp(v1, v2, t), t);
}

function interpolate_bezier_quadratic(unit_length: number, p0: Vec2D, p1: Vec2D, p2: Vec2D): p5.Vector[] {
  const points: p5.Vector[] = [];
  let v0 = new p5.Vector(p0.x, p0.y);
  let v1 = new p5.Vector(p1.x, p1.y);
  let v2 = new p5.Vector(p2.x, p2.y);
  // P(t) = P0*(1-t)^2 + P1*2*(1-t)*t + P2*t^2

  const length = 30;
  // TODO: calculate quadratic bezier arc length
  /*
      https://stackoverflow.com/questions/1074395/quadratic-bezier-interpolation
      Usually, a common method to traverse a parametric curve at constant-speed is to reparametrize by arc-length. 
      This means expressing P as P(s) where s is the length traversed along the curve. 
      Obviously, s varies from zero to the total length of the curve. In the case of a quadratic bezier curve, 
      there's a closed-form solution for the arc-length as a function of t, but it's a bit complicated. 
      Computationally, it's often faster to just integrate numerically using your favorite method. 
      Notice however that the idea is to compute the inverse relation, that is, t(s), so as to express P as P(t(s)). 
      Then, choosing evenly-spaced s will produce evenly-space P.
      */
  const num_points = Math.floor(length / unit_length);
  for (let i = 0; i < num_points; i++) {
    let t = i / num_points;
    let pp = quadratic_lerp(v0, v1, v2, t);
    points.push(pp);
  }
  return points;
}

/**
 * Interpolate (rasterize) font paths to get points
 * @param glyphs to interpolate
 * @param interpolation_resolution eg. if set to 3, every 3 pixels on a curve will be a point
 * @param vis_buf draw control points to this buffer for debug visualization, clears this buffer before drawing
 * @returns uniformly distributed points along the paths of the glyphs
 */
function interpolate_glyphs(
  glyphs: opentype.Path[],
  interpolation_resolution: number,
  vis_buf: p5.Graphics
): { glyph_points_separated: p5.Vector[][]; glyph_points: p5.Vector[] } {
  let glyph_points: p5.Vector[] = [];
  let glyph_points_separated: p5.Vector[][] = [];
  let pos = { x: 0, y: 0 };
  // @ts-expect-error
  vis_buf.clear();

  for (const glyph of glyphs) {
    let curr_glyph_points: p5.Vector[] = [];
    //console.log(glyph.commands);

    for (const cmd of glyph.commands) {
      switch (cmd.type) {
        case "M": {
          pos = { x: cmd.x, y: cmd.y };
          break;
        }
        case "L": {
          curr_glyph_points = curr_glyph_points.concat(interpolate_line(interpolation_resolution, pos, cmd));
          vis_buf.vertex(cmd.x, cmd.y);
          pos = { x: cmd.x, y: cmd.y };
          visualizeVertex(vis_buf, pos);
          break;
        }
        case "C": {
          console.error("Cubic bezier is not supported yet.");
          //p.bezier(curr_pos.x, curr_pos.y, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
          pos = { x: cmd.x, y: cmd.y };
          break;
        }
        case "Q": {
          vis_buf.vertex(pos.x, pos.y);
          const v1 = { x: cmd.x1, y: cmd.y1 };
          curr_glyph_points = curr_glyph_points.concat(
            interpolate_bezier_quadratic(interpolation_resolution, pos, v1, cmd)
          );
          vis_buf.quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y);
          pos = { x: cmd.x, y: cmd.y };
          vis_buf.push();
          vis_buf.fill(20, 100, 100);
          vis_buf.noStroke();
          vis_buf.circle(cmd.x1, cmd.y1, 3);
          vis_buf.fill(220, 100, 100);
          vis_buf.circle(cmd.x, cmd.y, 3);
          vis_buf.pop();
          break;
        }
      }
    }
    glyph_points_separated.push(curr_glyph_points);
    glyph_points = glyph_points.concat(curr_glyph_points);
  }
  return { glyph_points_separated, glyph_points };
}

function visualizeVertex(p: p5, pos: Vec2D) {
  p.push();
  p.fill(220, 100, 100);
  p.noStroke();
  p.circle(pos.x, pos.y, 5);
  p.pop();
}

// TOOD: possibly doesnt work
function drawShape(p: p5, glyphs: opentype.Path[]) {
  let pos = { x: 0, y: 0 };
  for (const glyph of glyphs) {
    // letters with holes (eg. o, P) come as a series of M and Z commands
    // we can draw them in P5 as follows:
    //   - call beginShape for the outer shape initialized by first M command
    //   - for every subsequent M command for the same glyph use beginContour-endContour pair
    //   - call endShape lastly
    // eg. beginShape->[beginContour->endContour, ..]->endShape
    let first_shape = true;
    for (const cmd of glyph.commands) {
      switch (cmd.type) {
        case "M": {
          pos = { x: cmd.x, y: cmd.y };
          first_shape ? p.beginShape() : p.beginContour();
          break;
        }
        case "L": {
          p.vertex(cmd.x, cmd.y);
          pos = { x: cmd.x, y: cmd.y };
          break;
        }
        case "C": {
          console.error("Implement cubic bezier");
          pos = { x: cmd.x, y: cmd.y };
          break;
        }
        case "Q": {
          p.vertex(pos.x, pos.y);
          const v1 = { x: cmd.x1, y: cmd.y1 };
          //p.quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y);
          p.quadraticVertex(
            cmd.x1 + p.noise(cmd.x1, p.millis() / 400) * 15,
            cmd.y1 + p.noise(cmd.y1, p.millis() / 400) * 15,
            cmd.x,
            cmd.y
          );
          pos = { x: cmd.x, y: cmd.y };
          break;
        }
        case "Z": {
          if (first_shape) {
            first_shape = false;
          } else {
            p.endContour();
          }
          break;
        }
      }
    }
    p.endShape(p.CLOSE);
  }
}

export { interpolate_line, interpolate_bezier_quadratic, visualizeVertex, interpolate_glyphs };
