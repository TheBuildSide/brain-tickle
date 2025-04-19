import { join } from "path";

export const DB_CONFIG = {
  migrations: {
    directory: join(process.cwd(), "src/lib/migrations"),
    tableName: "questions",
    files: [
      "create_questions_table.sql",
      "add_options_column.sql",
      "add_is_done_column.sql",
      "create_feedback_table.sql",
      "add_date_to_show_column.sql",
    ],
  },
} as const;
