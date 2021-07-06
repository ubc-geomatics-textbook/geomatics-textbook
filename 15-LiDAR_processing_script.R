## Basic LiDAR Processing using lidR Package ##
## Updated June 30, 2021 by Francois du Toit ##


# AIM: To clean point cloud, produce grid metrics (ABA), segment individual trees (and produce ITD metrics)

# Load packes to be used

library(lidR)
library(rgl)

##########################################################################################################
# Initial Data - load and explore (section 1/2)
##########################################################################################################

# Import las file
las <- readLAS("D:\\AIRBORNE_2019\\Adams_River\\output\\merge_normalized.laz", filter = "-drop_z_below 0")


# Validate las file - this is optional but can tell you if you have any issues with the file
las_check(las)

# Summarize las file  - here we can get some basic info about our las file
print(las)

# View our data - plot displays a 3D interactive windows-based on rgl for LAS objects
plot(las)

##########################################################################################################
# Classify and Remove Noise
##########################################################################################################

# Using IVF
las <- classify_noise(las, ivf(5,2))
# Remove outliers using filter_poi()
las_denoise <- filter_poi(las, Classification != LASNOISE

##########################################################################################################
# Classify the Ground (Section 3)
##########################################################################################################

mycsf <- csf(TRUE, 1, 1, time_step = 1)
las <- classify_ground(las, mycsf)
#plot(las, color = "Classification")

##########################################################################################################
# Create the DEM that we are going to use (Section 4)
##########################################################################################################

dtm_tin <- grid_terrain(las, res = 1, algorithm = tin())
plot_dtm3d(dtm_tin, bg = "white")


##########################################################################################################
# Normalize our point cloud (Section 5)
##########################################################################################################

nlas <- normalize_height(las, knnidw())

##########################################################################################################
# Create the CHM that we are going to use (Section 6)
##########################################################################################################

chm <- grid_canopy(las, res = 1, algorithm = p2r())
col <- height.colors(50)
plot(chm, col = col)

##########################################################################################################
# Segment Individual Trees (Section 7)
##########################################################################################################


##########################################################################################################
# Create ABA Metrics (Section 8)
##########################################################################################################

grid_metrics(las, func = ~mean(Z))


##########################################################################################################
# Create Individual Tree Metrics (Section 11)
##########################################################################################################



