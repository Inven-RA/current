CREATE SCHEMA IF NOT EXISTS inveniraBD;
SET search_path TO inveniraBD;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS iaps CASCADE;
DROP TABLE IF EXISTS objective CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS users_activities CASCADE;
DROP TABLE IF EXISTS iap_ownership CASCADE;
DROP TABLE IF EXISTS iap_activities CASCADE;
DROP TABLE IF EXISTS objective_analytics CASCADE;
DROP TABLE IF EXISTS activity_connection CASCADE;
DROP TABLE IF EXISTS activity_conection CASCADE;
DROP TABLE IF EXISTS activity_connections CASCADE;
DROP TABLE IF EXISTS models CASCADE;
DROP TABLE IF EXISTS activity CASCADE;
DROP TABLE IF EXISTS deployed_iaps CASCADE;


DROP TRIGGER IF EXISTS activity_search_update_trigger ON activities CASCADE;
DROP FUNCTION IF EXISTS activity_search_update CASCADE;

DROP TRIGGER IF EXISTS iap_search_update_trigger ON iaps CASCADE;
DROP FUNCTION IF EXISTS iap_search_update CASCADE;

DROP TRIGGER IF EXISTS check_iap_ownership_trigger ON iaps CASCADE;
DROP FUNCTION IF EXISTS check_iap_ownership CASCADE;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    --username VARCHAR(256) UNIQUE NOT NULL,
    email VARCHAR(256) UNIQUE NOT NULL,
    password VARCHAR(256) NOT NULL
);

CREATE TABLE activities(
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    properties JSON,
    config_url VARCHAR(256),
    json_params VARCHAR(256),
    --json_params_url VARCHAR(256),
    user_url VARCHAR(256),
    analytics VARCHAR(256),
    --analytics_url VARCHAR(256),
    --analytics_list_url TEXT[], 
    is_deployed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE iaps(
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    properties JSON,
    nodes JSON,
    edges JSON,
    is_deployed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE deployed_iaps(
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    properties JSON,
    nodes JSON,
    edges JSON,
    objectives JSON,
    deploy_URL VARCHAR(256)
);

CREATE TABLE iap_activities(
    iap_id INTEGER REFERENCES deployed_iaps(id),
    activity_id INTEGER REFERENCES activities(id),
    act_name VARCHAR(256),
    deployment_url VARCHAR(256),
    PRIMARY KEY(iap_id, activity_id)
);

CREATE TABLE objective(
    id SERIAL PRIMARY KEY,
    iap_id INTEGER REFERENCES iaps(id),
    name VARCHAR(256) NOT NULL
);

CREATE TABLE analytics(
    id SERIAL PRIMARY KEY,
    activity_id INTEGER REFERENCES activities(id),
    name VARCHAR(256) NOT NULL,
    score INTEGER
);

CREATE TABLE users_activities(
    users_id INTEGER REFERENCES users(id),
    activity_id INTEGER REFERENCES activities(id),
    PRIMARY KEY(users_id, activity_id)
);

CREATE TABLE activity_connections(
    source INTEGER REFERENCES activities(id),
    target INTEGER REFERENCES activities(id),
    label VARCHAR(256),
    iap_id INTEGER REFERENCES iaps(id),
    PRIMARY KEY(source, target, iap_id)
);

CREATE TABLE iap_ownership(
    users_id INTEGER REFERENCES users(id),
    iap_id INTEGER REFERENCES iaps(id),
    is_owner BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY(users_id, iap_id)
);

CREATE TABLE objective_analytics(
    objective_id INTEGER REFERENCES objective(id),
    analytics_id INTEGER REFERENCES analytics(id),
    PRIMARY KEY(objective_id, analytics_id)
);

--triggers

-- CREATE FUNCTION check_iap_ownership()
-- RETURNS TRIGGER AS
-- $BODY$
-- BEGIN
--     IF NOT EXISTS (
--         SELECT *
--         FROM iap_ownership
--         WHERE users_id = NEW.users_id AND iap_id = NEW.id AND is_owner = TRUE
--     ) THEN
--         RAISE EXCEPTION 'O usuário não possui permissão para mudar o deploy para TRUE neste iaps';
--     END IF;
--     RETURN NEW;
-- END;
-- $BODY$
-- LANGUAGE plpgsql;

-- CREATE TRIGGER check_iap_ownership_trigger
-- BEFORE UPDATE ON iaps
-- FOR EACH ROW
-- EXECUTE PROCEDURE check_iap_ownership();

--indexes
-- Users
--CREATE INDEX users_username ON users USING btree (username);
--CLUSTER users USING users_username;

-- Activity
CREATE INDEX activity_name ON activities USING btree (name);

-- iaps
CREATE INDEX iap_name ON iaps USING btree (name);

-- Users Activity
CREATE INDEX activity_user_id ON users_activities USING btree (users_id);

-- Users iaps
CREATE INDEX iap_user_id ON iap_ownership USING btree (users_id);

-- iaps Activity
CREATE INDEX activity_iap_id ON iap_activities USING btree (iap_id);

-- Objective Analytics
CREATE INDEX analytics_objective_id ON objective_analytics USING btree (objective_id);

-- index search nº1
-- Add column to store computed ts_vectors.
ALTER TABLE activities
ADD COLUMN tsvector TSVECTOR;

-- Create a function to automatically update ts_vectors.
CREATE FUNCTION activity_search_update() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.tsvector = to_tsvector('portuguese', NEW.name);
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.name <> OLD.name THEN
            NEW.tsvector = to_tsvector('portuguese', NEW.name);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger before insert or update on activity.
CREATE TRIGGER activity_search_update_trigger
BEFORE INSERT OR UPDATE ON activities
FOR EACH ROW
EXECUTE FUNCTION activity_search_update();

-- Create a GIN index for ts_vectors.
CREATE INDEX activity_search_index ON activities USING GIN (tsvector);

--index search nº2
-- Add column to store computed ts_vectors.
ALTER TABLE iaps
ADD COLUMN tsvector TSVECTOR;

-- Create a function to automatically update ts_vectors.
CREATE FUNCTION iap_search_update() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.tsvector = to_tsvector('portuguese', NEW.name);
    ELSIF TG_OP = 'UPDATE' THEN
        IF NEW.name <> OLD.name THEN
            NEW.tsvector = to_tsvector('portuguese', NEW.name);
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger before insert or update on iaps.
CREATE TRIGGER iap_search_update_trigger
BEFORE INSERT OR UPDATE ON iaps
FOR EACH ROW
EXECUTE FUNCTION iap_search_update();

-- Create a GIN index for ts_vectors.
CREATE INDEX iap_search_index ON iaps USING GIN (tsvector);

/*
-- TRANSACTIONS

-- insert users
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION READ COMMITTED;

INSERT INTO users(username, email, password) 
VALUES($username, $email, $password);

COMMIT;


-- delete users
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION READ COMMITTED;

DELETE FROM iap_ownership
WHERE users_id = $id;

DELETE FROM users_activity
WHERE users_id = $id;

DELETE FROM users
WHERE id = $id;

COMMIT;


-- insert activity
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

INSERT INTO activity(name, properties, config_url, json_params_url, user_url, analytics_url, analytics_list_url)
VALUES($name, $properties, $config_url, $json_params_url, $user_url, $analytics_url, $analytics_list_url);

COMMIT;


-- delete activity
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

DELETE FROM iap_activities
WHERE activity_id = $activity_id;

DELETE FROM users_activity
WHERE activity_id = $activity_id;

DELETE FROM activity
WHERE activity_id = $activity_id;

COMMIT;


-- create iaps
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

INSERT INTO iaps(name, description, nodes, edges)
VALUES ($name, $description, $nodes, $edges);

INSERT INTO iap_ownership(users_id, iap_id, is_owner)
VALUES ($users_id, $iap_id, TRUE);

COMMIT;


-- delete iaps
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

DELETE FROM iap_activities
WHERE iap_id = $iap_id;

DELETE FROM iap_ownership
WHERE iap_id = $iap_id;

DELETE FROM iaps
WHERE iap_id = $iap_id;

DELETE FROM objectives 
WHERE iap_id = $iap_id;

COMMIT;


-- create objective
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

INSERT INTO objective(iap_id, name)
VALUES($iap_id, $name);

COMMIT;


-- delete objective
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

DELETE FROM objective_analytics
WHERE objective_id = $objective_id;

DELETE FROM objective
WHERE objective_id = $objective_id;

COMMIT;
*/



--populate

