export enum DeliveryType {
  NOVA_POSHTA_DEPARTMENT = 'NOVA_POSHTA_DEPARTMENT',
  NOVA_POSHTA_COURIER = 'NOVA_POSHTA_COURIER',
  UKR_POSHTA = 'UKR_POSHTA',
  SELF_UZHGOROD = 'SELF_UZHGOROD'
}

export const deliveryTypeOptions = [
  {key: "NOVA_POSHTA_DEPARTMENT", label: "Самовивіз з Нової Пошти"},
  {key: "NOVA_POSHTA_COURIER", label: "Кур'єр Нова Пошта"},
  {key: "UKR_POSHTA", label: "Укр Пошта"},
  {key: "SELF_UZHGOROD", label: "Самовивіз з м.Ужгород"}
];
