INSERT INTO department (name)
VALUES("Executive"), ("Engineering"), ("Security"), ("Human Resources"), ("Medical");

INSERT INTO role (title, salary, department_id)
VALUES("Captain", 90000, 1), ("First Officer", 99000, 1), ("Operations Officer", 99000, 1), 
("Chief of Engineering", 98000, 2), ("Chief of Security", 98000, 3), ("Counselor", 98000, 4), 
("Chief Medical Officer", 99000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('JeanLuc', 'Picard', 1, NULL), ('William', 'Riker', 2, 1), ('LtCmdr', 'Data', 3, 2), 
('Geordi', 'LaForge', 4, 2), ('LtCmdr', 'Worf', 5, 2), ('Deanna', 'Troi', 6, 1), ('Beverly', 'Crusher', 7, 1);