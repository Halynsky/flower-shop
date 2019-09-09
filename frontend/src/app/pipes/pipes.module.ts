import { ModuleWithProviders, NgModule } from "@angular/core";
import { EnumToObjectsPipe } from "./enum-to-objects";


@NgModule({
  imports: [],
  declarations: [
    EnumToObjectsPipe
  ],
  exports: [
    EnumToObjectsPipe
  ]
})

export class PipesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PipesModule,
      providers: [ EnumToObjectsPipe ]
    };
  }
}

