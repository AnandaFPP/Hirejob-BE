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
    description VARCHAR(420)
    PRIMARY KEY(worker_id)
);
CREATE TABLE worker_detail (
    id INT NOT NULL,
    worker_id VARCHAR(255) NOT NULL,
    province VARCHAR(255),
    province_id VARCHAR(255),
    city TIMESTAMP NOT NULL,
    city_id VARCHAR(255),
    last_work VARCHAR,
    description VARCHAR(420)
);
CREATE TABLE skill (
    skill_id INT,
    worker_id VARCHAR(255) NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    PRIMARY KEY(skill_id)
);
CREATE TABLE experience (
    experience_id INT PRIMARY KEY,
    worker_id VARCHAR REFERENCES workers(worker_id),
    position VARCHAR(255),
    company_name VARCHAR(255),
    working_start DATE,
    working_end DATE,
    description TEXT,
    created_at TIMESTAMP
);
CREATE TABLE portofolio (
    porto_id INT PRIMARY KEY,
    worker_id VARCHAR NOT NULL REFERENCES workers(worker_id),
    porto_name VARCHAR(255),
    link_repo VARCHAR(420),
    porto_photo VARCHAR(516),
);