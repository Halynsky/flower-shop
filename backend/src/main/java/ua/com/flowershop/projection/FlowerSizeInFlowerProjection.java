package ua.com.flowershop.projection;

public interface FlowerSizeInFlowerProjection {
    Long getId();
    Integer getPrice();
    Integer getAmount();
    SizeProjection getSize();
}
