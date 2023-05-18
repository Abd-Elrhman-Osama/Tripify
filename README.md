<h1><a href="https://abd-elrhman-osama.github.io/Tripify/">Tripify</a></h1>
<h3>
    a responsive web app to discover the places in the map boundary box and provide the user with the best route from any point to any point.
</h3>
<h3><a href="https://abd-elrhman-osama.github.io/Tripify/">Live Demo</a></h3>
<h3>Technologies</h3>
<ul>
    <li>React JS</li>
    <li>Redux JS ToolKit & React-Redux</li>
    <li>React Query</li>
    <li>Leaflet JS & React-Leaflet</li>
    <li>
        RESTful APIs:
        <ul>
            <li>
                <a href="https://rapidapi.com/opentripmap/api/places1">
                    Places API
                </a>
                : (Geographic coordinates by placename & Places list by bounding box) endpoints.
            </li>
            <li>
                <a href="https://rapidapi.com/wirefreethought/api/geodb-cities">
                    GeoDB Cities API
                </a>
                : (Cities Near Location) endpoint.
            </li>
            <li>
                <a href="https://rapidapi.com/geoapify-gmbh-geoapify/api/geoapify-platform">
                    Geoapify Platform API
                </a>
                : (Route and directions) endpoint.
            </li>
            <li>
                <a href="https://rapidapi.com/castelli0giovanni-VdUSmLXuCR3/api/feroeg-reverse-geocoding">
                    Feroeg - Reverse Geocoding API
                </a>
                : (ReverseGeocode) endpoint.
            </li>
            <li><a href="https://rapidapi.com/geokeo-geokeo-default/api/geokeo-forward-geocoding">Geokeo Forward Geocoding API</a>: (search.php) endpoint.</li>
        </ul>
    </li>
</ul>
<h3>Features</h3>
<ul>
    <li>
        User geolocation and display it on the map with a marker.
    </li>
    <li>
        Places in the boundaries box of the map (Hotels | Resorts | Banks | ATMs | Restaurants | Cafes | Malls | Fuel Stations) are rendered as markers on the map and as a list of cards on the page.
    </li>
    <li>
        A list of nearby cities from the user's current location is displayed when the destination input of the search bar is focused.
    </li>
    <li>
        Auto-complete search.
    </li>
    <li>
        The countries' input menu provides the user with an accurate search.
    </li>
    <li>
        An interactive map, when you search for any destination, it moves to that place smoothly.
    </li>
    <li>
        The user can find his geolocation on the map easily by hitting the user location button if he drags the map away from his current location.
    </li>
    <li>
        The user can determine his geolocation again and display it on the map by hitting the user locate button if he has moved.
    </li>
    <li>
        The user can determine the origin and destination points for routing by filling in the origin and destination point inputs or clicking on some point on the map.
    </li>
    <li>
        Route details, directions, and a route on the map are displayed if the user entered the origin and destination points.
    </li>
    <li>
        The user can choose his current location as the origin point by hitting the user location button in the routing list.
    </li>
    <li>
        The user can choose the routing mode to provide the user with the best route.
    </li>
    <li>
        The user can find the displayed route on the map if the user drags the map away from the displayed route.
    </li>
    <li>
        The user can easily start routing from his location to some place by hitting the routing button in the places cards.
    </li>
</ul>
