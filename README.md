<h1 align="center">
🌐 Caesar Book Ecommerce
</h1>
<p align="center">
MongoDB, NestJS, React/Redux, NodeJS
</p>


## clone or download
```terminal
$ git clone https://github.com/CaesarNgyn/Caesar-Book-Ecommerce.git
$ yarn # or npm i
```

## project structure
```terminal
server/
   package.json
   .env
client/
   package.json
   .env
...
```

# Usage (run fullstack app on your machine)

## Prerequisites
- [MongoDB](https://gist.github.com/nrollr/9f523ae17ecdbb50311980503409aeb3)
- [Node](https://nodejs.org/en/download/) ^16.13.1
- [npm](https://nodejs.org/en/download/package-manager/)

You need both client and server runs concurrently in different terminal session, in order to make them talk to each other

## Client-side usage(PORT: 1212)
### Prepare .env

run the script at the first level:

```terminal
// in the root level
change '.env.sample' to '.env' and fill in neccessary parts
```

### Start

```terminal
$ cd client          // go to client folder
$ yarn # or npm i    // npm install packages
$ npm run dev        // run it locally
```

## Server-side usage(PORT: 6969)

### Prepare .env

run the script at the first level:

```terminal
// in the root level
change '.env.sample' to '.env' and fill in neccessary parts
```

### Start

```terminal
$ cd server   // go to server folder
$ npm i       // npm install packages
$ npm run dev // run it locally
```

## Author
[Caesar Martin](https://facebook.com/khanhrussian)

My real name is Khanh Nguyen, you can contact me via email: caesarngyn@gmail.com