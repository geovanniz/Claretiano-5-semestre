--CREATE USER 'alunoadm'@'localhost' IDENTIFIED BY '123456';
--GRANT ALL PRIVILEGES ON Escola.* TO 'alunoadm'@'localhost';
--FLUSH PRIVILEGES;

CREATE DATABASE Escola;
      USE Escola;

      CREATE TABLE alunos (
          id    INT PRIMARY KEY AUTO_INCREMENT,
          nome  VARCHAR(100),
          idade INT,
          nota  DOUBLE
      );

      INSERT INTO alunos (nome, idade, nota) VALUES
          ('João',  20, 8.0),
          ('Maria', 22, 9.5),
          ('Ana',   19, 7.0),
          ('Pedro', 23, 6.7);