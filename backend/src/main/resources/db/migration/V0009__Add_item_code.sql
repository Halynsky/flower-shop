ALTER TABLE flowers__sizes ADD COLUMN code varchar(16);

CREATE OR REPLACE FUNCTION insert_codes() RETURNS SETOF flowers__sizes AS
$BODY$
DECLARE f flowers%rowtype;
DECLARE fs flowers__sizes%rowtype;
DECLARE firstPart varchar;
DECLARE secondPart varchar;

BEGIN
    FOR f IN
        SELECT * FROM flowers
        LOOP

            FOR fs IN
                SELECT * FROM flowers__sizes WHERE flowers__sizes.flower_id = f.id
                LOOP

                    firstPart := f.flower_type_id::varchar;
                    secondPart := fs.id::varchar;

                    IF (length(firstPart) = 1) THEN
                        firstPart = concat('00', firstPart);
                    ELSE
                        firstPart = concat('0', firstPart);
                    END IF;

                    IF (length(secondPart) = 1) THEN
                        secondPart = concat('000', secondPart);
                    END IF;

                    IF (length(secondPart) = 2) THEN
                        secondPart = concat('00', secondPart);
                    END IF;

                    IF (length(secondPart) = 3) THEN
                        secondPart = concat('0', secondPart);
                    END IF;

                    UPDATE flowers__sizes SET code = concat(firstPart, secondPart) WHERE flowers__sizes.id = fs.id;

                END LOOP;

        END LOOP;
    RETURN;
END
$BODY$
    LANGUAGE plpgsql;

SELECT * FROM insert_codes();
DROP FUNCTION IF EXISTS get_all_foo;

ALTER TABLE flowers__sizes ALTER COLUMN code SET NOT NULL;
CREATE UNIQUE INDEX uk_flowers__sizes_code ON flowers__sizes (code);
