import { ModuleWithProviders, NgModule } from "@angular/core";
import { EnumToObjectsPipe } from "./enum-to-objects";
import { ToClassNamePipe } from "./to-class-name.pipe";
import { ReplaceLineBreaks } from "./replace-line-breaks";


@NgModule({
  imports: [],
  declarations: [
    EnumToObjectsPipe,
    ToClassNamePipe,
    ReplaceLineBreaks
  ],
  exports: [
    EnumToObjectsPipe,
    ToClassNamePipe,
    ReplaceLineBreaks
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

