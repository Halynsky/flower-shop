package ua.com.flowershop.projection;

public interface GroupShortProjection extends IdNameTupleProjection {
    String getNameOriginal();
    String getNameSingle();
    String getNameOriginalSingle();
}
