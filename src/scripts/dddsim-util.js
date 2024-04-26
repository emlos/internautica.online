class GameDB {
  constructor (dbName, storeName) {
    this.dbName = dbName
    this.storeName = storeName
    this.dbVersion = 1 // Start with version 1, increment if schema changes are needed
    this.db = null // This will hold the opened database
  }

  //prepare to put data into db table 'store': 'saves'
  async open() {
    if (this.db) return this.db; // Use already opened database

    const openDatabase = (version) => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, version);
            request.onerror = (event) => {
                console.error("Database error: ", event.target.errorCode);
				
                reject(new Error(event.target.errorCode));
            };
            request.onsuccess = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.close();
                    resolve(openDatabase(version + 1)); // Recursively attempt to open with incremented version
                } else {
                    resolve(db);
                }
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    console.log("Creating object store");
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
            request.onblocked = () => {
                console.warn("Please close all other tabs with this site open!");
                reject(new Error("Database open blocked"));
            };
        });
    };

    this.db = await openDatabase(this.dbVersion);
    return this.db; // Return the opened database
}


  async close () {
    if (this.db) {
      this.db.close()
      this.db = null
      console.log('Database connection closed.')
    }
  }

  async saveGameState (gameState) {
	
    await this.open()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)

      console.log(gameState)
      const request = store.put(gameState)

      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = event => reject(event.target.errorCode)
    })
  }

  async loadGameState (save_id) {
    await this.open()
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName])
      const store = transaction.objectStore(this.storeName)
      const request = store.get(save_id)

      request.onsuccess = event => {
        resolve(event.target.result)
      }
      request.onerror = event => {
        reject(event.target.errorCode)
      }
    })
  }

  async loadAllStates() {
	const db = await this.open();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([this.storeName], 'readonly');
		const store = transaction.objectStore(this.storeName);
		const request = store.getAll();

		request.onsuccess = () => {
			resolve(request.result);
		};
		request.onerror = (event) => {
			reject(event.target.errorCode);
		};
	});
}
  async deleteGameState (save_id) {
    await this.open() // Ensure the database is open
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(save_id)

      request.onsuccess = () => resolve()
      request.onerror = event => reject(event.target.errorCode)
    })
  }

  async deleteDatabase () {
    await this.close() // Make sure to close the database connection first
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.dbName)

      request.onsuccess = () => {
        console.log('Database deleted successfully')
        resolve()
      }

      request.onerror = event => {
        console.error('Database deletion failed: ', event.target.errorCode)
        reject(event.target.errorCode)
      }

      request.onblocked = () => {
        //console.log("Database deletion blocked. Make sure all connections are closed.");
        this.deleteDatabase()
      }
    })
  }
}

var SaveManager = new GameDB('DDDSIM-DEV', 'saves')
