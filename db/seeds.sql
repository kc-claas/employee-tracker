DO $$
  BEGIN

      INSERT INTO department (name)
      VALUES
        ('tests'),
        ('examples');

      INSERT INTO role (title, salary, department_id)
      VALUES
        ('Maestro of tests', 50000, 1),
        ('Lord of examples', 40000, 2);

      INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES
        ('Abraham', 'Athens', 1, null),
        ('Bianca', 'Boston', 2, null);


RAISE NOTICE 'Transaction complete';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM;
        ROLLBACK;
END $$;