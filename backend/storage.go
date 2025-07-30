package main

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"log"
)

func InitDB() *sql.DB {
	db, err := sql.Open("sqlite3", "file:status.db?_foreign_keys=on")
	if err != nil {
		log.Fatal(err)
	}

	schema := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		role TEXT NOT NULL
	);
	CREATE TABLE IF NOT EXISTS apis (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		url TEXT NOT NULL,
		interval TEXT NOT NULL,
		expected_status_code INTEGER NOT NULL,
		timeout TEXT NOT NULL,
		owner_id INTEGER NOT NULL,
		visibility TEXT NOT NULL,
		FOREIGN KEY(owner_id) REFERENCES users(id)
	);
	CREATE TABLE IF NOT EXISTS health_checks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		api_id INTEGER NOT NULL,
		timestamp INTEGER NOT NULL,
		status TEXT NOT NULL,
		response_time INTEGER NOT NULL,
		error_message TEXT,
		FOREIGN KEY(api_id) REFERENCES apis(id)
	);
	`
	if _, err := db.Exec(schema); err != nil {
		log.Fatal(err)
	}

	// Seed admin if no users
	var count int
	_ = db.QueryRow("SELECT COUNT(*) FROM users").Scan(&count)
	if count == 0 {
		hash, _ := HashPassword("admin")
		_, _ = db.Exec("INSERT INTO users(username, password, role) VALUES(?,?,?)",
			"admin", hash, "admin")
	}
	return db
}
