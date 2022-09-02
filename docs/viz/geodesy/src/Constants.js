/**
 * Colors of the objects in the visualization.
 */
export const GRATICULE_COLOR = "#ffffff";
export const ELLIPSOID_COLOR = "#5e78ce";
export const SPHERE_COLOR = "#d074b3";
export const GEOCENTRIC_LINE_COLOR = "#0047fd";
export const GEODETIC_LINE_COLOR = "#d30000";

/**
 * This value determines the size of the three models. In the sphere/ellipsoid case, it is used to specify the radius of
 * the geometry (before scaling).
 */
export const MODEL_RADIUS = 1;

/**
 * The layer the models are placed into for more efficient raycasting.
 */
export const MODEL_LAYER = 5;

/**
 * Constant flattening factor of the WGS84 ellipsoid.
 */
export const WGS_FLATTENING = 1 / 298.257223560;

export const VANCOUVER_LATITUDE = 49;
export const VANCOUVER_LONGITUDE = -122;

/**
 * Name of the control that controls the geoid height view.
 */
export const GEOID_HEIGHT_CONTROL = "geoidHeight";

/**
 * Displayed name of the Leva control that shows/hides the geoid.
 */
export const GEOID_CONTROL = "show geoid?";

/**
 * Names of the Leva folders for models and coordinates.
 */
export const MODELS_FOLDER = "Models";
export const COORDINATES_FOLDER = "Coordinates";

/**
 * Tooltip text for the Leva controls.
 */
export const GEOID_CONTROL_HINT = "Show/hide the geoid";
export const SPHERE_CONTROL_HINT = "Visibility of the sphere";
export const ELLIPSOID_CONTROL_HINT = "Visibility of the ellipsoid";
export const FLATTENING_CONTROL_HINT = "Flattening factor of the ellipsoid";

export const LATITUDE_CONTROL_HINT = "Latitude (degrees)";
export const LONGITUDE_CONTROL_HINT = "Longitude (degrees)";
export const GEODETIC_CONTROL_HINT = "Show as geodetic coordinates";
export const GEOCENTRIC_CONTROL_HINT = "Show as geocentric coordinates";

export const AUTOROTATE_HINT = "Automatically rotate around models";

export const LIGHT_INTENSITY_HINT = "Light intensity";
export const LIGHT_FOLLOW_HINT = "Make the light rotate with you";
export const LIGHT_OFFSET_HINT = "Lighting angle, in degrees";

/**
 * Number of width and height segments of the sphere and ellipsoid.
 */
export const WIDTH_SEGMENTS = 48;
export const HEIGHT_SEGMENTS = WIDTH_SEGMENTS / 2;

/**
 * The name associated with the geoid model object (used to identify the geoid).
 */
export const GEOID_NAME = "geoid";

export const LEGEND_GEOID = "Geoid";
export const LEGEND_ELLIPSOID = "Ellipsoid";
export const LEGEND_SPHERE = "Sphere";
export const LEGEND_GEODETIC = "Geodetic (λ,ϕ)";
export const LEGEND_GEOCENTRIC = "Geocentric (λ,ϕ)";