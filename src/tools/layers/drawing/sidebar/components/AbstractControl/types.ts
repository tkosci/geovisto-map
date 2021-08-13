import { DrawnObject } from './../../../model/types/index';
export type ControlProps = {
  tabControl: any;
};

export type ControlStateProps = ControlProps & {
  control: any;
};

export interface TAbstractControlState {
  tabControl: any;
  tool: any;
  control: any;
  _getSelected(): DrawnObject;
  _getExtraSelected(): DrawnObject[];
  _redrawSidebar(type?: string): void;
}
