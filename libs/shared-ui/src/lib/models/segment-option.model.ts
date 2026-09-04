export interface SegmentOption<TValue extends string = string> {
  readonly value: TValue;
  readonly label: string;
  readonly description?: string;
}
