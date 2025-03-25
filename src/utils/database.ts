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
      // Validação rigorosa do schema
      const validatedData = DB_SCHEMA.parse(parsedData);
      return validatedData;
    } catch (error) {
      if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        // Se o arquivo não existir, cria uma estrutura inicial válida
        const initialData: DatabaseData = { users: [] };
        await this.writeData(initialData);
        return initialData;
      }
      throw error;
    }
  },

  async writeData(data: DatabaseData): Promise<void> {
    // Valida os dados antes de escrever
    const validatedData = DB_SCHEMA.parse(data);
    // Escreve de forma atômica (usando temporary file pattern)
    const tempFilePath = `${dataFilePath}.tmp`;
    try {
      await fs.writeFile(tempFilePath, JSON.stringify(validatedData, null, 2), 'utf-8');
      await fs.rename(tempFilePath, dataFilePath);
    } catch (error) {
      // Limpa o arquivo temporário em caso de erro
      await fs.unlink(tempFilePath).catch(() => {});
      throw error;
    }
  }
};

// Métodos legados para compatibilidade (podem ser removidos depois de atualizar todos os imports)
export const readData = database.readData.bind(database);
export const writeData = database.writeData.bind(database);