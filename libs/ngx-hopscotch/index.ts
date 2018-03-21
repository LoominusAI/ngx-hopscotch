export { NgxHopscotchModule } from './src/ngx-hopscotch.module';
export { HopscotchService } from './src/hopscotch.service';

export interface TourStep {
  stepIndex: number;
  stepDef: any;
}

export interface StepOptions {
  onNext?: () => void;
  onPrev?: () => void;
}
