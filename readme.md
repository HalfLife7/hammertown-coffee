# Project Proposal

# Name: Hammertown Coffee

# Description

Application that shows coffee shops in Hamilton with the ability to get information such as store hours, reviews and directions.

# Target Audience

The audience that my app is targeting will consist of people who are looking for the closest place for a coffee, love coffee or just want a place to hangout. The age group mainly being targeted are adults at the age of 18+ such as students looking for a place to write a paper, people going on a date, or workers needing an extra boost of energy.

# Tasks Users Can Perform

Users can perform tasks related to finding a coffee shop and viewing its details such as phone number, store hours and price range.

- --Search by name
- --Filter by:
  - Chain coffee
  - Independent Coffee
  - Distance from you
  - Open
  - Price?
  - Etc.
- --See additional information:
  - Reviews
  - Store Hours
  - Photos
  - Ratings
  - Phone Number
- --Click button to get directions to selected coffee shop
- --Click button to select the closest coffee shop

# How Application Will Allow User to Perform Task

- --Search by name
  - Clicking button will calculate distance between user and coffee shops
    - Return the name, address and distance of closest coffee shop
- --Filter:
  - Click button to filter
    - If any of those coffee shops have that &#39;tag&#39;, then display them else hide them
- --Getting directions:
  - There will be a button to click to get directions which will open a google maps page with the target address already filled in with the location&#39;s address
- --Getting Additional Information:
  - Clicking on a marker will display the extra information in the side menu
  - The menu will have additional information such as reviews, store hours, photos, ratings and phone number
- --Use gmaps.js to create functional Google Map to display markers where coffee shops are located
- --Get user&#39;s current location from request to determine closest coffee shop
- --Getting directions to selected coffee shop:
  - Clicking the button will open a new page to google maps with the address of the selected coffee shop already filled out
- --Query Google Places API for additional information required such as store hours, reviews and price range and store this data in a JSON file

# Additional Data or Content Used

- --Open Data on Food Establishments – Licenced
  - https://www.hamilton.ca/city-initiatives/strategies-actions/open-data-program
- --Google Places API:
  - https://developers.google.com/maps/documentation/javascript/places
  - [https://developers.google.com/maps/documentation/javascript/places#place\_details](https://developers.google.com/maps/documentation/javascript/places#place_details)

# How Additional Data or Content is Obtained/Created

- --Convert the .csv file of Food Establishments – Licenced into a JavaScript object using the PHP conversion script in Lab#1
- --Query Google Places API:
  - Load in Google Places Library
    - \&lt;scripttype=&quot;text/javascript&quot;src=&quot;https://maps.googleapis.com/maps/api/js?key= **YOUR\_API\_KEY** &amp; **libraries=places**&quot;\&gt;\&lt;/script\&gt;
  - Get the Place ID and look up Place Details

# How Different Screen Sizes Will be Handled

Screen sizes will be handled with responsive design using BootStrap. When the screen is at the size of a mobile device, the map will take the width of the whole screen and about 80% of the height, the buttons for filters will be below at the top below the search bar and the additional information