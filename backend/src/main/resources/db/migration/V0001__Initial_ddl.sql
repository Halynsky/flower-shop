create table articles
(
    id bigserial not null
        constraint articles_pkey
            primary key,
    content varchar(5000),
    created timestamp default timezone('utc'::text, now()),
    image varchar(255),
    title varchar(255)
);

create table colors
(
    id bigserial not null
        constraint colors_pkey
            primary key,
    hex varchar(255) not null
        constraint uk_pdk8a0i6fmltfxw2e18k6wyif
            unique,
    name varchar(255) not null
        constraint uk_kfulqa7c70otb7t3uwkgcpy43
            unique
);

create table flower_types
(
    id bigserial not null
        constraint flower_types_pkey
            primary key,
    image varchar(255),
    name varchar(255)
        constraint uk_gaffviqnuwkki1rb67qoflloq
            unique,
    name_original varchar(255)
        constraint uk_5nkpissta07qa16yf9xjw5915
            unique,
    name_single varchar(255)
        constraint uk_eswcnmv6pxk02s5310l4fkk4r
            unique,
    planting_material_type varchar(255)
);

create table flowers
(
    id bigserial not null
        constraint flowers_pkey
            primary key,
    created timestamp default timezone('utc'::text, now()),
    description varchar(2000),
    flower_height_max integer,
    flower_height_min integer,
    flower_size_max integer,
    flower_size_min integer,
    group_name varchar(255),
    image varchar(255),
    is_new boolean,
    is_popular boolean,
    last_supply timestamp,
    name varchar(255)
        constraint uk_p2ig9l0p39rd93y1m29t5xjs3
            unique,
    name_original varchar(255)
        constraint uk_a7rda1j2knvtnqp3qxsu2gsrt
            unique,
    next_supply timestamp,
    popularity double precision
        constraint flowers_popularity_check
            check ((popularity >= (1)::double precision) AND (popularity <= (10)::double precision)),
    color_id bigint not null
        constraint flower_color_fkey
            references colors,
    color_secondary_id bigint
        constraint flower_secondary_color_fkey
            references colors,
    flower_type_id bigint not null
        constraint flower_flower_type_fkey
            references flower_types
);

create table images
(
    id bigserial not null
        constraint images_pkey
            primary key,
    created timestamp,
    data bytea,
    extension varchar(255),
    name varchar(255)
        constraint uk_s1hn0flcjavvrkvbn1pd8dts2
            unique,
    size integer
);

create table sizes
(
    id bigserial not null
        constraint sizes_pkey
            primary key,
    name varchar(255) not null
        constraint uk_rmd719hqv99q34v9yfelrkq3v
            unique
);

create table flower_types__sizes
(
    id bigserial not null
        constraint flower_types__sizes_pkey
            primary key,
    flower_type_id bigint
        constraint fkkoua6n1jx3vtedkyis0bjmxb5
            references flower_types,
    size_id bigint
        constraint fk9i9cqf0uq4wbbp3b457ga5cd0
            references sizes
);

create table flowers__sizes
(
    id bigserial not null
        constraint flowers__sizes_pkey
            primary key,
    amount integer default 0,
    price integer default 10000,
    price_old integer,
    reserved integer default 0,
    sold integer default 0,
    flower_id bigint
        constraint fk6lxdvlqqc1cmed7v7u1u410ju
            references flowers,
    size_id bigint
        constraint fkbicwcfxcj7hf6h0pgr63pi19
            references sizes
);

create table users
(
    id bigserial not null
        constraint users_pkey
            primary key,
    created timestamp default timezone('utc'::text, now()),
    email varchar(255)
        constraint uk_6dotkott2kjsp8vw4d0m25fb7
            unique,
    facebook_nickname varchar(64),
    icon varchar(255),
    is_activated boolean default false,
    is_enabled boolean default true,
    is_virtual boolean default false,
    last_order_date timestamp,
    name varchar(255) not null,
    new_email varchar(255),
    note varchar(2000),
    password varchar(255),
    phone varchar(255),
    role varchar(255) not null,
    secret_key varchar(255)
);

create table bucket_items
(
    id bigserial not null
        constraint bucket_items_pkey
            primary key,
    amount integer,
    flower_size_id bigint
        constraint fk753791i00c66iqlkku28jkw7a
            references flowers__sizes,
    user_id bigint
        constraint fkprvkvtbi7tv6cloa7lld5fash
            references users
);

create table favorite_flowers_list
(
    id bigserial not null
        constraint favorite_flowers_list_pkey
            primary key,
    is_default boolean not null,
    name varchar(255),
    user_id bigint
        constraint favorite_flowers_list_user_fkey
            references users
);

create table flowers__favorite_flowers_lists
(
    favorite_flowers_list_id bigint not null
        constraint fkcu66walopd0x78n6je21gcsut
            references favorite_flowers_list,
    flower_id bigint not null
        constraint fk5ga3fn9ld4b5rxwk0x8fkb9c2
            references flowers,
    constraint flowers__favorite_flowers_lists_pkey
        primary key (favorite_flowers_list_id, flower_id)
);

create table orders
(
    id bigserial not null
        constraint orders_pkey
            primary key,
    closed timestamp,
    comment varchar(500),
    created timestamp default timezone('utc'::text, now()),
    delivery_address varchar(500),
    discount integer default 0,
    note varchar(2000),
    paid timestamp,
    phone varchar(255),
    post_declaration varchar(32),
    status varchar(32) default 'NEW'::character varying not null,
    total_price integer,
    user_id bigint
        constraint fk32ql8ubntj5uh44ph9659tiih
            references users
);

create table order_items
(
    id bigserial not null
        constraint order_items_pkey
            primary key,
    amount integer not null,
    price integer not null,
    flower_size_id bigint
        constraint fkg8la74083n7l9g7ubpvtfwxgy
            references flowers__sizes,
    order_id bigint
        constraint fkbioxgbv59vetrxe0ejfubep1w
            references orders,
    warehouse_operation_id bigint
);

create table social_connections
(
    id bigserial not null
        constraint social_connections_pkey
            primary key,
    created timestamp,
    provider varchar(255),
    provider_id varchar(255),
    user_id bigint
        constraint social_connection_user_fkey
            references users
);

create table warehouse_operation_types
(
    id bigserial not null
        constraint warehouse_operation_types_pkey
            primary key,
    direction varchar(255) not null,
    operation_type varchar(255) not null
);

create table warehouse_operations
(
    id bigserial not null
        constraint warehouse_operations_pkey
            primary key,
    amount integer not null,
    comment varchar(2000),
    date timestamp default timezone('utc'::text, now()),
    is_active boolean default true,
    flower_size_id bigint not null
        constraint fkh7mbixdpgyal09pm8qf19dy0e
            references flowers__sizes,
    order_item_id bigint
        constraint fk54x3mvhbrywj9phyft62tdig
            references order_items,
    warehouse_operation_type_id bigint not null
        constraint fkiuf71hcaosp8kq8th0cnrkh48
            references warehouse_operation_types
);

alter table order_items
    add constraint fkagvd3xqgqq3metdngm58991nd
        foreign key (warehouse_operation_id) references warehouse_operations;

