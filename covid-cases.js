var img;

var database = [];
var country;
var prov;
var jan;
var feb;
var mar;
var apr;
var may;
var jun;
var jul;
var aug;
var sept;
var oct;
var nov;
var dec;
var lan;
var lon;
var clon = 0;
var clat = 0;

var defaultVal;
var colour;
var display;
var month;
var sel;
var zoom = 1;
var sf = 1;
var x = 0;
var y = 0;
var m_x, m_y;
var val;

var maplegendx = -600;
var maplegendy = 420;

function Covid_Cases() {
    this.name = "Covid Cases";

    this.id = "covid-cases";


    this.loaded = false;
    
    this.preload = function () {
        var self = this;

        //retrieving data for rate where rate = number of death due to virus/ number of people infected by the virus
        this.subdata = loadTable(
            './data/Extension-3/finaldata.csv', 'csv', 'header',
            function(table) {
                self.loaded = true;
            });
        img = loadImage('./img/image.jpg');
       
        
    };


    this.setup = function() {
        defaultVal = 0;
        //creating a slider with the range from 0 to 11 which will comprise of the months 
        slider = createSlider(0, 11, defaultVal,1);
        //indicating the position of the slider
        slider.position(1175, 738);
        //styling the slider
        slider.style('width', '200px');
        //an element in the DOM with given inner HTML; It is created as an indicator of the month of the year in 2020
        display = createP();
        //postioning of the display made for displaying the month no. 
        display.position(1070,720);
        
        //creating a dropdown menu for zoom functionality
        textAlign(CENTER);
        sel = createSelect();
        sel.position(320, 10);
        sel.option('Original');
        sel.option('zoom in');
        sel.option('zoom out');
        for(let row of this.subdata.rows)
        {
            //getting the country, providence, latitude and longitude, and the monthly rate of covid cases = death/infected foe each country and providence from the dataset(CSV file) using ES6 for-of loop
            country = row.getString('Country');
            //console.log(country);
            prov = row.getString('Providence/State')
            //console.log(prov);
            lat = row.getNum('Latitude')
            //console.log(lat);
            lon = row.getNum('Longitude')
            //console.log(lon)
            jan = row.getNum('January');
            feb = row.getNum('February');
            mar = row.getNum('March');
            apr = row.getNum('April');
            may = row.getNum('May');
            jun = row.getNum('June');
            jul = row.getNum('July');
            aug = row.getNum('August');
            sept = row.getNum('September');
            oct = row.getNum('October');
            nov = row.getNum('November');
            dec = row.getNum('December');

            //the data taken from the dataset is put in an object which is pushed into the array, database=[].
            database.push({
                country,
                prov,
                lat,
                lon,
                jan,
                feb,
                mar,
                apr,
                may,
                jun,
                jul,
                aug,
                sept,
                oct,
                nov,
                dec
            })
         
        }
 
    };

    //this function destroys the slider, display of slider, the dropdown menu and the database array inputs when another extension is selected so these do not appear in the other extenstions
    this.destroy = function(){
        slider.remove();
        display.remove();
        sel.remove();
        database = [];
    };
    this.draw = function() {
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }
        //this enables the map to follow the mouse when in zoom in and zoom out versions of the maps
        mx = mouseX;
        my = mouseY;
        push();
        translate(mx, my);
        scale(sf);
        scale(zoom);
        translate(-mx, -my);
        translate();
        //setting the original scale of the map on the screen 
        translate(width/2,height*6/16);
        imageMode(CENTER);
        background(img,0,0);
        val = sel.value()
        //when the 'Original' option from the dropdown menu is chosen, the zoom value and sf value will be set to 1
        if(val==='Original')
        {
            zoom = 1;
            sf = 1;
            window.removeEventListener('scroll', noScroll);
        } 

        for(let row of database)
        {
            //calcY(row.lat);
            //calling the calcX function with the input of the longitude values of the countries and states 
            var cx = calcX(clon);
            //calling the calcY function with the input of the latitude values of the countries and states 
            var cy = calcY(clat);
            //mapping the coordinates(longitude and latitude) of countries and states to be accurate to the map
            var x = calcX(row.lon) - cx;
            //console.log(x);
            var y = calcY(row.lat) - cy;
            //console.log(y);
            var v = slider.value(); 
            //The wording of the display where there will be increasing month numbers when moving from left to right
            display.html('Month no: ' + (v + 1));
            //calling SliderChange() with input of rates of 12 months in an array 
            var s =SliderChange(v,row)
            //used to map the size of the ellipse to the rate 
            //increment of rate from one month to the other month would cause an increment of 0.5 till the ellipse reaches the size of the ellipse mapped to the rate of covid cases
            //decrement of rate from one month to the other month would cause an decrement of 0.5 till the ellipse reaches the size of the ellipse mapped to the rate of covid cases 
            var r = s;
            this.size = 5;
            this.growth_size = this.size;
            this.growth_size = map(r, 0 , 30, 5, 65);
            if(this.size<this.growth_size)
            {
                this.size +=0.5;
            }else if(this.size>this.growth_size)
            {
                this.size -=0.5;
            };
            //the colour is mapped to the size of the circle.The larger the circle, the colour changes from green to orange to red
            let color2 = map(r,0,60,3,0)*30;
            colorMode(HSB);
            fill(color2,204,100, 0.75);
            stroke(0);
            strokeWeight(0.5);
            ellipse(x,y,this.growth_size);
            noStroke();
            fill(0);
            //If the condition of pressing the left mouseButton is true, it enables the display of the countries and states where the countries' name will be white and the states' name will be purple/
            if(mouseIsPressed)
            {
                if(mouseButton === LEFT)
                {
                    colorMode(RGB);
                    textSize(5);
                    fill(224,255,255);
                    text(row.country,x,y);
                    colorMode(RGB);
                    fill(255,0,255);
                    noStroke();
                    text(row.prov,x,y);
                }
            };
                        
        }
        //the following set of codes would be to draw the Map Legend which would describe what the color of the ellipses would reflect on the condition of the countries and states around the world across the 12 months in 2020.
        textSize(15);
        colorMode(RGB);
        fill(0);
        text('Map Legend:', maplegendx + 45, maplegendy);
        colorMode(HSB);
        for(var i = 360; i>0;i--)
        {
            //individual rectangles drawn one after another to resemble the range from green to red
            colorMode(HSB);
            fill(i/4,204,100);
            rect(i - 600, maplegendy + 20, 2, 10, 50);
        };
        colorMode(HSB);
        //indicating which part of the range implies about the condition of the country and state
        fill(90,204,100)
        rect(maplegendx+310, maplegendy + 40, 10, 10, 3);
        fill(45,204,100);
        rect(maplegendx + 160,  maplegendy + 40, 10, 10, 3);
        fill(0,204,100);
        rect(maplegendx,maplegendy + 40, 10, 10,3);
        colorMode(RGB)
        fill(0);
        textSize(10);
        textAlign(LEFT);
        text(' - Safe', maplegendx + 320,  maplegendy + 48);
        text(' - At risk', maplegendx + 170,  maplegendy + 48);
        text(' - Dangerous', maplegendx + 10,  maplegendy + 48);
        colorMode(RGB);  
        pop(); 

    };
    //This event listener function listens to the movement of the mouseY and if it is scrolling upwards and zoom-in functionality is selected in the dropdown menu, the zoom increments by 0.01 and sf increments by 1 else if the mouse is scrolled downwards and the zoom out functionality is selected in the dropdown menu, the zoom decrements by 0.01 and sf decrements by 1. The zoom value is limited: 0.25 to 1. The sf value is also limited from 0.5 to 2. This is to ensure the map is not decrementing or increasing in scale infinitely. There is another even listener that disables the scrollbar when the 'zoom in' or 'zoom out' functionality is being carried out. 
    window.addEventListener("wheel", function(e)
                            {
        if (e.deltaY <= 0 && val==='zoom in')
        {
            zoom += 0.01;
            sf+=1;
            window.addEventListener('scroll', noScroll);
        }
        else if(e.deltaY > 0 && val==='zoom out')
        {
           zoom -= 0.01;
           sf-=0.5
           zoom = constrain(zoom, 0.25, 1);
           sf = constrain(sf,0.5, 2);
           window.addEventListener('scroll', noScroll);
       }else if(val ==='Original')
       {
           window.removeEventListener('scroll', noScroll);
       }
                            
                            });
   
}
//This is the function that will restrict the scrollbar to scroll up or down when the zoom-in and zoom-out functionality is being carried out and this will be called out window event listener, function(e).
function noScroll()
{
    window.scrollTo(width/2, 0);
}
//formula used for Web Mercator projection which is easier for adding in the zoom functionality for the graph for the longitude of the countries and states 
function calcX(lon)
{
    lon = radians(lon);
    let a = (32*PI)*pow(2,zoom);
    let b = lon + PI ;
    return a * b;
}
//formula used for Web Mercator projection which is easier for adding in the zoom functionality for the graph for the latitude of the countries and states 
function calcY(lat)
{
    lat = radians(lat);
    let a = (32*PI)*pow(2,zoom);
    let b = tan(PI/4 + lat/2);
    let c = PI - log(b);
    return a * c;
}
//This function contains an array of all the rates in the order of months and then called in the draw function to be mapped to the size of the ellipses 
function SliderChange(months, row)
{
    callArr = [row.jan, row.feb, row.mar, row.apr, row.may, row.jun, row.jul, row.aug, row.sept, row.oct, row.nov, row.dec];
    return callArr[months];
}