package ua.com.flowershop.projection;

public interface FlowerSizeShortProjection {
    Long getId();
    Integer getPrice();
    Integer getAmount();
    Integer getReserved();
    Integer getSold();
    SizeProjection getSize();
    FlowerShortProjection getFlower();
}
