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
  mapId?: string;
  mapTypeControl?: boolean;
  streetViewControl?: boolean;
  fullscreenControl?: boolean;
  zoomControl?: boolean;
  clickableIcons?: boolean;
  styles?: Array<Record<string, unknown>>;
}

export interface GoogleAdvancedMarkerOptions {
  map?: GoogleMapInstance | null;
  position?: GoogleLatLngLiteral | GoogleLatLngObject | null;
  gmpDraggable?: boolean;
  title?: string;
}

export interface GoogleAdvancedMarkerInstance {
  position: GoogleLatLngLiteral | GoogleLatLngObject | null;
  map: GoogleMapInstance | null;
  gmpDraggable: boolean;
  title?: string;
  addEventListener: (event: string, handler: (e?: unknown) => void) => void;
  removeEventListener?: (event: string, handler: (e?: unknown) => void) => void;
  addListener?: (event: string, handler: (e?: unknown) => void) => GoogleMapListener;
}

// Backward-compatibility aliases
export type GoogleMarkerInstance = GoogleAdvancedMarkerInstance;
export type GoogleMarkerOptions = GoogleAdvancedMarkerOptions;

export interface GooglePlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText?: string;
}

export interface GoogleMapInstance {
  setCenter: (latLng: GoogleLatLngLiteral | GoogleLatLngObject) => void;
  panTo: (latLng: GoogleLatLngLiteral | GoogleLatLngObject) => void;
  setZoom: (zoom: number) => void;
  getZoom: () => number;
  getCenter: () => GoogleLatLngObject | null;
  addListener: (event: string, handler: (e: GoogleMapMouseEvent) => void) => GoogleMapListener;
}

export interface PlaceAddressComponent {
  longText?: string;
  shortText?: string;
  types?: string[];
}

export type PlaceDisplayName = string | { text?: string };

export type PlaceLocation =
  | GoogleLatLngLiteral
  | GoogleLatLngObject
  | { lat: number; lng: number }
  | { lat: () => number; lng: () => number };

export interface PlaceInstance {
  id?: string;
  displayName?: PlaceDisplayName;
  formattedAddress?: string;
  addressComponents?: PlaceAddressComponent[];
  location?: PlaceLocation;
  fetchFields: (options: { fields: string[] }) => Promise<void>;
}

export interface PlacePredictionItem {
  toPlace: () => PlaceInstance;
}

export interface PlaceSelectEvent extends Event {
  placePrediction?: PlacePredictionItem;
  place?: PlaceInstance;
}

export interface PlaceAutocompleteElementOptions {
  includedRegionCodes?: string[];
  componentRestrictions?: { country: string | string[] };
  requestedLanguage?: string;
  requestedRegion?: string;
}

export interface PlaceAutocompleteElementInstance extends HTMLElement {
  addEventListener: (event: string, handler: (e: Event) => void) => void;
  removeEventListener: (event: string, handler: (e: Event) => void) => void;
}

export interface GoogleMapsLibrary {
  Map: new (element: HTMLElement, options?: GoogleMapOptions) => GoogleMapInstance;
}

export interface GoogleMarkerLibrary {
  AdvancedMarkerElement: new (options?: GoogleAdvancedMarkerOptions) => GoogleAdvancedMarkerInstance;
}

export interface GooglePlacesLibrary {
  PlaceAutocompleteElement: new (
    options?: PlaceAutocompleteElementOptions,
  ) => PlaceAutocompleteElementInstance;
}

export interface GoogleGeocodingLibrary {
  Geocoder: new () => GoogleGeocoder;
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

export type ExtractedPlaceDetails = ExtractedLocationDetails;

export interface GoogleMapsScriptWindow extends Window {
  google?: {
    maps: {
      Map: new (element: HTMLElement, options?: GoogleMapOptions) => GoogleMapInstance;
      Geocoder: new () => GoogleGeocoder;
      importLibrary: (library: string) => Promise<unknown>;
      marker?: {
        AdvancedMarkerElement: new (
          options?: GoogleAdvancedMarkerOptions,
        ) => GoogleAdvancedMarkerInstance;
      };
      places?: {
        PlaceAutocompleteElement: new (
          options?: PlaceAutocompleteElementOptions,
        ) => PlaceAutocompleteElementInstance;
      };
    };
  };
  gm_authFailure?: () => void;
}
