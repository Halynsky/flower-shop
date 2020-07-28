import { ModuleWithProviders, NgModule } from "@angular/core";
import { DigitOnlyDirective } from "./ditgits-only.directive";
import { MinMaxDirective } from "./minmax.directive";

@NgModule({
  imports: [],
  declarations: [
    DigitOnlyDirective,
    MinMaxDirective
  ],
  exports: [
    DigitOnlyDirective,
    MinMaxDirective
  ]
})

export class DirectivesModule {
  static forRoot(): ModuleWithProviders<DirectivesModule> {
    return {
      ngModule: DirectivesModule
    };
  }
}

