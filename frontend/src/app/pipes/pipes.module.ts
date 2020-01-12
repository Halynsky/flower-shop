import { ModuleWithProviders, NgModule } from "@angular/core";
import { EnumToObjectsPipe } from "./enum-to-objects";
import { ToClassNamePipe } from "./to-class-name.pipe";


@NgModule({
  imports: [],
  declarations: [
    EnumToObjectsPipe,
    ToClassNamePipe
  ],
  exports: [
    EnumToObjectsPipe,
    ToClassNamePipe
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

