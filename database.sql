-------------------------------------------------------
--------------------------------------------------
-- START FROM SCRATCH:
DROP TRIGGER IF EXISTS "on_user_update" ON "user";
DROP TABLE IF EXISTS "user";


-------------------------------------------------------
--------------------------------------------------
-- TABLE SCHEMAS:
CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR (80) UNIQUE NOT NULL,
  "password" VARCHAR (1000) NOT NULL,
  "inserted_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);


-------------------------------------------------------
--------------------------------------------------
-- SEED DATA:
--   You'll need to actually register users via the application in order to get hashed
--   passwords. Once you've done that, you can modify this INSERT statement to include
--   your dummy users. Be sure to copy/paste their hashed passwords, as well.
--   This is only for development purposes! Here's a commented-out example:
-- INSERT INTO "user"
--   ("username", "password")
--   VALUES
--   ('unicorn10', '$2a$10$oGi81qjXmTh/slGzYOr2fu6NGuCwB4kngsiWQPToNrZf5X8hxkeNG'), --pw: 123
--   ('cactusfox', '$2a$10$8./c/6fB2BkzdIrAUMWOxOlR75kgmbx/JMrMA5gA70c9IAobVZquW'); --pw: 123


-------------------------------------------------------
--------------------------------------------------
-- AUTOMAGIC UPDATED_AT:

-- Did you know that you can make and execute functions
-- in PostgresQL? Wild, right!? I'm not making this up. Here
-- is proof that I am not making this up:
  -- https://x-team.com/blog/automatic-timestamps-with-postgresql/

-- Create a function that sets a row's updated_at column
-- to NOW():
CREATE OR REPLACE FUNCTION set_updated_at_to_now() -- 👈
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger on the user table that will execute
-- the set_update_at_to_now function on any rows that
-- have been touched by an UPDATE query:
CREATE TRIGGER on_user_update
BEFORE UPDATE ON "user"
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at_to_now();


--DROP TABLE IF EXISTS "job_requests";
--DROP TABLE IF EXISTS "jobs";
--DROP TABLE IF EXISTS "idea";
--DROP TABLE IF EXISTS "photos";
--DROP TABLE IF EXISTS "artists";
--DROP TABLE IF EXISTS "organizations";
--DROP TABLE IF EXISTS "user";
--DROP TABLE IF EXISTS "user_organizations";
--
--



CREATE TABLE "user"(
    "id" SERIAL NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT '0',
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_artist" BOOLEAN NOT NULL DEFAULT '0',
    "is_banned" BOOLEAN NOT NULL DEFAULT '0',
    "is_organization" BOOLEAN NOT NULL DEFAULT '0',
    "profile_pic" VARCHAR(255) NULL,
    "linkedin" TEXT NULL,
    "facebook" TEXT NULL,
    "insta" TEXT NULL,
    "website" TEXT NULL,
    "bio" TEXT NULL,
    "phone" VARCHAR(255) NULL
);
ALTER TABLE
    "user" ADD PRIMARY KEY("id");
CREATE TABLE "artists"(
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "soundcloud_id" VARCHAR(255) NULL,
    "spotify_id" VARCHAR(255) NULL,
    "accepted_jobs" TEXT NULL,
    "headline_description" VARCHAR(255) NULL
);
ALTER TABLE
    "artists" ADD PRIMARY KEY("id");
ALTER TABLE
    "artists" ADD CONSTRAINT "artists_user_id_unique" UNIQUE("user_id");
CREATE TABLE "organizations"(
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NULL,
    "description" TEXT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mission_statement" VARCHAR(255) NULL
);
ALTER TABLE
    "organizations" ADD PRIMARY KEY("id");
ALTER TABLE
    "organizations" ADD CONSTRAINT "organizations_user_id_unique" UNIQUE("user_id");
CREATE TABLE "photos"(
    "id" SERIAL NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "image_url" VARCHAR(255) NULL,
    "title" VARCHAR(255) NULL,
    "description" VARCHAR(255) NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "photos" ADD PRIMARY KEY("id");
CREATE TABLE "jobs"(
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NULL,
    "description" TEXT NULL,
    "deadline" DATE NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_archived" BOOLEAN NOT NULL DEFAULT '0'
);
ALTER TABLE
    "jobs" ADD PRIMARY KEY("id");
CREATE TABLE "job_requests"(
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "job_requests" ADD PRIMARY KEY("id");
CREATE TABLE "ideas"(
    "id" SERIAL NOT NULL,
    "artist_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(0) WITH
        TIME zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "is_archived" BOOLEAN NOT NULL DEFAULT '0',
        "idea" TEXT NULL
);
ALTER TABLE
    "ideas" ADD PRIMARY KEY("id");
CREATE TABLE "user_organizations"(
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL
);
ALTER TABLE
    "user_organizations" ADD PRIMARY KEY("id");
ALTER TABLE
    "user_organizations" ADD CONSTRAINT "user_organizations_user_id_unique" UNIQUE("user_id");
ALTER TABLE
    "ideas" ADD CONSTRAINT "ideas_artist_id_foreign" FOREIGN KEY("artist_id") REFERENCES "artists"("id");
ALTER TABLE
    "artists" ADD CONSTRAINT "artists_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "user"("id");
ALTER TABLE
    "photos" ADD CONSTRAINT "photos_artist_id_foreign" FOREIGN KEY("artist_id") REFERENCES "artists"("id");
ALTER TABLE
    "jobs" ADD CONSTRAINT "jobs_organization_id_foreign" FOREIGN KEY("organization_id") REFERENCES "organizations"("id");
ALTER TABLE
    "user_organizations" ADD CONSTRAINT "user_organizations_organization_id_foreign" FOREIGN KEY("organization_id") REFERENCES "organizations"("id");
ALTER TABLE
    "job_requests" ADD CONSTRAINT "job_requests_artist_id_foreign" FOREIGN KEY("artist_id") REFERENCES "artists"("id");
ALTER TABLE
    "organizations" ADD CONSTRAINT "organizations_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "user"("id");
ALTER TABLE
    "user_organizations" ADD CONSTRAINT "user_organizations_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "user"("id");
ALTER TABLE
    "job_requests" ADD CONSTRAINT "job_requests_job_id_foreign" FOREIGN KEY("job_id") REFERENCES "jobs"("id");
    /*Added the extra column to artists*/
    ALTER TABLE "artists" 
ADD COLUMN "card_photo" TEXT;
    /*Added the extra column to idea table*/
    ALTER TABLE "ideas" 
ADD COLUMN "title" TEXT NOT NULL;
