-- Tipos enumerados
CREATE TYPE task_category AS ENUM ('ACADEMIC', 'PERSONAL');
CREATE TYPE task_status   AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- Tabela de tarefas
CREATE TABLE tasks (
    id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(120)  NOT NULL,
    description TEXT,
    category    task_category NOT NULL,
    status      task_status   NOT NULL DEFAULT 'TODO',
    due_date    DATE,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT tasks_title_not_blank CHECK (length(btrim(title)) > 0)
);

-- Índices para os filtros do dashboard
CREATE INDEX idx_tasks_status   ON tasks (status);
CREATE INDEX idx_tasks_category ON tasks (category);
CREATE INDEX idx_tasks_due_date ON tasks (due_date);

-- Trigger de updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION set_updated_at();