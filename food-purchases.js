var data;
var bubbles;
var years;
var buttons;

function Food_Purchases()
{
    this.name = "Food Purchases";
    
    this.id = "food-purchases";
    
    
    this.loaded = false;
    this.preload = function () {
    var self = this;
    this.data = loadTable(
      './data/foodData/foodData.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
    function (table){
        self.loaded = true;
      });

      };
      this.setup = function (){
          years = [];
          bubbles = [];
          buttons = [];
          //drawing buttons and connecting it to the bubbles function
          for(var i = 5 ;i<this.data.getColumnCount();i++)
          {
              var s = this.data.columns[i];
              years.push(s);
              
              var button = createButton(s);
              buttons.push(button);
              if(i < 27)
              {
                  button.position(410+46.6*(i-5),8);
              }else{
                  button.position(410+46.6*(i-27),28);
              }
              button.mousePressed(function()
                                  {
                  //console.log(this.elt.innerHTML);
                  var yearString = this.elt.innerHTML;
                  var yearIndex = years.indexOf(yearString);
                  //change the bubbles according to the years
                  for(var i = 0; i < bubbles.length; i++)
                  {
                      bubbles[i].setYear(yearIndex);
                  }
              });
          }
        
          for(var i =0; i<this.data.getRowCount();i++)
          {
              var r = this.data.getRow(i);
              var name = r.getString("L1");
              //console.log(r.getString("L1"))
              if(name != "")
              {
                  var d = [];
                  for(var j =0; j < years.length;j++)
                  {
                      var v = Number(r.get(years[j]));
                      d.push(v);  
                  }
                  var bu = new Bubble(name, d);
                  bu.setYear(0);
                  //console.log(r.getString("L1"));
                  bubbles.push(bu);
              }
              var name = r.getString("L1");
                            
          } 
      };
    
      this.destroy = function(){
          //to remove every button in this extension when moving to any other extensions
          for(var i = 0; i<buttons.length;i++)
          {
              buttons[i].remove();
          }
      };

      this.draw = function(){
      if (!this.loaded) 
      {
          console.log('Data not yet loaded');
          return;
      }
          background(100);
        
          textAlign(CENTER);
          fill(0);
          textSize(15);
          noStroke();
          //let users know how to use the application without too much guidance
          text('Instructions: Press hold the right mouse button to view categories for computer users', width/2,height*11/12);
          text('Instructions: Press hold any key to view categories for touch screen application', width/2,height*11/12 + 20);
          push();
          textAlign(CENTER);
          //center positioning the bubbles which will expand and contract according to the amount of food purchases made for each food category 
          translate(width/2, height/2);
          for(var i =0; i<bubbles.length;i++)
          {
              bubbles[i].updateDirection(bubbles);
              bubbles[i].draw();
          }
          pop();
      };
}

function getRandomID(){
    var alpha = "abcdefghijklmnopqrstuvwxyz0123456789";
    var s = "";
    //racing through the number of characters
    //making a randomString generator
    //10 random letters
    for(var i = 0; i<10; i++)
    {
        s +=alpha[floor(random(0,alpha.length))];
    }
    return s;
}
function Bubble(_name, _data){
    this.name = _name;
    this.id = getRandomID();
    this.pos = createVector(0, random(0,0));
    this.dir = createVector(0,0);

    this.data = _data;

    this.color = color(random(0,255), random(0,255), random(0,255));
    this.size = 20;
        
    this.draw = function()
    {
        fill(this.color);
        noStroke();
        ellipse(this.pos.x, this.pos.y,this.size);
        noStroke();
        fill(0);
        textSize(8);
        textAlign(CENTER);
        //conditional statement that controls when the food category is displayed connecting to the mouse events
        if(mouseIsPressed)
        {
            if(mouseButton === RIGHT)
            {
                text(this.name, this.pos.x-50, this.pos.y, 90, 50); 
            }
        }else if(keyIsPressed)
        {
            text(this.name, this.pos.x-50, this.pos.y, 90, 50); 
        }
        this.pos.add(this.dir);
        //shrink and growth of bubbles gradually 
        if(this.size < this.target_size)
        {
            this.size += 0.5;
        }
        else if(this.size > this.target_size)
        {
            this.size -= 0.5;
        }
    };
    this.setValue = function(v)
    {
        this.size = map(v,0,3000,5,200); 
    };
    this.updateDirection = function(_bubbles)
    {
        // direction is set to 0 to ensure that bubbles dont spread out if they do not overlap each other
        this.dir = createVector(0,0);
        //iterate through all the bubbles
        for(var i =0; i<_bubbles.length;i++)
        {
            if(_bubbles[i].id != this.id)
            {
                //this causes the bubble to move as the position is subtracted:var v = this.pos.sub(_bubbles[i].pos);
                var v = p5.Vector.sub(this.pos,_bubbles[i].pos);
                var d = v.mag();
                if(d < this.size/2 + _bubbles[i].size/2)
                {
                    //dynamic p5vector(for every overlapping bubble to will move causing animation of the bubbles)
                    //normalise makes sure the length of the vector is 1.
                    if(d==0)
                    {
                        this.dir.add(p5.Vector.random2D());
                    }
                    else
                    {
                        //console.log("collision!")
                        this.dir.add(v);
                    }
                }

            }
        }
        this.dir.normalize();
    };
    this.setYear = function(year_index)
    {
        var v = this.data[year_index];
        //this.size = v would not work as the data value may be either too big or too small and we need to map the values
        this.target_size = map(v, 0, 3600,5,200);

    };
}