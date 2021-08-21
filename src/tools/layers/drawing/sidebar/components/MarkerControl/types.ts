import { LooseObject, DrawnObject } from "./../../../model/types/index";
import { TAbstractControlState } from "../AbstractControl/types";

export interface TMarkerControlState extends TAbstractControlState {
  iconSrcs: Set<string>;
  selectedIcon: string;
  getSelectedIcon(): string;
  setSelectedIcon(icon: string): void;
  changeIconOpts(iconOpt: LooseObject): DrawnObject | null;
  changeIconAction(icon: string): void;
  changeIconAnchor(val: number, coordinate: "x" | "y"): void;
  addIconAction(e: InputEvent): void;
  appendToIconSrcs(iconUrl: string): void;
}
