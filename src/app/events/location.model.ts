export interface Coordinates {
    lat: number;
    lng: number;
}

export interface EventLocation extends Coordinates{
    address: string;
    staticMapImgUrl: string;
}