
// some globals to play with

// these must match the size of the canvas div 
// TODO pick up these automatically from the div directly
var paper_height = 1000;
var paper_width = 1000;
var list_of_ranks = ['superfamily', 'genus', 'order', 'kingdom', 'family', 'phylum'];

var colours = ['#1ABC9C', '#2ECC71', '#3498DB', '#9B59B6', '#34495E', '#F39C12', '#D35400', '#C0392B'];
var point_radius = 2;
var point_opacity = 1;

// function to grab all the points that lie inside the current ellipse
// TODO allow more than one ellipse
get_points_inside_ellipse = function(e){
    console.log("go!");
    var ellipsetheta = Math.radians(window.ellipse.myRotation);
    console.log("angle is " + ellipsetheta);
    var ids = new Array();
    for (var i=0;i<window.points.length; i++){
        var point = window.points[i];
        var ellipsex = window.ellipse.attrs.cx;
        var ellipsey = window.ellipse.attrs.cy;
        var ellipserx = window.ellipse.attrs.rx;
        var ellipsery = window.ellipse.attrs.ry;

        var pointx = ((point.attrs.cx - ellipsex)* Math.cos(ellipsetheta)) + ((point.attrs.cy - ellipsey) * Math.sin(ellipsetheta)) + ellipsex;
        var pointy = ((point.attrs.cy - ellipsey) * Math.cos(ellipsetheta)) - ((point.attrs.cx - ellipsex)* Math.sin(ellipsetheta)) + ellipsey;

        //scary math to calculate if the point lies within the elipse
        if ((Math.pow((pointx - ellipsex), 2) / Math.pow(ellipserx, 2)) + (Math.pow((pointy - ellipsey), 2) / Math.pow(ellipsery, 2)) < 1){
            point.attr('fill', 'red');
            ids.push(point.contig_id)
        }
        else{
            point.attr('fill', 'blue');
        }
    }
    console.log(ids);
}
// function to switch between colourings
switch_to = function(rank){
    console.log('switching to ' + rank);
    $('#key').empty();
    for (var i=0;i<Math.min(7, window.tax_colours[rank]['counts'].length); i++){
        var name = window.tax_colours[rank]['counts'][i][0];
        var item = $('<h3>').css('background-color', window.tax_colours[rank]['counts'][i][2]).text(name);
        $('#key').append(item);
    }
    var  other = $('<h3>').css('background-color',  '#7F8C8D').text('unclassified');
    $('#key').append(other);

    for (var i=0;i<window.points.length;i++){
        var point = window.points[i];
        var new_colour = '#7F8C8D';
        if (typeof point.taxonomic_data[rank] != "undefined"){
            new_colour = window.tax_colours[rank]['name2colour'][point.taxonomic_data[rank]];
        }
        point.attr('fill', new_colour);
    }

}

// utility functions for trig
// Converts from degrees to radians.
Math.radians = function(degrees) {
      return degrees * Math.PI / 180;
  };

// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};

function log10(val) {
      return Math.log(val) / Math.LN10;
}

// functions for drawing an ellipse
// start, move, and up are the drag functions
start = function() {
    // storing original coordinates
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    this.attr({
        opacity: 1
    });
    if (this.attr("y") < 60 && this.attr("x") < 60) this.attr({
        fill: "#000"
    });
    }, 
move = function(dx, dy) {

    // move will be called with dx and dy
    if (this.attr("y") > 200 || this.attr("x") > 300) this.attr({
        x: this.ox + dx,
        y: this.oy + dy
    });
    else {
        nowX = Math.min(300, this.ox + dx);
        nowY = Math.min(200, this.oy + dy);
        nowX = Math.max(0, nowX);
        nowY = Math.max(0, nowY);
        this.attr({
            x: nowX,
            y: nowY
        });
        if (this.attr("fill") != "#000") this.attr({
            fill: "#000"
        });
    }

    }, 
up = function() {
    // restoring state
    this.attr({
        opacity: .5
    });
    if (this.attr("y") < 60 && this.attr("x") < 60) this.attr({
        fill: "#AEAEAE"
    });
};

function draw_ellipse(x, y, w, h) {

    var element = window.paper.ellipse(x, y, w, h);
    element.attr({
        fill: "gray",
        opacity: .5,
        stroke: "#F00"
    });
    $(element.node).attr('id', 'rct' + x + y);
    console.log(element.attr('x'));

    element.drag(move, start, up);
    element.click(function(e) {

        elemClicked = $(element.node).attr('id');

    });

    return element;
}
function setRotation(e){

    console.log('setting rotation');
    // Prevent text edit cursor while dragging in webkit browsers
    e.originalEvent.preventDefault();

    var offset = $("#canvas").offset();
    mouseDownX = e.pageX - offset.left;
    mouseDownY = e.pageY - offset.top;


    $("#canvas").unbind("mousemove");
    $("#canvas").unbind("click");
    $("#canvas").click(setCentre);
  
}

function setCentre(e){

    console.log('setting centre');
    // Prevent text edit cursor while dragging in webkit browsers
    e.originalEvent.preventDefault();
    var offset = $("#canvas").offset();
    mouseDownX = e.pageX - offset.left;
    mouseDownY = e.pageY - offset.top;
    window.ellipse = draw_ellipse(mouseDownX, mouseDownY, 0, 0);
    $("#canvas").mousemove(function(e) {
        var offset = $("#canvas").offset();
        var upX = e.pageX - offset.left;
        var upY = e.pageY - offset.top;

        var width = upX - mouseDownX;
        var height = upY - mouseDownY;

        window.ellipse.attr( { "rx": width > 0 ? width : 0,
            "ry": height > 0 ? height : 0 } );
        });
    $("#canvas").unbind("click");
    $("#canvas").click(setSize);
  
}

function setSize(e){
    console.log("setting size");                   
    $("#canvas").unbind("mousemove");
    var BBox = window.ellipse.getBBox();
    if (BBox.width==0 && BBox.height==0) window.ellipse.remove();
    $("#canvas").unbind("mousemove");
    $("#canvas").mousemove(function(e) {
        var offset = $("#canvas").offset();
        var upX = e.pageX - offset.left;
        var upY = e.pageY - offset.top;

        var width = upX - mouseDownX;
        var height = upY - mouseDownY;

        console.log(height);
        window.ellipse.transform("r" + height);
        window.ellipse.myRotation = height;

    var ellipsetheta = Math.radians(- window.ellipse.myRotation);
    for (var i=0;i<window.points.length; i++){
        var point = window.points[i];
        var ellipsex = window.ellipse.attrs.cx;
        var ellipsey = window.ellipse.attrs.cy;
        var ellipserx = window.ellipse.attrs.rx;
        var ellipsery = window.ellipse.attrs.ry;


    }

    });
    $("#canvas").unbind("click");
    $("#canvas").click(setRotation);
}

// big function to read data from the file and transform it into an array of points
// also to calculate the colours for display taxonomic annotation
read_in_data = function(e){
   
    var file = $('#myfile')[0].files[0];
    console.log(file);
    var reader = new FileReader();


    reader.onprogress = function(e){
        var percentLoaded = Math.round((e.loaded / e.total) * 100);
        console.log(percentLoaded + '%');
    }

    var sample_every = 5;


    function get_data(cols)  {

        var result = {};
        result.length = parseFloat(cols[2]);
        result.coverage = log10(parseFloat(cols[3]));
        result.gc = parseFloat(cols[4]);
        result.id = cols[1];
        result.taxonomic_data={};
        //now process taxonomic information
        for (var j=5;j<cols.length;j++){
            if (list_of_ranks.indexOf(cols[j]) > -1){
                result.taxonomic_data[cols[j]] = cols[j+1];
            }
        }
        return result;

    }

    reader.onload = function(thefile){
        var start = new Date();
        window.points = new Array();
        var data = thefile.target.result.split('\n');
        window.data = data;
        var tax_table = {};
        for (var h=0;h<list_of_ranks.length;h++){
            tax_table[list_of_ranks[h]] = {};
        }

        var max_length=0, max_coverage=0, max_gc=0, min_gc=1;
        //process the file data once to calculate the max and the colours for taxonomic annotation
        for (var i=0; i<data.length; i++){
            
            if (i % 1000 == 0){
                console.log('processed' + i);
            }

            if (data[i] != '' && i % sample_every == 0){
                var cols = data[i].split('\t');
                var row_data = get_data(cols);
                max_length = Math.max(max_length, row_data.length);
                max_coverage = Math.max(max_coverage, row_data.coverage);
                max_gc = Math.max(max_gc, row_data.gc);
                min_gc = Math.min(min_gc, row_data.gc);

                // if this row has taxonomic info, add it to the count
                for (var h=0;h<list_of_ranks.length;h++){
                    var rank_name = list_of_ranks[h];
                    var this_rows_id = row_data.taxonomic_data[rank_name];
                    if (typeof this_rows_id != "undefined"){
                        var current_count_for_id = tax_table[rank_name][this_rows_id];
                        if (typeof current_count_for_id === "undefined"){
                            current_count_for_id = 0;
                        }
                        tax_table[rank_name][this_rows_id] = current_count_for_id + 1;
                    }
                }
            }
        }


        // now we have a completed taxon count we can set up the colors
        window.tax_colours = {};
        for (var h=0;h<list_of_ranks.length;h++){
            var rank_name = list_of_ranks[h];
            window.tax_colours[rank_name] = {};
            var rank_counts = tax_table[rank_name];
            var sortable = [];
            var name2colour = {};
            for (var rank in rank_counts){
                sortable.push([rank, rank_counts[rank]]);
            }
            sortable.sort(function(a, b) {return b[1] - a[1]})
            for (var i=0;i<sortable.length;i++){
                if (i < 7){
                    sortable[i].push(colours[i]);
                    name2colour[sortable[i][0]] = colours[i];
                } 
                else{
                    sortable[i].push('#7F8C8D');
                    name2colour[sortable[i][0]] = '#7F8C8D';
                }
            }
            window.tax_colours[rank_name]['counts'] = sortable;
            window.tax_colours[rank_name]['name2colour'] = name2colour;
        }


        //now add the actual points
        for (var i=0; i<data.length; i++){
            if (i % 1000 == 0){
                console.log('created' + i);
            }
            if (data[i] != '' && i % sample_every == 0){
                var cols = data[i].split('\t');
                var row_data = get_data(cols);
                var point_x_pos =  (((row_data.gc-min_gc)/(max_gc - min_gc)) * paper_width);
                var point_y_pos = paper_height - ( (row_data.coverage / max_coverage) * paper_height ); 
                var point = window.paper.circle(point_x_pos, point_y_pos, point_radius);
                point.attr("fill", "red");
                point.attr("stroke-width",0);
                point.attr("fill-opacity",point_opacity);
                point.taxonomic_data = row_data.taxonomic_data;
                point.contig_id = row_data.id;

                window.points.push(point);
            }
        }
        var end = new Date();
        console.log('rendered in ' + (end - start));
    }
    reader.readAsText(file);
   

}


$(document).ready(function() {

            var mouseDownX = 0;
            var mouseDownY = 0;
            var elemClicked;

            window.paper = Raphael("canvas", paper_height, paper_width);

            // first click sets the centre
            $("#canvas").click(setCentre);

            // clicking go grabs the points inside the ellipse
            $("#go").click(get_points_inside_ellipse);

            // clicking load loads the data
            $('#load').click(read_in_data);


        });


