export { NgxHopscotchModule } from './src/ngx-hopscotch.module';
export { HopscotchService } from './src/hopscotch.service';

export interface TourStep {
  stepNum: number;
  stepDef: any;
  routeEnabled?: boolean;
}

export interface ReadyOptions {
  stepNum: number;
  onNext?: () => void;
  onPrev?: () => void;
}

export interface RouteOptions {
  prevPath: string;
}
