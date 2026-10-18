export interface GoogleLatLngLiteral {
  lat: number;
  lng: number;
}

export interface GoogleLatLngObject {
  lat: () => number;
  lng: () => number;
}

export type GoogleLatLng = GoogleLatLngLiteral | GoogleLatLngObject;

export interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GoogleGeocoderGeometry {
  location: GoogleLatLng;
  location_type?: string;
}

export interface GoogleGeocoderResult {
  place_id: string;
  formatted_address: string;
  address_components: GoogleAddressComponent[];
  geometry: GoogleGeocoderGeometry;
  types?: string[];
}

export type GoogleGeocoderStatus =
  | 'OK'
  | 'ZERO_RESULTS'
  | 'OVER_QUERY_LIMIT'
  | 'REQUEST_DENIED'
  | 'INVALID_REQUEST'
  | 'UNKNOWN_ERROR';

export interface GoogleGeocoder {
  geocode: (
    request: {
      location?: GoogleLatLngLiteral;
      address?: string;
      placeId?: string;
    },
    callback: (results: GoogleGeocoderResult[] | null, status: GoogleGeocoderStatus) => void,
  ) => void;
}

export interface GoogleMapMouseEvent {
  latLng?: GoogleLatLngObject | null;
}

export interface GoogleMapListener {
  remove: () => void;
}

export interface GoogleMapOptions {
  center: GoogleLatLngLiteral;
  zoom: number;
  mapTypeControl?: boolean;
  streetViewControl?: boolean;
  fullscreenControl?: boolean;
  zoomControl?: boolean;
  clickableIcons?: boolean;
  styles?: Array<Record<string, unknown>>;
}

export interface GoogleMarkerOptions {
  position: GoogleLatLngLiteral;
  map?: GoogleMapInstance | null;
  draggable?: boolean;
  title?: string;
  animation?: unknown;
}

export interface GoogleMarkerInstance {
  setPosition: (latLng: GoogleLatLngLiteral | GoogleLatLngObject) => void;
  getPosition: () => GoogleLatLngObject | null;
  setMap: (map: GoogleMapInstance | null) => void;
  addListener: (event: string, handler: (e?: GoogleMapMouseEvent) => void) => GoogleMapListener;
  setVisible: (visible: boolean) => void;
}

export interface GoogleMapInstance {
  setCenter: (latLng: GoogleLatLngLiteral | GoogleLatLngObject) => void;
  panTo: (latLng: GoogleLatLngLiteral | GoogleLatLngObject) => void;
  setZoom: (zoom: number) => void;
  getZoom: () => number;
  getCenter: () => GoogleLatLngObject | null;
  addListener: (event: string, handler: (e: GoogleMapMouseEvent) => void) => GoogleMapListener;
}

export interface GooglePlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText?: string;
}

export interface ExtractedLocationDetails {
  googlePlaceId: string;
  name?: string;
  address: string;
  cityName?: string;
  areaName?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

// Backwards compatibility alias
export type ExtractedPlaceDetails = ExtractedLocationDetails;

export interface GooglePlacesPredictionItem {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text?: string;
  };
}

export interface GooglePlaceDetailsResult {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  address_components?: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
}

export interface GoogleAutocompleteService {
  getPlacePredictions: (
    request: { input: string; sessionToken?: string },
    callback: (predictions: GooglePlacesPredictionItem[] | null, status: string) => void,
  ) => void;
}

export interface GooglePlacesService {
  getDetails: (
    request: { placeId: string; fields?: string[]; sessionToken?: string },
    callback: (place: GooglePlaceDetailsResult | null, status: string) => void,
  ) => void;
}

export interface GooglePlacesServiceStatus {
  OK: string;
  ZERO_RESULTS: string;
  OVER_QUERY_LIMIT: string;
  REQUEST_DENIED: string;
  INVALID_REQUEST: string;
}

export interface GoogleMapsScriptWindow extends Window {
  google?: {
    maps: {
      Map: new (element: HTMLElement, options?: GoogleMapOptions) => GoogleMapInstance;
      Marker: new (options?: GoogleMarkerOptions) => GoogleMarkerInstance;
      Geocoder: new () => GoogleGeocoder;
      Animation?: {
        DROP: unknown;
        BOUNCE: unknown;
      };
      event?: {
        clearInstanceListeners: (instance: unknown) => void;
      };
      places?: {
        AutocompleteService: new () => GoogleAutocompleteService;
        PlacesService: new (attrContainer: HTMLDivElement) => GooglePlacesService;
        PlacesServiceStatus: GooglePlacesServiceStatus;
      };
    };
  };
  gm_authFailure?: () => void;
}
