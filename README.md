# Alemeno_CreditSystem
## Credit Approval Server Side System (Express - RESTapi with MySQL) for Alemeno 

<br />


## Setting Up 

First, Clone the Repo
```
  git clone https://github.com/ShubhamTiwary914/Alemeno_CreditSystem.git
  cd Alemeno_CreditSystem
```
 

<br />

### Using Docker

> Run the Docker Compose for Loading Node & Mysql Containers + Redis for Celery 
```
  docker-compose up -f docker-compose.yml
```

<br />

> Initially Run the Celery Workers + Client to Persist Data onto MySQL
```
  npm run celery-worker
```

```
  npm run celery-client
```

<br /> <br />

> [!NOTE]
> You can use this if the first method doesn't work initially!



### Alternatively (Running Components Individually )

> Run the Redis Container (Required for Celery)
```
  docker-compose up -f redis-docker-compose.yml
```

> Install the npm packages
```
  npm install
```

<br />

> [!NOTE]
> Make sure MySQl is set with credentials referncing the .env file

> Initially Run the Celery Workers + Client to Persist Data onto MySQL
```
  npm run celery-worker
```

```
  npm run celery-client
```

<br />

> Start Web Server (Runs on Localhost)
```
  npm rn start
```



