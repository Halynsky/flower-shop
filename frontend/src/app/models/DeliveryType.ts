export enum DeliveryType {
  NOVA_POSHTA_DEPARTMENT = 'NOVA_POSHTA_DEPARTMENT',
  NOVA_POSHTA_COURIER = 'NOVA_POSHTA_COURIER',
  UKR_POSHTA_DEPARTMENT = 'UKR_POSHTA_DEPARTMENT',
  SELF_UZHGOROD = 'SELF_UZHGOROD'
}

export const deliveryTypeOptions = [
  {key: "NOVA_POSHTA_DEPARTMENT", label: "Самовивіз з Нової Пошти"},
  {key: "NOVA_POSHTA_COURIER", label: "Кур'єр Нова Пошта"},
  {key: "UKR_POSHTA_DEPARTMENT", label: "Самовивіз з Укр Пошти"},
  {key: "SELF_UZHGOROD", label: "Самовивіз м.Ужгород"}
];
