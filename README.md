Blobsplorer
=======

Blobsplorer is a tool for interactive visualization of assembled DNA sequence data ("contigs") derived from (often unintentionally) mixed-species pools. It allows the simultaneous display of GC content, coverage, and taxonomic annotation for collections of contigs with a view to separating out those belonging to different taxa.

Blobsplorer is unlikely to be of use on its own as it requires contig data to be supplied in a format that involves considerable preprocessing (see below for a description). The easiest way to use Blobsplorer is as part of a workflow using scripts from [here](https://github.com/blaxterlab/blobology).

Bugs, comments and questions to martin.jones@ed.ac.uk

Deployment
========
Blobsplorer is built as a single web page with associated resources (chiefly Javascript libraries). To use it, simply clone or download/extract the repository and open Blobplorer.html in a web browser. All necessary Javascript libraries are included in the respository, so you do not even need an internet connection to use it. 

In order to accomplish file processing without any server-side component, Blobsplorer uses the HTML5 File API, so a recent browser is required. If you like, you can refer to [this page](http://caniuse.com/#feat=fileapi) to figure out whether your browser will work or not, but it's probably easier to just download the latest version of Chrome, as Javascript performance goes a long way towards determining how pleasant Blobsplorer is to use. 

Usage
========
To use Blobsplorer, open the web page in your browser then select an input file. The contig data will be loaded, and the plot drawn, when you click the "Load contigs" button, but before you do it's a good idea to set the sampling level from the dropdown menu. For a first pass, set the sampling level so that the number of points displayed is less than 10,000 (e.g. if you have a file with data for 50,000 contigs, select "every ten"). Depending on the speed of your computer, you may have to wait for a while for the plot to be displayed. Hardware acceleration may improve performance, or it may not - preliminary testing has not revealed any strong improvement, but your mileage may vary. If you want to monitor the performance of the tool, use the Javascript console to view logging events. 

Once the plot has loaded, you can adjust the taxonomic level used for the shading of the points by changing the selection in the "colour by" drop-down box. The names of the taxonomic levels are read from the field headers on the first line of the input file, so if something seems wrong here, double-check the format of the input file before you do anything else. You can also select the library for which you want to view coverage data, if your input file contains more than one. 

Clicking on a taxon name in the key on the left-hand side of the screen will highlight contigs annotated as belonging to that taxon (actually it will dim the others, but it amounts to the same thing). This can make it easier to see e.g. contigs belonging to your target organism, if you have a lot of unannotated ones. 

Clicking the “Download as SVG” button will generate a copy of the plot in SVG format, which you can open scalar vector drawing package for further processing.

Once the data have been loaded and displayed, groups of contigs can be defined by drawing ellipses on the plot. To draw an ellipse, clicks once on the plot to define the center, then move the cursor to define the shape of the ellipse. Then click a second time, and move the cursor to define the rotation of the ellipse. Clicking for the third and final time on the plot completes the definition of the ellipse. Defining ellipses in this way is not a very intuitive interface, but it's the best one I could come up with using my very limited knowledge of geometry :-)

Multiple ellipses can be drawn in this way to define a set of contigs. Clicking the “Highlight selected” button will confirm the selection visually by shading the selected contigs in red, while clicking the “download contig ids” button will generate a text file containing the identifiers of the selected contigs which can be downloaded for further processing - for example, to extract contigs with matching ids for re-assembly. 

Input format
================
Input data
The input for Blobsplorer consists of a tab-separated value (TSV) format file, with a single header row followed by one row per contig (see https://raw.github.com/mojones/blobsplorer/master/sample.txt for an example). The first three columns of each row give the sequence ID, length and GC content. There follow an arbitrary number of columns, whose field headers begin with the string "cov_", giving the coverage for each library. After these come an arbitrary number of taxonomic annotation columns, whose field headers begin with the string "taxlevel_". 

Here's an example of the first few lines of a file with coverage data from two libraries, and four levels of taxonomic annotation - remember that the first line contains the field headers:

````
seqid	len	gc	cov_pa61-scaffolds.fa.ERR138445.bowtie2.sorted.bam	cov_pa61-scaffolds.fa.ERR138446.bowtie2.sorted.bam	taxlevel_species	taxlevel_order	taxlevel_phylum	taxlevel_superkingdom
336810	36626	0.387649195640893	55.1477092775834	24.9888603724176	Caenorhabditis remanei	Rhabditida	Nematoda	Eukaryota
348686	7096	0.379315831344471	78.2068771138607	38.997322435173	Not annotated	Not annotated	Not annotated	Not annotated
198688	1592	0.654522613065327	11.4893216080402	8.33479899497488	Pseudomonas stutzeri	Pseudomonadales	Proteobacteria	Bacteria
30797	94	0.329787234042553	154.148936170213	85.563829787234	Not annotated	Not annotated	Not annotated	Not annotated

````

Take a look at the sample_big.txt and sample_small.txt files in the root of the repository for a real-life examples. 



