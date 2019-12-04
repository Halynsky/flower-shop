package ua.com.flowershop.util;

import static ua.com.flowershop.util.Constants.SLASH;

public class Path {

	//	MAIN PATH
	public static final String API					= "api";

	//	CONTROLLER ENDPOINT PARTS
    public static final String AUTH				    = "auth";
    public static final String USERS	            = "users";
	public static final String ARTICLES				= "articles";
    public static final String COLORS				= "colors";
    public static final String FLOWERS				= "flowers";
    public static final String FLOWER_TYPES			= "flower-types";
    public static final String SIZES				= "sizes";
    public static final String WAREHOUSE_OPERATIONS	= "warehouse-operations";
    public static final String ORDERS	            = "orders";

	//	CONTROLLER ENDPOINTS
    public static final String AUTH_PATH 			        = API + SLASH + AUTH;
    public static final String USERS_PATH	                = API + SLASH + USERS;
	public static final String ARTICLES_PATH 			    = API + SLASH + ARTICLES;
	public static final String COLORS_PATH 			        = API + SLASH + COLORS;
	public static final String FLOWERS_PATH 			    = API + SLASH + FLOWERS;
	public static final String FLOWER_TYPES_PATH 			= API + SLASH + FLOWER_TYPES;
	public static final String SIZES_PATH			        = API + SLASH + SIZES;
	public static final String WAREHOUSE_OPERATIONS_PATH 	= API + SLASH + WAREHOUSE_OPERATIONS;
	public static final String ORDERS_PATH 		            = API + SLASH + ORDERS;

}

