import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

const DATABASE_NAME = 'little_lemon3';

// Initialize the database and create the menu table if it doesn't exist
export const initializeDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Insert menu items into the database
export const insertMenuItem = async (name, price, description, image, category) => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await db.runAsync(
      'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
      [name, price, description, image, category]
    );
  } catch (error) {
    console.error('Error inserting menu item:', error);
  }
};

// Load menu items from the database and update state
export const loadMenuItems = async (setMenuItems, selected = '', query = '') => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    let sql = 'SELECT * FROM menu';
    const params = [];

    if (selected || query) {
      sql += ' WHERE';
      if (selected) {
        sql += ' category = ?';
        params.push(selected.toLowerCase());
      }
      if (query) {
        sql += selected ? ' AND' : '';
        sql += ' name LIKE ?';
        params.push(`%${query}%`);
      }
    }

    const filteredRows = await db.getAllAsync(sql, params);
    setMenuItems(filteredRows);
    console.log(sql);
    console.log("filter");

  } catch (error) {
    console.error('Error loading filtered menu items:', error);
  }
};

// Load initial menu items from the database and update state
export const loadinitialMenuItems = async (setMenuItems) => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    let sql = 'SELECT * FROM menu';

    const allRows = await db.getAllAsync(sql);
    if (allRows.length > 0) {
      setMenuItems(allRows);
      console.log("getall")
    } else {
      await fetchMenuItems(setMenuItems);
      console.log("fetch");
    }
  } catch (error) {
    console.error('Error loading filtered menu items:', error);
  }
};

// Fetch menu items from the remote server and store them in the database
export const fetchMenuItems = async (setMenuItems) => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
    const data = await response.json();

    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    for (const item of data.menu) {
      await insertMenuItem(
        item.name,
        item.price,
        item.description,
        item.image,
        item.category
      );
    }
    //await db.runAsync('DELETE FROM menu');
    const allRows = await db.getAllAsync('SELECT * FROM menu');
    setMenuItems(allRows);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    Alert.alert('Failed to fetch menu', 'Please check your internet connection.');
  }
};
