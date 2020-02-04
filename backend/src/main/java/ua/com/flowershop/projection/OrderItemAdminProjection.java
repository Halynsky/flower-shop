package ua.com.flowershop.projection;

public interface OrderItemAdminProjection {
    Long getId();
    String getName();
    Integer getAmount();
    Integer getPrice();
    String getImage();
    String getSizeName();
    String getFlowerTypeName();
    Long getFlowerSizeId();
    Long getOrderId();
    Integer getAvailable();
}
