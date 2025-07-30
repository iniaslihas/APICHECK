package main

type User struct {
	ID       int64  `json:"id"`
	Username string `json:"username"`
	Password string `json:"-"`
	Role     string `json:"role"`
}

type Api struct {
	ID                 int64  `json:"id"`
	Name               string `json:"name"`
	URL                string `json:"url"`
	Interval           string `json:"interval"`
	ExpectedStatusCode int    `json:"expectedStatusCode"`
	Timeout            string `json:"timeout"`
	OwnerID            int64  `json:"ownerId"`
	Visibility         string `json:"visibility"`
}

type HealthCheck struct {
	ID           int64  `json:"id"`
	ApiID        int64  `json:"apiId"`
	Timestamp    int64  `json:"timestamp"`
	Status       string `json:"status"`
	ResponseTime int64  `json:"responseTime"`
	ErrorMessage string `json:"errorMessage"`
}
