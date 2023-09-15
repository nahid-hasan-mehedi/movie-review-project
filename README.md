Marker, Please Read:
Note: Please install all Node Modules before testing otherwise the program will not run.
-----------------------------------------------------
Here is instruction for server-side tests:
1:Clone the repository using Git.

2:Download the IMDb datasets from https://www.imdb.com/interfaces/ and extract the file titled "title.basics.tsv.gz".

3:Navigate to the directory where the datasets were downloaded and extracted, and run the command "mongoimport --db=imdb-db --type=tsv --headerline --collection=movietitles titles.tsv".

4:Start the MongoDB server by running the command "mongod" and establish a connection using MongoDB Compass.

5:Run the tests located in the "tests" folder.

-------------------------------------------------------
Instruction for client-side Features testing:

1-Run app.js, After connecting to the database please visit http://localhost:3000/
After visiting localhost3000 you can test all client-side segments.
We have all client-side code under the views folder 
Here's a link that will show our client-side testing and what should output this program.
https://youtu.be/VWj_5KvpX70
-------------------------------------------------------
Client-side feature descriptions:

1:Register: Graphical user interface located at "/register".

2:Login: Graphical user interface located at "/login".

3:Filter movies: Graphical user interface to filter movies based on release year and run time.

4:Add/View comments: Graphical user interface to add and view comments for a movie.

5:Add/View ratings: Graphical user interface to add and view ratings for a movie.

6:Average rating: Graphical user interface to display the average rating for a movie.

7:Authentication: Cannot view movies, add comment, add rating without being logged in

-----------------------------------------------------------
Server-side feature descriptions:
A lot of the response from the api on the server side was removed(example res.send(data) was replaced with res.render(page)) to instead render the client side. If the tests do  not throw error they have passed. 

1:Register: Ability to register a new user.

2:Login: Ability to log in with correct credentials, which are checked against the database.

3:Filter movies: Ability to filter movies based on release year and run time.

4:Add comments: Ability to add comments to a movie and view existing comments.

5:Add rating: Ability to add a rating to a movie and view existing ratings.

6:Average rating: Display the average rating of a movie.

--------------------------------------------------------------
Attribution:
-We have used professor-provided assignment code to understand and use how to communicate between the server side and client side. We have used Google to debug minor errors and got an idea of how to solve those errors.

-Used boilerplate css and ejs templates from a udemy course on web development, https://www.udemy.com/course/the-complete-web-development-bootcamp, and modified to fit our app and functionality.
