// External packages:
import mongoose, { Connection } from 'mongoose';

// Internal modules:
import config from '../../env/config.js';

// MongoDB database client class:
export class DatabaseClient {
  private connection: Connection;

  constructor() {
    this.connection = mongoose.connection;
    this.setupEventHandlers();
  }

  // Method for setting up event handlers:
  private setupEventHandlers(): void {
    this.connection.on('error', (error) => {
      console.error(`Database error. More details as follows: ${error}.`);
      process.exit(1);
    });

    this.connection.once('open', () => {
      console.log('Connected to Movie-Challenge Database.');
    });
  }

  // Method for connecting to the database:
  async connect(): Promise<void> {
    try {
      await mongoose.connect(config.connectionStringDb);
    } catch (error) {
      console.error(
        `Failed to connect to the database. More details as follows: ${error}.`
      );
      process.exit(1);
    }
  }

  // Method for disconnecting from the database:
  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from User Database.');
    } catch (error) {
      console.error(
        `Failed to disconnect from the database. More details as follows: ${error}.`
      );
      process.exit(1);
    }
  }

  // Method for getting a collection:
  async getCollection(collectionName: string): Promise<mongoose.Collection> {
    try {
      return this.connection.collection(collectionName);
    } catch (error) {
      console.error(
        `Failed to get collection. More details as follows: ${error}.`
      );
      process.exit(1);
    }
  }
}
