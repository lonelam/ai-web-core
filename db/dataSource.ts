import dataSourceConfig from '../src/dataSource.config';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource(dataSourceConfig);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
export default AppDataSource;
