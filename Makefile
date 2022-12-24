SHELL := /bin/bash

build:
	docker build -t th-project .

run:
	docker run -p 3000:3000 th-project

test:
	docker ps -a | awk '{print $$1,$$2}' | grep th-project | awk '{print $$1}' | xargs -I % docker exec -i % npm run test

stop:
	docker ps -a | awk '{print $$1,$$2}' | grep th-project | awk '{print $$1}' | xargs docker stop

remove:
	docker ps -a | awk '{print $$1,$$2}' | grep th-project | awk '{print $$1}' | xargs docker rm

remove_image:
	docker images | awk '{print $$1,$$3}' | grep th-project | awk '{print $$2}' | xargs docker rmi
