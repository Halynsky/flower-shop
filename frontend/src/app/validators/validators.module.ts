import { ModuleWithProviders, NgModule } from '@angular/core';
import { UniqueValidator } from "./unique-validator.directive";
import { RangePairValidator } from "./range-pair-validator.directive";
import { EqualValidator } from "./equal-validator.directive";
import { IsObjectValidator } from "./is-object-validator.directive";

@NgModule({
  declarations: [
    UniqueValidator,
    RangePairValidator,
    EqualValidator,
    IsObjectValidator
  ],
  imports: [
  ],
  exports: [
    UniqueValidator,
    RangePairValidator,
    EqualValidator,
    IsObjectValidator
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


