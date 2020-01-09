import { ModuleWithProviders, NgModule } from '@angular/core';
import { UniqueValidator } from "./unique-validator.directive";
import { RangePairValidator } from "./range-pair-validator.directive";
import { EqualValidator } from "./equal-validator.directive";

@NgModule({
  declarations: [
    UniqueValidator,
    RangePairValidator,
    EqualValidator
  ],
  imports: [
  ],
  exports: [
    UniqueValidator,
    RangePairValidator,
    EqualValidator
  ],
  providers: []
})
export class ValidatorsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ValidatorsModule,
    };
  }
}


