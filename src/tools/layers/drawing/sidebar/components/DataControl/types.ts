import { LooseObject } from './../../../model/types/index';
import { TAbstractControlState } from '../AbstractControl/types';

export type TData = LooseObject;
export type TFilterValue = string;

export interface TDataControlState extends TAbstractControlState {
  data: TData[];
  identifierType: string;
  filtersAmount: number;
  filtersKeys: string[];
  filtersValues: TFilterValue[];
  clearFilters(): void;
  getFiltersKey(idx: number): string;
  getFiltersValue(idx: number): TFilterValue;
  setFiltersKey(idx: number, value: string): void;
  setFiltersValue(idx: number, value: TFilterValue): void;
  increaseFilters(): void;
  decreaseFilters(): void;
  getIdentifierType(): string;
  changeWhichIdUseAction(e: InputEvent): void;
  changeIdentifierAction(id: string): void;
  changeDescriptionAction(e: InputEvent): void;
  changeDesc(inputText: string): void;
  callIdentifierChange(haveToCheckFilters?: boolean): void;
}
