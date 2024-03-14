package ua.com.flowershop.projection;

import ua.com.flowershop.entity.Order;

public interface UserDeliveryInfoProjection {
    Long getId();
    Order.DeliveryType getDeliveryType();
    String getCity() ;
    String getStreet() ;
    String getHouse();
    String getApartment();
    String getPostalCode();
    String getNovaPoshtaDepartment();
    String getReceiverFullName();
    String getReceiverPhone();
}
