-- Schema: film

create schema if not exists film;
alter schema film owner to film_user;

-- Table: film.films

-- DROP TABLE IF EXISTS film.films;

CREATE TABLE IF NOT EXISTS film.films
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    rating numeric NOT NULL,
    director character varying(255) COLLATE pg_catalog."default" NOT NULL,
    tags text COLLATE pg_catalog."default" NOT NULL,
    image character varying(255) COLLATE pg_catalog."default" NOT NULL,
    cover character varying(255) COLLATE pg_catalog."default" NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    about character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PK_697487ada088902377482c970d1" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS film.films
    OWNER to film_user;

-- Table: film.schedules

-- DROP TABLE IF EXISTS film.schedules;

CREATE TABLE IF NOT EXISTS film.schedules
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    daytime character varying(255) COLLATE pg_catalog."default" NOT NULL,
    hall integer NOT NULL,
    rows integer NOT NULL,
    seats integer NOT NULL,
    price numeric NOT NULL,
    taken text COLLATE pg_catalog."default" NOT NULL,
    "filmId" uuid,
    CONSTRAINT "PK_7e33fc2ea755a5765e3564e66dd" PRIMARY KEY (id),
    CONSTRAINT "FK_1c2f5e637713a429f4854024a76" FOREIGN KEY ("filmId")
        REFERENCES film.films (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS film.schedules
    OWNER to film_user;