# mydramalist API
🔥 Blazing Fast API which scrapes Mydramalist.com made using Fastify and Cheerio. 

## Setup

```pnpm install```

```node index.js```

available at `http://localhost:5001/`
## API Reference

```
  GET /api/${type}/${filter}?page=${pagenum}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `type`      | `string` | **Required**, can be `shows` or `movies` |
| `filter`      | `string` | **Required**, can be `top`, `popular`, `newest`, `upcoming`, `variety` |
| `pagenum`      | `string` | **Optional**, eg: `2`|

```
  GET /api/details/${mdl_slug}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `mdl_slug`      | `string` | **Required**, eg: `49231-move-to-heaven`|




## Made with

NodeJS , Fastify and Cheerio


## Authors

- [@parnexcodes](https://github.com/parnexcodes)

