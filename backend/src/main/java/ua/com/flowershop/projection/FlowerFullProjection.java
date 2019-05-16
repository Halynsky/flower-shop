package ua.com.flowershop.projection;

public interface FlowerFullProjection extends FlowerProjection {

    ColorProjection getColor();
    ColorProjection getColorSecondary();

}
