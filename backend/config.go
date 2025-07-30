package main

import (
	"encoding/json"
	"os"
)

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

type ApiConfig struct {
	Name               string `json:"name"`
	URL                string `json:"url"`
	Interval           string `json:"interval"`
	ExpectedStatusCode int    `json:"expectedStatusCode"`
	Timeout            string `json:"timeout"`
	OwnerID            int64  `json:"ownerId"`
	Visibility         string `json:"visibility"`
}

func LoadInitialConfig(path string) ([]ApiConfig, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var cfg []ApiConfig
	if err := json.NewDecoder(f).Decode(&cfg); err != nil {
		return nil, err
	}
	return cfg, nil
}
