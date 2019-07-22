import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'enumToObjects' })
export class EnumToObjectsPipe implements PipeTransform{

  transform(enumeration: any, keyName: string = 'value', valueName: string = 'label'): any {
    let array = [];

    for (let item in enumeration) {
      let obj = {};
      obj[keyName] = item;
      obj[valueName] = enumeration[item];
      if (typeof enumeration[item] !== 'function') {
        array.push(obj);
      }

    }

    return array;
  }

}
