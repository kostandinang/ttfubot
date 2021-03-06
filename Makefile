start-docker:
	@docker-compose up -d

updev: start-docker
	@npm run dev

up:
	@docker-compose up -d
	@npm start

down:
	@docker-compose stop
	@npm stop

reload:
	@npm run reload

log:
	@npm run log

run-test:
	@npm test

redis-cli:
	@docker exec -i -t ttfu_redis redis-cli 
