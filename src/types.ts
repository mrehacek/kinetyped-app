import p5 from "p5";

export interface KT_DataSetup {
  canvasWidth: number;
  canvasHeight: number;
}

export interface KT_DataDraw {}

export interface KT_P5 extends p5 {
  reset: () => void;
  clear: () => any; // is wrongly typed in p5
}

export type KT_SketchDataClosure = (data_setup: KT_DataSetup, data_draw: KT_DataDraw) => (p: p5) => (p: p5) => p5;
export type KT_SketchClosure = (p: p5) => (p: p5) => p5;

export interface KT_SavedDesign {
  id: string;
  name: string;
  default?: boolean;
  data_setup: KT_DataSetup;
  data_draw: KT_DataDraw;
  width: number;
  height: number;
  active: boolean;
  instance: KT_P5 | null;
  preview_image: string;
}

export interface KT_SavedDesign_LocalStorage {
  id: string;
  name: string;
  default?: boolean;
  data_setup: any;
  data_draw: any;
  width: number;
  height: number;
  preview_image: string;
}
