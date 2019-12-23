import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class TranslationService {

  text = {
    IN: 'Прихід',
    OUT: 'Відхід',
    GOODS_ARRIVAL: 'Прибуття товару',
    RETURN: 'Повернення',
    SALE: 'Продаж',
    EXTERNAL_SALE: 'Продаж (поза системою)',
    GIFT: 'Подарунок',
    DEFECT: 'Списання (Брак)'
  };

  calendar_ua = {
    closeText: "Обрати",
    prevText: "Назад",
    nextText: "Вперед",
    currentText: "Сьогодні",
    monthNames: [ "Січень","Лютий","Березень","Квітень","Травень","Червень",
      "Липень","Серпень","Вересень","Жовтень","Листопад","Грудень" ],
    monthNamesShort: [ "Січ", "Лют", "Бер", "Квт", "Трв", "Чер",
      "Лип", "Срп", "Вер", "Жвт", "Лст", "Грд" ],
    dayNames: [ "Неділя", "Понеділок", "Вівторок", "Середа", "Четверь", "Пятниця", "Субота" ],
    dayNamesShort: [ "Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
    dayNamesMin: [ "Нд","Пн","Вт","Ср","Чт","Пт","Сб" ],
    weekHeader: "Тжд",
    dateFormat: "dd/mm/yy",
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: "" };

  constructor() {}

}
