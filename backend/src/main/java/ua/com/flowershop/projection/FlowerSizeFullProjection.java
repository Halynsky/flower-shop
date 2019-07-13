package ua.com.flowershop.projection;

public interface FlowerSizeFullProjection {
    Integer getPrice();

    Integer getAmount();

    Integer getReserved();

    Integer getSold();

    SizeProjection getSize();

    FlowerProjection getFlower();
}
