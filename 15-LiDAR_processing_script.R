## Basic LiDAR Processing using lidR Package ##
## Updated July 15, 2021 by Francois du Toit ##


# AIM: To create a basic workflow that can be used by students in conjunction with the lidR book (https://jean-romain.github.io/lidRbook/) to:
# Clean a point cloud, produce grid metrics (ABA), segment individual trees,and produce ITD metrics
# Additional information about the lidR package and functions can be found here: https://cran.r-project.org/web/packages/lidR/lidR.pdf

# This LiDAR data can be downloaded from: https://opendata.vancouver.ca/explore/dataset/lidar-2018/information/
# Click on the 'map' tab and select a tile to download. In this script, I used tile '4840E_54550N'

# Load packes to be used

library(lidR)
library(rgl)

##########################################################################################################
# Initial Data - load and explore (section 1/2 of lidR book)
##########################################################################################################

# Import your las file

las <- readLAS("YOUR_FILE_PATH\\your_pointcloud.las", filter = "-drop_z_below 0") # we use "drop_z_below 0 removes erroneous points

# Validate las file - this is optional but can tell you if you have any issues with the file (useful if you have raw data!)
las_check(las)

# In our case, We can see that several points are duplicated - we can filter these out using 'filter_duplicates
las <- filter_duplicates(las)

# Summarize las file  - here we can get some basic info about our las file (density and size in the memory are important!)
print(las)

# View our data - 'plot' displays a 3D interactive windows-based on rgl for a LAS object
plot(las, bg = "white", axis = T) # We can see there is clearly some 'high noise' around 500 meters above the ground in our file

##########################################################################################################
# Classify and Remove Noise
##########################################################################################################

# First we can filter the high noise by filtering to only keep points under 150 meters:
las_denoise <- filter_poi(las, Z < 150)

# Next, we can classify noise Using the IVF algorithm
# Note: more than one algorithm exists and you can explore them using by ?classify_noise in the console
las_denoise <- classify_noise(las_denoise, ivf(3,2))

# Then, we can remove outliers using filter_poi() again
las_denoise <- filter_poi(las_denoise, Classification != LASNOISE)

# If we now view the point cloud we can see that it looks more like what we want to see!
plot(las_denoise, bg = "white", axis = T)

# IMPORTANT NOTE: this point cloud was already classified - some vendors will classify point clouds ahead of time.
# Since we know that classification 7 and 18 are noise, we could also simply filter out those points:
# las_denoise <- filter_poi(las, Classification != 7, Classification != 18)
# HOWEVER, sometimes we want to re-classify point clouds to make sure they are done to our specifications

##########################################################################################################
# Classify the Ground (Section 3 of lidR book)
##########################################################################################################

# We can set our parameters for the ground segmentation algorithm based on a Cloth Simulation Filter
mycsf <- csf(TRUE, 1, 1, time_step = 1)

# Classify the ground using our segmentation algorithm
las_classified <- classify_ground(las_denoise, mycsf)

# View our classified point cloud
plot(las_classified, bg = "white", color = "Classification")

# Note: Since this point cloud had already been classified, we could have just viewed the ground.
# HOWEVER, as above sometimes we do not know what the vendor has done, so we want to de-noise and classify the point clouds ourselves

##########################################################################################################
# Create the DEM that we are going to use (Section 4)
##########################################################################################################

# Create a digital terrain model using our classified las point cloud from above
dtm_tin <- grid_terrain(las_classified, res = 1, algorithm = tin())

# Here we are using a different kind of plot to view our DTM
plot_dtm3d(dtm_tin, bg = "white")

##########################################################################################################
# Normalize our point cloud (Section 5)
##########################################################################################################

# Since we have classified the ground, we can now normalize our point cloud to get accurate tree heights
nlas <- normalize_height(las_classified, knnidw())

# Make sure we drop all of the points below 0!
nlas <- filter_poi(nlas, Z >= 0)

# If we compare this plot to 'las' or even 'las denoise' we should see that it is a lot more uniform
plot(nlas, bg = "white", axis = T)

##########################################################################################################
# Create the CHM that we are going to use (Section 6)
##########################################################################################################

# Create the canopy height model using 'grid_canopy'. This function creates a digital surface model
chm <- grid_canopy(nlas, res = 1, algorithm = p2r())

# We can customize our colours like this
col <- height.colors(50)

# Since 'chm' is a raster, it will just plot in the 'Plots' window of RStudio
plot(chm, bg = "white", col = col)

# If we use plot_dtm3d we can plot a raster in 3D (we did the same to look at our DEM above)
plot_dtm3d(chm, bg = "white")

##########################################################################################################
# Segment Individual Trees (Section 7)
##########################################################################################################

# Before we can segment our trees, we first need to find the tree tops. In this point cloud I am only interested in taller trees,
# so I have set a minimum search height of 15 meters
ttops <- find_trees(nlas, lmf(ws = 5, hmin = 15))

# One was to view these tree tops is to plot it in 2D
plot(chm, col = height.colors(50))
plot(ttops, add = TRUE)

# We can also plot them in 3D
x <- plot(nlas, bg = "white", size = 4)
add_treetops3d(x, ttops)

# Now that we have our tree tops, we can select an algorithm to use (we are using the dalponte algorithm here)...
algo <- dalponte2016(chm, ttops)

# ... and apply it to our normalized point cloud!
trees <- segment_trees(nlas, algo)

# Success! We can see that we now have a segmented point cloud
plot(trees, bg = "white", size = 4, color = "treeID") # visualize trees

##########################################################################################################
# Create Metrics 1 -
# ABA Metrics (Section 8/9)
##########################################################################################################

# There are several ways to create area based metrics, but the most important things to keep in mind is 'res'
# This is the parameter that dictates what the size of the cell is for your area based metric!

# Using the lidR built in metrics, we can create a RasterBrick of all the standard metrics using '.stdmetrics'
# Here we have set the resolution to 10 meters
metrics <- grid_metrics(nlas, .stdmetrics, 10)

# If we view the plot we can see them all
plot(metrics, col = height.colors(50))

# It is also possible to create single RasterLayers, for example we can create mean height, or max height rasters
hmean <- grid_metrics(nlas, func = ~mean(Z), res = 10)
hmax <- grid_metrics(nlas, func = ~max(Z), res = 10)
hsd <- grid_metrics(nlas, func = ~sd(Z), res = 10)

# If you want to write the raster somewhere, you can use the code below
#writeRaster(hmean, "FILEPATH\\hmean.tif", format="GTiff")

# View the plot of the metric
plot(hmean, bg = "white", col = col)

# Finally, if we want to we could also make predictions! (see section 9 for more on this)
prediction <- grid_metrics(nlas, ~0.7018 * sum(Z > 2)/length(Z) + 0.9268 *max(Z), 20)

# plot the predictions
plot(prediction, col = height.colors(50))

##########################################################################################################
# Create Metrics 2 -
# Create Individual Tree Metrics (Section 11)
##########################################################################################################

# Using our segmented point cloud, we can look to section 11 to produce metrics for individual trees.
itc_metrics <- tree_metrics(trees, ~list(z_max = max(Z), z_mean = mean(Z)))

# Similar to the ABA metrics, we can use '.stdmetrics' or create our own
# To plot this we can use spplot to help us visualize the results. Here we are looking at max Z
spplot(itc_metrics, zcol="z_max", col.regions = hcl.colors(5))

# If we are interested in using these metrics in modeling or another program, we can view the table of metrics using
View(itc_metrics@data)

# And write them to a csv using something like
write.csv(itc_metrics@data, "YOUR_PATH\\itc_metrics.csv")

# That's it! If you need more information, please check out the lidR book - it goes through many more examples of what you can do!
