ALTER TABLE favorite_flowers_list
    RENAME TO favorite_items_list;

CREATE TABLE flower_sizes__favorite_items_lists
(
    favorite_items_list_id bigint not null
        constraint fk_flower_sizes__favorite_items_list_1
            references favorite_items_list,
    flower_size_id bigint not null
        constraint fk_flower_sizes__favorite_items_list_2
            references flowers__sizes,
    constraint flower_sizes__favorite_items_list_pkey
        primary key (favorite_items_list_id, flower_size_id)
);

INSERT INTO flower_sizes__favorite_items_lists (favorite_items_list_id, flower_size_id)
SELECT fffs.favorite_flowers_list_id as favorite_flowers_list_id, fs.id as flower_size_id
FROM flowers__favorite_flowers_lists as fffs
         LEFT JOIN flowers__sizes fs on fffs.flower_id = fs.flower_id;

DROP TABLE flowers__favorite_flowers_lists;
