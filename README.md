### How To Run The App
Build the Docker image:
```
make build
```

Then start Docker container:
```
make run
```

---

### Running Unit Tests
First make sure the Docker container is running (i.e. `make run`). Then run the following command in your terminal:
```
make test
```

---

### Testing API Endpoints
The `postman` folder in this repo contains a Postman collection of various requests to test the API endpoints.

Postman App can be downloaded here: https://www.postman.com/downloads/

Alternatively, feel free to use `curl` or another API request client such as https://insomnia.rest/

---

### Cleaning Up Docker containers
```
make stop
make remove
```
---
### Remove Docker image
```
make remove_image
```
---
### Swagger & API Documentation
Once you've built the Docker image and have a running container, visit `localhost:3000/swagger`