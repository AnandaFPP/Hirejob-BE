-- TABLE DATABASE --

CREATE TABLE workers (
    worker_id VARCHAR(255) NOT NULL,
    worker_name VARCHAR(255) NOT NULL,
    worker_email VARCHAR(255) NOT NULL,
    worker_phone VARCHAR(255) NOT NULL,
    worker_photo VARCHAR(255),
    worker_pass VARCHAR(420) NOT NULL,
    worker_confirm_pass VARCHAR(420) NOT NULL,
    province VARCHAR(255),
    city VARCHAR(255),
    last_work VARCHAR,
    description VARCHAR(420),
    updated_on timestamp default CURRENT_TIMESTAMP not null,
    PRIMARY KEY(worker_id)
);

CREATE TABLE recruiter(
    recruiter_id VARCHAR NOT NULL PRIMARY KEY,
    recruiter_compname VARCHAR(255),
    recruiter_jobfield VARCHAR(255),
    recruiter_province VARCHAR(255),
    recruiter_city VARCHAR(255),
    recruiter_desc TEXT,
    recruiter_emailcomp VARCHAR(255),
    recruiter_phone VARCHAR(255),
    recruiter_linkedin VARCHAR(255),
    recruiter_name VARCHAR(255),
    recruiter_email VARCHAR(255),
    recruiter_position VARCHAR(255),
    recruiter_password VARCHAR(255),
    recruiter_confirmpassword VARCHAR(255),
    recruiter_photo VARCHAR(255),
    updated_on timestamp default CURRENT_TIMESTAMP not null,
);

CREATE TABLE skills (
    skill_id VARCHAR,
    worker_id VARCHAR(255),
    skill_name VARCHAR(255),
    PRIMARY KEY(skill_id)
);
CREATE TABLE experience (
    experience_id VARCHAR PRIMARY KEY,
    worker_id VARCHAR REFERENCES workers(worker_id),
    position VARCHAR(255),
    company_name VARCHAR(255),
    working_start DATE,
    working_end DATE,
    description TEXT,
    created_at TIMESTAMP
);
CREATE TABLE portofolio (
    porto_id VARCHAR PRIMARY KEY,
    worker_id VARCHAR NOT NULL REFERENCES workers(worker_id),
    porto_name VARCHAR(255),
    link_repo VARCHAR(420),
    porto_photo VARCHAR(516),
);

CREATE TABLE hire (
    hire_id VARCHAR PRIMARY KEY,
    hire_title TEXT,
    hire_desc TEXT,
    worker_id VARCHAR,
    recruiter_id VARCHAR,
    worker_name VARCHAR,
    worker_email VARCHAR,
    recruiter_compname VARCHAR
);

create table workers_verification
(
    id text not null ,
    worker_id text ,
    token text ,
    created_on timestamp default CURRENT_TIMESTAMP not null	,
    constraint 	workers foreign key(worker_id) 	references 	workers(worker_id) ON DELETE CASCADE,
    primary key (id)
)

CREATE FUNCTION update_updated_on_worker()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now
();
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_worker_updated_on
    BEFORE
UPDATE
    ON
        workers
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_worker
();

create table recruiter_verification
(
    id text not null ,
    recruiter_id text ,
    token text ,
    created_on timestamp default CURRENT_TIMESTAMP not null	,
    constraint 	recruiter foreign key(recruiter_id) 	references 	recruiter(recruiter_id) ON DELETE CASCADE,
    primary key (id)
)

CREATE FUNCTION update_updated_on_recruiter()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now
();
RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recruiter_updated_on
    BEFORE
UPDATE
    ON
        recruiter
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_recruiter
();