#! /bin/bash

docker run -d \
    --name wweb-pg \
    -e POSTGRES_DB=wweb \
    -e POSTGRES_USER=pgwweb \
    -e POSTGRES_PASSWORD=pgpassword \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -p 5432:5432 \
    postgres:15.2
