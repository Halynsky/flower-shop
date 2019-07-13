package ua.com.flowershop.projection;

public interface FlowerSizeShortProjection {
    Integer getPrice();
    Integer getAmount();
    Integer getReserved();
    Integer getSold();
    SizeProjection getSize();
    FlowerShortProjection getFlower();
}
