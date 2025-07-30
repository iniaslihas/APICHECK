package main

import (
	"database/sql"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"net/http"
)

func NewRouter(db *sql.DB) http.Handler {
	r := mux.NewRouter()

	r.HandleFunc("/api/register", registerHandler(db)).Methods("POST")
	r.HandleFunc("/api/login", loginHandler(db)).Methods("POST")

	protected := r.PathPrefix("/api").Subrouter()
	protected.Use(AuthMiddleware)

	protected.HandleFunc("/status", statusHandler(db)).Methods("GET")
	protected.HandleFunc("/history/{name}", historyHandler(db)).Methods("GET")
	protected.HandleFunc("/add-api", addApiHandler(db)).Methods("POST")
	protected.HandleFunc("/api-configs", listApisHandler(db)).Methods("GET")
	protected.HandleFunc("/api-configs/{id}", updateDeleteApiHandler(db)).Methods("PUT", "DELETE")
	protected.HandleFunc("/users", listUsersHandler(db)).Methods("GET")
	protected.HandleFunc("/users/{id}", updateDeleteUserHandler(db)).Methods("PUT", "DELETE")

	return cors.AllowAll().Handler(r) // NOT cors.Default()
}

func writeJSON(w http.ResponseWriter, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(v)
}
