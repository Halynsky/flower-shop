package ua.com.flowershop.util;

import static ua.com.flowershop.util.Constants.SLASH;

public class Path {

	//	MAIN PATH
	public static final String API					= "api";

	//	CONTROLLER ENDPOINT PARTS
    public static final String AUTH				    = "auth";
    public static final String USERS	            = "users";
    public static final String PROFILE	            = "profile";
    public static final String SOCIAL				= "social";
	public static final String ARTICLES				= "articles";
    public static final String COLORS				= "colors";
    public static final String GROUPS				= "groups";
    public static final String FLOWERS				= "flowers";
    public static final String FLOWER_TYPES			= "flower-types";
    public static final String SIZES				= "sizes";
    public static final String FLOWER_SIZES = "flower-sizes";
    public static final String WAREHOUSE_OPERATIONS	= "warehouse-operations";
    public static final String ORDERS	            = "orders";
    public static final String BUCKET	            = "buckets";
    public static final String IMAGES               = "images";

	//	CONTROLLER ENDPOINTS
    public static final String AUTH_PATH 			        = API + SLASH + AUTH;
    public static final String USERS_PATH	                = API + SLASH + USERS;
    public static final String PROFILE_PATH	                = API + SLASH + PROFILE;
    public static final String SOCIAL_PATH	                = API + SLASH + SOCIAL;
	public static final String ARTICLES_PATH 			    = API + SLASH + ARTICLES;
	public static final String COLORS_PATH 			        = API + SLASH + COLORS;
    public static final String GROUPS_PATH 			        = API + SLASH + GROUPS;
	public static final String FLOWERS_PATH 			    = API + SLASH + FLOWERS;
	public static final String FLOWER_TYPES_PATH 			= API + SLASH + FLOWER_TYPES;
	public static final String SIZES_PATH			        = API + SLASH + SIZES;
    public static final String FLOWER_SIZES_PATH            = API + SLASH + FLOWER_SIZES;
	public static final String WAREHOUSE_OPERATIONS_PATH 	= API + SLASH + WAREHOUSE_OPERATIONS;
	public static final String ORDERS_PATH 		            = API + SLASH + ORDERS;
    public static final String BUCKET_PATH 		            = API + SLASH + BUCKET;
    public static final String IMAGES_PATH                  = API + SLASH + IMAGES;

	// OTHER
    public static final String EMAIL                    = "email";
    public static final String CONFIRM				    = "confirm";
    public static final String ACTIVATION				= "activation";
    public static final String PASSWORD_RESTORE         = "password-restore";
    public static final String ICON                     = "icon";

    // PATH VARIABLES
    public static final String ID_PATH_VARIABLE         = "/{id}";

}

