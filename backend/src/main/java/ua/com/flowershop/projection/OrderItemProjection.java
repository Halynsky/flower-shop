package ua.com.flowershop.projection;

public interface OrderItemProjection {
    Long getId();
    String getName();
    Integer getAmount();
    Integer getPrice();
    String getImage();
    String getSizeName();
    Long getFlowerSizeId();
    String getFlowerTypeName();
    Long getOrderId();
    String getCode();
}
