up:
	@docker-compose up -d

run-test:
	@npm test

redis-cli:
	@docker exec -i -t ttfu_redis redis-cli 