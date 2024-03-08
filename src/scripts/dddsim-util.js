class GameDB {
	constructor(dbName, storeName) {
		this.dbName = dbName;
		this.storeName = storeName;
		this.db = null;
	}

	async open() {
		if (this.db) return;

		this.db = await new Promise((resolve, reject) => {
			const request = indexedDB.open(this.dbName, 1);

			request.onerror = (event) => {
				console.error("Database error: ", event.target.errorCode);
				reject(event.target.errorCode);
			};

			request.onsuccess = (event) => {
				resolve(event.target.result);
			};

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				db.createObjectStore(this.storeName, { keyPath: "save_id" });
			};
		});
	}

	async saveGameState(gameState) {
		await this.open();
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction([this.storeName], "readwrite");
			const store = transaction.objectStore(this.storeName);
			const request = store.put(gameState);

			request.onsuccess = () => resolve();
			request.onerror = (event) => reject(event.target.errorCode);
		});
	}

	async loadGameState(save_id) {
		await this.open();
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction([this.storeName]);
			const store = transaction.objectStore(this.storeName);
			const request = store.get(save_id);

			request.onsuccess = (event) => {
				resolve(event.target.result);
			};
			request.onerror = (event) => {
				reject(event.target.errorCode);
			};
		});
	}

    async deleteGameState(save_id) {
        await this.open(); // Ensure the database is open
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);
          const request = store.delete(save_id);
      
          request.onsuccess = () => resolve();
          request.onerror = (event) => reject(event.target.errorCode);
        });
      }
}

const SaveManager = new GameDB("TestDB", "saves");
