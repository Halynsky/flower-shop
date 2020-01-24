package ua.com.flowershop.projection;

public interface GroupProjection extends IdNameTupleProjection {
    String getNameOriginal();
    String getNameSingle();
    String getNameOriginalSingle();
}
