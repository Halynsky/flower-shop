import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class TranslationService {

  text = {
    directions: {
      IN: 'Прихід',
      OUT: 'Відхід'
    },
    operationTypes: {
      GOODS_ARRIVAL: 'Прибуття товару',
      RETURN: 'Повернення',
      SALE: 'Продаж',
      EXTERNAL_SALE: 'Продаж (поза системою)',
      GIFT: 'Подарунок',
      DEFECT: 'Списання (брак)',
      MISTAKE: 'Списання (помилкове внесення)'
    },
    orderStatuses: {
      NEW: "Нове",
      PROCESSING: "В обробці",
      DELIVERING: "Відправлено",
      RETURNED: "Повернено",
      CANCELED: "Відмінено",
      CANCELED_AUTO: "Відмінено (автоматично)",
      DONE: "Виконано"
    }
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
    yearSuffix: "",
    today: 'Сьогодні',
    clear: 'Очистити'
  };

  constructor() {}

}
