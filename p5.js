var countries = [];

function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "navbar") {
    x.className += " responsive";
  } else {
    x.className = "navbar";
  }
}

window.addEventListener('load', function() {
    getDetails();
});

function getDetails() {
    var link = 'https://pomber.github.io/covid19/timeseries.json';
    
    $(".loader").css("display", "block");
    httpGet(link);
}

function httpGet(link) {
    if(link !== null && link !== undefined && link !== "") {
        $.ajax({
            url: link,
            success: function(data) {
                //alert(data)
                //document.getElementById("defaultOpen").click();
                let items = Object.keys(data);
                
                var content = "";
                var totalConfirmed  = 0;
                var totalRecovered  = 0;
                var totalDeath      = 0;
                var totalActive     = 0;
                
                items.map(key => {
                    let value = data[key];
                    
                    var confirmed   = 0;
                    var recovered   = 0;
                    var deaths      = 0;
                    var active      = 0;
                    
                    Object.values(value).forEach(entry => {
                        confirmed = entry['confirmed'];
                        recovered = entry['recovered'];
                        deaths    = entry['deaths'];
                    });
                    
                    active = confirmed - recovered - deaths;
                    
                    var coutryWise  = {};
                    
                    coutryWise['country']       = key;
                    coutryWise['confirmed']     = confirmed;
                    coutryWise['recovered']     = recovered;
                    coutryWise['deaths']        = deaths;
                    coutryWise['active']        = active;
                    
                    countries.push(coutryWise);
                    
                    totalConfirmed += confirmed;
                    totalRecovered += recovered;
                    totalDeath     += deaths;
                    totalActive    += active;
                    
                    content += '<div class = "datadiv"><button class="collapsible" style="background-color: '+ getRandomColor() +'"><b>'+ key +'</b></button><div class="content1"><span class="confirmed"><b>'+ confirmed +'</b><br><br> Confirmed</span><span class="recovered"><b>'+ recovered +'</b><br><br> Recovered</span><span class="death"><b>'+ deaths +'</b><br><br> Deaths</span><p>' + 
active +'<br><br>Active</p><button id="' + key + '" onclick = "showGraph(this, '+ key +', '+ confirmed +','+recovered+','+deaths+')" class="btn btn-info">Display By Graph</button><div id = "chartContainer_' + key + '"></div></div></div>';
                });
                
                $('#totalConfirmed').html('<b>' + totalConfirmed + '</b><br><br>Confirmed');
                $('#totalRecovered').html('<b>' + totalRecovered + '</b><br><br>Recovered');
                $('#totalDeath').html('<b>' + totalDeath + '</b><br><br>Deaths');
                $('#totalActive').html('<b>' + totalActive + '</b><br><br>Active Cases (Confirmed - Recovered - Deaths)');
               
                $('#profileDetails').append(content);
                
               // applyCollapsible();
                
                $("#card1").css("display", "block");
                $(".loader").css("display", "none");
                $("body, html").css("background-color", "#ffffff");
            },
            error: function() {
                alert("System seems to be offline, or your link is invalid. Be sure the link is correct, and try again later");
            }
        });
    }
}

function applyCollapsible() {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active2");var content = this.nextElementSibling;
        
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        } 
      });
    }
}

function filterTable() {
  var input, filter, table, tr, td, i, txtValue, confirmed, totalConfirmed=0, recovered, totalRecovered=0, death, totalDeath = 0, totalActive  = 0;;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myCodeTable");
  tr = document.getElementsByClassName("datadiv");
  
  for (i = 0; i < tr.length; i++) {
    td      = tr[i].getElementsByTagName("button")[0];
    confirmed    = tr[i].getElementsByTagName("b")[1];
    recovered    = tr[i].getElementsByTagName("b")[2];
    death       = tr[i].getElementsByTagName("b")[3];
   
    if (td) {
      txtValue = td.textContent || td.innerText;
      
      //console.log(txtValue.toUpperCase().indexOf(filter));
      
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        
        if(confirmed) {
            totalConfirmed += Number(confirmed.innerText);
        }
        
        if(recovered) {
            totalRecovered += Number(recovered.innerText);
        }
        
        if(death) {
            totalDeath += Number(death.innerText);
        }
        
      } else {
        tr[i].style.display = "none";
      }
    } 
    
  }
  
  totalActive   = totalConfirmed - totalRecovered - totalDeath;
  
    $('#totalConfirmed').html('<b>' + totalConfirmed + '</b><br><br>Confirmed');
    $('#totalRecovered').html('<b>' + totalRecovered + '</b><br><br>Recovered');
    $('#totalDeath').html('<b>' + totalDeath + '</b><br><br>Deaths');
    $('#totalActive').html('<b>' + totalActive + '</b><br><br>Active Cases (Confirmed - Recovered - Deaths)');
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getTopTenCountriesByDeath() {
    countries.sort(function(a, b) {
        return b.deaths - a.deaths
    });
    
    var totalXP = [];

    for(var j = 0; j < 10; j++) {
        var obj1  = countries[j];
                
        totalXP.push({
            label : obj1.country, y : obj1.deaths
        });
    }
    
    var options = {
        theme: "dark2",
        width: 450,
        animationEnabled: true,
        legend: {
            maxWidth: 350,
            itemWidth: 120
        },

        data: [{
                type: "doughnut",
                innerRadius: "40%",
                toolTipContent: "<b>{label}</b>: {y} (#percent%)",
                indexLabelFontSize: 12,
                showInLegend: "true",
                legendText: "{label}",
                indexLabel: "{label} (#percent%)",
                //yValueFormatString: "#,##0,,.## Million",
                dataPoints: totalXP
        }]
    };
    
    var options1 = {
        theme: "dark2",
        width: 450,
        animationEnabled: true,
        legend: {
            maxWidth: 350,
            itemWidth: 120
        },

        data: [{
                type: "column",
                indexLabelFontSize: 12,
                //yValueFormatString: "#,##0,,.## Million",
                dataPoints: totalXP
        }]
    };
    
    var options2 = {
        theme: "dark2",
        width: 450,
        animationEnabled: true,
        legend: {
            maxWidth: 350,
            itemWidth: 120
        },

        data: [{
                type: "bar",
                indexLabelFontSize: 12,
                //yValueFormatString: "#,##0,,.## Million",
                dataPoints: totalXP
        }]
    };

    $("#chartContainer").CanvasJSChart(options);
    $("#chartContainer1").CanvasJSChart(options1);
    $("#chartContainer2").CanvasJSChart(options2);
    $(".modal-title").html("Top Ten Countries By Death");
    $("#myModal").modal('show');
}

function getTopTenCountriesByTotal() {
    countries.sort(function(a, b) {
        return b.deaths - a.deaths
    });
    
    var totalXP = [];

    for(var j = 0; j < 10; j++) {
        var obj1  = countries[j];
                
        totalXP.push({
            label : obj1.country, y : obj1.confirmed
        });
    }
    
    var options = {
        theme: "dark2",
        width: 450,
        animationEnabled: true,
        legend: {
            maxWidth: 350,
            itemWidth: 120
        },

        data: [{
                type: "doughnut",
                innerRadius: "40%",
                toolTipContent: "<b>{label}</b>: {y} (#percent%)",
                indexLabelFontSize: 12,
                showInLegend: "true",
                legendText: "{label}",
                indexLabel: "{label} (#percent%)",
                //yValueFormatString: "#,##0,,.## Million",
                dataPoints: totalXP
        }]
    };

    var options1 = {
        theme: "dark2",
        width: 450,
        animationEnabled: true,
        legend: {
            maxWidth: 350,
            itemWidth: 120
        },

        data: [{
                type: "column",
                indexLabelFontSize: 12,
                //yValueFormatString: "#,##0,,.## Million",
                dataPoints: totalXP
        }]
    };
    
    var options2 = {
        theme: "dark2",
        width: 450,
        animationEnabled: true,
        legend: {
            maxWidth: 350,
            itemWidth: 120
        },

        data: [{
                type: "bar",
                indexLabelFontSize: 12,
                //yValueFormatString: "#,##0,,.## Million",
                dataPoints: totalXP
        }]
    };

    $("#chartContainer").CanvasJSChart(options);
    $("#chartContainer1").CanvasJSChart(options1);
    $("#chartContainer2").CanvasJSChart(options2);
    $(".modal-title").html("Top Ten Countries By Total Cases");
    $("#myModal").modal('show');
}

function getTopTenCountriesByActive() {
    countries.sort(function(a, b) {
        return b.active - a.active
    });
    
    var totalXP = [];

    for(var j = 0; j < 10; j++) {
        var obj1  = countries[j];
                
        totalXP.push({
            label : obj1.country, y : obj1.active
        });
    }
    
    var options = {
        theme: "dark2",
        width: 450,
        animationEnabled: true,
        legend: {
            maxWidth: 350,
            itemWidth: 120
        },

        data: [{
                type: "doughnut",
                innerRadius: "40%",
                toolTipContent: "<b>{label}</b>: {y} (#percent%)",
                indexLabelFontSize: 12,
                showInLegend: "true",
                legendText: "{label}",
                indexLabel: "{label} (#percent%)",
                //yValueFormatString: "#,##0,,.## Million",
                dataPoints: totalXP
        }]
    };

    var options1 = {
        theme: "dark2",
        width: 450,
        animationEnabled: true,
        legend: {
            maxWidth: 350,
            itemWidth: 120
        },

        data: [{
                type: "column",
                indexLabelFontSize: 12,
                //yValueFormatString: "#,##0,,.## Million",
                dataPoints: totalXP
        }]
    };
    
    var options2 = {
        theme: "dark2",
        width: 450,
        animationEnabled: true,
        legend: {
            maxWidth: 350,
            itemWidth: 120
        },

        data: [{
                type: "bar",
                indexLabelFontSize: 12,
                //yValueFormatString: "#,##0,,.## Million",
                dataPoints: totalXP
        }]
    };

    $("#chartContainer").CanvasJSChart(options);
    $("#chartContainer1").CanvasJSChart(options1);
    $("#chartContainer2").CanvasJSChart(options2);
    $(".modal-title").html("Top Ten Countries By Active Cases");
    $("#myModal").modal('show');
}

function someInfo() {
    $(".modal-title").html("Some prevention on Corona Virus");
    $("#myModal1").modal('show');
}

function showGraph(obj, cnt, confirmed, recovered, deaths) {
    
    if(obj.id) {var active = confirmed - recovered - deaths;
        
        var totalXP = [];

       totalXP.push({label : 'Confirmed', y : confirmed});
       totalXP.push({label : 'Recovered', y : recovered});
       totalXP.push({label : 'Deaths', y : deaths});
       totalXP.push({label : 'Active', y : active});
        
        var options = {
            //theme: "dark2",
            width: 400,
            animationEnabled: true,
            legend: {
                maxWidth: 350,
                itemWidth: 120
            },
    
            data: [{
                    type: "doughnut",
                    innerRadius: "40%",
                    toolTipContent: "<b>{label}</b>: {y} (#percent%)",
                    indexLabelFontSize: 12,
                    showInLegend: "true",
                    legendText: "{label}",
                    indexLabel: "{label} (#percent%)",
                    //yValueFormatString: "#,##0,,.## Million",
                    dataPoints: totalXP
            }]
        };
        
        var options1 = {
            //theme: "dark2",
            width: 400,
            animationEnabled: true,
            legend: {
                maxWidth: 350
            },
    
            data: [{
                    type: "column",
                    //yValueFormatString: "#,##0,,.## Million",
                    dataPoints: totalXP
            }]
        };
        
        var options2 = {
            //theme: "dark2",
            width: 400,
            animationEnabled: true,
            legend: {
                maxWidth: 350
            },
    
            data: [{
                    type: "bar",
                    //yValueFormatString: "#,##0,,.## Million",
                    dataPoints: totalXP
            }]
        };

        $("#chartContainer").CanvasJSChart(options);
        $("#chartContainer1").CanvasJSChart(options1);
        $("#chartContainer2").CanvasJSChart(options2);
        $(".modal-title").html(obj.id);
        $("#myModal").modal('show');
    }
}