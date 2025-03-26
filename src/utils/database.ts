import fs from 'fs/promises';
import path from 'path';
import { env } from '../config/env';
import { DB_SCHEMA, DatabaseData } from '../models/db.model';

const dataFilePath = path.resolve(__dirname, '../../', env.DATA_FILE_PATH);

export const database = {
  async readData(): Promise<DatabaseData> {
    try {
      await fs.access(dataFilePath);
      const data = await fs.readFile(dataFilePath, 'utf-8');
      const parsedData = JSON.parse(data);
      const validatedData = DB_SCHEMA.parse(parsedData);
      return validatedData;
    } catch (error) {
      if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        // If the file does not exist, create a valid initial structure
        const initialData: DatabaseData = { users: [] };
        await this.writeData(initialData);
        return initialData;
      }
      throw error;
    }
  },

  async writeData(data: DatabaseData): Promise<void> {
    const validatedData = DB_SCHEMA.parse(data);
    const tempFilePath = `${dataFilePath}.tmp`;
    try {
      await fs.writeFile(tempFilePath, JSON.stringify(validatedData, null, 2), 'utf-8');
      await fs.rename(tempFilePath, dataFilePath);
    } catch (error) {
      await fs.unlink(tempFilePath).catch(() => {});
      throw error;
    }
  }
};

export const readData = database.readData.bind(database);
export const writeData = database.writeData.bind(database);