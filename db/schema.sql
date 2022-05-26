DROP DATABASE IF EXISTS enterprise;
CREATE DATABASE enterprise;

USE enterprise;

CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary INT NOT NULL,
    department_id INT,
    INDEX dept_index (department_id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    INDEX role_index (role_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id),
    INDEX manager_index (manager_id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id)
);