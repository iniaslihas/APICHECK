package main

import (
	"context"
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"time"
)

func StartMonitoring(ctx context.Context, db *sql.DB) {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			var apis []Api
			rows, _ := db.Query("SELECT id, url, expected_status_code, timeout FROM apis")
			for rows.Next() {
				var a Api
				_ = rows.Scan(&a.ID, &a.URL, &a.ExpectedStatusCode, &a.Timeout)
				apis = append(apis, a)
			}
			rows.Close()

			for _, api := range apis {
				go checkAPI(db, api)
			}
		}
	}
}

func checkAPI(db *sql.DB, api Api) {
	start := time.Now()
	timeout, _ := time.ParseDuration(api.Timeout)
	client := http.Client{Timeout: timeout}
	req, _ := http.NewRequest("GET", api.URL, nil)
	req.Header.Set("User-Agent", "api-status-dashboard/1.0")
	resp, err := client.Do(req)
	duration := time.Since(start).Milliseconds()

	status := "UP"
	errMsg := ""
	if err != nil {
		status = "DOWN"
		errMsg = err.Error()
	} else {
		defer resp.Body.Close()
		io.Copy(io.Discard, resp.Body)
		if resp.StatusCode != api.ExpectedStatusCode {
			status = "DOWN"
			errMsg = fmt.Sprintf("unexpected status %d", resp.StatusCode)
		}
	}
	_, _ = db.Exec(`
		INSERT INTO health_checks(api_id, timestamp, status, response_time, error_message)
		VALUES(?,?,?,?,?)
	`, api.ID, time.Now().Unix(), status, duration, errMsg)
}
