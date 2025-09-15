FROM redis:6-alpine
ENV REDIS_CONFIG_FILE=/usr/local/etc/redis/redis.conf
COPY ./redis.conf $REDIS_CONFIG_FILE
EXPOSE 6379
CMD ["sh", "-c", "redis-server $REDIS_CONFIG_FILE"]
