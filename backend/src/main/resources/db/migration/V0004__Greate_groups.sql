DROP TABLE flower_types__sizes;

create table groups
(
    id bigserial not null
        constraint groups_pkey
            primary key,
    name varchar(255),
    name_original varchar(255),
    name_original_single varchar(255),
    name_single varchar(255),
    flower_type_id bigint
        constraint fkb9vuttw4lkeygajpyf5uxbbfn
            references flower_types
);

ALTER TABLE flowers ADD COLUMN group_id bigint;
ALTER TABLE flowers ADD CONSTRAINT flower_group_fkey FOREIGN KEY (group_id) REFERENCES groups (id);
ALTER TABLE flowers DROP COLUMN group_name;
