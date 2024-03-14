create table user_delivery_infos
(
    apartment              varchar(255),
    city                   varchar(255),
    delivery_type          varchar(255),
    house                  varchar(255),
    nova_poshta_department varchar(255),
    postal_code            varchar(20),
    receiver_full_name     varchar(255),
    receiver_phone         varchar(20),
    street                 varchar(255),
    concated_address       text,
    user_id                bigint not null
        primary key
        constraint user_delivery_info_fk
            references users
);