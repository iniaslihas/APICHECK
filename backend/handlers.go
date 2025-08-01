package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

/* ---------- Auth ---------- */

func registerHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Username string `json:"username"`
			Password string `json:"password"`
			Role     string `json:"role"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		hash, _ := HashPassword(req.Password)
		_, err := db.Exec("INSERT INTO users(username, password, role) VALUES(?,?,?)",
			req.Username, hash, req.Role)
		if err != nil {
			http.Error(w, "user exists", http.StatusConflict)
			return
		}
		writeJSON(w, map[string]string{"status": "created"})
	}
}

func loginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		var user User
		err := db.QueryRow("SELECT id, password, role FROM users WHERE username=?", req.Username).
			Scan(&user.ID, &user.Password, &user.Role)
		if err != nil || !CheckPassword(user.Password, req.Password) {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		token, _ := GenerateToken(&user)
		writeJSON(w, map[string]string{"token": token})
	}
}

/* ---------- Dashboard ---------- */

func statusHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := getUser(r)
		query := `
		SELECT apis.id, apis.name, apis.url, apis.expected_status_code,
		       health_checks.status, health_checks.response_time, health_checks.timestamp
		FROM apis
		LEFT JOIN health_checks ON health_checks.id = (
		    SELECT id FROM health_checks WHERE api_id = apis.id ORDER BY timestamp DESC LIMIT 1
		)
		WHERE apis.visibility = 'public' OR apis.owner_id = ?
		`
		rows, err := db.Query(query, user.UserID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		type item struct {
			ID           int64  `json:"id"`
			Name         string `json:"name"`
			Status       string `json:"status"`
			ResponseTime int64  `json:"responseTime"`
			LastChecked  int64  `json:"lastChecked"`
		}
		var res []item
		for rows.Next() {
			var id int64
			var name, url, status string
			var code int
			var rt sql.NullInt64
			var ts sql.NullInt64
			_ = rows.Scan(&id, &name, &url, &code, &status, &rt, &ts)
			res = append(res, item{
				Name:         name,
				Status:       status,
				ResponseTime: rt.Int64,
				LastChecked:  ts.Int64,
			})
		}
		writeJSON(w, res)
	}
}

/* ---------- History ---------- */

func historyHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		name := mux.Vars(r)["name"]
		user := getUser(r)
		var apiID int64
		var ownerID int64
		err := db.QueryRow(`
			SELECT id, owner_id FROM apis WHERE name = ? AND (visibility = 'public' OR owner_id = ?)
		`, name, user.UserID).Scan(&apiID, &ownerID)
		if err != nil {
			http.Error(w, "not found", http.StatusNotFound)
			return
		}

		rows, err := db.Query(`
			SELECT timestamp, status, response_time, error_message
			FROM health_checks WHERE api_id = ? ORDER BY timestamp DESC LIMIT 500
		`, apiID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		type rec struct {
			Timestamp    int64  `json:"timestamp"`
			Status       string `json:"status"`
			ResponseTime int64  `json:"responseTime"`
			ErrorMessage string `json:"errorMessage"`
		}
		var data []rec
		for rows.Next() {
			var ts int64
			var st string
			var rt int64
			var em sql.NullString
			_ = rows.Scan(&ts, &st, &rt, &em)
			data = append(data, rec{ts, st, rt, em.String})
		}
		writeJSON(w, data)
	}
}

/* ---------- API CRUD ---------- */

func addApiHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var api Api
		if err := json.NewDecoder(r.Body).Decode(&api); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		user := getUser(r)
		res, err := db.Exec(`
			INSERT INTO apis(name, url, interval, expected_status_code, timeout, owner_id, visibility)
			VALUES(?,?,?,?,?,?,?)
		`, api.Name, api.URL, api.Interval, api.ExpectedStatusCode, api.Timeout, user.UserID, api.Visibility)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		id, _ := res.LastInsertId()
		writeJSON(w, map[string]int64{"id": id})
	}
}

func listApisHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user := getUser(r)
		var rows *sql.Rows
		var err error
		if user.Role == "admin" {
			rows, err = db.Query("SELECT * FROM apis")
		} else {
			rows, err = db.Query("SELECT * FROM apis WHERE owner_id = ?", user.UserID)
		}
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var apis []Api
		for rows.Next() {
			var a Api
			_ = rows.Scan(&a.ID, &a.Name, &a.URL, &a.Interval, &a.ExpectedStatusCode, &a.Timeout, &a.OwnerID, &a.Visibility)
			apis = append(apis, a)
		}
		writeJSON(w, apis)
	}
}

func updateDeleteApiHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, _ := strconv.ParseInt(mux.Vars(r)["id"], 10, 64)
		user := getUser(r)
		var owner int64
		_ = db.QueryRow("SELECT owner_id FROM apis WHERE id = ?", id).Scan(&owner)
		if user.Role != "admin" && owner != user.UserID {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
		switch r.Method {
		case http.MethodDelete:
			_, _ = db.Exec("DELETE FROM apis WHERE id = ?", id)
			writeJSON(w, map[string]string{"status": "deleted"})
		case http.MethodPut:
			var api Api
			_ = json.NewDecoder(r.Body).Decode(&api)
			_, _ = db.Exec(`
				UPDATE apis SET name=?, url=?, interval=?, expected_status_code=?, timeout=?, visibility=?
				WHERE id = ?
			`, api.Name, api.URL, api.Interval, api.ExpectedStatusCode, api.Timeout, api.Visibility, id)
			writeJSON(w, map[string]string{"status": "updated"})
		}
	}
}

/* ---------- User CRUD ---------- */

func listUsersHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, _ := db.Query("SELECT id, username, role FROM users")
		defer rows.Close()
		var users []User
		for rows.Next() {
			var u User
			_ = rows.Scan(&u.ID, &u.Username, &u.Role)
			users = append(users, u)
		}
		writeJSON(w, users)
	}
}

func updateDeleteUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, _ := strconv.ParseInt(mux.Vars(r)["id"], 10, 64)
		switch r.Method {
		case http.MethodDelete:
			_, _ = db.Exec("DELETE FROM users WHERE id = ?", id)
			writeJSON(w, map[string]string{"status": "deleted"})
		case http.MethodPut:
			var u User
			_ = json.NewDecoder(r.Body).Decode(&u)
			hash, _ := HashPassword(u.Password)
			_, _ = db.Exec("UPDATE users SET username=?, password=?, role=? WHERE id=?",
				u.Username, hash, u.Role, id)
			writeJSON(w, map[string]string{"status": "updated"})
		}
	}
}
