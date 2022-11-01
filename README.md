
# Cosmos Odyssey Planet Routing APP

This project uses the Cosmos Odyssey API for planetary routes to offer the client tickets between the planets and stores the reserved tickets in the database.
The project consists of an Express JS server back-end and React client front-end.

The API url for the project is https://cosmos-odyssey.azurewebsites.net/api/v1.0/TravelPrices

<b>To start testing the project, open 2 command terminals.
One for the server and the other for client.</b>

### <b>Server terminal</b>
Navigate terminal to the server directory.
Install required packages with `npm install` command.
Launch the server with `nodemon` command.

The server should now be running and on port 3001 on localhost.

### <b>Client terminal</b>
Navigate terminal to the client directory.
Install required packages with `npm install` command.
Launch the dev client with `npm run start` command.

This launches the client on localhost:3000 

Navigating to http://localhost:3000 will open the application.

The application has 2 main routes. 
One for buying tickets and the other for Checking previously reserved tickets.

## Buy Page
Here you can enter origin planet and destination planet. Based on that the app will query according available routes to you.

The routes can also be sorted according to price, distance and travel time.

The routes can also be filtered according to the companies carrying out the routes.

Clicking on a route will open the route and its providers on the sidebar. There you can enter first and last name to make a reservation for the ticket.
## Check Ticket Page
Here you can check previously reserved tickets. Entering first and last name will query for reservations.

The reservations can also be clicked on to open more detailed information about them in the sidebar.

The App will only keep the last 15 provided routelists in memory. When a new routelist is acquired, the oldest routelist will be deleted from the database. This included all the information related to that routelist and the reservations made for that routelist.

Currently the app loads more routelists only when front-end is open to query for them.