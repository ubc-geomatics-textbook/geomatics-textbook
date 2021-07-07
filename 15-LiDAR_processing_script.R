## Basic LiDAR Processing using lidR Package ##
## Updated June 30, 2021 by Francois du Toit ##


# AIM: To clean point cloud, produce grid metrics (ABA), segment individual trees (and produce ITD metrics)

# This LiDAR data can be downloaded from

# Load packes to be used

library(lidR)
library(rgl)

##########################################################################################################
# Initial Data - load and explore (section 1/2)
##########################################################################################################

# Import las file
las <- readLAS("D:\\4840E_54550N\\4840E_54550N_200x200_2.las", filter = "-drop_z_below 0")


# Validate las file - this is optional but can tell you if you have any issues with the file
las_check(las)

# We can see that several points are duplicated - we can filter these out

las <- filter_duplicates(las)

# Summarize las file  - here we can get some basic info about our las file
print(las)

# View our data - plot displays a 3D interactive windows-based on rgl for LAS object
# We can see there is clearly some 'high noise' around 500 meters above the ground
plot(las, bg = "white", axis = T)


#, axis = TRUE, legend = TRUE)

##########################################################################################################
# Classify and Remove Noise
##########################################################################################################

# First we can filter the high noise by filtering to only keep points under 150 meters:
las_denoise <- filter_poi(las, Z < 150)

# Next, we can classify noise Using the IVF algorithm
las_denoise <- classify_noise(las_denoise, ivf(3,2))

# Then, we can remove outliers using filter_poi()
las_denoise <- filter_poi(las_denoise, Classification != LASNOISE)

# If we now view the point cloud we can see that it looks more like what we want to see:
plot(las_denoise, bg = "white", axis = T)


#NOTE: this point cloud was already classified - some vendors will classify point clouds ahead of time.
# Since we know that classification 7 and 18 are noise, we could also simply filter out those points:
#las_denoise <- filter_poi(las, Classification != 7, Classification != 18)

##########################################################################################################
# Classify the Ground (Section 3)
##########################################################################################################

mycsf <- csf(TRUE, 1, 1, time_step = 1)
las_classified <- classify_ground(las_denoise, mycsf)

plot(las_classified, bg = "white", color = "Classification")

# Note: Since this point cloud has been classified, we could just view the ground. HOWEVER, sometimes we do not
# know what the vendor has done, so we want to denoise and classify the point clouds ourselves

##########################################################################################################
# Create the DEM that we are going to use (Section 4)
##########################################################################################################

dtm_tin <- grid_terrain(las_classified, res = 1, algorithm = tin())

plot_dtm3d(dtm_tin, bg = "white")


##########################################################################################################
# Normalize our point cloud (Section 5)
##########################################################################################################

nlas <- normalize_height(las_classified, knnidw())

#make sure we drop all of the points below 0
nlas <- filter_poi(nlas, Z >= 0)

plot(nlas, bg = "white", axis = T)

##########################################################################################################
# Create the CHM that we are going to use (Section 6)
##########################################################################################################

chm <- grid_canopy(nlas, res = 1, algorithm = p2r())
col <- height.colors(50)
plot(chm, bg = "white", col = col)

plot_dtm3d(chm, bg = "white")

##########################################################################################################
# Segment Individual Trees (Section 7)
##########################################################################################################



ttops <- find_trees(nlas, lmf(ws = 5, hmin = 15))

plot(chm, col = height.colors(50))
plot(ttops, add = TRUE)

x <- plot(nlas, bg = "white", size = 4)
add_treetops3d(x, ttops)

algo <- dalponte2016(chm_p2r_05_smoothed, ttops_chm_p2r_05_smoothed)
las <- segment_trees(las, algo) # segment point cloud
plot(las, bg = "white", size = 4, color = "treeID") # visualize trees




##########################################################################################################
# Create ABA Metrics (Section 8)
##########################################################################################################

hmean <- grid_metrics(nlas, func = ~mean(Z), res = 10)
hmax <- grid_metrics(nlas, func = ~max(Z), res = 10)

plot(hmean, bg = "white", col = col)

plot_dtm3d(hmean, bg = "white")

metrics <- grid_metrics(nlas, .stdmetrics, 10) # calculate standard metrics
plot(metrics, col = height.colors(50)) # some plotting


prediction <- grid_metrics(nlas, ~0.7018 * sum(Z > 2)/length(Z) + 0.9268 *max(Z), 20) # predicting model mapping
plot(prediction, col = height.colors(50)) # some plotting


  ##########################################################################################################
# Create Individual Tree Metrics (Section 11)
##########################################################################################################



